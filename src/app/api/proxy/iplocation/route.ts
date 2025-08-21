export async function GET() {
    try {
        const response = await fetch("https://system.govacation.biz/ashx/general/ipexternal.ashx");
        const data = await response.json();
        return Response.json(data);
    } catch (error: any) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}