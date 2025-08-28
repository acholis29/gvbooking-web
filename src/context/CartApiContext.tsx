"use client";
import { createContext, useContext, useEffect, useState } from "react";

type DetailPax = {
  charge_type: string;
  quantity: string;
  age: string;
  currency: string;
  price_per_item: string;
  price_total: string;
};

type DetailSurcharge = {
  surcharge: string;
  currency: string;
  price_total: string;
};

type CartApiItem = {
  master_file_id: string;
  transaction_id: string;
  market_id: string;
  client_id: string;
  company_id: string;
  supplier_id: string;
  voucher_number: string;
  excursion_id: string;
  excursion_sub_id: string;
  excursion_name: string;
  pickup_date: string;
  pickup_time: string;
  location_id: string;
  location_name: string;
  location_detail: string;
  pax_adult: number;
  pax_child: number;
  pax_infant: number;
  pax_total: number;
  currency_id: string;
  currency: string;
  price: string;
  price_in_format: string;
  priceori: string;
  priceori_in_format: string;
  disc: string;
  disc_in_format: string;
  promo_value: string;
  currency_local_id: string;
  currency_local: string;
  price_local: string;
  price_local_in_format: string;
  remark_to_internal: string;
  remark_to_supplier: string;
  picture: string;
  picture_small: string;
  create_by: string;
  create_date: string;
  modified_by: string;
  modified_date: string;
  detail_pax: DetailPax[];
  detail_surcharge: DetailSurcharge[];
};

type CartApiContextType = {
  cartApiItems: CartApiItem[];
  cartApiCount: number;
  idxCompCart: string;
  setIdxCompCart: (value: string) => void;
  addToCartApi: (item: CartApiItem) => void;
  saveCartApi: (items: CartApiItem[]) => void; // tambahkan ini
};

const CartApiContext = createContext<CartApiContextType | undefined>(undefined);

export function CartApiProvider({ children }: { children: React.ReactNode }) {
  const [cartApiItems, setCartApiItems] = useState<CartApiItem[]>([]);
  const [idxCompCart, setIdxCompCart] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart_api") || "[]");
    setCartApiItems(storedCart);
  }, []);

  const saveCartApi = (items: CartApiItem[]) => {
    localStorage.setItem("cart_api", JSON.stringify(items));
    setCartApiItems(items);
    if (items.length > 0) {
      setIdxCompCart(items[0].company_id);
    }
  };

  const addToCartApi = (item: CartApiItem) => {
    const updated = [item, ...cartApiItems];
    saveCartApi(updated);
  };

  return (
    <CartApiContext.Provider
      value={{
        cartApiItems,
        cartApiCount: cartApiItems.length,
        idxCompCart,
        setIdxCompCart,
        addToCartApi,
        saveCartApi, // tambahkan ini
      }}
    >
      {children}
    </CartApiContext.Provider>
  );
}

// Custom hook biar gampang akses context
export function useCartApi() {
  const context = useContext(CartApiContext);
  if (!context) {
    throw new Error("useCartApi must be used within a CartApiProvider");
  }
  return context;
}
