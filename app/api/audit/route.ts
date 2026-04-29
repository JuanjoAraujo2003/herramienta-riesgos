export const dynamic = 'force-dynamic'; // ESTA ES LA NUEVA LEY


import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// El Ojo lee los últimos 100 movimientos en el sistema
export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Fallo en la extracción de registros" }, { status: 500 });
  }
}