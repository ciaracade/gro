import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading, isNewUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-fredoka text-4xl font-bold text-teal">gro!</h1>
          <p className="text-gray-400 text-sm mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (isNewUser) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
