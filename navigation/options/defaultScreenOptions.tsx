import React from "react";
import { Icon } from "native-base";
import {
  TransitionPresets,
  type StackNavigationOptions,
} from "@react-navigation/stack";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import colors from "../../libs/colors";
import { colorModeResponsiveStyle } from "../../libs/color-mode-utils";

export default (): StackNavigationOptions => ({
  ...TransitionPresets.DefaultTransition,
  headerStyle: {
    shadowColor: "transparent",
    borderBottomWidth: 1,
    ...colorModeResponsiveStyle((selector) => ({
      borderColor: selector({
        light: DefaultTheme.colors.border,
        dark: DarkTheme.colors.border,
      }),
    })),
  },
  headerBackImage: () => (
    <Icon
      size={"md"}
      marginRight={"-3px"}
      {...colorModeResponsiveStyle((selector) => ({
        color: selector(colors.nyu),
      }))}
      as={<Ionicons name={"chevron-back"} />}
    />
  ),
});
