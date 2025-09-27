import { NextRequest } from "next/server";
import { prisma } from "../../../infrastructure/db/prismaClient";
import { verifyToken } from "../../../utils/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { phone, name, consent } = await req.json();
  const newUser = await prisma.user.create({
    data: { phone, name, consent },
  });
  return new Response(JSON.stringify(newUser), { status: 201, headers: { 'Content-Type': 'application/json' } });
}