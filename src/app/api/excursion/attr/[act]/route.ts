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
  let ssql = ''; // Default to empty string if not provided

  try {

    switch (act) {
      case 'recomended':
        ssql = `api_MSExcursion_Recom '${idx_comp}'`;
        break;
      case 'search':
        ssql = `api_MSExcursion_List_search '${keyword}'`;
        break;
      default:
        console.log("Invalid day of the week.");
    }


    const result = await prisma.$queryRawUnsafe(ssql);
    return Response.json(result);
  } catch (error) {
    console.error('Error GET /api/excursion/recomended_destinaton/[idx_comp]:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}