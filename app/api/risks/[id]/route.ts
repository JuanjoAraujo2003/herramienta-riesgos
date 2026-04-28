import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ORDEN DE MODIFICACIÓN (EDITAR)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    
    // Nueva ley absoluta: Desempaquetar la promesa del ID antes de actuar
    const resolvedParams = await params; 
    
    // Recalculamos los puntajes por si cambiaste los valores
    const inherentRiskScore = body.impactValue * body.probabilityValue;
    let inherentRiskLevel = "Bajo";
    if (inherentRiskScore >= 15) inherentRiskLevel = "Alto";
    else if (inherentRiskScore >= 8) inherentRiskLevel = "Medio";

    const updatedRisk = await prisma.risk.update({
      where: { id: resolvedParams.id },
      data: { ...body, inherentRiskScore, inherentRiskLevel }
    });

    return NextResponse.json(updatedRisk);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al modificar el riesgo" }, { status: 500 });
  }
}

// ORDEN DE ERRADICACIÓN (ELIMINAR)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Nueva ley absoluta: Desempaquetar la promesa del ID antes de borrar
    const resolvedParams = await params;

    await prisma.risk.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ message: "Riesgo erradicado del sistema" });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al ejecutar la orden de borrado" }, { status: 500 });
  }
}