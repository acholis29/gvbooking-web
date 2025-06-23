// pages/404.tsx
export default function Custom404() {
  return (
    <div className="flex items-center justify-center  flex-col mb-5">
      <div className="flex flex-col items-center justify-center  px-4">
        {/* SVG Ilustrasi */}
        <img src="/images/error/404.svg" className="w-150" alt="" />

        {/* Text */}
        <h1 className="text-3xl text-center font-bold text-gray-800 mb-2 mt-2">
          404 - Halaman Tidak Ditemukan
        </h1>

        {/* Tombol kembali */}
        <a
          href="/"
          className="mt-4 inline-block bg-red-800 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
