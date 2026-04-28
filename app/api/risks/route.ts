import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los riesgos
export async function GET() {
  try {
    const risks = await prisma.risk.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(risks);
  } catch (error) {
    return NextResponse.json({ error: "El sistema ha fallado en recuperar los datos" }, { status: 500 });
  }
}

// Crear un nuevo riesgo (Reemplazando la carga manual de Excel)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Aquí el sistema calcula automáticamente lo que antes hacías manual
    const inherentRiskScore = body.impactValue * body.probabilityValue;
    const inherentRiskLevel = inherentRiskScore > 15 ? "Alto" : inherentRiskScore > 8 ? "Medio" : "Bajo";

    const newRisk = await prisma.risk.create({
      data: {
        ...body,
        inherentRiskScore,
        inherentRiskLevel
      }
    });

    return NextResponse.json(newRisk, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar el riesgo" }, { status: 500 });
  }
}