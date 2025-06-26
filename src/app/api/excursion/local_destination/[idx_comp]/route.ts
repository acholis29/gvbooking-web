import { prisma } from '@/lib/prisma';

// ORM
// export async function GET() {
//   try {
//     const excursions = await prisma.mSExcursion.findMany({
//       where: {
//         StsDel: true, // misal ambil yang belum dihapus
//       },
//     });
//     return Response.json(excursions);
//   } catch (error) {
//     console.error('Error GET /api/excursion:', error);
//     return Response.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// QUERY RAW FROM PROCEDURE

export async function GET(
  request: Request,
  { params }: { params: { idx_comp: string } }
) {
  const { idx_comp } = await params;

  try {
    console.log('ini dari params :'+ idx_comp);
    // const result = await prisma.$queryRawUnsafe(`api_MSExcursion_Lis 'idx_comp');
    // const result = await prisma.$queryRawUnsafe(`api_MSExcursion_List '${idx_comp}' ,'',''`);
    // const result = await prisma.$queryRawUnsafe(`api_MSExcursion_Recom '${idx_comp}'`);
    const result = await prisma.$queryRawUnsafe(`api_MSExcursion_Filter '${idx_comp}' ,'s'`);
    return Response.json(result);
  } catch (error) {
    console.error('Error GET /api/excursion/local_destination/[idx_comp]:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

