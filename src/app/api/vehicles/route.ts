import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make');

  try {
    let url = 'https://api.api-ninjas.com/v1/carmakes';
    if (make) {
      url = `https://api.api-ninjas.com/v1/carmodels?make=${make}`;
    }

    const res = await fetch(url, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY || '' },
    });

    if (!res.ok) {
      // Fail gracefully so frontend doesn't crash
      return NextResponse.json(make ? { models: [] } : { brands: [] });
    }

    const data = await res.json();

    if (!make) {
      const brands = data.map((b: any) => b.name);
      return NextResponse.json({ brands });
    } else {
      const models = data.map((m: any) => m.model);
      return NextResponse.json({ models });
    }
  } catch (error) {
    return NextResponse.json(make ? { models: [] } : { brands: [] });
  }
}