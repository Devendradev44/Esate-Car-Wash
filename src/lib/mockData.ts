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

// export const vehicleHierarchy = [
//   {
//     id: "cat_hatchback",
//     name: "Hatchback",
//     brands: [
//       {
//         id: "brand_maruti",
//         name: "Maruti Suzuki",
//         models: [
//           { id: "swift", name: "Swift" },
//           { id: "baleno", name: "Baleno" },
//           { id: "wagonr", name: "Wagon R" },
//           { id: "altok10", name: "Alto K10" },
//           { id: "celerio", name: "Celerio" },
//           { id: "ignis", name: "Ignis" },
//         ],
//       },
//       {
//         id: "brand_hyundai",
//         name: "Hyundai",
//         models: [
//           { id: "i10nios", name: "Grand i10 Nios" },
//           { id: "i20", name: "i20" },
//         ],
//       },
//       {
//         id: "brand_tata",
//         name: "Tata",
//         models: [
//           { id: "tiago", name: "Tiago" },
//           { id: "altroz", name: "Altroz" },
//         ],
//       },
//     ],
//   },

//   {
//     id: "cat_sedan",
//     name: "Sedan",
//     brands: [
//       {
//         id: "brand_honda",
//         name: "Honda",
//         models: [
//           { id: "city", name: "City" },
//           { id: "amaze", name: "Amaze" },
//         ],
//       },
//       {
//         id: "brand_hyundai",
//         name: "Hyundai",
//         models: [
//           { id: "verna", name: "Verna" },
//           { id: "aura", name: "Aura" },
//         ],
//       },
//       {
//         id: "brand_skoda",
//         name: "Skoda",
//         models: [
//           { id: "slavia", name: "Slavia" },
//         ],
//       },
//       {
//         id: "brand_vw",
//         name: "Volkswagen",
//         models: [
//           { id: "virtus", name: "Virtus" },
//         ],
//       },
//     ],
//   },

//   {
//     id: "cat_suv",
//     name: "SUV",
//     brands: [
//       {
//         id: "brand_hyundai",
//         name: "Hyundai",
//         models: [
//           { id: "creta", name: "Creta" },
//           { id: "venue", name: "Venue" },
//           { id: "alcazar", name: "Alcazar" },
//           { id: "exter", name: "Exter" },
//         ],
//       },
//       {
//         id: "brand_tata",
//         name: "Tata",
//         models: [
//           { id: "nexon", name: "Nexon" },
//           { id: "harrier", name: "Harrier" },
//           { id: "safari", name: "Safari" },
//           { id: "punch", name: "Punch" },
//         ],
//       },
//       {
//         id: "brand_mahindra",
//         name: "Mahindra",
//         models: [
//           { id: "scorpio", name: "Scorpio N" },
//           { id: "xuv700", name: "XUV700" },
//           { id: "thar", name: "Thar" },
//           { id: "3xo", name: "XUV 3XO" },
//         ],
//       },
//       {
//         id: "brand_toyota",
//         name: "Toyota",
//         models: [
//           { id: "fortuner", name: "Fortuner" },
//           { id: "hyryder", name: "Urban Cruiser Hyryder" },
//           { id: "innova", name: "Innova Hycross" },
//         ],
//       },
//       {
//         id: "brand_kia",
//         name: "Kia",
//         models: [
//           { id: "seltos", name: "Seltos" },
//           { id: "sonet", name: "Sonet" },
//           { id: "carens", name: "Carens" },
//         ],
//       },
//       {
//         id: "brand_mg",
//         name: "MG",
//         models: [
//           { id: "hector", name: "Hector" },
//           { id: "astor", name: "Astor" },
//         ],
//       },
//     ],
//   },

//   {
//     id: "cat_luxury",
//     name: "Luxury",
//     brands: [
//       {
//         id: "brand_bmw",
//         name: "BMW",
//         models: [
//           { id: "3series", name: "3 Series" },
//           { id: "5series", name: "5 Series" },
//           { id: "x1", name: "X1" },
//           { id: "x3", name: "X3" },
//           { id: "x5", name: "X5" },
//         ],
//       },
//       {
//         id: "brand_mercedes",
//         name: "Mercedes-Benz",
//         models: [
//           { id: "aclass", name: "A-Class" },
//           { id: "cclass", name: "C-Class" },
//           { id: "eclass", name: "E-Class" },
//           { id: "glc", name: "GLC" },
//           { id: "gle", name: "GLE" },
//         ],
//       },
//       {
//         id: "brand_audi",
//         name: "Audi",
//         models: [
//           { id: "a4", name: "A4" },
//           { id: "a6", name: "A6" },
//           { id: "q3", name: "Q3" },
//           { id: "q5", name: "Q5" },
//         ],
//       },
//     ],
//   },

