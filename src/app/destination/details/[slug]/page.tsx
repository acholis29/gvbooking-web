import { capitalizeWords } from "@/helper/helper";
import DetailDestination from "./client";

// --- Dynamic Metadata ---
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { country?: string; state?: string; title?: string };
}) {
  // WAJIB: tunggu searchParams
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
