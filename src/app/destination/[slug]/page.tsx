// import Image from "next/image";
import DestinationClient from "./client";
type PageProps = {
  params: {
    slug: string;
  };
};

export default async function DestinationPage({ params }: PageProps) {
  // Dynamic Route
  const param = await params;
  return <DestinationClient slug={param.slug} />;
}
