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

type CustomerVehicle = { id: string; category: string; brand: string; model: string; reg: string; isDefault: boolean };
type CustomerAddress = { id: string; community: string; flat: string };
type CommunityServiceSetting = { serviceName: string; enabled: boolean; discountPct: number };
type Community = { id: string; name: string; address: string; status: "ACTIVE" | "HIDDEN"; slotCapacity: number; timeRange?: { start: string; end: string }; serviceSettings?: CommunityServiceSetting[] };
type TimeSlot = { id: string; label: string; startTime: string; endTime: string };
type ServiceItem = { id: string; name: string; description: string; duration: number; pricing: Record<string, number>; active?: boolean };
type BookingItem = { 
  id: string; bookingCode: string; date: string; time: string; 
  customer: string; flat: string; community: string; vehicle: string; regNumber: string; 
  service: string; amount: number; bookingStatus: "BOOKED" | "COMPLETED" | "CANCELLED"; paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  cancelledBy?: "CUSTOMER" | "ADMIN" | "STAFF";
  paymentMethod?: "CASH" | "UPI" | "ONLINE";
};
type ExpenseItem = { id: string; date: string; name: string; category: string; amount: number; paymentType: string; notes: string; community?: string };
type StaffItem = { id: string; name: string; phone: string; community: string; pin: string; status: "ACTIVE" | "DISABLED"; role: "STAFF" | "ADMIN" };

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
  { id: "staff_1", name: "Vikram Singh", phone: "9911099110", community: "Estate Lakeside", pin: "123456", status: "ACTIVE", role: "STAFF" },
  { id: "staff_2", name: "Manoj Patil", phone: "9922099220", community: "Vista Heights", pin: "567890", status: "ACTIVE", role: "STAFF" },
  { id: "staff_3", name: "Sameer Khan", phone: "9933099330", community: "Estate Lakeside", pin: "901234", status: "DISABLED", role: "STAFF" },
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

  communities: Community[];
  vehicles: VehicleCategory[];
  services: ServiceItem[];
  bookings: BookingItem[];
  expenses: ExpenseItem[];
  staff: StaffItem[];
  addresses: CustomerAddress[];
  customerGarage: CustomerVehicle[];

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
  setServiceStatus: (id: string, active: boolean) => void;
  deleteService: (id: string) => void;

  // Booking Actions
  addBooking: (booking: BookingItem) => void;
  completeBooking: (id: string, method: "CASH" | "UPI" | "ONLINE") => void;

  // Expense Actions
  addExpense: (expense: ExpenseItem) => void;
  updateExpense: (id: string, date: string, name: string, amount: number, category: string, paymentType: string, notes: string, community?: string) => void;
  deleteExpense: (id: string) => void;

  expenseCategories: string[];
  addExpenseCategory: (category: string) => void;
  removeExpenseCategory: (category: string) => void;

  // Staff Actions
  addStaff: (staff: StaffItem) => void;
  updateStaff: (id: string, data: { name?: string; phone?: string; community?: string; pin?: string; status?: "ACTIVE" | "DISABLED" }) => void;
  deleteStaff: (id: string) => void;
};

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      mockUser: null,
      setMockUser: (user) => set({ mockUser: user }),
      logoutMockUser: () => set({ mockUser: null }),

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
          b.id === id ? { ...b, bookingStatus: "CANCELLED" as const, paymentStatus: "REFUNDED" as const, cancelledBy } : b
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
      addBooking: (newBooking) => set((state) => ({ bookings: [newBooking, ...state.bookings] })),
      completeBooking: (id, method) => set((state) => ({
        bookings: state.bookings.map(b => 
          b.id === id ? { ...b, bookingStatus: "COMPLETED" as const, paymentStatus: "PAID" as const, paymentMethod: method } : b
        )
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
      updateStaff: (id: string, data: { name?: string; phone?: string; community?: string; pin?: string; status?: "ACTIVE" | "DISABLED" }) => set((state) => ({
        staff: state.staff.map(s => s.id === id ? { ...s, ...data } : s)
      })),
      deleteStaff: (id) => set((state) => ({ staff: state.staff.filter(s => s.id !== id) })),
    }),
    {
      name: "estate-car-wash-v15",
      version: 19,
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
        const rawStaff = Array.isArray(state.staff) ? state.staff : initialStaff;
        const keptPins = new Set(rawStaff.map((s) => String(s.pin ?? "")).filter((p) => /^\d{6}$/.test(p)));
        const staff = rawStaff.map((s) => {
          const pin = String(s.pin ?? "");
          if (/^\d{6}$/.test(pin)) return s;
          let np = String(Math.floor(100000 + Math.random() * 900000));
          while (keptPins.has(np)) np = String(Math.floor(100000 + Math.random() * 900000));
          keptPins.add(np);
          return { ...s, pin: np };
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
        return {
          ...state,
          communities,
          customers,
          // reset a stale demo-customer session once their account is gone
          mockUser: state.mockUser && state.mockUser.role === "CUSTOMER" && demoCustomerIds.has(String(state.mockUser.id)) ? null : state.mockUser,
          staff,
          vehicles: dedupeVehicles(Array.isArray(state.vehicles) ? state.vehicles as Array<{ id: string; brands: Array<{ id: string; models: Array<{ id: string }> }> }> : vehicleFixtures),
          expenses: (Array.isArray(state.expenses) ? state.expenses : []).filter((e) => !demoExpenseIds.has(String(e.id))),
          bookings: (Array.isArray(state.bookings) ? state.bookings : []).filter((b) => !/^b10\d{2}$/i.test(String(b.id))),
          addresses: (Array.isArray(state.addresses) ? state.addresses : []).filter((a) => !String(a.id).startsWith("addr_")),
          customerGarage: (Array.isArray(state.customerGarage) ? state.customerGarage : []).filter((v) => !String(v.id).startsWith("veh_")),
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
