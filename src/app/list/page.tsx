import { Suspense } from "react";
import ListClient from "./ListClient";
import { capitalizeWords } from "@/helper/helper";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { country?: string; state?: string };
}) {
  const country = searchParams.country || "unknown";
  const state = searchParams.state || "unknown";

  const title = `Govacation - List ${capitalizeWords(
    country
  )} (${capitalizeWords(state)})`;

  return {
    title,
    description: `Halaman untuk list ${state}, ${country}`,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading List...</div>}>
      <ListClient />
    </Suspense>
  );
}
