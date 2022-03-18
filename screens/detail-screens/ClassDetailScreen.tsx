import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "native-base";
import { useRoute } from "@react-navigation/native";

import { getClassCode } from "../../shared/helper";
import { type ClassInfo } from "../../shared/types";

export default function ClassDetailScreen() {
  const route = useRoute();
  const classInfo = route.params as ClassInfo;

  return (
    <ScrollView>
      <SafeAreaView edges={["left", "right"]}>
        <Text variant={"h1"}>{"Mobile Application Development"}</Text>
        <Text variant={"h2"}>
          {"Tandon School of Engineering"} | {"Integrated Digital Media"}
        </Text>
        {!!classInfo.description && (
          <Text fontSize={"md"} margin={"10px"}>
            {classInfo.description}
          </Text>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}