import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import { AuthGate } from "@/components/AuthGate";

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
      <AuthGate
        title="Sign in failed"
        body="The hosted UI did not complete."
        error={error}
        actionLabel="Go to home"
        onAction={() => navigate("/")}
      />
    );
  }

  return <AuthGate title="Signing in…" body="Hold for the hosted UI to finish." />;
}
