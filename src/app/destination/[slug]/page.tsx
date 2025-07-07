// import Image from "next/image";
import DestinationClient from "./client";
// type PageProps = {
//   params: {
//     slug: string;
//   };
// };

// After
type Params = Promise<{ slug: string }>;

export default async function DestinationPage({ params }: { params: Params }) {
  // Dynamic Route
  const param = await params;
  return <DestinationClient slug={param.slug} />;
}
