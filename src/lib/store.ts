import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useState, useEffect } from 'react';

// --- TYPES ---
type MockUser = { id: string; role: "CUSTOMER" | "STAFF" | "ADMIN"; name: string; phone?: string; email?: string };
type CustomerVehicle = { id: string; category: string; brand: string; model: string; reg: string; isDefault: boolean };
type CustomerAddress = { id: string; community: string; flat: string };
type Community = { id: string; name: string; address: string; status: "ACTIVE" | "HIDDEN" };
type VehicleCategory = { id: string; name: string; brands: VehicleBrand[] };
type VehicleBrand = { id: string; name: string; models: VehicleModel[] };
type VehicleModel = { id: string; name: string };
type ServiceItem = { id: string; name: string; description: string; pricing: Record<string, number> };
type BookingItem = { 
  id: string; bookingCode: string; date: string; time: string; 
  customer: string; flat: string; community: string; vehicle: string; regNumber: string; 
  service: string; amount: number; bookingStatus: "BOOKED" | "COMPLETED" | "CANCELLED"; paymentStatus: "PENDING" | "PAID" | "REFUNDED"
};
type ExpenseItem = { id: string; date: string; name: string; category: string; amount: number; paymentType: string; notes: string };
type StaffItem = { id: string; name: string; phone: string; community: string; pin: string; status: "ACTIVE" | "DISABLED" };

// --- INITIAL MOCK DATA ---
const initialCommunities: Community[] = [
  { id: "c1", name: "Prestige Shantiniketan", address: "Whitefield Main Rd, Bangalore", status: "ACTIVE" },
  { id: "c2", name: "Sobha Halcyon", address: "Jalahalli, Bangalore", status: "ACTIVE" },
  { id: "c3", name: "Brigade Gateway", address: "Malleshwaram, Bangalore", status: "HIDDEN" },
];

const initialVehicles: VehicleCategory[] = [
  { id: "cat_suv", name: "SUV", brands: [
      { id: "brand_toyota", name: "Toyota", models: [{ id: "model_fortuner", name: "Fortuner" }] },
      { id: "brand_hyundai", name: "Hyundai", models: [{ id: "model_creta", name: "Creta" }] },
  ]},
  { id: "cat_hatchback", name: "Hatchback", brands: [
      { id: "brand_maruti", name: "Maruti Suzuki", models: [{ id: "model_swift", name: "Swift" }, { id: "model_baleno", name: "Baleno" }] },
  ]},
  { id: "cat_luxury", name: "Luxury", brands: [
      { id: "brand_bmw", name: "BMW", models: [{ id: "model_3series", name: "3 Series" }] },
  ]},
];

const initialServices: ServiceItem[] = [
  { id: "s1", name: "Exterior Wash", description: "Basic exterior foam wash", pricing: { Hatchback: 250, Sedan: 300, SUV: 350, Luxury: 600 } },
  { id: "s2", name: "Interior & Exterior Detail", description: "Deep clean inside and out", pricing: { Hatchback: 800, Sedan: 1000, SUV: 1200, Luxury: 2500 } },
];

const initialBookings: BookingItem[] = [
  { id: "b1", bookingCode: "ECW-1001", date: "22-05-2025", time: "10:00–12:00 PM", customer: "Rahul Sharma", flat: "A-401", community: "Prestige Shantiniketan", vehicle: "Toyota Fortuner (SUV)", regNumber: "TG 09 AB 1234", service: "Exterior Wash", amount: 350, bookingStatus: "BOOKED", paymentStatus: "PENDING" },
  { id: "b2", bookingCode: "ECW-1002", date: "22-05-2025", time: "02:00–04:00 PM", customer: "Priya Patel", flat: "B-1202", community: "Sobha Halcyon", vehicle: "Hyundai Creta (SUV)", regNumber: "TG 11 CX 5678", service: "Interior Detail", amount: 1200, bookingStatus: "COMPLETED", paymentStatus: "PAID" },
];

const initialExpenses: ExpenseItem[] = [
  { id: "e1", date: "01-05-2025", name: "May Staff Salaries", category: "SALARY", amount: 25000, paymentType: "UPI", notes: "Paid to 3 staff" },
  { id: "e2", date: "05-05-2025", name: "Community Rent", category: "RENT", amount: 15000, paymentType: "ACCOUNT_TRANSFER", notes: "Monthly fee" },
];

const initialStaff: StaffItem[] = [
  { id: "st1", name: "Ramesh Kumar", phone: "9876543210", community: "Prestige Shantiniketan", pin: "1234", status: "ACTIVE" },
  { id: "st2", name: "Suresh Babu", phone: "9876543211", community: "Sobha Halcyon", pin: "5678", status: "ACTIVE" },
];

