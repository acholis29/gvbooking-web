import { Suspense } from "react";
import ListClient from "./ListClient";
import { capitalizeWords } from "@/helper/helper";

export async function generateMetadata({ searchParams }: any) {
  // WAJIB (Next.js 15): searchParams harus di-await
  const query = await searchParams;

  const country = query.country || "unknown";
  const state = query.state || "unknown";

  const title = `Govacation - ${capitalizeWords(country)} (${capitalizeWords(
    state
  )})`;

  return {
    title,
    description: `Halaman untuk ${state}, ${country}`,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading List...</div>}>
      <ListClient />
    </Suspense>
  );
}
