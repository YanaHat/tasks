import { NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!res.ok) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }

  const data = await res.json();

  return NextResponse.json(data);
}
