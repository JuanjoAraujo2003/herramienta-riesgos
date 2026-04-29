import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Listar usuarios (Solo Admin)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Acceso Denegado" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(users);
}

// Crear usuario (Solo Admin)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Verificación de rango: Solo el Admin puede crear otros usuarios
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "No tienes autoridad para esto" }, { status: 403 });
  }

  try {
    const { email, password, name, role } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name, role }
    });

    return NextResponse.json({ message: "Usuario forjado con éxito", user: { email: newUser.email } });
  } catch (error) {
    return NextResponse.json({ error: "El correo ya está registrado o hay un error" }, { status: 500 });
  }
}