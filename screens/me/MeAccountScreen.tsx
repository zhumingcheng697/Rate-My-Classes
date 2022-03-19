import { Text, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";

type MeAccountScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Me-Account"
>;

export default function MeAccountScreen() {
  const navigation = useNavigation<MeAccountScreenNavigationProp>();

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Text variant={"h1"}>McCoy Applseed</Text>
      <Button
        margin={"10px"}
        onPress={() => {
          navigation.push("Me-Starred");
        }}
      >
        Starred
      </Button>
      <Button
        margin={"10px"}
        onPress={() => {
          navigation.push("Me-Reviewed");
        }}
      >
        Reviewed
      </Button>
      <Button
        margin={"10px"}
        onPress={() => {
          navigation.replace("Me-SignIn");
        }}
      >
        Sign Out
      </Button>
    </KeyboardAwareSafeAreaScrollView>
  );
}
