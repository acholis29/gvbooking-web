import { prisma } from '@/lib/prisma';

// QUERY RAW FROM PROCEDURE
export async function GET(
  request: Request,
  { params }: { params: { idx_comp: string } }
) {
  const { idx_comp } = await params;

  try {
    console.log('ini dari params :'+ idx_comp);
    const result = await prisma.$queryRawUnsafe(`api_MSExcursion_Recom '${idx_comp}'`);
    return Response.json(result);
  } catch (error) {
    console.error('Error GET /api/excursion/recomended_destinaton/[idx_comp]:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

