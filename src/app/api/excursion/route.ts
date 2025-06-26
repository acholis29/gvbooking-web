import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const excursions = await prisma.mSExcursion.findMany({
      where: {
        StsDel: false, // misal ambil yang belum dihapus
      },
    });
    return Response.json(excursions);
  } catch (error) {
    console.error('Error GET /api/excursion:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
