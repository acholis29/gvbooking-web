import DestinationClient from "./client";

type Params = Promise<{ slug: string }>;

// --- Dynamic Metadata ---
export async function generateMetadata({ params }: { params: Params }) {
  const slug = (await params).slug;

  const title = `Govacation - ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;

  return {
    title,
    description: `Halaman untuk negara ${slug}`,
  };
}

export default async function DestinationPage({ params }: { params: Params }) {
  // Dynamic Route
  const param = await params;
  return <DestinationClient slug={param.slug} />;
}
