export default function Services() {
  return (
    <main className="px-10 py-16">
      <h1 className="text-5xl font-bold mb-10">
        OUR FREIGHT <span className="text-purple-400">SOLUTIONS</span>
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {["Economy", "Standard", "Heavy", "Express", "VIP"].map((item) => (
          <div key={item} className="bg-[#111827] p-6 rounded">
            <h2 className="text-xl font-bold">
              SEA PARCEL {item.toUpperCase()}
            </h2>

            <p className="text-gray-400 mt-2">
              Logistics solution for {item}.
            </p>

            <button className="mt-4 border border-purple-500 px-4 py-1 rounded">
              Initiate Booking
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}