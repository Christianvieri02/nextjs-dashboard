const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent';

export function CardSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden rounded-xl bg-[#11131A] p-2 border border-gray-900 shadow-sm`}>
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-800" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-800" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-gray-800/10 px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-800" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4 bg-[#11131A] p-6 rounded-lg border border-gray-900`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-800" />
      <div className="rounded-xl bg-gray-850 p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-gray-800/20 p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-800" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-900 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-800" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-800" />
          <div className="mt-2 h-4 w-12 rounded-md bg-gray-800" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-800" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4 bg-[#11131A] p-6 rounded-lg border border-gray-900`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-800" />
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-850 p-4">
        <div className="bg-transparent px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-800" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-800`} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-900 last-of-type:border-none">
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-800 animate-pulse" />
          <div className="h-6 w-24 rounded bg-gray-800 animate-pulse" />
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-800 animate-pulse" />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-800 animate-pulse" />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-800 animate-pulse" />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-800 animate-pulse" />
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-800 animate-pulse" />
          <div className="h-[38px] w-[38px] rounded bg-gray-800 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

export function InvoicesMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-[#11131A] p-4 border border-gray-900">
      <div className="flex items-center justify-between border-b border-gray-900 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-800 animate-pulse" />
          <div className="h-6 w-16 rounded bg-gray-800 animate-pulse" />
        </div>
        <div className="h-6 w-16 rounded bg-gray-800 animate-pulse" />
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-800 animate-pulse" />
          <div className="mt-2 h-6 w-24 rounded bg-gray-800 animate-pulse" />
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-800 animate-pulse" />
          <div className="h-10 w-10 rounded bg-gray-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root animate-pulse">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-[#11131A]/40 border border-gray-900 p-2 md:pt-0">
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-gray-300 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr className="border-b border-gray-900">
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Customer</th>
                <th scope="col" className="px-3 py-5 font-medium">Email</th>
                <th scope="col" className="px-3 py-5 font-medium">Amount</th>
                <th scope="col" className="px-3 py-5 font-medium">Date</th>
                <th scope="col" className="px-3 py-5 font-medium">Status</th>
                <th scope="col" className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-gray-800 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-800 rounded" />
      </div>

      <div className="grid grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`${shimmer} relative overflow-hidden bg-[#11131A] p-6 rounded-lg border border-gray-900 shadow-lg h-28 flex flex-col justify-between`}>
            <div className="h-3 w-20 bg-gray-800 rounded" />
            <div className="h-8 w-12 bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-[#11131A] rounded-lg border border-gray-900 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-900">
          <div className="h-5 w-32 bg-gray-800 rounded mb-2" />
          <div className="h-3 w-48 bg-gray-800 rounded" />
        </div>
        
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-900 last:border-none">
              <div className="h-4 w-24 bg-gray-800 rounded" />
              <div className="h-4 w-36 bg-gray-800 rounded" />
              <div className="h-6 w-16 bg-gray-800 rounded-full" />
              <div className="h-4 w-44 bg-gray-800 rounded" />
              <div className="h-4 w-28 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FleetSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-gray-800 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-800 rounded" />
      </div>

      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${shimmer} relative overflow-hidden bg-[#11131A] p-6 rounded border border-gray-800/80 shadow h-28 flex flex-col justify-between`}>
            <div className="flex justify-between items-start">
              <div className="w-5 h-5 bg-gray-800 rounded" />
              <div className="h-8 w-12 bg-gray-800 rounded" />
            </div>
            <div className="h-3 w-28 bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-[#11131A] rounded border border-gray-800/80 overflow-hidden">
        <div className="p-5 border-b border-gray-800/80">
          <div className="flex justify-between gap-4">
            <div className="h-3 w-16 bg-gray-800 rounded" />
            <div className="h-3 w-20 bg-gray-800 rounded" />
            <div className="h-3 w-12 bg-gray-800 rounded" />
            <div className="h-3 w-16 bg-gray-800 rounded" />
            <div className="h-3 w-12 bg-gray-800 rounded" />
            <div className="h-3 w-24 bg-gray-800 rounded" />
            <div className="h-3 w-16 bg-gray-800 rounded" />
          </div>
        </div>
        <div className="p-5 space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-800/50 last:border-none">
              <div className="h-4 w-16 bg-gray-800 rounded" />
              <div className="h-4 w-32 bg-gray-800 rounded" />
              <div className="h-4 w-12 bg-gray-800 rounded" />
              <div className="h-4 w-20 bg-gray-800 rounded" />
              <div className="h-6 w-16 bg-gray-800 rounded-full" />
              <div className="h-4 w-24 bg-gray-800 rounded" />
              <div className="h-4 w-16 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-gray-800 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-800 rounded" />
      </div>

      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${shimmer} relative overflow-hidden bg-[#11131A] p-6 rounded-lg border border-[#D977F9]/20 shadow h-28 flex flex-col justify-between`}>
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 bg-gray-800 rounded" />
              <div className="w-12 h-4 bg-gray-800 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-800 rounded" />
            <div className="h-3 w-24 bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#11131A] p-6 rounded-lg border border-[#D977F9]/20 h-[320px] flex flex-col justify-between">
          <div className="h-4 w-32 bg-gray-800 rounded" />
          <div className="h-44 w-full bg-gray-800/40 rounded flex items-end p-4">
            <div className="w-full h-24 border-l border-b border-gray-700 relative overflow-hidden">
              <div className={`${shimmer} absolute inset-0`} />
            </div>
          </div>
          <div className="h-3 w-48 bg-gray-800 rounded self-center" />
        </div>

        <div className="bg-[#11131A] p-6 rounded-lg border border-[#D977F9]/20 h-[320px] flex flex-col justify-between">
          <div className="h-4 w-32 bg-gray-800 rounded" />
          <div className="h-44 w-44 rounded-full border border-gray-800 bg-gray-800/20 self-center flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-[#11131A]" />
          </div>
          <div className="h-3 w-48 bg-gray-800 rounded self-center" />
        </div>
      </div>

      <div className="bg-[#11131A] p-6 rounded-lg border border-[#D977F9]/20 h-64 flex flex-col justify-between">
        <div className="h-4 w-32 bg-gray-800 rounded" />
        <div className="flex h-36 items-end gap-16 px-10 border-b border-gray-850">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-12 bg-gray-800/50 rounded-t" style={{ height: `${20 + i * 15}%` }} />
          ))}
        </div>
        <div className="h-3 w-48 bg-gray-800 rounded self-center" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-[#11131A] p-6 rounded-lg border border-gray-800/80 shadow space-y-4">
            <div className="h-3 w-32 bg-gray-800 rounded" />
            <div className="h-8 w-24 bg-gray-800 rounded" />
            <div className="h-3.5 w-40 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="h-[calc(100vh-80px)] flex gap-8 animate-pulse">
      <div className="flex-1 flex flex-col h-full">
        <div className="mb-4">
          <div className="h-8 w-40 bg-gray-800 rounded mb-2" />
          <div className="h-3 w-32 bg-gray-800 rounded" />
        </div>
        <div className={`${shimmer} relative flex-1 bg-[#0A0C10] rounded-xl border border-gray-800/80 overflow-hidden`} />
      </div>

      <div className="w-[380px] bg-[#0A0C10] border border-gray-800/80 rounded-xl flex flex-col overflow-hidden h-full">
        <div className="p-6 border-b border-gray-800/80 bg-[#11131A] flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-800 rounded" />
          <div className="w-5 h-5 bg-gray-800 rounded" />
        </div>
        <div className="flex-1 p-4 space-y-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#11131A] border border-gray-800/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-28 bg-gray-800 rounded" />
                <div className="h-4 w-12 bg-gray-800 rounded" />
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="h-2 w-10 bg-gray-800 rounded" />
                  <div className="h-3 w-20 bg-gray-800 rounded" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-10 bg-gray-800 rounded" />
                  <div className="h-3 w-12 bg-gray-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-gray-800/80 bg-[#11131A] flex justify-between">
          <div className="h-3 w-20 bg-gray-800 rounded" />
          <div className="h-3 w-24 bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ShipmentTrackerSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden bg-[#151822] rounded-lg border border-gray-800/50 shadow-2xl p-8 flex flex-col space-y-6`}>
      <div className="flex justify-between items-start pb-8 border-b border-gray-800">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-850 rounded" />
          <div className="h-4 w-32 bg-gray-850 rounded" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-4 w-24 bg-gray-850 rounded" />
          <div className="h-6 w-32 bg-gray-850 rounded" />
        </div>
      </div>
      
      <div className="flex justify-between items-center py-6 relative px-4 mx-4">
        <div className="h-[2px] bg-gray-800 w-full absolute top-1/2 left-0 right-0 -translate-y-1/2 -z-10" />
        <div className="w-4 h-4 rounded-full bg-gray-850" />
        <div className="w-8 h-8 rounded-full bg-gray-850" />
        <div className="w-4 h-4 rounded-full bg-gray-850" />
      </div>

      <div className="space-y-6 pl-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-gray-850 shrink-0" />
            <div className="space-y-2 w-full">
              <div className="h-4 w-40 bg-gray-850 rounded" />
              <div className="h-3 w-60 bg-gray-850 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BillingSkeleton() {
  return (
    <tr className={`${shimmer} relative overflow-hidden text-xs text-gray-300`}>
      <td className="py-4.5 px-6 font-bold text-white whitespace-nowrap flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-[#1C1F2B] flex items-center justify-center text-gray-800" />
        <div className="h-4 w-24 bg-gray-850 rounded" />
      </td>
      <td className="py-4.5 px-6">
        <div className="h-4 w-48 bg-gray-850 rounded" />
      </td>
      <td className="py-4.5 px-6">
        <div className="h-4 w-20 bg-gray-850 rounded" />
      </td>
      <td className="py-4.5 px-6 font-bold text-white">
        <div className="h-4 w-12 bg-gray-850 rounded" />
      </td>
      <td className="py-4.5 px-6">
        <div className="h-6 w-16 bg-gray-850 rounded-full" />
      </td>
      <td className="py-4.5 px-6 text-right">
        <div className="h-6 w-8 bg-gray-850 rounded ml-auto" />
      </td>
    </tr>
  );
}

export function CalculatorSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden w-full h-full flex flex-col justify-between space-y-6`}>
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-800/50 pb-3">
          <div className="w-5 h-5 bg-gray-850 rounded" />
          <div className="h-4 w-36 bg-gray-850 rounded" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between border-b border-gray-800/20 pb-2">
              <div className="h-4 w-20 bg-gray-855 rounded" />
              <div className="h-4 w-24 bg-gray-855 rounded" />
            </div>
          ))}
          <div className="pt-2 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-28 bg-gray-855 rounded" />
                <div className="h-3 w-16 bg-gray-855 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-800/80 pt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 bg-gray-850 rounded" />
          <div className="h-8 w-24 bg-gray-850 rounded" />
        </div>
        <div className="h-3 w-32 bg-gray-850 rounded self-end" />
      </div>
    </div>
  );
}
