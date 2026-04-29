export const dynamic = 'force-dynamic'; // ESTA ES LA NUEVA LEY


import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const resolvedParams = await params; 

    const updatedFlow = await prisma.dataFlow.update({
      where: { id: resolvedParams.id },
      data: body
    });
    return NextResponse.json(updatedFlow);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al modificar el flujo" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.dataFlow.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ message: "Flujo erradicado" });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al ejecutar el borrado" }, { status: 500 });
  }
}