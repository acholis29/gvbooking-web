import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

// QUERY RAW FROM PROCEDURE
export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe(`api_MSExcursion_Filter '' ,'c'`);
    return Response.json(result);
  } catch (error: any) {
    logger.error('Error GET /api/excursion/activity_country', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
