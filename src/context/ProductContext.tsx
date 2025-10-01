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
import { useUser } from "./UserContext";

export type Product = {
    id: number;
    name: string;
    price: number;
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
        sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'createdAt_desc'
    ) => Promise<void>;
    invalidateCache: () => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useUser();
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // Guardamos los filtros actuales en el estado para que el prefetching los pueda usar
    const [currentSearch, setCurrentSearch] = useState<string | undefined>();
    const [currentSort, setCurrentSort] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'createdAt_desc'>('createdAt_desc');

    // --- Lógica de Cache y Prefetching ---
    const cache = useRef(new Map<string, PaginatedResponse<Product>>());

    // Genera una clave única para el caché basada en los filtros actuales
    const getCacheKey = useCallback(
        (
            page: number,
            search?: string,
            sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'createdAt_desc'
        ) => `page=${page}&search=${search || ''}&sort=${sort || 'createdAt_desc'}`,
        []
    );
    
    // Función para limpiar el caché, la usaremos después de mutaciones
    const invalidateCache = useCallback(() => {
        cache.current.clear();
    }, []);

    const fetchProducts = useCallback(
        async (
            currentPage = 1,
            search?: string,
            sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'createdAt_desc'
        ) => {
            setCurrentSearch(search);
            setCurrentSort(sort || 'createdAt_desc');

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
                    limit: 6,
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
        if (isAuthenticated) {
            fetchProducts(1);
        } else {
            // Limpiar productos si el usuario se desautentica
            setProducts([]);
        }
    }, [isAuthenticated, fetchProducts]);

    // Efecto para el prefetching de páginas adyacentes
    useEffect(() => {
        const prefetch = async (pageToPrefetch: number, search?: string, sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'createdAt_desc') => {
            // No hacer prefetch si está fuera de los límites
            if (pageToPrefetch <= 0 || pageToPrefetch > lastPage) return;

            const cacheKey = getCacheKey(pageToPrefetch, search, sort);
            if (cache.current.has(cacheKey)) return; // Ya está en caché

            // Usamos los filtros actuales guardados en el estado del contexto
            const response = await productService.getAll({ page: pageToPrefetch, limit: 6, search, sort });
            cache.current.set(cacheKey, response);
        };

        // Prefetch de la página siguiente y anterior
        prefetch(page + 1, currentSearch, currentSort);
        prefetch(page - 1, currentSearch, currentSort);

    }, [page, lastPage, currentSearch, currentSort, getCacheKey]); // Se ejecuta cuando cambia la página o los filtros

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
                invalidateCache,
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
