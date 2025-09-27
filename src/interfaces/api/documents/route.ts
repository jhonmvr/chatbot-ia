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

  const documents = await prisma.document.findMany();
  return new Response(JSON.stringify(documents), { headers: { 'Content-Type': 'application/json' } });
}