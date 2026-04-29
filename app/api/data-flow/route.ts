export const dynamic = 'force-dynamic'; // ESTA ES LA NUEVA LEY


import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const flows = await prisma.dataFlow.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(flows);
  } catch (error) {
    return NextResponse.json({ error: "Fallo en la comunicación" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFlow = await prisma.dataFlow.create({ data: body });
    return NextResponse.json(newFlow, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar el flujo" }, { status: 500 });
  }
}