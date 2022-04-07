import React, { useState } from "react";
import { Text, VStack, Button, Box } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
  useIsFocused,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import LeftAlignedButton from "../../components/LeftAlignedButton";
import AlertPopup from "../../components/AlertPopup";

type AccountScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Account"
>;

type AccountScreenRouteProp = RouteProp<MeNavigationParamList, "Account">;

export default function AccountScreen() {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const route = useRoute<AccountScreenRouteProp>();
  const isFocused = useIsFocused();
  const [showAlert, setShowAlert] = useState(false);

  const isSignedIn = route.params.isSignedIn;

  return (
    <>
      {isSignedIn && (
        <AlertPopup
          isOpen={showAlert && isFocused}
          onClose={() => {
            setShowAlert(false);
          }}
          header={"Sign Out"}
          body={
            "You are about to sign out. After you signed out, you will have to sign in again with your email and password."
          }
          footer={(ref) => (
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                _pressed={{ opacity: 0.5 }}
                _hover={{ opacity: 0.5 }}
                onPress={() => {
                  setShowAlert(false);
                }}
                ref={ref}
              >
                Cancel
              </Button>
              <Button
                background={"red.600"}
                onPress={() => {
                  setShowAlert(false);
                  navigation.replace("Account", { isSignedIn: false });
                }}
              >
                Sign Out
              </Button>
            </Button.Group>
          )}
        />
      )}
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"}>
            {isSignedIn ? "McCoy Applseed" : "Rate My Classes Pro"}
          </Text>
          <VStack margin={"10px"} space={"12px"}>
            <LeftAlignedButton
              title={isSignedIn ? "Starred" : "Sign In"}
              onPress={() => {
                navigation.navigate(isSignedIn ? "Starred" : "SignIn");
              }}
            />
            <LeftAlignedButton
              title={isSignedIn ? "Reviewed" : "Sign Up"}
              onPress={() => {
                navigation.navigate(isSignedIn ? "Reviewed" : "SignUp");
              }}
            />
            <LeftAlignedButton
              title={"Settings"}
              onPress={() => {
                navigation.navigate("Settings");
              }}
            />
            {isSignedIn && (
              <LeftAlignedButton
                title={"Sign Out"}
                _text={{ color: "red.600" }}
                showChevron={false}
                marginTop={"15px"}
                onPress={() => {
                  setShowAlert(true);
                }}
              />
            )}
          </VStack>
        </Box>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
