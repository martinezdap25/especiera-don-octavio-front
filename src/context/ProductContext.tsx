/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { productService } from "@/services/productService";

export type Product = {
    id: number;
    name: string;
    price: string;
    image?: string;
    unitType: "grams" | "unit";
    deletedAt?: string | null;
};

type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    lastPage: number;
};

type ProductContextType = {
    products: Product[];
    page: number;
    lastPage: number;
    total: number;
    loading: boolean;
    error: string | null;
    fetchProducts: (
        page?: number,
        search?: string,
        sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'
    ) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- Lógica de Cache y Prefetching ---
    const cache = useRef(new Map<string, PaginatedResponse<Product>>());

    // Genera una clave única para el caché basada en los filtros actuales
    const getCacheKey = (
        page: number,
        search?: string,
        sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'
    ) => `page=${page}&search=${search || ''}&sort=${sort || 'name_asc'}`;

    const fetchProducts = useCallback(
        async (
            currentPage = 1,
            search?: string,
            sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'
        ) => {
            const cacheKey = getCacheKey(currentPage, search, sort);

            // 1. Usar cache si existe para la combinación de filtros actual
            if (cache.current.has(cacheKey)) {
                const cachedData = cache.current.get(cacheKey)!;
                setProducts(cachedData.data);
                setPage(cachedData.page);
                setLastPage(cachedData.lastPage);
                setTotal(cachedData.total);
                return; // No es necesario seguir si los datos están en caché
            }

            try {
                setLoading(true);
                setError(null);

                // 2. Hacer la petición al API si no hay datos en caché
                const response = await productService.getAll({
                    page: currentPage,
                    limit: 5,
                    search,
                    sort,
                });
                
                setProducts(response.data);
                setPage(response.page);
                setLastPage(response.lastPage);
                setTotal(response.total);

                // 3. Guardar la respuesta completa en el caché con la clave correcta
                cache.current.set(cacheKey, response);

            } catch (err: any) {
                setError(err.message || "Error al cargar productos");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Efecto para la carga inicial de productos
    useEffect(() => {
        fetchProducts(1);
    }, [fetchProducts]);

    // Efecto para el prefetching de páginas adyacentes
    useEffect(() => {
        const prefetch = async (pageToPrefetch: number) => {
            // No hacer prefetch si está fuera de los límites
            if (pageToPrefetch <= 0 || pageToPrefetch > lastPage) return;

            // Obtener filtros actuales del componente ProductList (esto es una limitación, idealmente se pasarían al contexto)
            // Por ahora, asumimos que los filtros no cambian durante el prefetch.
            // Una mejora sería guardar search y sort en el estado del contexto.
            const currentSearch = new URLSearchParams(window.location.search).get('search') || undefined;
            const currentSort = (new URLSearchParams(window.location.search).get('sort') as any) || undefined;

            const cacheKey = getCacheKey(pageToPrefetch, currentSearch, currentSort);
            if (cache.current.has(cacheKey)) return; // Ya está en caché

            const response = await productService.getAll({ page: pageToPrefetch, limit: 5, search: currentSearch, sort: currentSort });
            cache.current.set(cacheKey, response);
        };

        // Prefetch de la página siguiente y anterior
        prefetch(page + 1);
        prefetch(page - 1);

    }, [page, lastPage]); // Se ejecuta cuando cambia la página

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
