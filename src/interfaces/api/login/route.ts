import { NextRequest } from "next/server";
import { prisma } from "../../../infrastructure/db/prismaClient";
import { generateToken } from "../../../utils/auth";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return new Response('Phone is required', { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  const token = generateToken({ id: user.id, phone: user.phone });
  return new Response(JSON.stringify({ token }), { headers: { 'Content-Type': 'application/json' } });
}