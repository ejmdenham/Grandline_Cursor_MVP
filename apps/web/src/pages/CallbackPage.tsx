import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

export default function CallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const search = window.location.search;
      if (search.includes("code=")) {
        try {
          const authModule = await import("aws-amplify/auth");
          const handleRedirect = (authModule as { handleRedirectAuth?: () => Promise<unknown> }).handleRedirectAuth;
          if (typeof handleRedirect === "function") {
            await handleRedirect();
          } else {
            await fetchAuthSession();
          }
          navigate("/", { replace: true });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Sign-in failed");
        }
      } else {
        navigate("/", { replace: true });
      }
    };
    run();
  }, [navigate]);

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{error}</p>
        <button type="button" onClick={() => navigate("/")}>
          Go to home
        </button>
      </div>
    );
  }

  return <div style={{ padding: "2rem", textAlign: "center" }}>Signing in…</div>;
}
