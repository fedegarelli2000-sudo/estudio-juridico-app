import { NextResponse } from 'next/server';

let globalStore = {};

export async function GET() {
  return NextResponse.json(globalStore);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, value } = body;
    if (key) {
      globalStore[key] = value;
    }
    return NextResponse.json({ success: true, globalStore });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
