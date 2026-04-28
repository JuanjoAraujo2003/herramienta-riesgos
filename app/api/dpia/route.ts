import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const dpias = await prisma.dpia.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(dpias);
  } catch (error) {
    return NextResponse.json({ error: "Fallo en la comunicación" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDpia = await prisma.dpia.create({ data: body });
    return NextResponse.json(newDpia, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar la evaluación" }, { status: 500 });
  }
}