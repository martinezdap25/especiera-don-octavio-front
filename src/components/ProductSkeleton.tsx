export default function ProductSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between p-3 animate-pulse">
      {/* Skeleton para Nombre, precio y unidad */}
      <div className="flex flex-col min-w-0 gap-2">
        <div className="h-5 w-32 sm:w-40 bg-amber-200 rounded"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-green-200 rounded"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Skeleton para Botón */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 sm:w-24 sm:h-10 bg-green-200 rounded-full sm:rounded-lg"></div>
      </div>
    </div>
  );
}