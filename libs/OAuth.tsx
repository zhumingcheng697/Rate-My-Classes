import React, { useCallback, type ReactNode } from "react";
import { Platform } from "react-native";
import appleAuth from "@invertase/react-native-apple-authentication";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
} from "react-native-dotenv";

import { composeUsername } from "./utils";

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  offlineAccess: true,
});

export type OAuthProviderProps = {
  children: ReactNode;
};

export function OAuthProvider({ children }: OAuthProviderProps) {
  return <>{children}</>;
}

export type OAuthTokenResponse = {
  idToken: string;
  username: string | null;
};

export type OAuthCodeResponse = {
  authCode: string;
};

export type OAuthSignInOptions =
  | {
      callback: (res?: OAuthTokenResponse) => void;
      onError: (error: any) => void;
      flow?: "idToken";
    }
  | {
      callback: (res?: OAuthCodeResponse) => void;
      onError: (error: any) => void;
      flow: "authCode";
    };

export namespace AppleOAuth {
  export function isSupported() {
    return !(
      Platform.OS === "ios" && parseInt(Platform.Version.split(".")[0]) < 13
    );
  }

  export function useSignIn({ callback, onError, flow }: OAuthSignInOptions) {
    return useCallback(async () => {
      try {
        const { user, fullName, identityToken, authorizationCode } =
          await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME],
          });

        const state = await appleAuth.getCredentialStateForUser(user);

        if (state !== appleAuth.State.AUTHORIZED)
          return onError(new Error("Unable to authorize"));

        if (!identityToken || !authorizationCode)
          return onError(new Error("Unable to retrieve id token or auth code"));

        if (flow === "authCode")
          return callback({ authCode: authorizationCode });

        const username = composeUsername({
          givenName: fullName?.givenName,
          middleName: fullName?.middleName,
          familyName: fullName?.familyName,
          nickname: fullName?.nickname,
        });

        return callback({
          idToken: identityToken,
          username,
        });
      } catch (error: any) {
        if (
          `${error?.code}` !== "1001" &&
          !/com\.apple\.AuthenticationServices\.AuthorizationError error 1001/.test(
            `${error?.message}` || ""
          )
        ) {
          console.error(error);
          return onError(error);
        }

        return callback();
      }
    }, [callback, onError, flow]);
  }
}

export namespace GoogleOAuth {
  export function useSignIn({ callback, onError, flow }: OAuthSignInOptions) {
    return useCallback(async () => {
      try {
        await GoogleSignin.hasPlayServices();

        const { user, idToken, serverAuthCode } = await GoogleSignin.signIn();

        if (!idToken || !serverAuthCode)
          return onError(new Error("Unable to retrieve id token or auth code"));

        if (flow === "authCode") return callback({ authCode: serverAuthCode });

        const username = composeUsername({
          fullName: user.name,
          givenName: user.givenName,
          familyName: user.familyName,
        });

        return callback({ idToken, username });
      } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          return callback();
        } else if (error.code === statusCodes.IN_PROGRESS) {
          return callback();
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          onError("Google Play services not available or outdated");
        } else {
          onError(error);
        }
        console.error(error);
      }
    }, [callback, onError, flow]);
  }

  export async function signOut() {
    await GoogleSignin.signOut();
  }
}
