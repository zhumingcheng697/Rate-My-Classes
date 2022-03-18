import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, Button } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type ExploreNavigationParamList } from "../../shared/types";
import Grid from "../../components/Grid";

type ExploreSchoolScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-School"
>;

type ExploreSchoolScreenRouteProp = RouteProp<
  ExploreNavigationParamList,
  "Explore-School"
>;

export default function ExploreSchoolScreen() {
  const navigation = useNavigation<ExploreSchoolScreenNavigationProp>();
  const route = useRoute<ExploreSchoolScreenRouteProp>();

  return (
    <ScrollView>
      <SafeAreaView edges={["left", "right"]}>
        <Text variant={"h1"}>{route.params.schoolCode}</Text>

        <Grid minChildrenWidth={140} childrenHeight={"90px"}>
          {["Integrated Digital Media", "Computer Science", "Math"].map(
            (department, index) => (
              <Button
                key={index}
                borderRadius={12}
                onPress={() => {
                  navigation.navigate("Explore-Department", {
                    schoolCode: route.params.schoolCode,
                    departmentCode: "DM",
                  });
                }}
              >
                {department}
              </Button>
            )
          )}
        </Grid>
      </SafeAreaView>
    </ScrollView>
  );
}
