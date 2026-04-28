import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const resolvedParams = await params; 
    const updatedDpia = await prisma.dpia.update({ where: { id: resolvedParams.id }, data: body });
    return NextResponse.json(updatedDpia);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al modificar DPIA" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.dpia.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ message: "DPIA erradicada" });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al ejecutar el borrado" }, { status: 500 });
  }
}