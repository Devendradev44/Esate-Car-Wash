import { NextResponse } from 'next/server';
import { vehicleFixtures } from '@/lib/vehicleFixtures';

type VehicleQuery = {
  category?: string;
  make?: string;
  search?: string;
};

const getVehicleQuery = (request: Request): VehicleQuery => {
  const searchParams = new URL(request.url).searchParams;
  return {
    category: searchParams.get('category') ?? undefined,
    make: searchParams.get('make') ?? undefined,
    search: searchParams.get('search')?.trim().toLowerCase() || undefined,
  };
};

const filterText = (value: string, search?: string) =>
  !search || value.toLowerCase().includes(search);

export async function GET(request: Request) {
  const query = getVehicleQuery(request);
  const categories = vehicleFixtures
    .filter((category) =>
      !query.category || category.name.toLowerCase() === query.category.toLowerCase()
    )
    .map((category) => ({
      ...category,
      brands: category.brands.filter((brand) =>
        (!query.make || brand.name.toLowerCase() === query.make.toLowerCase()) &&
        brand.models.some((model) => filterText(model.name, query.search))
      ),
    }))
    .filter((category) => category.brands.length > 0);

  if (query.make) {
    const requestedMake = query.make.toLowerCase();
    const models = categories
      .flatMap((category) => category.brands)
      .filter((brand) => brand.name.toLowerCase() === requestedMake)
      .flatMap((brand) => brand.models)
      .filter((model) => filterText(model.name, query.search));

    return NextResponse.json({ models: models.map((model) => model.name) });
  }

  const brands = categories.flatMap((category) => category.brands);
  return NextResponse.json({
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      brands: category.brands.map((brand) => brand.name),
      models: category.brands.flatMap((brand) => brand.models).map((model) => model.name),
    })),
    brands: Array.from(new Set(brands.map((brand) => brand.name))),
    models: brands.flatMap((brand) => brand.models).map((model) => model.name),
  });
}

