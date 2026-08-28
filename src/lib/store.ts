import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useState, useEffect } from 'react';

// --- TYPES ---
type MockUser = { id: string; role: "CUSTOMER" | "STAFF" | "ADMIN"; name: string; phone: string; email: string };
type CustomerVehicle = { id: string; category: string; brand: string; model: string; reg: string; isDefault: boolean };
type CustomerAddress = { id: string; community: string; flat: string };
type Community = { id: string; name: string; address: string; status: "ACTIVE" | "HIDDEN"; slotCapacity: number };
type TimeSlot = { id: string; label: string; startTime: string };
type VehicleCategory = { id: string; name: string; brands: VehicleBrand[] };
type VehicleBrand = { id: string; name: string; models: VehicleModel[] };
type VehicleModel = { id: string; name: string };
type ServiceItem = { id: string; name: string; description: string; pricing: Record<string, number> };
type BookingItem = { 
  id: string; bookingCode: string; date: string; time: string; 
  customer: string; flat: string; community: string; vehicle: string; regNumber: string; 
  service: string; amount: number; bookingStatus: "BOOKED" | "COMPLETED" | "CANCELLED"; paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  cancelledBy?: "CUSTOMER" | "ADMIN" | "STAFF";
};
type ExpenseItem = { id: string; date: string; name: string; category: string; amount: number; paymentType: string; notes: string };
type StaffItem = { id: string; name: string; phone: string; community: string; pin: string; status: "ACTIVE" | "DISABLED"; role: "STAFF" | "ADMIN" };

// --- INITIAL MOCK DATA ---
const initialCommunities: Community[] = [
  { id: "c1", name: "Prestige Shantiniketan", address: "Whitefield Main Rd, Bangalore", status: "ACTIVE", slotCapacity: 2 },
  { id: "c2", name: "Sobha Halcyon", address: "Jalahalli, Bangalore", status: "ACTIVE", slotCapacity: 2 },
  { id: "c3", name: "Brigade Gateway", address: "Malleshwaram, Bangalore", status: "HIDDEN", slotCapacity: 1 },
];

const initialTimeSlots: TimeSlot[] = [
  { id: "ts1", label: "08:00 - 10:00 AM", startTime: "08:00" },
  { id: "ts2", label: "10:00 - 12:00 PM", startTime: "10:00" },
  { id: "ts3", label: "12:00 - 02:00 PM", startTime: "12:00" },
  { id: "ts4", label: "02:00 - 04:00 PM", startTime: "14:00" },
  { id: "ts5", label: "04:00 - 06:00 PM", startTime: "16:00" },
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
  { id: "s1", name: "Basic Wash", description: "Essential exterior cleaning for everyday maintenance.", pricing: { Hatchback: 400, Sedan: 500, SUV: 600, Luxury: 600 } },
  { id: "s2", name: "Deluxe Wash", description: "A more complete wash with interior vacuuming.", pricing: { Hatchback: 600, Sedan: 800, SUV: 1000, Luxury: 1000 } },
  { id: "s3", name: "Premium Wash", description: "Deep exterior and interior care.", pricing: { Hatchback: 1000, Sedan: 1200, SUV: 1500, Luxury: 1500 } },
  { id: "s4", name: "Deep Cleaning", description: "Complete interior and exterior deep cleaning.", pricing: { Hatchback: 3000, Sedan: 3500, SUV: 4000, Luxury: 4000 } }
];

const initialBookings: BookingItem[] = [
  { id: "b1", bookingCode: "ECW-1001", date: "22-05-2025", time: "10:00 - 12:00 PM", customer: "Rahul Sharma", flat: "A-401", community: "Prestige Shantiniketan", vehicle: "Toyota Fortuner (SUV)", regNumber: "TG 09 AB 1234", service: "Exterior Wash", amount: 350, bookingStatus: "BOOKED", paymentStatus: "PENDING" },
  { id: "b2", bookingCode: "ECW-1002", date: "22-05-2025", time: "02:00 - 04:00 PM", customer: "Priya Patel", flat: "B-1202", community: "Sobha Halcyon", vehicle: "Hyundai Creta (SUV)", regNumber: "TG 11 CX 5678", service: "Interior Detail", amount: 1200, bookingStatus: "COMPLETED", paymentStatus: "PAID" },
];

const initialExpenses: ExpenseItem[] = [
  { id: "e1", date: "01-05-2025", name: "May Staff Salaries", category: "SALARY", amount: 25000, paymentType: "UPI", notes: "Paid to 3 staff" },
  { id: "e2", date: "05-05-2025", name: "Community Rent", category: "RENT", amount: 15000, paymentType: "ACCOUNT_TRANSFER", notes: "Monthly fee" },
];

