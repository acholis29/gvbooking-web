import { prisma } from '@/lib/prisma';

// QUERY RAW FROM PROCEDURE
export async function GET(
  request: Request,
  { params }: { params: Promise<{ idx_comp: string }> }
) {
  const idx_comp = (await params).idx_comp;

  try {
    // const result = await prisma.$queryRawUnsafe(`api_MSExcursion_Filter '${idx_comp}' ,'s'`);
    // Gunakan parameter binding agar aman dari SQL injection
    const result = await prisma.$queryRaw`
      exec api_MSExcursion_Filter ${idx_comp}, 's'
    `;
    return Response.json(result);
  } catch (error) {
    console.error('Error GET /api/excursion/local_destination/[idx_comp]:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

