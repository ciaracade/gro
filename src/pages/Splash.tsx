import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* illustration area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16">
        {/* decorative illustration using emojis */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* background circle */}
          <div className="absolute inset-0 bg-teal/10 rounded-full" />
          {/* farmer character area */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="text-7xl">🧑‍🌾</span>
            <div className="flex gap-2 mt-2">
              <span className="text-3xl">🌱</span>
              <span className="text-4xl">🥬</span>
              <span className="text-3xl">🌿</span>
            </div>
          </div>
          {/* floating elements */}
          <span className="absolute top-4 right-4 text-2xl animate-bounce">
            🍎
          </span>
          <span
            className="absolute top-8 left-4 text-2xl animate-bounce"
            style={{ animationDelay: "0.5s" }}
          >
            🥕
          </span>
          <span
            className="absolute bottom-8 right-8 text-xl animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            🌻
          </span>
        </div>

        {/* logo */}
        <h1 className="font-fredoka text-5xl font-bold text-teal mt-8">gro!</h1>

        {/* headline */}
        <h2 className="text-2xl font-bold text-gray-900 mt-6 text-center">
          Sustainable Productivity
        </h2>
        <p className="text-gray-500 text-center mt-2 max-w-xs leading-relaxed">
          gro! is designed to help you share food and reduce waste in your
          community, one bite at a time.
        </p>
      </div>

      {/* cta */}
      <div className="px-6 pb-12">
        <button
          onClick={() => navigate("/home")}
          className="w-full bg-teal text-white font-semibold py-4 rounded-2xl text-lg hover:bg-teal-dark transition-colors shadow-lg shadow-teal/30"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
