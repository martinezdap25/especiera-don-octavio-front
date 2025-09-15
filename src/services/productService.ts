import axios from "axios";
import { Product } from "@/context/ProductContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL no está definido en el .env");
}

type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    lastPage: number;
};

type GetAllProductsParams = {
    page?: number;
    limit?: number;
    search?: string;
    sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
};

export const productService = {
    getAll: async (params: GetAllProductsParams = {}): Promise<PaginatedResponse<Product>> => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.sort) queryParams.append('sort', params.sort);

        const { data } = await axios.get<PaginatedResponse<Product>>(
            `${API_URL}/products?${queryParams.toString()}`
        );

        return data;
    },

    getById: async (id: number): Promise<Product> => {
        const { data } = await axios.get<Product>(`${API_URL}/products/${id}`);
        return data;
    },

    create: async (product: Omit<Product, "id">): Promise<Product> => {
        const { data } = await axios.post<Product>(`${API_URL}/products`, product);
        return data;
    },

    update: async (id: number, product: Partial<Product>): Promise<Product> => {
        const { data } = await axios.put<Product>(`${API_URL}/products/${id}`, product);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/products/${id}`);
    },
};
