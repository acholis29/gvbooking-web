import { capitalizeWords } from "@/helper/helper";
import DetailDestination from "./client";

export async function generateMetadata({ searchParams }: any) {
  // WAJIB (Next.js 15): searchParams harus di-await
  const query = await searchParams;

  const country = query.country || "unknown";
  const state = query.state || "unknown";
  const _title = query.title || "unknown";

  const title = `Govacation - ${capitalizeWords(country)} (${capitalizeWords(
    state
  )}) | ${_title}`;

  return {
    title,
    description: `Halaman untuk ${state}, ${country}`,
  };
}

export default function DetailDestinationPage() {
  return <DetailDestination />;
}
