import { Skeleton } from "../ui/Skeleton";

// 1. STANDARD GRID LOADER (For Collection Tiles, Shop Page)
export function GridSkeleton({ count = 3, type = "rect" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {/* Shape Logic: 'arch' for collections, 'rect' for products */}
          <Skeleton 
            className={`aspect-[3/4] w-full mb-6 ${
              type === 'arch' ? 'rounded-t-[12rem]' : 'rounded-xl'
            }`} 
          />
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-40" />
            {type === 'product' && <Skeleton className="h-4 w-16 mt-1" />}
          </div>
        </div>
      ))}
    </div>
  );
}

// 2. BEST SELLER LOADER (Unique Layout)
// Matches your exact BestSellers.jsx layout (5 cols left, 7 cols right)
export function BestSellerSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      
      {/* LEFT: Hero Item */}
      <div className="md:col-span-5">
        <Skeleton className="h-[600px] w-full rounded-t-[15rem]" />
        <div className="text-center mt-6 flex flex-col items-center gap-2">
           <Skeleton className="h-8 w-48" />
           <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* RIGHT: Two Items */}
      <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 md:mt-0">
         {[1, 2].map((i) => (
           <div key={i} className={i === 2 ? "md:mt-32" : ""}>
              <Skeleton className={`h-[350px] w-full ${i === 1 ? 'rounded-[4rem]' : 'rounded-t-[10rem]'}`} />
              <div className={`mt-4 gap-2 flex flex-col ${i === 1 ? 'items-start ml-4' : 'items-center'}`}>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}