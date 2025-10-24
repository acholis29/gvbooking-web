import { prisma } from '@/lib/prisma';

// QUERY RAW FROM PROCEDURE
export async function GET(
  request: Request,
  { params }: { params: Promise<{ act: string }> }
) {
  const { searchParams } = new URL(request.url);
  const act = (await params).act || ''; // Default to empty string if not provided
  const idx_comp = searchParams.get('idxcomp') || ''; // Default to empty string if not provided
  const keyword = searchParams.get('keyword') || '';
  const excursion_join = searchParams.get('exc_j') || '';
  let ssql = ''; // Default to empty string if not provided

  try {
    let result; // ✅ deklarasi sekali saja
    switch (act) {
      case 'recomended':
        // ssql = `api_MSExcursion_Recom '${idx_comp}'`;
        // Gunakan parameter binding agar aman dari SQL injection
        result = await prisma.$queryRaw`exec api_MSExcursion_Recom ${idx_comp}`;
        break;
      case 'search':
        // ssql = `api_MSExcursion_List_search '${keyword}'`;
        result = await prisma.$queryRaw`exec api_MSExcursion_List_search ${keyword}`;
        break;
      case 'search-excursion':
        // ssql = `select * from dbo.MSExcursion where Idx_excursion = '${keyword}'`;
        result = await prisma.$queryRaw`
          select * from dbo.MSExcursion where Idx_excursion = ${keyword}
        `;
        break;
      case 'last-search':
        // ssql = `api_MSExcursion_LastOpen '${excursion_join}'`;
        result = await prisma.$queryRaw`exec api_MSExcursion_LastOpen ${excursion_join}`;
        break;
      default:
        console.log("Invalid day of the week.");
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }


    // const result = await prisma.$queryRawUnsafe(ssql);
    return Response.json(result);
  } catch (error) {
    console.error('Error GET /api/excursion/recomended_destinaton/[idx_comp]:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}