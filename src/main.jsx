import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "./providers/AuthProvider";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import CMSProvider from "./providers/CMSProvider";
import CourseProvider from "./providers/CourseProvider";
import InternshipProvider from "./providers/InternshipProvider";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const rootElement = document.getElementById("root");

const App = (
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <PrimeReactProvider>
          <AuthProvider>
            <CMSProvider>
              <CourseProvider>
                <InternshipProvider>
                  <RouterProvider router={router} />
                </InternshipProvider>
              </CourseProvider>
            </CMSProvider>
          </AuthProvider>
        </PrimeReactProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);

// Use hydration for react-snap pre-rendered content, otherwise use normal render
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, App);
} else {
  createRoot(rootElement).render(App);
}