// --- THE STORE ---
type AppStore = {
  mockUser: MockUser | null;
  setMockUser: (user: MockUser) => void;
  logoutMockUser: () => void;

  communities: Community[];
  vehicles: VehicleCategory[];
  services: ServiceItem[];
  bookings: BookingItem[];
  expenses: ExpenseItem[];
  staff: StaffItem[];
  addresses: CustomerAddress[];
  customerGarage: CustomerVehicle[];

  // Actions
  addCommunity: (community: Community) => void;
  updateCommunityStatus: (id: string, status: "ACTIVE" | "HIDDEN") => void;
  addAddress: (address: CustomerAddress) => void;
  addCustomerVehicle: (vehicle: CustomerVehicle) => void;
  addService: (service: ServiceItem) => void;
  addBooking: (booking: BookingItem) => void;
  addExpense: (expense: ExpenseItem) => void;
  cancelBooking: (id: string) => void;
  addStaff: (staff: StaffItem) => void;
  
  addVehicleCategory: (category: VehicleCategory) => void;
  addVehicleBrand: (categoryId: string, brand: VehicleBrand) => void;
  addVehicleModel: (categoryId: string, brandId: string, model: VehicleModel) => void;
  deleteVehicleCategory: (id: string) => void;
  deleteVehicleBrand: (categoryId: string, brandId: string) => void;
  deleteVehicleModel: (categoryId: string, brandId: string, modelId: string) => void;
  
  completeBooking: (id: string) => void;
};

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      mockUser: null,
      setMockUser: (user) => set({ mockUser: user }),
      logoutMockUser: () => set({ mockUser: null }),

      communities: initialCommunities,
      vehicles: initialVehicles,
      services: initialServices,
      bookings: initialBookings,
      expenses: initialExpenses,
      staff: initialStaff,
      
      addresses: [
        { id: "a1", community: "Prestige Shantiniketan", flat: "A-401" },
        { id: "a2", community: "Sobha Halcyon", flat: "B-1202" },
      ],
      customerGarage: [
        { id: "v1", category: "SUV", brand: "Toyota", model: "Fortuner", reg: "TG 09 AB 1234", isDefault: true },
        { id: "v2", category: "Hatchback", brand: "Maruti Suzuki", model: "Swift", reg: "TG 11 CX 5678", isDefault: false },
      ],

      // --- MUTATIONS ---
      addCommunity: (newCommunity) => set((state) => ({ communities: [...state.communities, newCommunity] })),
      updateCommunityStatus: (id, status) => set((state) => ({
        communities: state.communities.map(c => c.id === id ? { ...c, status } : c)
      })),
      addAddress: (newAddress) => set((state) => ({ addresses: [...state.addresses, newAddress] })),
      addCustomerVehicle: (newVehicle) => set((state) => ({ customerGarage: [...state.customerGarage, newVehicle] })),
      addService: (newService) => set((state) => ({ services: [...state.services, newService] })),
      addBooking: (newBooking) => set((state) => ({ bookings: [newBooking, ...state.bookings] })),
      addExpense: (newExpense) => set((state) => ({ expenses: [newExpense, ...state.expenses] })),
      cancelBooking: (id) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, bookingStatus: "CANCELLED" as const, paymentStatus: "REFUNDED" as const } : b)
      })),
      addStaff: (newStaff) => set((state) => ({ staff: [...state.staff, newStaff] })),
      
      // VEHICLES
      addVehicleCategory: (newCategory) => set((state) => ({ vehicles: [...state.vehicles, newCategory] })),
      addVehicleBrand: (categoryId, newBrand) => set((state) => ({
        vehicles: state.vehicles.map(cat => cat.id === categoryId ? { ...cat, brands: [...cat.brands, newBrand] } : cat)
      })),
      addVehicleModel: (categoryId, brandName, newModel) => set((state) => ({
        vehicles: state.vehicles.map(cat => {
          if (cat.id !== categoryId) return cat;
          
        // Check if brand already exists by NAME
          const brandExists = cat.brands.find(b => b.name === brandName);
          
          if (brandExists) {
            // Brand exists, just add the model
            return {
              ...cat,
              brands: cat.brands.map(brand => 
                brand.name === brandName ? { ...brand, models: [...brand.models, newModel] } : brand
              )
            };
          } else {
            // Brand doesn't exist, create it and add the model!
            return {
              ...cat,
              brands: [...cat.brands, { id: `brand_${Date.now()}`, name: brandName, models: [newModel] }]
            };
          }
        })
      })),
      deleteVehicleCategory: (id) => set((state) => ({ vehicles: state.vehicles.filter(c => c.id !== id) })),
      deleteVehicleBrand: (categoryId, brandId) => set((state) => ({
        vehicles: state.vehicles.map(c => c.id === categoryId ? { ...c, brands: c.brands.filter(b => b.id !== brandId) } : c)
      })),
      deleteVehicleModel: (categoryId, brandId, modelId) => set((state) => ({
        vehicles: state.vehicles.map(c => c.id === categoryId ? {
          ...c,
          brands: c.brands.map(b => b.id === brandId ? { ...b, models: b.models.filter(m => m.id !== modelId) } : b)
        } : c)
      })),

      // STAFF
      completeBooking: (id) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, bookingStatus: "COMPLETED" as const, paymentStatus: "PAID" as const } : b)
      })),
    }),
    {
      name: 'estate-car-wash-v4', // FORCED FRESH START
    }
  )
);

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
};