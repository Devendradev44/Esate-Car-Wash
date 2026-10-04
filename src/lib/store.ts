import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useState } from 'react';
import { vehicleFixtures, type VehicleCategory, type VehicleBrand, type VehicleModel } from './vehicleFixtures';

// --- TYPES ---
type MockUser = { id: string; role: "CUSTOMER" | "STAFF" | "ADMIN"; name: string; phone?: string; email?: string };

type Customer = {
  id: string;
  name: string;
  phone?: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

// Admin credentials & management
type AdminPermission = "bookings" | "staff" | "finance" | "settings" | "vehicles" | "services" | "communities" | "expenses";
type AdminUser = {
  id: string;
  email: string;
  passwordHash: string; // mock hash for demo
  name: string;
  permissions: AdminPermission[];
  lastLogin: string | null;
  invitedBy: string | null;
  createdAt: string;
  status: "ACTIVE" | "DISABLED";
};

type CustomerVehicle = { id: string; ownerId: string; category: string; brand: string; model: string; reg: string; isDefault: boolean };
type CustomerAddress = { id: string; ownerId: string; community: string; flat: string };
type CustomerDriver = { id: string; ownerId: string; name: string; phone: string };
type CommunityServiceSetting = { serviceName: string; enabled: boolean; discountPct: number };
type Community = { id: string; name: string; address: string; status: "ACTIVE" | "HIDDEN"; slotCapacity: number; timeRange?: { start: string; end: string }; serviceSettings?: CommunityServiceSetting[] };
type TimeSlot = { id: string; label: string; startTime: string; endTime: string };
type ServiceItem = { id: string; name: string; description: string; duration: number; pricing: Record<string, number>; active?: boolean };
export type BookingItem = { 
  id: string; bookingCode: string; date: string; time: string; 
  customer: string; customerId: string; flat: string; community: string; vehicle: string; regNumber: string; 
  service: string; amount: number; bookingStatus: "BOOKED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  cancelledBy?: "CUSTOMER" | "ADMIN" | "STAFF";
  cancelledAt?: string;
  startTime?: string;
  endTime?: string;
  durationMin?: number;
  paymentMethod?: "CASH" | "UPI" | "ONLINE";
  coordinator?: { type: "SELF" | "DRIVER"; name: string; phone: string };
  assignedTo?: string;
  helperIds?: string[];
};
type ExpenseItem = { id: string; date: string; name: string; category: string; amount: number; paymentType: string; notes: string; community?: string };
type StaffItem = { id: string; name: string; phone: string; communities: string[]; pin: string; status: "ACTIVE" | "DISABLED"; role: "STAFF" | "ADMIN" };

// Simple mock hash function for demo (not secure, just for UI validation)
export const mockHash = (password: string) => `hash_${btoa(password).slice(0, 16)}`;
export const verifyMockHash = (password: string, hash: string) => mockHash(password) === hash;

// --- INITIAL MOCK DATA ---
// Demo customers/communities/expenses removed — real data is created in-app (admin defines communities).
const initialCommunities: Community[] = [];
const initialExpenses: ExpenseItem[] = [];

const formatTimeLabel = (minutes: number) => {
  const hours24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const modifier = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${String(hours12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${modifier}`;
};

const formatClockTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const initialTimeSlots: TimeSlot[] = Array.from({ length: 19 }, (_, index) => {
  const start = 9 * 60 + index * 30;
  const end = start + 30;
  return {
    id: `ts${index + 1}`,
    label: `${formatTimeLabel(start)} - ${formatTimeLabel(end)}`,
    startTime: formatClockTime(start),
    endTime: formatClockTime(end),
  };
});

const initialServices: ServiceItem[] = [
  { id: "s1", name: "Basic Wash", description: "Essential exterior cleaning for everyday maintenance.", duration: 1, pricing: { Hatchback: 400, Sedan: 500, SUV: 600, Luxury: 600 } },
  { id: "s2", name: "Deluxe Wash", description: "A more complete wash with interior vacuuming.", duration: 2, pricing: { Hatchback: 600, Sedan: 800, SUV: 1000, Luxury: 1000 } },
  { id: "s3", name: "Premium Wash", description: "Deep exterior and interior care.", duration: 3, pricing: { Hatchback: 1000, Sedan: 1200, SUV: 1500, Luxury: 1500 } },
  { id: "s4", name: "Deep Cleaning", description: "Complete interior and exterior deep cleaning.", duration: 5, pricing: { Hatchback: 3000, Sedan: 3500, SUV: 4000, Luxury: 4000 } }
];

const initialCustomers: Customer[] = [];

const initialBookings: BookingItem[] = [];

const initialStaff: StaffItem[] = [
  { id: "staff_1", name: "Vikram Singh", phone: "9911099110", communities: ["Estate Lakeside"], pin: "123456", status: "ACTIVE", role: "STAFF" },
  { id: "staff_2", name: "Manoj Patil", phone: "9922099220", communities: ["Vista Heights"], pin: "567890", status: "ACTIVE", role: "STAFF" },
  { id: "staff_3", name: "Sameer Khan", phone: "9933099330", communities: ["Estate Lakeside"], pin: "901234", status: "DISABLED", role: "STAFF" },
];

// Default super admin - password: "Paddwird#1"
const initialAdmins: AdminUser[] = [
  {
    id: "admin_1",
    email: "dewang.dave1990@yahoo.com",
    passwordHash: mockHash("Paddwird#1"),
    name: "Dewang Dave",
    permissions: ["bookings", "staff", "finance", "settings", "vehicles", "services", "communities", "expenses"],
    lastLogin: null,
    invitedBy: null,
    createdAt: new Date().toISOString(),
    status: "ACTIVE",
  },
];

// --- THE STORE ---
type AppStore = {
  mockUser: MockUser | null;
  setMockUser: (user: MockUser) => void;
  logoutMockUser: () => void;
  claimCustomerData: (id: string, name: string) => void;

  communities: Community[];
  vehicles: VehicleCategory[];
  services: ServiceItem[];
  bookings: BookingItem[];
  expenses: ExpenseItem[];
  staff: StaffItem[];
  addresses: CustomerAddress[];
  customerGarage: CustomerVehicle[];
  drivers: CustomerDriver[];

  // Customers
  customers: Customer[];
  addCustomer: (customer: Partial<Customer> & Omit<Customer, "id" | "createdAt">) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Admin management
  admins: AdminUser[];
  addAdmin: (admin: Omit<AdminUser, "id" | "createdAt" | "lastLogin">) => void;
  updateAdmin: (id: string, data: Partial<Omit<AdminUser, "id" | "createdAt">>) => void;
  deleteAdmin: (id: string) => void;
  updateAdminLastLogin: (id: string) => void;

  updateMockUser: (data: { name?: string; phone?: string; email?: string }) => void;
  cancelBooking: (id: string, cancelledBy: "CUSTOMER" | "ADMIN" | "STAFF") => void;
  rescheduleBooking: (id: string, newDate: string, newTime: string) => void;
  startService: (id: string, assignedTo?: string) => void;
  reinstateBooking: (id: string) => void;
  setHelpers: (id: string, helperIds: string[]) => void;

  timeSlots: TimeSlot[];
  addTimeSlot: (label: string, startTime: string, endTime?: string) => void;
  deleteTimeSlot: (id: string) => void;

  // Community Actions
  addCommunity: (community: Community) => void;
  updateCommunityStatus: (id: string, status: "ACTIVE" | "HIDDEN") => void;
  updateCommunity: (id: string, name: string, address: string, slotCapacity: number, timeRange?: { start: string; end: string }) => void;
  updateCommunityTimeRange: (id: string, start: string, end: string) => void;
  updateCommunityServices: (id: string, serviceSettings: CommunityServiceSetting[]) => void;
  deleteCommunity: (id: string) => void;

  // Address Actions
  addAddress: (address: Omit<CustomerAddress, "ownerId">) => void;
  updateAddress: (id: string, community: string, flat: string) => void;
  deleteAddress: (id: string) => void;

  // Vehicle Actions
  addCustomerVehicle: (vehicle: Omit<CustomerVehicle, "ownerId">) => void;
  updateCustomerVehicle: (id: string, reg: string) => void;
deleteCustomerVehicle: (id: string) => void;

  // Driver Actions
  addDriver: (driver: Omit<CustomerDriver, "ownerId">) => void;
  updateDriver: (id: string, name: string, phone: string) => void;
  deleteDriver: (id: string) => void;
   
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
  setServiceStatus: (id: string, active: boolean) => void;
  deleteService: (id: string) => void;

  // Booking Actions
  addBooking: (booking: Omit<BookingItem, "customerId">) => void;
  completeBooking: (id: string, method: "CASH" | "UPI" | "ONLINE", received?: boolean) => void;

  // Expense Actions
  addExpense: (expense: ExpenseItem) => void;
  updateExpense: (id: string, date: string, name: string, amount: number, category: string, paymentType: string, notes: string, community?: string) => void;
  deleteExpense: (id: string) => void;

  expenseCategories: string[];
  addExpenseCategory: (category: string) => void;
  removeExpenseCategory: (category: string) => void;

  // Staff Actions
  addStaff: (staff: StaffItem) => void;
  updateStaff: (id: string, data: { name?: string; phone?: string; communities?: string[]; pin?: string; status?: "ACTIVE" | "DISABLED" }) => void;
  deleteStaff: (id: string) => void;
};

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      mockUser: null,
      setMockUser: (user) => set({ mockUser: user }),
      logoutMockUser: () => set({ mockUser: null }),
      // Heal for accounts whose data was backfilled while logged out (v21 migration stamped
      // ownerId/customerId = "" because no customer session was active at first load). Only
      // unowned records are claimed; anything already owned is left untouched.
      claimCustomerData: (id, name) => set((state) => {
        const owns = (v: unknown) => typeof v === "string" && v.trim() !== "";
        return {
          addresses: state.addresses.map((a) => (owns(a.ownerId) ? a : { ...a, ownerId: id })),
          customerGarage: state.customerGarage.map((v) => (owns(v.ownerId) ? v : { ...v, ownerId: id })),
          drivers: state.drivers.map((d) => (owns(d.ownerId) ? d : { ...d, ownerId: id })),
          bookings: state.bookings.map((b) => {
            if (owns(b.customerId)) return b;
            const nameMatch = !b.customer || (typeof b.customer === "string" && b.customer.trim().toLowerCase() === (name || "").trim().toLowerCase());
            return nameMatch ? { ...b, customerId: id } : b;
          }),
        };
      }),

      communities: initialCommunities,
      vehicles: vehicleFixtures,
      services: initialServices,
      bookings: initialBookings,
      expenses: initialExpenses,
      expenseCategories: ["SALARY", "RENT", "WATER", "ELECTRICITY", "MAINTENANCE", "TRAVEL", "FUEL", "EQUIPMENT", "REPAIR", "FOOD", "CLEANING_MATERIAL", "MARKETING", "MISCELLANEOUS"],
      staff: initialStaff,
      
      // Admin management
      admins: initialAdmins,
      addAdmin: (newAdmin) => set((state) => ({
        admins: [...state.admins, { 
          ...newAdmin, 
          id: `admin_${Date.now()}`, 
          createdAt: new Date().toISOString(),
          lastLogin: null,
        }]
      })),
      updateAdmin: (id, data) => set((state) => ({
        admins: state.admins.map(a => a.id === id ? { ...a, ...data } : a)
      })),
      deleteAdmin: (id) => set((state) => ({
        admins: state.admins.filter(a => a.id !== id)
      })),
      updateAdminLastLogin: (id) => set((state) => ({
        admins: state.admins.map(a => a.id === id ? { ...a, lastLogin: new Date().toISOString() } : a)
      })),

updateMockUser: (data) => set((state) => {
          const updatedMockUser = state.mockUser ? { ...state.mockUser, ...data } : {
            id: `user_${Date.now()}`,
            role: "CUSTOMER" as const,
            name: data.name ?? "Customer User",
            phone: data.phone,
            email: data.email,
          };
          // If the updated mockUser is a customer, update the customer record
          const updatedCustomers = state.customers.map(c => 
            c.id === updatedMockUser.id ? { ...c, ...data } : c
          );
          return { mockUser: updatedMockUser, customers: updatedCustomers };
        }),
      
      cancelBooking: (id, cancelledBy) => set((state) => ({
        bookings: state.bookings.map(b => 
          b.id === id ? { ...b, bookingStatus: "CANCELLED" as const, paymentStatus: "REFUNDED" as const, cancelledBy, cancelledAt: new Date().toISOString() } : b
        )
      })),
      startService: (id, assignedTo) => set((state) => ({
        bookings: state.bookings.map(b => 
          b.id === id && b.bookingStatus === "BOOKED" ? { ...b, bookingStatus: "IN_PROGRESS" as const, startTime: new Date().toISOString(), ...(assignedTo ? { assignedTo } : {}) } : b
        )
      })),
      setHelpers: (id, helperIds) => set((state) => ({
        bookings: state.bookings.map(b => 
          b.id === id ? { ...b, helperIds } : b
        )
      })),
      reinstateBooking: (id) => set((state) => ({
        bookings: state.bookings.map(b => 
          b.id === id && b.bookingStatus === "CANCELLED" ? { ...b, bookingStatus: "BOOKED" as const, cancelledBy: undefined, cancelledAt: undefined, paymentStatus: b.paymentMethod && b.paymentMethod !== "CASH" ? "PAID" as const : "PENDING" as const } : b
        )
      })),
      rescheduleBooking: (id, newDate, newTime) => set((state) => ({
        bookings: state.bookings.map(b => 
          b.id === id ? { ...b, date: newDate, time: newTime } : b
        )
      })),

      timeSlots: initialTimeSlots,
      addTimeSlot: (label: string, startTime: string, endTime?: string) => set((state) => ({ timeSlots: [...state.timeSlots, { id: `ts${Date.now()}`, label, startTime, endTime: endTime || startTime }] })),
      deleteTimeSlot: (id) => set((state) => ({ timeSlots: state.timeSlots.filter(t => t.id !== id) })),

      addresses: [],
      customerGarage: [],
      drivers: [],
      customers: initialCustomers,

      // --- MUTATIONS ---
      // Community
      addCommunity: (newCommunity) => set((state) => ({ communities: [...state.communities, newCommunity] })),
      updateCommunityStatus: (id, status) => set((state) => ({
        communities: state.communities.map(c => c.id === id ? { ...c, status } : c)
      })),
      deleteCommunity: (id) => set((state) => ({ communities: state.communities.filter(c => c.id !== id) })),
      updateCommunity: (id, name, address, slotCapacity, timeRange) => set((state) => ({
        communities: state.communities.map(c => c.id === id ? { ...c, name, address, slotCapacity, ...(timeRange ? { timeRange } : {}) } : c)
      })),
      updateCommunityTimeRange: (id, start, end) => set((state) => ({
        communities: state.communities.map(c => c.id === id ? { ...c, timeRange: { start, end } } : c)
      })),
      updateCommunityServices: (id, serviceSettings) => set((state) => ({
        communities: state.communities.map(c => c.id === id ? { ...c, serviceSettings } : c)
      })),

      // Address
      addAddress: (newAddress) => set((state) => { 
        const ownerId = state.mockUser?.id ?? "";
        return { addresses: [...state.addresses, { ...newAddress, ownerId }] };
      }),
      updateAddress: (id, community, flat) => set((state) => ({ 
        addresses: state.addresses.map(a => a.id === id ? { ...a, community, flat } : a) 
      })),
      deleteAddress: (id) => set((state) => ({ addresses: state.addresses.filter(a => a.id !== id) })),

      // Customer Vehicles
      addCustomerVehicle: (newVehicle) => set((state) => {
        const ownerId = state.mockUser?.id ?? "";
        return { customerGarage: [...state.customerGarage, { ...newVehicle, ownerId }] };
      }),
      updateCustomerVehicle: (id, reg) => set((state) => ({
        customerGarage: state.customerGarage.map(v => v.id === id ? { ...v, reg } : v)
      })),
      deleteCustomerVehicle: (id) => set((state) => ({ customerGarage: state.customerGarage.filter(v => v.id !== id) })),

      // Drivers
      addDriver: (newDriver) => set((state) => {
        const ownerId = state.mockUser?.id ?? "";
        return { drivers: [...state.drivers, { ...newDriver, ownerId }] };
      }),
      updateDriver: (id, name, phone) => set((state) => ({
        drivers: state.drivers.map(d => d.id === id ? { ...d, name, phone } : d)
      })),
      deleteDriver: (id) => set((state) => ({ drivers: state.drivers.filter(d => d.id !== id) })),

      // Customer Actions
      addCustomer: (newCustomer) => set((state) => ({ 
        customers: [...state.customers, { 
          ...newCustomer, 
          id: newCustomer.id || `cust_${Date.now()}`, 
          createdAt: newCustomer.createdAt || new Date().toISOString() 
        }] 
      })),
      updateCustomer: (id, data) => set((state) => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      deleteCustomer: (id) => set((state) => ({ customers: state.customers.filter(c => c.id !== id) })),

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
      setServiceStatus: (id, active) => set((state) => ({
        services: state.services.map(s => s.id === id ? { ...s, active } : s)
      })),
      deleteService: (id) => set((state) => ({ services: state.services.filter(s => s.id !== id) })),

      // Bookings
      addBooking: (newBooking) => set((state) => {
        const owner = state.mockUser as MockUser | null | undefined;
        const matched = (Array.isArray(state.customers) ? state.customers : []).find((c) => c.name === newBooking.customer);
        const customerId = matched?.id || (owner?.role === "CUSTOMER" && owner.id ? owner.id : "");
        return { bookings: [{ ...newBooking, customerId }, ...state.bookings] };
      }),
      completeBooking: (id, method, received = true) => set((state) => ({
        bookings: state.bookings.map(b => {
          if (b.id !== id) return b;
          const endTime = new Date().toISOString();
          const durationMin = b.startTime ? Math.max(0, Math.round((Date.now() - new Date(b.startTime).getTime()) / 60000)) : undefined;
          return { ...b, bookingStatus: "COMPLETED" as const, paymentStatus: received ? "PAID" as const : "PENDING" as const, paymentMethod: received ? method : b.paymentMethod, endTime, durationMin };
        })
      })),

      // Expenses
      addExpense: (newExpense) => set((state) => ({ expenses: [...state.expenses, newExpense] })),
      updateExpense: (id, date, name, amount, category, paymentType, notes, community) => set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, date, name, amount, category, paymentType, notes, community: community || undefined } : e)
      })),
      deleteExpense: (id) => set((state) => ({ expenses: state.expenses.filter(e => e.id !== id) })),

      addExpenseCategory: (category) => set((state) => ({
        expenseCategories: state.expenseCategories.includes(category.toUpperCase()) ? state.expenseCategories : [...state.expenseCategories, category.toUpperCase()]
      })),
      removeExpenseCategory: (category) => set((state) => ({
        expenseCategories: state.expenseCategories.filter(c => c !== category)
      })),

      // Staff
      addStaff: (newStaff) => set((state) => ({ staff: [...state.staff, newStaff] })),
      updateStaff: (id: string, data: { name?: string; phone?: string; communities?: string[]; pin?: string; status?: "ACTIVE" | "DISABLED" }) => set((state) => ({
        staff: state.staff.map(s => s.id === id ? { ...s, ...data } : s)
      })),
      deleteStaff: (id) => set((state) => ({ staff: state.staff.filter(s => s.id !== id) })),
    }),
    {
      name: "estate-car-wash-v15",
      version: 24,
      migrate: (persistedState) => {
        const state = persistedState && typeof persistedState === "object"
          ? persistedState as Partial<AppStore>
          : {};
        const legacyRanges = new Set([
          "08:00|10:00",
          "10:00|12:00",
          "12:00|14:00",
          "14:00|16:00",
          "16:00|18:00",
        ]);
        const legacyLabels = new Set([
          "08:00–10:00 AM",
          "10:00–12:00 PM",
          "12:00–02:00 PM",
          "02:00–04:00 PM",
          "04:00–06:00 PM",
          "08:00 - 10:00 AM",
          "10:00 - 12:00 PM",
          "12:00 - 02:00 PM",
          "02:00 - 04:00 PM",
          "04:00 - 06:00 PM",
        ]);
        const hasLegacyTimeSlots = Array.isArray(state.timeSlots) && state.timeSlots.length === 5 && state.timeSlots.every((slot) => {
          const timeSlot = slot as Partial<TimeSlot>;
          return legacyRanges.has(`${timeSlot.startTime}|${timeSlot.endTime}`) || legacyLabels.has(timeSlot.label || "");
        });
        // v17: keep real user-created data only — drop old demo-seeded records (bookings b1001-b1014, addr_*, veh_*, customers cust_1..cust_6, communities comm_1/comm_2, expenses exp_1..exp_5)
        const demoCustomerIds = new Set(["cust_1", "cust_2", "cust_3", "cust_4", "cust_5", "cust_6"]);
        const demoCommunityIds = new Set(["comm_1", "comm_2"]);
        const demoExpenseIds = new Set(["exp_1", "exp_2", "exp_3", "exp_4", "exp_5"]);
        const customers = (Array.isArray(state.customers) ? state.customers : []).filter((c) => !demoCustomerIds.has(String(c.id)));
        const communities = (Array.isArray(state.communities) ? state.communities : []).filter((c) => !demoCommunityIds.has(String(c.id)));
        // v18: staff now require a 6-digit PIN, but persisted browsers may hold old 4-digit pins that can no longer log in.
        // Keep the member (name/phone/community) and generate a fresh unique 6-digit PIN for anyone without a valid one.
        // v23: StaffItem.community (single) -> staff.communities (array) so an admin can assign one person to multiple
        // communities. Normalize whichever shape is persisted (old single string -> array of one).
        const rawStaff = Array.isArray(state.staff) ? state.staff : initialStaff;
        const keptPins = new Set(rawStaff.map((s) => String((s as { pin?: unknown }).pin ?? "")).filter((p) => /^\d{6}$/.test(p)));
        const staff = rawStaff.map((s) => {
          const legacy = s as { community?: string; communities?: string[] };
          const base = {
            ...s,
            communities: Array.isArray(legacy.communities)
              ? legacy.communities
              : legacy.community
                ? [legacy.community]
                : [],
          };
          const pin = String((base as { pin?: unknown }).pin ?? "");
          if (/^\d{6}$/.test(pin)) return base;
          let np = String(Math.floor(100000 + Math.random() * 900000));
          while (keptPins.has(np)) np = String(Math.floor(100000 + Math.random() * 900000));
          keptPins.add(np);
          return { ...base, pin: np };
        });
        // v19: seed fixtures reused id "model_punch" for both the Hatchback and SUV Tata Punch,
        // which made <TableRow key={model.id}> collide on the vehicles page. Dedupe every id in
        // the vehicle tree (ids are internal-only; bookings/garage store plain text names).
        const seenVehicleIds = new Set<string>();
        const uniqueVehicleId = (id: string) => {
          if (!seenVehicleIds.has(id)) { seenVehicleIds.add(id); return id; }
          let n = 2;
          let next = id;
          while (seenVehicleIds.has(next)) next = `${id}_${n++}`;
          seenVehicleIds.add(next);
          return next;
        };
        const dedupeVehicles = (vehicles: Array<{ id: string; brands: Array<{ id: string; models: Array<{ id: string }> }> }>) =>
          vehicles.map((c) => ({
            ...c,
            id: uniqueVehicleId(String(c.id)),
            brands: (Array.isArray(c.brands) ? c.brands : []).map((b) => ({
              ...b,
              id: uniqueVehicleId(String(b.id)),
              models: (Array.isArray(b.models) ? b.models : []).map((m) => ({ ...m, id: uniqueVehicleId(String(m.id)) })),
            })),
          }));
        // v21: scope per-customer data. Addresses/garage/drivers belong to the owning customer;
        // bookings carry a customerId derived from the customer record (name match) or, failing that,
        // the active customer session. This stops a newly registered account from seeing another
        // account's saved data.
        // v22: the v21 backfill ONLY worked when a customer session was active at migration time —
        // a logged-out browser got ownerId/customerId = "" and the strict owner filters hid that
        // data after the next login. Reclaim any still-unowned record for the active customer
        // session (non-empty owners are never touched); handleLogin additionally claims for
        // existing accounts via claimCustomerData when no session existed at migrate time.
        const scopedOwnerId = state.mockUser && state.mockUser.role === "CUSTOMER" && state.mockUser.id ? String(state.mockUser.id) : "";
        const claimOwner = (owner: unknown, fallback: string) =>
          typeof owner === "string" && owner.trim() ? owner : fallback;
        const customersByName = new Map((Array.isArray(state.customers) ? state.customers : []).map((c) => [c.name, String(c.id)]));
        const addresses = (Array.isArray(state.addresses) ? state.addresses : []).filter((a) => !String(a.id).startsWith("addr_")).map((a) => ({ ...a, ownerId: claimOwner(a.ownerId, scopedOwnerId) }));
        const customerGarage = (Array.isArray(state.customerGarage) ? state.customerGarage : []).filter((v) => !String(v.id).startsWith("veh_")).map((v) => ({ ...v, ownerId: claimOwner(v.ownerId, scopedOwnerId) }));
        return {
          ...state,
          communities,
          customers,
          // reset a stale demo-customer session once their account is gone
          mockUser: state.mockUser && state.mockUser.role === "CUSTOMER" && demoCustomerIds.has(String(state.mockUser.id)) ? null : state.mockUser,
          staff,
          // v20: saved drivers are user-created only; default to empty when absent
          drivers: (Array.isArray(state.drivers) ? state.drivers : []).map((d) => ({ ...d, ownerId: claimOwner(d.ownerId, scopedOwnerId) })),
          vehicles: dedupeVehicles(Array.isArray(state.vehicles) ? state.vehicles as Array<{ id: string; brands: Array<{ id: string; models: Array<{ id: string }> }> }> : vehicleFixtures),
          expenses: (Array.isArray(state.expenses) ? state.expenses : []).filter((e) => !demoExpenseIds.has(String(e.id))),
          bookings: (Array.isArray(state.bookings) ? state.bookings : []).filter((b) => !/^b10\d{2}$/i.test(String(b.id))).map((b) => {
            const existingId = b.customerId && String(b.customerId).trim() ? String(b.customerId) : "";
            return { ...b, customerId: existingId || (customersByName.get(b.customer) ?? scopedOwnerId) };
          }),
          addresses,
          customerGarage,
          timeSlots: hasLegacyTimeSlots ? initialTimeSlots : (Array.isArray(state.timeSlots) ? state.timeSlots : initialTimeSlots),
        } as AppStore;
      },
    }
  )
);

export const useHydrated = () => {
  const [hydrated] = useState(true);
  return hydrated;
};

export const getTimeSlotsForCommunity = (communityId?: string): TimeSlot[] => {
  if (!communityId) return initialTimeSlots;
  const store = useStore.getState();
  const community = store.communities.find(c => c.id === communityId);
  if (!community?.timeRange?.start || !community?.timeRange?.end) return initialTimeSlots;
  const startMinutes = parseInt(community.timeRange.start.split(":")[0]) * 60 + parseInt(community.timeRange.start.split(":")[1]);
  const endMinutes = parseInt(community.timeRange.end.split(":")[0]) * 60 + parseInt(community.timeRange.end.split(":")[1]);
  const fmt24 = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  const fmt12 = (mins: number) => {
    const h = Math.floor(mins / 60);
    const mod = h >= 12 ? "PM" : "AM";
    const dh = h % 12 || 12;
    return `${String(dh).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")} ${mod}`;
  };
  const slots: TimeSlot[] = [];
  for (let m = startMinutes; m < endMinutes; m += 30) {
    slots.push({
      id: `ts-c-${communityId}-${fmt24(m)}-${fmt24(m + 30)}`,
      label: `${fmt12(m)} - ${fmt12(m + 30)}`,
      startTime: fmt24(m),
      endTime: fmt24(m + 30),
    });
  }
  return slots;
};
