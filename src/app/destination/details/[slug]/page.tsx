import { capitalizeWords } from "@/helper/helper";
import DetailDestination from "./client";

// --- Dynamic Metadata ---
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { country?: string; state?: string; title?: string };
}) {
  const country = searchParams.country || "unknown";
  const state = searchParams.state || "unknown";
  const _title = searchParams.title || "unknown";

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
