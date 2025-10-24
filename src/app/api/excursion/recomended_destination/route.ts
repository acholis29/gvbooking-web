import { prisma } from '@/lib/prisma';

// QUERY RAW FROM PROCEDURE
export async function GET(
  request: Request,
  // { params }: { params: Promise<{ idx_comp: string }> }
) {
  const { searchParams } = new URL(request.url);

  // Get the additional parameters from the URL query string
  const idx_comp = searchParams.get('idxcomp') || ''; // Default to empty string if not provided

  try {
    // const result = await prisma.$queryRawUnsafe(`api_MSExcursion_Recom '${idx_comp}'`);
    // Gunakan parameter binding agar aman dari SQL injection
    const result = await prisma.$queryRaw`
      exec api_MSExcursion_Recom ${idx_comp}
    `;
    return Response.json(result);
  } catch (error) {
    console.error('Error GET /api/excursion/recomended_destinaton/[idx_comp]:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}