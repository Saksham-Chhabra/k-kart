import { create } from "zustand";
import axios from "../src/lib/axios";
import { toast } from "react-hot-toast";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/products", productData);
      set((state) => ({
        products: [...state.products, response.data],
      }));
      toast.success("Product created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Product creation failed");
    } finally {
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      set({ loading: false });
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
      }));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Product deletion failed");
    } finally {
      set({ loading: false });
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      // this will update the isFeatured prop of the product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch products by category"
      );
    } finally {
      set({ loading: false });
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch featured products"
      );
    } finally {
      set({ loading: false });
    }
  },
}));

export { useProductStore };
