import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rats = await prisma.rat.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(rats);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al recuperar el RAT" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRat = await prisma.rat.create({ data: body });
    return NextResponse.json(newRat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar la actividad" }, { status: 500 });
  }
}