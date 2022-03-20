import { Text, Button, Input, VStack, Box, Pressable } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import PlainTextButton from "../../components/PlainTextButton";

type MeSignUpScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "SignUp"
>;

export default function MeSignUpScreen() {
  const navigation = useNavigation<MeSignUpScreenNavigationProp>();

  return (
    <KeyboardAwareSafeAreaScrollView>
      <VStack marginX={"10px"} space={"8px"}>
        <Box>
          <Text variant={"label"}>Username</Text>
          <Input autoCompleteType={"username"} />
        </Box>
        <Box>
          <Text variant={"label"}>Email</Text>
          <Input
            autoCompleteType={"email"}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
          />
        </Box>
        <Box>
          <Text variant={"label"}>Password</Text>
          <Input variant={"password"} />
        </Box>
        <Box>
          <Text variant={"label"}>Confirm Password</Text>
          <Input variant={"password"} />
        </Box>
        <Button
          marginY={"15px"}
          onPress={() => {
            navigation.replace("Account");
          }}
        >
          <Text variant={"button"}>Sign Up</Text>
        </Button>
        <Box>
          <Text textAlign={"center"}>Already have an account?</Text>
          <PlainTextButton
            title={"Sign In"}
            onPress={() => {
              navigation.replace("SignIn");
            }}
          />
        </Box>
      </VStack>
    </KeyboardAwareSafeAreaScrollView>
  );
}