import { prisma } from '@/lib/prisma';

// QUERY RAW FROM PROCEDURE
export async function GET(
  request: Request
) {
  const { searchParams } = new URL(request.url);

   // Get the additional parameters from the URL query string
  const idx_comp = searchParams.get('idx-comp-alias') || ''; // Default to empty string if not provided
  const state = searchParams.get('state') || ''; // Default to empty string if not provided
  const holiday = searchParams.get('holiday-type') || ''; // Default to empty string if not provided
  const price_min = searchParams.get('price-min') || ''; // Default to empty string if not provided
  const price_max = searchParams.get('price-max') || ''; // Default to empty string if not provided

  try {
    console.log('ini dari paramsxxx :'+ idx_comp);
    const result = await prisma.$queryRawUnsafe(`api_MSExcursion_List '${idx_comp}' ,'${state}','${holiday}', '${price_min}', '${price_max}'`);
    return Response.json(result);
  } catch (error) {
    console.error('Error GET /api/excursion/local_destination/detail:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
