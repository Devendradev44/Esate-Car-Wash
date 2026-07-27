// Simulating the 3-tier hierarchy from the Prisma Schema (VehicleCategory -> VehicleBrand -> VehicleModel)
export const vehicleHierarchy = [
  {
    id: "cat_hatchback",
    name: "Hatchback",
    brands: [
      { id: "brand_maruti", name: "Maruti Suzuki", models: [{ id: "model_swift", name: "Swift" }, { id: "model_baleno", name: "Baleno" }] },
      { id: "brand_hyundai", name: "Hyundai", models: [{ id: "model_i20", name: "i20" }] },
    ]
  },
  {
    id: "cat_sedan",
    name: "Sedan",
    brands: [
      { id: "brand_honda", name: "Honda", models: [{ id: "model_city", name: "City" }] },
      { id: "brand_hyundai", name: "Hyundai", models: [{ id: "model_verna", name: "Verna" }] },
    ]
  },
  {
    id: "cat_suv",
    name: "SUV",
    brands: [
      { id: "brand_toyota", name: "Toyota", models: [{ id: "model_fortuner", name: "Fortuner" }] },
      { id: "brand_hyundai", name: "Hyundai", models: [{ id: "model_creta", name: "Creta" }] },
      { id: "brand_mg", name: "MG", models: [{ id: "model_hector", name: "Hector" }] },
    ]
  },
  {
    id: "cat_luxury",
    name: "Luxury",
    brands: [
      { id: "brand_bmw", name: "BMW", models: [{ id: "model_3series", name: "3 Series" }, { id: "model_5series", name: "5 Series" }] },
      { id: "brand_mercedes", name: "Mercedes-Benz", models: [{ id: "model_cclass", name: "C-Class" }] },
    ]
  }
];

// User's current saved vehicles (Simulating CustomerVehicle table)
export const savedVehicles = [
  { id: "v1", category: "SUV", brand: "Toyota", model: "Fortuner", reg: "TG 09 AB 1234" },
  { id: "v2", category: "Hatchback", brand: "Maruti Suzuki", model: "Swift", reg: "TG 11 CX 5678" },
];

// User's current saved addresses (Simulating CustomerAddress table)
export const savedAddresses = [
  { id: "a1", community: "Prestige Shantiniketan", flat: "A-401" },
  { id: "a2", community: "Sobha Halcyon", flat: "B-1202" },
];

// Services with dynamic pricing based on VehicleCategory (Simulating ServicePricing table)
export const services = [
  { name: "Exterior Wash", hatchbackPrice: 250, suvPrice: 350, luxuryPrice: 600 },
  { name: "Interior & Exterior Detail", hatchbackPrice: 800, suvPrice: 1200, luxuryPrice: 2500 },
];

// Time slots (Simulating TimeSlot table)
export const timeSlots = ["08:00–10:00 AM", "10:00–12:00 PM", "12:00–02:00 PM", "02:00–04:00 PM", "04:00–06:00 PM"];