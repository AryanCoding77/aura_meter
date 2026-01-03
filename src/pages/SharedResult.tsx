import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuraResultById, StoredResult } from "@/lib/resultStorage";
import Results from "./Results";

const SharedResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    // Try to get result from localStorage
    const storedResult = getAuraResultById(id);
    
    if (storedResult) {
      setResult(storedResult);
    } else {
      // Result not found
      console.error("Result not found:", id);
    }
    
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading result...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold mb-4">Result Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This aura result doesn't exist or has expired.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="btn-primary-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-xl"
          >
            Check Your Own Aura
          </button>
        </div>
      </div>
    );
  }

  // Pass result to Results component via location state
  return <Results />;
};

export default SharedResult;
