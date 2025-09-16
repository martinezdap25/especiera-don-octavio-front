import ProductList from "@/components/ProductList";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-4 md:p-6 ">
      <ProductList />
    </main>
  );
}