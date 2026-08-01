import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make');

  try {
    let url = `https://api.api-ninjas.com/v1/cars?limit=30`;
    if (make) url += `&make=${make}`;

    const res = await fetch(url, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY! },
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    if (!make) {
      const brands = [...new Set(data.map((c: any) => c.make))];
      return NextResponse.json({ brands });
    } else {
      const models = [...new Set(data.map((c: any) => c.model))];
      return NextResponse.json({ models });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}