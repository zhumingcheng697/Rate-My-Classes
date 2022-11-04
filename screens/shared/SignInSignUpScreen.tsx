import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { Text, Button, Input, VStack, Box, HStack, Divider } from "native-base";
import {
  CommonActions,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { Route, composeErrorMessage } from "../../libs/utils";
import { type SharedNavigationParamList } from "../../libs/types";
import { GoogleSignInButton } from "../../libs/GoogleSignIn";
import { useInitialTabName } from "../../libs/hooks";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import LabeledInput from "../../components/LabeledInput";
import PlainTextButton from "../../components/PlainTextButton";
import { SolidButton } from "../../components/LinkCompatibleButtons";
import AlertPopup from "../../components/AlertPopup";
import { useAuth } from "../../mongodb/auth";

type SignInSignUpScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "SignInSignUp"
>;

type SignInSignUpScreenRouteProp = RouteProp<
  SharedNavigationParamList,
  "SignInSignUp"
>;

export default function SignInSignUpScreen() {
  const navigation = useNavigation<SignInSignUpScreenNavigationProp>();
  const route = useRoute<SignInSignUpScreenRouteProp>();
  const auth = useAuth();
  const tabName = useInitialTabName();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [key, setKey] = useState(Math.random());

  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<any>(null);

  const [showGoogleAlert, setShowGoogleAlert] = useState(false);
  const [googleError, setGoogleError] = useState<any>(null);

  const isSigningUp = route.params?.isSigningUp ?? false;

  const isAuthenticated = auth.isAuthenticated;

  useEffect(() => {
    if (isAuthenticated) {
      navigation.goBack();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setIsLoading(false);
    setPassword("");
    setConfirmPassword("");
  }, [isSigningUp]);

  useEffect(() => {
    setKey(Math.random());
  }, [username, email, confirmPassword, isSigningUp]);

  return (
    <>
      <AlertPopup
        header={`Unable to ${isSigningUp ? "Sign Up" : "Sign In"}`}
        body={composeErrorMessage(error)}
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <AlertPopup
        header={`Unable to ${isSigningUp ? "Sign Up" : "Sign In"} with Google`}
        body={composeErrorMessage(googleError)}
        isOpen={showGoogleAlert}
        onClose={() => setShowGoogleAlert(false)}
      />
      <KeyboardAwareSafeAreaScrollView>
        <VStack margin={"10px"} space={"8px"}>
          {isSigningUp && (
            <LabeledInput label={"Username"} usePlainLabel>
              <Input
                value={username}
                onChangeText={setUsername}
                autoCompleteType={"username"}
              />
            </LabeledInput>
          )}
          <LabeledInput label={"Email"} usePlainLabel>
            <Input
              value={email}
              onChangeText={setEmail}
              autoCompleteType={"email"}
              autoCorrect={false}
              autoCapitalize={"none"}
              keyboardType={"email-address"}
            />
          </LabeledInput>
          <LabeledInput label={"Password"} usePlainLabel>
            <Input
              key={`${key}`}
              value={password}
              onChangeText={setPassword}
              textContentType={"oneTimeCode"}
              variant={"password"}
            />
          </LabeledInput>
          {isSigningUp && (
            <LabeledInput label={"Confirm Password"} usePlainLabel>
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                textContentType={"oneTimeCode"}
                variant={"password"}
              />
            </LabeledInput>
          )}
          <VStack marginY={"15px"} space={"12px"}>
            <SolidButton
              isDisabled={
                isLoading ||
                !email ||
                !password ||
                (isSigningUp &&
                  (!username ||
                    !confirmPassword ||
                    password !== confirmPassword))
              }
              onPress={async () => {
                try {
                  setIsLoading(true);
                  if (isSigningUp) {
                    await auth.signUpWithEmailPassword(
                      username,
                      email,
                      password
                    );
                  } else {
                    await auth.signInWithEmailPassword(email, password);
                  }
                  setError(null);
                } catch (e) {
                  setError(e);
                  setShowAlert(true);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <Text variant={"button"}>
                {isSigningUp ? "Sign Up with Email" : "Sign In with Email"}
              </Text>
            </SolidButton>
            <HStack
              marginY={"8px"}
              space={"15px"}
              justifyContent={"space-between"}
              alignContent={"center"}
              alignItems={"center"}
            >
              <Divider minW={0} flexShrink={1} />
              <Text
                textAlign={"center"}
                fontSize={"md"}
                fontWeight={"medium"}
                flexGrow={10}
                flexShrink={0}
              >
                or
              </Text>
              <Divider minW={0} flexShrink={1} />
            </HStack>
            <GoogleSignInButton
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setError={(error) => {
                setGoogleError(error);
                setShowGoogleAlert(true);
              }}
            />
          </VStack>
          <Box>
            <Text textAlign={"center"}>
              {isSigningUp
                ? "Already have an account?"
                : "Don’t have an account yet?"}
            </Text>
            <HStack justifyContent={"center"}>
              <PlainTextButton
                paddingX={"5px"}
                isDisabled={isLoading}
                title={isSigningUp ? "Sign In" : "Sign Up"}
                linkTo={{
                  ...Route(tabName, "SignInSignUp", {
                    ...route.params,
                    isSigningUp: !isSigningUp,
                  }),
                  action: CommonActions.setParams({
                    isSigningUp: !isSigningUp,
                  }),
                }}
                onPress={() => Keyboard.dismiss()}
              />
            </HStack>
          </Box>
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
