import { prisma } from '@/lib/prisma';

// QUERY RAW FROM PROCEDURE
export async function GET(
    request: Request
) {
    const { searchParams } = new URL(request.url);

    // Get the additional parameters from the URL query string
    const idx_comp = searchParams.get('idx-comp-alias') || ''; // Default to empty string if not provided
    try {
        const result = await prisma.$queryRawUnsafe(`api_MSExcursion_Filter '${idx_comp}' ,'h'`);
        return Response.json(result);
    } catch (error) {
        console.error('Error GET /api/excursion/activity_country:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
