/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { productService } from "@/services/productService";

export type Product = {
    id: number;
    name: string;
    price: string; // 👈 como tu API devuelve price en string
    image?: string;
    unitType: "grams" | "unit";
    deletedAt?: string | null;
};

type ProductContextType = {
    products: Product[];
    page: number;
    lastPage: number;
    total: number;
    loading: boolean;
    error: string | null;
    fetchProducts: (page?: number, search?: string, sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc') => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async (
        currentPage = 1,
        search?: string,
        sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await productService.getAll({
                page: currentPage,
                limit: 5, // O el límite que prefieras
                search,
                sort,
            });
            setProducts(response.data);
            setPage(response.page);
            setLastPage(response.lastPage);
            setTotal(response.total);
        } catch (err: any) {
            setError(err.message || "Error al cargar productos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <ProductContext.Provider
            value={{
                products,
                page,
                lastPage,
                total,
                loading,
                error,
                fetchProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProducts debe usarse dentro de un ProductProvider");
    }
    return context;
};
