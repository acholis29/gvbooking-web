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

// Format Uang Indonesia
export function formatToIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format Untuk Rubah Adult Child dan Infant Jadi A|1|0,C|1|11,C|1|11
export function acis_qty_age(adult: string, child: string, infant: string): string {
  let _adult = `A|${adult}|0,`;
  let _child = "";
  let _infant = "";

  // child
  if (child !== "" && child !== "{}" && child != "0") {
    let child_data = JSON.parse(child);
    child_data.ages.forEach((age: any, index: number) => {
      _child += `C|1|${age},`;
    });
  }

  // infant
  if (infant != "" && infant != "0") {
    _infant = `I|${infant}|0`;
  }

  // Gabungkan semua dan hapus koma terakhir jika ada
  let result = `${_adult}${_child}${_infant}`.replace(/,$/, "");
  return result;
}

// Format Day Sunday, 30 July 2025
export function format_date(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Format ribuan
export function formatRibuan(num: number) {
  if (typeof num !== "number") return num;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Format ribuan international
export function formatRibuanInternational(num: number): string {
  if (typeof num !== "number") return String(num);
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Get url image di recomendation
export const getCountryImageUrl = (
  coreInitial: any[],
  idx_comp: string,
  path: string
): string | null => {
  const found = coreInitial.find((item) => item.idx_comp === idx_comp);
  if (!found || !path) return null;
  return `${found.url_img}/${path}`;
};

// Get Host Image Saja
export const getHostImageUrl = (
  coreInitial: any[],
  idx_comp: string,
): string | null => {
  const found = coreInitial.find((item) => item.idx_comp === idx_comp);
  if (!found) return null;

  return `${found.url_img}`;
};

export function generateTempEmail(): string {
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${randomStr}@temp.com`;
}

export function splitUsername(fullname: string) {
  const arr: string[] = fullname.split(" ");
  return arr
}