//   {
//     id: "cat_ev",
//     name: "Electric",
//     brands: [
//       {
//         id: "brand_tata",
//         name: "Tata",
//         models: [
//           { id: "nexonev", name: "Nexon EV" },
//           { id: "punchev", name: "Punch EV" },
//           { id: "curvvev", name: "Curvv EV" },
//         ],
//       },
//       {
//         id: "brand_mg",
//         name: "MG",
//         models: [
//           { id: "windsor", name: "Windsor EV" },
//           { id: "zs", name: "ZS EV" },
//         ],
//       },
//       {
//         id: "brand_hyundai",
//         name: "Hyundai",
//         models: [
//           { id: "kona", name: "Kona Electric" },
//           { id: "ioniq5", name: "IONIQ 5" },
//         ],
//       },
//     ],
//   },
// ];

// export const savedVehicles = [
//   {
//     id: "v1",
//     nickname: "Family SUV",
//     category: "SUV",
//     brand: "Toyota",
//     model: "Fortuner",
//     year: 2023,
//     color: "White",
//     fuel: "Diesel",
//     transmission: "Automatic",
//     reg: "TG09AB1234",
//     default: true,
//   },
//   {
//     id: "v2",
//     nickname: "Office Car",
//     category: "Sedan",
//     brand: "Honda",
//     model: "City",
//     year: 2022,
//     color: "Silver",
//     fuel: "Petrol",
//     transmission: "Manual",
//     reg: "TS10CD5678",
//     default: false,
//   },
//   {
//     id: "v3",
//     nickname: "Weekend Ride",
//     category: "Hatchback",
//     brand: "Maruti Suzuki",
//     model: "Baleno",
//     year: 2024,
//     color: "Blue",
//     fuel: "Petrol",
//     transmission: "Automatic",
//     reg: "KA05XY8899",
//     default: false,
//   },
// ];

// export const savedAddresses = [
//   {
//     id: "a1",
//     label: "Home",
//     community: "Prestige Shantiniketan",
//     flat: "A-401",
//     city: "Hyderabad",
//     pincode: "500084",
//     landmark: "Near Club House",
//     default: true,
//   },
//   {
//     id: "a2",
//     label: "Office",
//     community: "Mindspace IT Park",
//     flat: "Tower 2",
//     city: "Hyderabad",
//     pincode: "500081",
//     landmark: "Gate 3",
//     default: false,
//   },
//   {
//     id: "a3",
//     label: "Parents",
//     community: "Sobha Halcyon",
//     flat: "B-1202",
//     city: "Bengaluru",
//     pincode: "560103",
//     landmark: "Near Metro",
//     default: false,
//   },
// ];


// export const services = [
//   {
//     id: "basic",
//     name: "Basic Exterior Wash",
//     duration: 45,
//     hatchbackPrice: 299,
//     sedanPrice: 349,
//     suvPrice: 449,
//     luxuryPrice: 699,
//   },
//   {
//     id: "premium",
//     name: "Interior + Exterior Wash",
//     duration: 90,
//     hatchbackPrice: 799,
//     sedanPrice: 899,
//     suvPrice: 1199,
//     luxuryPrice: 1899,
//   },
//   {
//     id: "foam",
//     name: "Snow Foam Wash",
//     duration: 60,
//     hatchbackPrice: 499,
//     sedanPrice: 549,
//     suvPrice: 699,
//     luxuryPrice: 999,
//   },
//   {
//     id: "wax",
//     name: "Wax Polish",
//     duration: 120,
//     hatchbackPrice: 999,
//     sedanPrice: 1199,
//     suvPrice: 1599,
//     luxuryPrice: 2499,
//   },
//   {
//     id: "ceramic",
//     name: "Ceramic Coating",
//     duration: 360,
//     hatchbackPrice: 7999,
//     sedanPrice: 9999,
//     suvPrice: 12999,
//     luxuryPrice: 18999,
//   },
// ];

// export const timeSlots = [
//   "08:00–09:00 AM",
//   "09:00–10:00 AM",
//   "10:00–11:00 AM",
//   "11:00–12:00 PM",
//   "12:00–01:00 PM",
//   "01:00–02:00 PM",
//   "02:00–03:00 PM",
//   "03:00–04:00 PM",
//   "04:00–05:00 PM",
//   "05:00–06:00 PM",
//   "06:00–07:00 PM",
// ];