import React from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { type IButtonProps } from "native-base";
import config from "react-native-config";

import Button from "../components/GoogleSignInButton";
import { useAuth } from "../mongodb/auth";

GoogleSignin.configure({
  webClientId: config.GOOGLE_WEB_CLIENT_ID,
  iosClientId: config.GOOGLE_IOS_CLIENT_ID,
});

type GoogleSignInButtonBaseProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: any) => void;
};

export type GoogleSignInButtonProps = GoogleSignInButtonBaseProps &
  Omit<IButtonProps, keyof GoogleSignInButtonBaseProps | "onPress">;

export function GoogleSignInButton({
  isLoading,
  setIsLoading,
  setError,
  isDisabled = false,
  ...rest
}: GoogleSignInButtonProps) {
  const auth = useAuth();

  return (
    <Button
      {...rest}
      isDisabled={isLoading || isDisabled}
      onPress={async () => {
        try {
          setIsLoading(true);

          await GoogleSignin.hasPlayServices();

          const user = await GoogleSignin.signIn();
          const username = user.user.name || user.user.givenName || "New User";

          await auth.continueWithGoogle(user.idToken!, username);
        } catch (error: any) {
          console.error(error);

          // handle errors
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            return;
          } else if (error.code === statusCodes.IN_PROGRESS) {
            return;
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            setError("Google Play services not available or outdated");
          } else {
            setError(error);
          }
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
