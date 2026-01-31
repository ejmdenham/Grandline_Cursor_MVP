import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import { env } from "./config/env";
import App from "./App";
import "./index.css";

const cognitoDomain = env.cognitoHostedUiPrefix
  ? `${env.cognitoHostedUiPrefix}.auth.${env.cognitoRegion}.amazoncognito.com`
  : "";

if (env.cognitoUserPoolId && env.cognitoClientId) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: env.cognitoUserPoolId,
        userPoolClientId: env.cognitoClientId,
        ...(cognitoDomain && {
          loginWith: {
            oauth: {
              domain: cognitoDomain,
              scopes: ["email", "openid", "profile"],
              redirectSignIn: [window.location.origin + "/callback", "http://localhost:5173/callback"],
              redirectSignOut: [window.location.origin + "/", "http://localhost:5173/"],
              responseType: "code",
            },
          },
        }),
      },
    },
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
