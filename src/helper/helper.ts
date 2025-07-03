export function capitalizeWords(sentence: string): string {
  return sentence
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Mengubah hanya huruf pertama dari kalimat jadi kapital
export function capitalizeFirst(sentence: string): string {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

// Mengubah kalimat menjadi slug (contoh: "Indonesia Timur" → "indonesia-timur")
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
    .replace(/[^\w\-]+/g, "") // Hapus karakter non-alphanumeric
    .replace(/\-\-+/g, "-"); // Ganti multiple `-` dengan satu
}

// Potong Kalimat
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");

  return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed).trim() + "...";
}

// Buat Tipe Data Object Add To Cart
type CartItem = {
  idx_comp: string,
  idx_excursion: string,
  title: string,
  sub_title: string,
  price: string,
  currency: string,
};

export function handleAddToCart(data: CartItem) {
  if (typeof window === "undefined") return; // pastikan di browser

  // Ambil cart lama
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // Gabungkan data baru ke cart lama
  const updatedCart = [data, ...cart];

  // Simpan ke localStorage
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  console.log("Cart updated:", updatedCart);
};

export function handleDeleteCart(idx_excursion: string) {
  if (typeof window === "undefined") return; // pastikan di browser
  // Ambil cart lama
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // Filter cart yang tidak sama dengan idx_excursion yang diklik
  const updatedCart = cart.filter(
    (item: { idx_excursion?: string }) => item.idx_excursion !== idx_excursion
  );

  // Simpan cart baru ke localStorage
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  console.log("Item removed. Updated cart:", updatedCart);

}


