import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// LEER LAS TAREAS DE UN RIESGO ESPECÍFICO
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const riskId = searchParams.get('riskId');
    
    if (!riskId) return NextResponse.json([]);
    
    const plans = await prisma.actionPlan.findMany({ 
      where: { riskId },
      orderBy: { createdAt: 'asc' }
    });
    
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al leer los planes" }, { status: 500 });
  }
}

// CREAR UNA NUEVA TAREA
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPlan = await prisma.actionPlan.create({ data: body });
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al asignar el plan de acción" }, { status: 500 });
  }
}