const initialStaff: StaffItem[] = [
  { id: "st1", name: "Ramesh Kumar", phone: "9876543210", community: "Prestige Shantiniketan", pin: "1234", status: "ACTIVE", role: "STAFF" },
  { id: "st2", name: "Suresh Babu", phone: "9876543211", community: "Sobha Halcyon", pin: "5678", status: "ACTIVE", role: "STAFF" },
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

  updateMockUser: (data: { name?: string; phone?: string; email?: string }) => void;
  cancelBooking: (id: string, cancelledBy: "CUSTOMER" | "ADMIN" | "STAFF") => void;

  timeSlots: TimeSlot[];
  addTimeSlot: (label: string, startTime: string) => void;
  deleteTimeSlot: (id: string) => void;

  // Community Actions
  addCommunity: (community: Community) => void;
  updateCommunityStatus: (id: string, status: "ACTIVE" | "HIDDEN") => void;
  updateCommunity: (id: string, name: string, address: string, slotCapacity: number) => void;
  deleteCommunity: (id: string) => void;

  // Address Actions
  addAddress: (address: CustomerAddress) => void;
  updateAddress: (id: string, community: string, flat: string) => void;
  deleteAddress: (id: string) => void;

  // Vehicle Actions
  addCustomerVehicle: (vehicle: CustomerVehicle) => void;
  updateCustomerVehicle: (id: string, reg: string) => void;
  deleteCustomerVehicle: (id: string) => void;
  
  addVehicleCategory: (category: VehicleCategory) => void;
  addVehicleBrand: (categoryId: string, brand: VehicleBrand) => void;
  addVehicleModel: (categoryId: string, brandId: string, model: VehicleModel) => void;
  updateVehicleCategory: (id: string, name: string) => void;
  updateVehicleBrand: (categoryId: string, brandId: string, name: string) => void;
  updateVehicleModel: (categoryId: string, brandId: string, modelId: string, name: string) => void;
  deleteVehicleCategory: (id: string) => void;
  deleteVehicleBrand: (categoryId: string, brandId: string) => void;
  deleteVehicleModel: (categoryId: string, brandId: string, modelId: string) => void;

  // Service Actions
  addService: (service: ServiceItem) => void;
  updateService: (id: string, name: string, description: string, pricing: Record<string, number>) => void;
  deleteService: (id: string) => void;

  // Booking Actions
  addBooking: (booking: BookingItem) => void;
  completeBooking: (id: string) => void;

  // Expense Actions
  addExpense: (expense: ExpenseItem) => void;
  updateExpense: (id: string, date: string, name: string, amount: number, category: string, paymentType: string, notes: string) => void;
  deleteExpense: (id: string) => void;

  // Staff Actions
  addStaff: (staff: StaffItem) => void;
  updateStaff: (id: string, name: string, phone: string, community: string) => void;
  deleteStaff: (id: string) => void;
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
      
      updateMockUser: (data) => set((state) => ({
        mockUser: state.mockUser ? { ...state.mockUser, ...data } : null
      })),
      
      cancelBooking: (id, cancelledBy) => set((state) => ({
        bookings: state.bookings.map(b => 
          b.id === id ? { ...b, bookingStatus: "CANCELLED" as const, paymentStatus: "REFUNDED" as const, cancelledBy } : b
        )
      })),

      timeSlots: initialTimeSlots,
      addTimeSlot: (label, startTime) => set((state) => ({ timeSlots: [...state.timeSlots, { id: `ts${Date.now()}`, label, startTime }] })),
      deleteTimeSlot: (id) => set((state) => ({ timeSlots: state.timeSlots.filter(t => t.id !== id) })),

      addresses: [
        { id: "a1", community: "Prestige Shantiniketan", flat: "A-401" },
        { id: "a2", community: "Sobha Halcyon", flat: "B-1202" },
      ],
      customerGarage: [
        { id: "v1", category: "SUV", brand: "Toyota", model: "Fortuner", reg: "TG 09 AB 1234", isDefault: true },
        { id: "v2", category: "Hatchback", brand: "Maruti Suzuki", model: "Swift", reg: "TG 11 CX 5678", isDefault: false },
      ],

      // --- MUTATIONS ---
      // Community
      addCommunity: (newCommunity) => set((state) => ({ communities: [...state.communities, newCommunity] })),
      updateCommunityStatus: (id, status) => set((state) => ({
        communities: state.communities.map(c => c.id === id ? { ...c, status } : c)
      })),
      deleteCommunity: (id) => set((state) => ({ communities: state.communities.filter(c => c.id !== id) })),
      updateCommunity: (id, name, address, slotCapacity) => set((state) => ({
        communities: state.communities.map(c => c.id === id ? { ...c, name, address, slotCapacity } : c)
      })),

      // Address
      addAddress: (newAddress) => set((state) => ({ addresses: [...state.addresses, newAddress] })),
      updateAddress: (id, community, flat) => set((state) => ({ 
        addresses: state.addresses.map(a => a.id === id ? { ...a, community, flat } : a) 
      })),
      deleteAddress: (id) => set((state) => ({ addresses: state.addresses.filter(a => a.id !== id) })),

      // Customer Vehicles
      addCustomerVehicle: (newVehicle) => set((state) => ({ customerGarage: [...state.customerGarage, newVehicle] })),
      updateCustomerVehicle: (id, reg) => set((state) => ({
        customerGarage: state.customerGarage.map(v => v.id === id ? { ...v, reg } : v)
      })),
      deleteCustomerVehicle: (id) => set((state) => ({ customerGarage: state.customerGarage.filter(v => v.id !== id) })),

      // Vehicle Master
      addVehicleCategory: (newCategory) => set((state) => ({ vehicles: [...state.vehicles, newCategory] })),
      addVehicleBrand: (categoryId, newBrand) => set((state) => ({
        vehicles: state.vehicles.map(cat => cat.id === categoryId ? { ...cat, brands: [...cat.brands, newBrand] } : cat)
      })),
      addVehicleModel: (categoryId, brandName, newModel) => set((state) => ({
        vehicles: state.vehicles.map(cat => {
          if (cat.id !== categoryId) return cat;
          const brandExists = cat.brands.find(b => b.name === brandName);
          if (brandExists) {
            return {
              ...cat,
              brands: cat.brands.map(brand => 
                brand.name === brandName ? { ...brand, models: [...brand.models, newModel] } : brand
              )
            };
          } else {
            return {
              ...cat,
              brands: [...cat.brands, { id: `brand_${Date.now()}`, name: brandName, models: [newModel] }]
            };
          }
        })
      })),
      updateVehicleCategory: (id, name) => set((state) => ({
        vehicles: state.vehicles.map(c => c.id === id ? { ...c, name } : c)
      })),
      updateVehicleBrand: (categoryId, brandId, name) => set((state) => ({
        vehicles: state.vehicles.map(c => c.id === categoryId ? {
          ...c,
          brands: c.brands.map(b => b.id === brandId ? { ...b, name } : b)
        } : c)
      })),
      updateVehicleModel: (categoryId, brandId, modelId, name) => set((state) => ({
        vehicles: state.vehicles.map(c => c.id === categoryId ? {
          ...c,
          brands: c.brands.map(b => b.id === brandId ? {
            ...b,
            models: b.models.map(m => m.id === modelId ? { ...m, name } : m)
          } : b)
        } : c)
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

      // Services
      addService: (newService) => set((state) => ({ services: [...state.services, newService] })),
      updateService: (id, name, description, pricing) => set((state) => ({
        services: state.services.map(s => s.id === id ? { ...s, name, description, pricing } : s)
      })),
      deleteService: (id) => set((state) => ({ services: state.services.filter(s => s.id !== id) })),

      // Bookings
      addBooking: (newBooking) => set((state) => ({ bookings: [newBooking, ...state.bookings] })),
      completeBooking: (id) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, bookingStatus: "COMPLETED" as const, paymentStatus: "PAID" as const } : b)
      })),

      // Expenses
      addExpense: (newExpense) => set((state) => ({ expenses: [...state.expenses, newExpense] })),
      updateExpense: (id, date, name, amount, category, paymentType, notes) => set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, date, name, amount, category, paymentType, notes } : e)
      })),
      deleteExpense: (id) => set((state) => ({ expenses: state.expenses.filter(e => e.id !== id) })),

      // Staff
      addStaff: (newStaff) => set((state) => ({ staff: [...state.staff, newStaff] })),
      updateStaff: (id, name, phone, community) => set((state) => ({
        staff: state.staff.map(s => s.id === id ? { ...s, name, phone, community } : s)
      })),
      deleteStaff: (id) => set((state) => ({ staff: state.staff.filter(s => s.id !== id) })),
    }),
    {
      name: 'estate-car-wash-v8', // Bumped to v7 to ensure clean state and apply type fixes
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