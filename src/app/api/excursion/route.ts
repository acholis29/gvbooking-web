import { prisma } from '@/lib/prisma';

export async function GET() {
  const excursions = await prisma.mSExcursion.findMany();
  return Response.json(excursions);
}
