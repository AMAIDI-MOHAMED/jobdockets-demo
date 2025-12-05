export const JOB_LOCATIONS = [
    { label: "Lagos", slug: "lagos" },
    { label: "Abuja", slug: "abuja" },
    { label: "Port Harcourt", slug: "port-harcourt" },
    { label: "Kano", slug: "kano" },
    { label: "Ibadan", slug: "ibadan" },
    { label: "Enugu", slug: "enugu" },
    { label: "Benin", slug: "benin" },
    { label: "Kaduna", slug: "kaduna" },
    { label: "Others", slug: "others" },
];

export const getLocationBySlug = (slug = "") =>
    JOB_LOCATIONS.find((location) => location.slug === slug);

export const slugifyLocationLabel = (label = "") => {
    const target = label.trim().toLowerCase();
    const directMatch = JOB_LOCATIONS.find(
        (location) => location.label.toLowerCase() === target
    );

    if (directMatch) {
        return directMatch.slug;
    }

    return target.replace(/\s+/g, "-");
};
