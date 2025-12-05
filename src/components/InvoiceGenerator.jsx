import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Coins } from 'lucide-react';

const InvoiceGenerator = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      customerDetails: [{ name: '', email: '' }],
      addressDetails: '',
      invoiceDetails: {
        title: '',
        currency: 'USD',
        dueDate: ''
      },
      items: [{ name: '', quantity: 1, price: 0, amount: 0 }],
      discount: 0,
      tax: 0,
      additionalNotes: '',
      paymentInstructions: {
        accountNumber: '',
        bankName: '',
        routingNumber: ''
      }
    }
  });

  const { fields: customerFields, append: appendCustomer, remove: removeCustomer } = useFieldArray({
    control,
    name: 'customerDetails'
  });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items'
  });

  const axiosPublic = useAxiosPublic();

  // Watch values for calculations
  const items = watch('items');
  const discount = watch('discount') || 0;
  const tax = watch('tax') || 0;

  // Calculate amounts
  const calculateItemAmount = (index) => {
    const item = items[index];
    const amount = Math.round((item.quantity || 0) * (item.price || 0) * 100) / 100;
    setValue(`items.${index}.amount`, amount);
    return amount;
  };

  const subtotal = Math.round(items.reduce((sum, item) => sum + (item.amount || 0), 0) * 100) / 100;
  const discountAmount = Math.round((subtotal * discount) / 100 * 100) / 100;
  const taxAmount = Math.round(((subtotal - discountAmount) * tax) / 100 * 100) / 100;
  const total = Math.round((subtotal - discountAmount + taxAmount) * 100) / 100;

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)', symbol: '$', icon: DollarSign },
    { value: 'NGN', label: 'NGN (₦)', symbol: '₦', icon: Coins }
  ];

  const selectedCurrency = currencyOptions.find(opt => opt.value === watch('invoiceDetails.currency'));

  const onSubmit = async (data) => {
    const toastId = toast.loading('Processing...');
    try {
      // Get the selected currency from form data
      const currentCurrency = currencyOptions.find(opt => opt.value === data.invoiceDetails.currency) || currencyOptions[0];
      
      const invoicePayload = {
        ...data,
        subtotal,
        discountAmount,
        taxAmount,
        total,
        isDraft: false,
        currency: currentCurrency.value
      };

      if (isPreview) {
        setInvoiceData(invoicePayload);
        setIsPreview(true);
        toast.success('Invoice preview ready', { id: toastId });
      } else {
        // Save as draft
        const response = await axiosPublic.post('/invoice', {
          ...invoicePayload,
          isDraft: true
        });
        if (response) {
          toast.success('Invoice saved as draft', { id: toastId });
          reset();
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to process invoice', { id: toastId });
    }
  };

  const handleSendInvoice = async () => {
    const toastId = toast.loading('Sending invoice...');
    try {
      // Ensure currency is included in the invoice data
      const currentCurrency = currencyOptions.find(opt => opt.value === invoiceData?.invoiceDetails?.currency) || currencyOptions[0];
      const response = await axiosPublic.post('/invoice', {
        ...invoiceData,
        currency: currentCurrency.value,
        isDraft: false
      });
      if (response) {
        toast.success('Invoice sent successfully', { id: toastId });
        setIsPreview(false);
        setInvoiceData(null);
        reset();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send invoice', { id: toastId });
    }
  };

  const handleSaveAsDraft = async () => {
    const toastId = toast.loading('Saving as draft...');
    try {
      // Ensure currency is included in the invoice data
      const currentCurrency = currencyOptions.find(opt => opt.value === invoiceData?.invoiceDetails?.currency) || currencyOptions[0];
      const response = await axiosPublic.post('/invoice', {
        ...invoiceData,
        currency: currentCurrency.value,
        isDraft: true
      });
      if (response) {
        toast.success('Invoice saved as draft', { id: toastId });
        setIsPreview(false);
        setInvoiceData(null);
        reset();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save draft', { id: toastId });
    }
  };

  const handleMakeEdits = () => {
    setIsPreview(false);
    // Pre-fill the form with existing data
    Object.keys(invoiceData).forEach(key => {
      if (key === 'customerDetails') {
        setValue('customerDetails', invoiceData[key]);
      } else if (key === 'items') {
        setValue('items', invoiceData[key]);
      } else if (key === 'invoiceDetails') {
        setValue('invoiceDetails', invoiceData[key]);
      } else if (key === 'paymentInstructions') {
        setValue('paymentInstructions', invoiceData[key]);
      } else {
        setValue(key, invoiceData[key]);
      }
    });
    setInvoiceData(null);
  };

  if (isPreview && invoiceData) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-md shadow max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Invoice Preview</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={handleSendInvoice}
              label="Send Invoice"
              className="bg-green-600 border-none w-full sm:w-auto"
            />
            <Button
              onClick={handleSaveAsDraft}
              label="Save as Draft"
              className="bg-blue-600 border-none w-full sm:w-auto"
            />
            <Button
              onClick={handleMakeEdits}
              label="Make Edits"
              className="bg-gray-600 border-none w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Invoice Preview Content */}
        <div className="border rounded-lg p-4 sm:p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{invoiceData.invoiceDetails.title || 'INVOICE'}</h1>
            <p className="text-gray-600 text-sm sm:text-base">Due Date: {invoiceData.invoiceDetails.dueDate}</p>
          </div>

          {/* Customer Details */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Bill To:</h3>
            {invoiceData.customerDetails.map((customer, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm sm:text-base"><strong>{customer.name}</strong></p>
                <p className="text-gray-600 text-sm sm:text-base">{customer.email}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          {invoiceData.addressDetails && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Address:</h3>
              <p className="text-gray-600 text-sm sm:text-base">{invoiceData.addressDetails}</p>
            </div>
          )}

          {/* Items Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse border min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left text-xs sm:text-sm">Item</th>
                  <th className="border p-2 text-center text-xs sm:text-sm">Qty</th>
                  <th className="border p-2 text-right text-xs sm:text-sm">Price</th>
                  <th className="border p-2 text-right text-xs sm:text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-xs sm:text-sm">{item.name}</td>
                    <td className="border p-2 text-center text-xs sm:text-sm">{item.quantity}</td>
                    <td className="border p-2 text-right text-xs sm:text-sm">
                      {selectedCurrency?.symbol}{item.price}
                    </td>
                    <td className="border p-2 text-right text-xs sm:text-sm">
                      {selectedCurrency?.symbol}{item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="w-full sm:ml-auto sm:w-64 space-y-2 sm:space-y-3">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Subtotal:</span>
              <span>{selectedCurrency?.symbol}{invoiceData.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Discount ({invoiceData.discount}%):</span>
              <span>-{selectedCurrency?.symbol}{invoiceData.discountAmount}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Tax ({invoiceData.tax}%):</span>
              <span>{selectedCurrency?.symbol}{invoiceData.taxAmount}</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
              <span>Total:</span>
              <span>{selectedCurrency?.symbol}{invoiceData.total}</span>
            </div>
          </div>

          {/* Additional Notes */}
          {invoiceData.additionalNotes && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Additional Notes:</h3>
              <p className="text-gray-600 text-sm sm:text-base">{invoiceData.additionalNotes}</p>
            </div>
          )}

          {/* Payment Instructions */}
          {invoiceData.paymentInstructions.accountNumber && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Payment Instructions:</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Account: {invoiceData.paymentInstructions.accountNumber}<br />
                Bank: {invoiceData.paymentInstructions.bankName}<br />
                {invoiceData.paymentInstructions.routingNumber && 
                  `Routing: ${invoiceData.paymentInstructions.routingNumber}`}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="p-4 sm:p-6 bg-white rounded-md shadow max-w-6xl mx-auto">
      <h2 className="text-[24px] sm:text-[28px] md:text-[38px] xmd:text-[48px] font-semibold mb-4 sm:mb-6">Invoice Generator</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        {/* Customer Details Section */}
        <div className="border rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Customer Details</h3>
          {customerFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm sm:text-base">Customer Name</label>
                <InputText
                  className={`!bg-gray-100 !border-0 ${errors.customerDetails?.[index]?.name ? '!border-red-500' : ''}`}
                  placeholder="Enter customer name"
                  {...register(`customerDetails.${index}.name`, {
                    required: 'Customer name is required'
                  })}
                />
                {errors.customerDetails?.[index]?.name && (
                  <span className="text-red-500 text-sm">{errors.customerDetails[index].name.message}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm sm:text-base">Customer Email</label>
                <InputText
                  className={`!bg-gray-100 !border-0 ${errors.customerDetails?.[index]?.email ? '!border-red-500' : ''}`}
                  placeholder="Enter customer email"
                  {...register(`customerDetails.${index}.email`, {
                    required: 'Customer email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.customerDetails?.[index]?.email && (
                  <span className="text-red-500 text-sm">{errors.customerDetails[index].email.message}</span>
                )}
              </div>
              {customerFields.length > 1 && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => removeCustomer(index)}
                    label="Remove Customer"
                    className="bg-red-600 border-none"
                    size="small"
                  />
                </div>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendCustomer({ name: '', email: '' })}
            label="Add Another Customer"
            className="bg-blue-600 border-none"
            size="small"
          />
        </div>

        {/* Address Details Section */}
        <div className="border rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Address Details</h3>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm sm:text-base">Address</label>
            <textarea
              className="bg-gray-100 border-0 rounded-md p-3 resize-none"
              rows="3"
              placeholder="Enter complete address"
              {...register('addressDetails', {
                required: 'Address is required'
              })}
            />
            {errors.addressDetails && (
              <span className="text-red-500 text-sm">{errors.addressDetails.message}</span>
            )}
          </div>
        </div>

        {/* Invoice Details Section */}
        <div className="border rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Invoice Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm sm:text-base">Invoice Title</label>
              <InputText
                className={`!bg-gray-100 !border-0 ${errors.invoiceDetails?.title ? '!border-red-500' : ''}`}
                placeholder="Enter invoice title"
                {...register('invoiceDetails.title', {
                  required: 'Invoice title is required'
                })}
              />
              {errors.invoiceDetails?.title && (
                <span className="text-red-500 text-sm">{errors.invoiceDetails.title.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm sm:text-base">Currency</label>
              <Select
                value={watch('invoiceDetails.currency')}
                onValueChange={(value) => setValue('invoiceDetails.currency', value)}
              >
                <SelectTrigger className="w-full bg-gray-100 border-0">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
              <label className="font-semibold text-sm sm:text-base">Due Date</label>
              <InputText
                type="date"
                className={`!bg-gray-100 !border-0 ${errors.invoiceDetails?.dueDate ? '!border-red-500' : ''}`}
                {...register('invoiceDetails.dueDate', {
                  required: 'Due date is required'
                })}
              />
              {errors.invoiceDetails?.dueDate && (
                <span className="text-red-500 text-sm">{errors.invoiceDetails.dueDate.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="border rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Items</h3>
          <div className="space-y-4">
            {itemFields.map((field, index) => (
              <div key={field.id} className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-6 sm:gap-4">
                <div className="lg:col-span-2">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm sm:text-base">Item Description</label>
                    <InputText
                      className={`!bg-gray-100 !border-0 ${errors.items?.[index]?.name ? '!border-red-500' : ''}`}
                      placeholder="Enter item description"
                      {...register(`items.${index}.name`, {
                        required: 'Item description is required'
                      })}
                    />
                    {errors.items?.[index]?.name && (
                      <span className="text-red-500 text-sm">{errors.items[index].name.message}</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-0">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm sm:text-base">Qty</label>
                    <InputText
                      type="number"
                      min="1"
                      className={`!bg-gray-100 !border-0 ${errors.items?.[index]?.quantity ? '!border-red-500' : ''}`}
                      {...register(`items.${index}.quantity`, {
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Quantity must be at least 1' }
                      })}
                      onChange={(e) => {
                        setValue(`items.${index}.quantity`, parseInt(e.target.value) || 0);
                        calculateItemAmount(index);
                      }}
                    />
                    {errors.items?.[index]?.quantity && (
                      <span className="text-red-500 text-sm">{errors.items[index].quantity.message}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm sm:text-base">Price</label>
                    <InputText
                      type="number"
                      min="0"
                      step="0.01"
                      className={`!bg-gray-100 !border-0 ${errors.items?.[index]?.price ? '!border-red-500' : ''}`}
                      {...register(`items.${index}.price`, {
                        required: 'Price is required',
                        min: { value: 0, message: 'Price must be at least 0' }
                      })}
                      onChange={(e) => {
                        setValue(`items.${index}.price`, parseFloat(e.target.value) || 0);
                        calculateItemAmount(index);
                      }}
                    />
                    {errors.items?.[index]?.price && (
                      <span className="text-red-500 text-sm">{errors.items[index].price.message}</span>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm sm:text-base">Amount</label>
                    <InputText
                      className="!bg-gray-200 !border-0"
                      value={selectedCurrency?.symbol + (items[index]?.amount || 0).toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>
                {itemFields.length > 1 && (
                  <div className="flex justify-end lg:items-end">
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      label="Remove"
                      className="bg-red-600 border-none h-10 w-full sm:w-auto"
                      size="small"
                    />
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendItem({ name: '', quantity: 1, price: 0, amount: 0 })}
              label="Add More Items"
              className="bg-blue-600 border-none w-full sm:w-auto"
              size="small"
            />
          </div>
        </div>

        {/* Totals Section */}
        <div className="border rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Totals</h3>
          <div className="w-full sm:ml-auto sm:w-64 space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold text-sm sm:text-base">Subtotal:</span>
              <span className="text-sm sm:text-base">{selectedCurrency?.symbol}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">Discount (%):</span>
              <InputText
                type="number"
                min="0"
                max="100"
                className="!bg-gray-100 !border-0 w-20 text-right"
                {...register('discount')}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">Tax (%):</span>
              <InputText
                type="number"
                min="0"
                max="100"
                className="!bg-gray-100 !border-0 w-20 text-right"
                {...register('tax')}
              />
            </div>
            <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
              <span>Total:</span>
              <span>{selectedCurrency?.symbol}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="border rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Additional Notes</h3>
          <textarea
            className="bg-gray-100 border-0 rounded-md p-3 w-full resize-none"
            rows="3"
            placeholder="Enter any additional notes or terms"
            {...register('additionalNotes')}
          />
        </div>

        {/* Payment Instructions Section */}
        <div className="border rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Payment Instructions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm sm:text-base">Account Number</label>
              <InputText
                className="!bg-gray-100 !border-0"
                placeholder="Enter account number"
                {...register('paymentInstructions.accountNumber')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm sm:text-base">Bank Name</label>
              <InputText
                className="!bg-gray-100 !border-0"
                placeholder="Enter bank name"
                {...register('paymentInstructions.bankName')}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
              <label className="font-semibold text-sm sm:text-base">Routing Number</label>
              <InputText
                className="!bg-gray-100 !border-0"
                placeholder="Enter routing number"
                {...register('paymentInstructions.routingNumber')}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            type="submit"
            onClick={() => setIsPreview(true)}
            label="Preview Invoice"
            className="bg-blue-600 border-none px-8 w-full sm:w-auto"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            onClick={() => setIsPreview(false)}
            label="Save as Draft"
            className="bg-gray-600 border-none px-8 w-full sm:w-auto"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </section>
  );
};

export default InvoiceGenerator;