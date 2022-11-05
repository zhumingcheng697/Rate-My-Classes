import React, { type ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useScript, appleAuthHelpers } from "react-apple-signin-auth";
import { GOOGLE_WEB_CLIENT_ID } from "react-native-dotenv";

export type OAuthProviderProps = {
  children: ReactNode;
};

export default function OAuthProvider({ children }: OAuthProviderProps) {
  useScript(appleAuthHelpers.APPLE_SCRIPT_SRC);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_WEB_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
