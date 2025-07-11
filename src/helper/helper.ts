// Mengubah Huruf Pertama Tiap Kata Jadi Capital
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

// Mengubah semua huruf menjadi huruf kecil (lowercase)
export function toLowerCaseAll(text: string): string {
  return text.toLowerCase();
}



