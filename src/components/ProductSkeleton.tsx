export default function ProductSkeleton() {
  return (
    <li className="p-4 flex justify-between items-center">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </li>
  );
}