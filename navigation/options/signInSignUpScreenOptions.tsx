import React from "react";
import { Platform } from "react-native";
import { type RouteProp } from "@react-navigation/native";
import {
  type StackNavigationProp,
  type StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";

import PlainTextButton from "../../components/PlainTextButton";
import { type MeNavigationParamList } from "../../shared/types";

type SignInSignUpScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "SignIn" | "SignUp"
>;

type SignInSignUpScreenRouteProp = RouteProp<
  MeNavigationParamList,
  "SignIn" | "SignUp"
>;

export type SignInSignUpScreenOptionsProp = {
  navigation: SignInSignUpScreenNavigationProp;
  route: SignInSignUpScreenRouteProp;
};

export default ({
  navigation,
  route,
}: SignInSignUpScreenOptionsProp): StackNavigationOptions => ({
  presentation: "modal",
  gestureEnabled: false,
  title: route.name === "SignIn" ? "Sign In" : "Sign Up",
  headerLeft: (props) => {
    return (
      <PlainTextButton
        marginLeft={"10px"}
        title={"Cancel"}
        _text={{ fontSize: "md", fontWeight: "normal" }}
        onPress={navigation.goBack}
        {...props}
      />
    );
  },
  ...(Platform.OS === "ios" || Platform.OS === "macos"
    ? TransitionPresets.ModalSlideFromBottomIOS
    : TransitionPresets.DefaultTransition),
});
