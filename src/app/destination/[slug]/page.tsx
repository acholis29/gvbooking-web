import DestinationClient from "./client";

type Params = Promise<{ slug: string }>;

export default async function DestinationPage({ params }: { params: Params }) {
  // Dynamic Route
  const param = await params;
  return <DestinationClient slug={param.slug} />;
}
