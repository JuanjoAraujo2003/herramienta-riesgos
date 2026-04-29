import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const resolvedParams = await params; 
    
    const inherentRiskScore = body.impactValue * body.probabilityValue;
    const inherentRiskLevel = inherentRiskScore >= 15 ? "Alto" : inherentRiskScore >= 8 ? "Medio" : "Bajo";

    const updatedRisk = await prisma.risk.update({
      where: { id: resolvedParams.id },
      data: { ...body, inherentRiskScore, inherentRiskLevel }
    });

    // LA ORDEN SECRETA DE AUDITORÍA
    await prisma.auditLog.create({
      data: {
        userEmail: "admin@empresa.com", // Aquí entrará el correo de NextAuth en el futuro
        action: "EDITAR",
        entity: "MATRIZ DE RIESGOS",
        entityId: updatedRisk.id,
        details: `Se modificó el riesgo: ${updatedRisk.riskEvent}`
      }
    });

    return NextResponse.json(updatedRisk);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al modificar el riesgo" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    // Obtenemos el nombre del riesgo antes de destruirlo para anotarlo
    const riskToDestroy = await prisma.risk.findUnique({ where: { id: resolvedParams.id }});

    await prisma.risk.delete({
      where: { id: resolvedParams.id }
    });

    // LA ORDEN SECRETA DE AUDITORÍA
    if (riskToDestroy) {
      await prisma.auditLog.create({
        data: {
          userEmail: "admin@empresa.com",
          action: "ELIMINAR",
          entity: "MATRIZ DE RIESGOS",
          entityId: resolvedParams.id,
          details: `Riesgo erradicado: ${riskToDestroy.riskEvent}`
        }
      });
    }

    return NextResponse.json({ message: "Riesgo erradicado del sistema" });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al ejecutar la orden de borrado" }, { status: 500 });
  }
}