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

// ... existing imports

export function VideoScrollSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-[#1C1917]">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Header Skeleton */}
        <div className="flex justify-between items-end mb-8">
          {/* Title */}
          <Skeleton className="h-10 w-64 bg-white/10" />
          {/* Badge */}
          <Skeleton className="h-8 w-32 bg-white/10 hidden md:block" />
        </div>

        {/* Scrollable Cards Skeleton */}
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shrink-0">
               {/* Vertical Video Aspect Ratio */}
               <Skeleton className="w-[280px] md:w-[320px] aspect-[9/16] rounded-2xl bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramSkeleton() {
  return (
    <section className="py-24 px-4 bg-[#F9F8F6] relative overflow-hidden border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Skeleton */}
        <div className="flex flex-col items-center mb-16 gap-4">
          <Skeleton className="h-8 w-48 rounded-full" />
          <Skeleton className="h-12 w-64 md:w-80" />
        </div>

        {/* Layout Skeleton */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Stacked Photos Skeleton */}
          <div className="md:col-span-5 flex flex-col gap-8 relative z-10 px-4 md:px-0">
             {/* Photo 1 (Tilted Left) */}
             <Skeleton className="w-full max-w-[320px] aspect-square transform rotate-[-3deg] shadow-xl self-start bg-gray-300" />
             {/* Photo 2 (Tilted Right) */}
             <Skeleton className="w-full max-w-[320px] aspect-[4/5] transform rotate-[4deg] shadow-xl self-end md:-mt-12 bg-gray-300" />
          </div>

          {/* RIGHT: Reel Skeleton */}
          <div className="md:col-span-7 relative z-0 md:pl-12">
             <Skeleton className="w-full md:max-w-[400px] mx-auto aspect-[9/16] rounded-[2.5rem]" />
          </div>

          {/* CENTER: Sticker Skeleton */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
             <Skeleton className="w-36 h-36 md:w-48 md:h-48 rounded-full border-[6px] border-[#F9F8F6]" />
          </div>

        </div>
      </div>
    </section>
  );
}



// ... existing imports (Skeleton)

export function ProductDetailSkeleton() {
  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="max-w-[1440px] mx-auto px-0 md:px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT: IMAGE GALLERY SKELETON */}
        <div className="w-full lg:w-3/5">
           {/* Desktop Grid Layout Mimic */}
           <div className="hidden lg:grid grid-cols-2 gap-4">
              <Skeleton className="col-span-2 aspect-[4/3] w-full" />
              <Skeleton className="col-span-1 aspect-[3/4] w-full" />
              <Skeleton className="col-span-1 aspect-[3/4] w-full" />
           </div>
           {/* Mobile View Mimic */}
           <div className="lg:hidden">
              <Skeleton className="aspect-[3/4] w-full" />
           </div>
        </div>

        {/* RIGHT: DETAILS SKELETON */}
        <div className="w-full lg:w-2/5 px-6 lg:px-0 flex flex-col gap-6 sticky top-28 h-fit">
           
           {/* Header */}
           <div>
             <Skeleton className="h-10 w-3/4 mb-4" /> {/* Title */}
             <Skeleton className="h-8 w-1/4" />       {/* Price */}
           </div>

           {/* Size Selector */}
           <div>
             <div className="flex justify-between mb-3">
               <Skeleton className="h-4 w-24" />
               <Skeleton className="h-4 w-16" />
             </div>
             <div className="grid grid-cols-6 gap-2">
               {[...Array(6)].map((_, i) => (
                 <Skeleton key={i} className="h-12 w-full" />
               ))}
             </div>
           </div>

           {/* Buttons */}
           <div className="flex gap-4">
             <Skeleton className="h-14 w-32 rounded-lg" /> {/* Qty */}
             <Skeleton className="h-14 flex-1 rounded-lg" /> {/* Add to Cart */}
           </div>

           {/* Editor Note */}
           <Skeleton className="h-32 w-full rounded-xl" />

           {/* Accordions / Icons */}
           <div className="space-y-4 pt-4">
             <div className="flex gap-4"><Skeleton className="w-8 h-8 rounded-full" /><div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-2 w-48" /></div></div>
             <div className="flex gap-4"><Skeleton className="w-8 h-8 rounded-full" /><div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-2 w-48" /></div></div>
           </div>

        </div>
      </div>
    </div>
  );
}