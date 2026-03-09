export default function Orders() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="bg-teal px-4 pt-10 pb-6">
        <h1 className="text-center text-white font-semibold text-lg">
          My Orders
        </h1>
      </header>

      <div className="flex-1 p-4 space-y-4">
        {/* active pickups */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Active Pickups
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥬</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  Fresh Produce & Bread
                </p>
                <p className="text-xs text-gray-500">From Maria G.</p>
              </div>
              <span className="bg-teal/10 text-teal text-xs font-semibold px-2.5 py-1 rounded-full">
                Confirmed
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📍</span>
              <span>Main Library · 2 blocks away</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>🕐</span>
              <span>Pick up by 11:00 AM</span>
            </div>
            <button className="w-full bg-teal text-white font-semibold py-3 rounded-xl text-sm hover:bg-teal-dark transition-colors">
              Get Directions
            </button>
          </div>
        </div>

        {/* past orders */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Past Pickups</h2>
          {[
            {
              emoji: "🍕",
              title: "Pizza & Salad",
              from: "Jake M.",
              date: "Mar 5",
              points: 15,
            },
            {
              emoji: "🥖",
              title: "Bakery Items",
              from: "Sarah K.",
              date: "Mar 3",
              points: 10,
            },
            {
              emoji: "🥫",
              title: "Canned Goods",
              from: "James T.",
              date: "Feb 28",
              points: 20,
            },
          ].map((order, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
            >
              <span className="text-2xl">{order.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">
                  {order.title}
                </p>
                <p className="text-xs text-gray-500">
                  From {order.from} · {order.date}
                </p>
              </div>
              <span className="text-sm text-teal font-semibold">
                +{order.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
