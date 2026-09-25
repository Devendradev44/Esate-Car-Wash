// Vehicle fixture data - normalized to 4 categories, no two-wheelers, stable IDs
export type VehicleModel = { id: string; name: string };
export type VehicleBrand = { id: string; name: string; models: VehicleModel[] };
export type VehicleCategory = { id: string; name: string; brands: VehicleBrand[] };

export const vehicleFixtures: VehicleCategory[] = [
  {
    id: "cat_hatchback",
    name: "Hatchback",
    brands: [
      {
        id: "brand_maruti",
        name: "Maruti Suzuki",
        models: [
          { id: "model_swift", name: "Swift" },
          { id: "model_baleno", name: "Baleno" },
          { id: "model_wagonr", name: "Wagon R" },
          { id: "model_altrok10", name: "Alto K10" },
          { id: "model_celerio", name: "Celerio" },
          { id: "model_ignis", name: "Ignis" },
          { id: "model_spresso", name: "S-Presso" },
        ],
      },
      {
        id: "brand_hyundai_hatch",
        name: "Hyundai",
        models: [
          { id: "model_i10nios", name: "Grand i10 Nios" },
          { id: "model_i20", name: "i20" },
          { id: "model_exter", name: "Exter" },
        ],
      },
      {
        id: "brand_tata_hatch",
        name: "Tata",
        models: [
          { id: "model_tiago", name: "Tiago" },
          { id: "model_altroz", name: "Altroz" },
          { id: "model_punch", name: "Punch" },
        ],
      },
      {
        id: "brand_toyota_hatch",
        name: "Toyota",
        models: [
          { id: "model_glanza", name: "Glanza" },
        ],
      },
      {
        id: "brand_honda_hatch",
        name: "Honda",
        models: [
          { id: "model_jazz", name: "Jazz" },
        ],
      },
      {
        id: "brand_renault_hatch",
        name: "Renault",
        models: [
          { id: "model_kwid", name: "Kwid" },
          { id: "model_triber", name: "Triber" },
        ],
      },
      {
        id: "brand_mg_hatch",
        name: "MG",
        models: [
          { id: "model_comet", name: "Comet EV" },
        ],
      },
    ],
  },
  {
    id: "cat_sedan",
    name: "Sedan",
    brands: [
      {
        id: "brand_honda_sedan",
        name: "Honda",
        models: [
          { id: "model_city", name: "City" },
          { id: "model_amaze", name: "Amaze" },
        ],
      },
      {
        id: "brand_hyundai_sedan",
        name: "Hyundai",
        models: [
          { id: "model_verna", name: "Verna" },
          { id: "model_aura", name: "Aura" },
        ],
      },
      {
        id: "brand_maruti_sedan",
        name: "Maruti Suzuki",
        models: [
          { id: "model_ciaz", name: "Ciaz" },
          { id: "model_dzire", name: "Dzire" },
        ],
      },
      {
        id: "brand_skoda_sedan",
        name: "Skoda",
        models: [
          { id: "model_slavia", name: "Slavia" },
          { id: "model_octavia", name: "Octavia" },
        ],
      },
      {
        id: "brand_vw_sedan",
        name: "Volkswagen",
        models: [
          { id: "model_virtus", name: "Virtus" },
        ],
      },
      {
        id: "brand_tata_sedan",
        name: "Tata",
        models: [
          { id: "model_tigor", name: "Tigor" },
        ],
      },
      {
        id: "brand_toyota_sedan",
        name: "Toyota",
        models: [
          { id: "model_yaris", name: "Yaris" },
          { id: "model_camry", name: "Camry" },
        ],
      },
      {
        id: "brand_bmw_sedan",
        name: "BMW",
        models: [
          { id: "model_2seriesgc", name: "2 Series Gran Coupe" },
          { id: "model_3series", name: "3 Series" },
          { id: "model_5series", name: "5 Series" },
        ],
      },
      {
        id: "brand_mercedes_sedan",
        name: "Mercedes-Benz",
        models: [
          { id: "model_aclass", name: "A-Class" },
          { id: "model_cclass", name: "C-Class" },
          { id: "model_eclass", name: "E-Class" },
        ],
      },
      {
        id: "brand_audi_sedan",
        name: "Audi",
        models: [
          { id: "model_a4", name: "A4" },
          { id: "model_a6", name: "A6" },
        ],
      },
    ],
  },
  {
    id: "cat_suv",
    name: "SUV",
    brands: [
      {
        id: "brand_hyundai_suv",
        name: "Hyundai",
        models: [
          { id: "model_creta", name: "Creta" },
          { id: "model_venue", name: "Venue" },
          { id: "model_alcazar", name: "Alcazar" },
          { id: "model_tucson", name: "Tucson" },
          { id: "model_ionaq5", name: "IONIQ 5" },
        ],
      },
      {
        id: "brand_tata_suv",
        name: "Tata",
        models: [
          { id: "model_nexon", name: "Nexon" },
          { id: "model_harrier", name: "Harrier" },
{ id: "model_safari", name: "Safari" },
          { id: "model_punch_suv", name: "Punch" },
          { id: "model_curvv", name: "Curvv" },
        ],
      },
      {
        id: "brand_mahindra_suv",
        name: "Mahindra",
        models: [
          { id: "model_scorpio", name: "Scorpio N" },
          { id: "model_xuv700", name: "XUV700" },
          { id: "model_thar", name: "Thar" },
          { id: "model_xuv3xo", name: "XUV 3XO" },
          { id: "model_bolero", name: "Bolero Neo" },
        ],
      },
      {
        id: "brand_toyota_suv",
        name: "Toyota",
        models: [
          { id: "model_fortuner", name: "Fortuner" },
          { id: "model_hyryder", name: "Urban Cruiser Hyryder" },
          { id: "model_innova", name: "Innova Hycross" },
          { id: "model_rumion", name: "Rumion" },
        ],
      },
      {
        id: "brand_kia_suv",
        name: "Kia",
        models: [
          { id: "model_seltos", name: "Seltos" },
          { id: "model_sonet", name: "Sonet" },
          { id: "model_carens", name: "Carens" },
          { id: "model_carnival", name: "Carnival" },
          { id: "model_ev6", name: "EV6" },
        ],
      },
      {
        id: "brand_mg_suv",
        name: "MG",
        models: [
          { id: "model_hector", name: "Hector" },
          { id: "model_astor", name: "Astor" },
          { id: "model_gloster", name: "Gloster" },
          { id: "model_zs", name: "ZS EV" },
          { id: "model_windsor", name: "Windsor EV" },
        ],
      },
      {
        id: "brand_maruti_suv",
        name: "Maruti Suzuki",
        models: [
          { id: "model_brezza", name: "Brezza" },
          { id: "model_grandvitara", name: "Grand Vitara" },
          { id: "model_fronx", name: "Fronx" },
          { id: "model_jimny", name: "Jimny" },
        ],
      },
      {
        id: "brand_honda_suv",
        name: "Honda",
        models: [
          { id: "model_elevate", name: "Elevate" },
          { id: "model_crv", name: "CR-V" },
        ],
      },
      {
        id: "brand_skoda_suv",
        name: "Skoda",
        models: [
          { id: "model_kushaq", name: "Kushaq" },
          { id: "model_kodiaq", name: "Kodiaq" },
        ],
      },
      {
        id: "brand_vw_suv",
        name: "Volkswagen",
        models: [
          { id: "model_taigun", name: "Taigun" },
          { id: "model_tiguan", name: "Tiguan" },
        ],
      },
      {
        id: "brand_jeep_suv",
        name: "Jeep",
        models: [
          { id: "model_compass", name: "Compass" },
          { id: "model_meridian", name: "Meridian" },
          { id: "model_wrangler", name: "Wrangler" },
        ],
      },
      {
        id: "brand_nissan_suv",
        name: "Nissan",
        models: [
          { id: "model_magnite", name: "Magnite" },
          { id: "model_kicks", name: "Kicks" },
        ],
      },
      {
        id: "brand_renault_suv",
        name: "Renault",
        models: [
          { id: "model_kyger", name: "Kiger" },
          { id: "model_duster", name: "Duster" },
        ],
      },
      {
        id: "brand_citroen_suv",
        name: "Citroën",
        models: [
          { id: "model_c3aircross", name: "C3 Aircross" },
          { id: "model_c5aircross", name: "C5 Aircross" },
        ],
      },
      {
        id: "brand_force_suv",
        name: "Force Motors",
        models: [
          { id: "model_gurkha", name: "Gurkha" },
        ],
      },
      {
        id: "brand_isuzu_suv",
        name: "Isuzu",
        models: [
          { id: "model_mux", name: "MU-X" },
        ],
      },
    ],
  },
  {
    id: "cat_luxury",
    name: "Luxury",
    brands: [
      {
        id: "brand_bmw_luxury",
        name: "BMW",
        models: [
          { id: "model_x1", name: "X1" },
          { id: "model_x3", name: "X3" },
          { id: "model_x5", name: "X5" },
          { id: "model_x7", name: "X7" },
          { id: "model_3series_lux", name: "3 Series" },
          { id: "model_5series_lux", name: "5 Series" },
          { id: "model_7series", name: "7 Series" },
        ],
      },
      {
        id: "brand_mercedes_luxury",
        name: "Mercedes-Benz",
        models: [
          { id: "model_gla", name: "GLA" },
          { id: "model_glb", name: "GLB" },
          { id: "model_glc", name: "GLC" },
          { id: "model_gle", name: "GLE" },
          { id: "model_gls", name: "GLS" },
          { id: "model_cclass_lux", name: "C-Class" },
          { id: "model_eclass_lux", name: "E-Class" },
          { id: "model_sclass", name: "S-Class" },
        ],
      },
      {
        id: "brand_audi_luxury",
        name: "Audi",
        models: [
          { id: "model_q3", name: "Q3" },
          { id: "model_q5", name: "Q5" },
          { id: "model_q7", name: "Q7" },
          { id: "model_q8", name: "Q8" },
          { id: "model_a4_lux", name: "A4" },
          { id: "model_a6_lux", name: "A6" },
          { id: "model_a8", name: "A8" },
        ],
      },
      {
        id: "brand_volvo_luxury",
        name: "Volvo",
        models: [
          { id: "model_xc40", name: "XC40" },
          { id: "model_xc60", name: "XC60" },
          { id: "model_xc90", name: "XC90" },
          { id: "model_s60", name: "S60" },
          { id: "model_s90", name: "S90" },
        ],
      },
      {
        id: "brand_jaguar_luxury",
        name: "Jaguar",
        models: [
          { id: "model_fpace", name: "F-Pace" },
          { id: "model_epace", name: "E-Pace" },
          { id: "model_xf", name: "XF" },
        ],
      },
      {
        id: "brand_landrover_luxury",
        name: "Land Rover",
        models: [
          { id: "model_evoque", name: "Range Rover Evoque" },
          { id: "model_velar", name: "Range Rover Velar" },
          { id: "model_sport", name: "Range Rover Sport" },
          { id: "model_defender", name: "Defender" },
        ],
      },
      {
        id: "brand_porsche_luxury",
        name: "Porsche",
        models: [
          { id: "model_macan", name: "Macan" },
          { id: "model_cayenne", name: "Cayenne" },
          { id: "model_panamera", name: "Panamera" },
        ],
      },
      {
        id: "brand_lexus_luxury",
        name: "Lexus",
        models: [
          { id: "model_nx", name: "NX" },
          { id: "model_rx", name: "RX" },
          { id: "model_lx", name: "LX" },
          { id: "model_es", name: "ES" },
        ],
      },
    ],
  },
];

// Helper to get all models for a category (for pricing lookups)
export const getCategoryNames = (): string[] =>
  vehicleFixtures.map((c) => c.name);

// Helper to find category by name
export const findCategoryByName = (name: string): VehicleCategory | undefined =>
  vehicleFixtures.find((c) => c.name.toLowerCase() === name.toLowerCase());

// Helper to find brand in category
export const findBrandInCategory = (categoryId: string, brandName: string): VehicleBrand | undefined => {
  const cat = vehicleFixtures.find((c) => c.id === categoryId);
  return cat?.brands.find((b) => b.name.toLowerCase() === brandName.toLowerCase());
};

// Helper to find model in category+brand
export const findModelInCategoryBrand = (
  categoryId: string,
  brandId: string,
  modelName: string
): VehicleModel | undefined => {
  const cat = vehicleFixtures.find((c) => c.id === categoryId);
  const brand = cat?.brands.find((b) => b.id === brandId);
  return brand?.models.find((m) => m.name.toLowerCase() === modelName.toLowerCase());
};
