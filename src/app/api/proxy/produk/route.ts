// src/app/api/proxy/produk/route.ts
import { API_HOSTS } from "@/lib/apihost";  


export async function POST(request: Request) {
    try {
        // 1. Ambil body dari request
        const body = await request.json();

        // 2. Ubah ke format URL-encoded
        const formBody = new URLSearchParams();
        for (const key in body) {
            formBody.append(key, body[key]);
        }

        // 3. Lakukan request ke API tujuan
        const response = await fetch(
            `${API_HOSTS.host1}/excursion.asmx/v2_product_description`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody.toString(),
            }
        );

        // 4. Cek status
        if (!response.ok) {
            return new Response("Failed to fetch from upstream", { status: 502 });
        }

        // 5. Responsenya JSON atau text?
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            const result = await response.json();
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } else {
            const text = await response.text(); // ← antisipasi jika XML
            return new Response(text, {
                status: 200,
                headers: {
                    "Content-Type": contentType || "text/plain",
                },
            });
        }
    } catch (error) {
        console.error("Proxy error:", error);
        return new Response("Proxy error", { status: 500 });
    }
}
