import ProductList from "@/components/ProductList";

export default function HomePage() {

  return (
    <main className="bg-gray-100 flex flex-col items-center p-4 md:p-6 min-h-[calc(100vh-5rem)]">
      <ProductList />
    </main>
  );
}