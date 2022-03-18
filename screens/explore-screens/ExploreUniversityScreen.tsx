import { useMemo } from "react";
import { Text, Button, Pressable, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import { type ExploreNavigationParamList } from "../../shared/types";
import {
  isSchoolGrad,
  isObjectEmpty,
  getSchoolNameByCode,
} from "../../shared/utils";
import SafeAreaScrollView from "../../containers/SafeAreaScrollView";
import Grid from "../../containers/Grid";

type ExploreUniversityScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-University"
>;

export default function ExploreUniversityScreen() {
  const navigation = useNavigation<ExploreUniversityScreenNavigationProp>();
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const isSchoolNameLoaded = !!schoolNames && !isObjectEmpty(schoolNames);
  const isDepartmentNameLoaded =
    !!departmentNames && !isObjectEmpty(departmentNames);

  const [undergradCodes, gradCodes] = useMemo(() => {
    if (!isSchoolNameLoaded || !isDepartmentNameLoaded) return [[], []];

    const undergradCodes: string[] = [];
    const gradCodes: string[] = [];

    for (let code in schoolNames) {
      const departments = departmentNames[code];
      if (departments && !isObjectEmpty(departments)) {
        if (isSchoolGrad(code)) {
          gradCodes.push(code);
        } else {
          undergradCodes.push(code);
        }
      }
    }

    return [undergradCodes, gradCodes];
  }, [schoolNames, departmentNames]);

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>Undergraduate</Text>
      <Grid
        isLoaded={isSchoolNameLoaded && isDepartmentNameLoaded}
        minChildrenWidth={140}
        childrenHeight={"90px"}
      >
        {undergradCodes.map((code, index) => (
          <Pressable
            key={index}
            background={"background.secondary"}
            borderRadius={12}
            onPress={() => {
              navigation.navigate("Explore-School", {
                schoolCode: code,
              });
            }}
          >
            <VStack
              height={"100%"}
              justifyContent={"center"}
              marginX={2}
              textAlign={"center"}
            >
              <Text
                fontSize={"md"}
                fontWeight={"medium"}
                lineHeight={"sm"}
                textAlign={"center"}
                numberOfLines={2}
              >
                {getSchoolNameByCode(code, schoolNames)}
              </Text>
              <Text textAlign={"center"}>{code.toUpperCase()}</Text>
            </VStack>
          </Pressable>
        ))}
      </Grid>

      <Text variant={"h1"} marginTop={"16px"}>
        Graduate
      </Text>
      <Grid
        isLoaded={!!schoolNames && !!Object.keys(schoolNames).length}
        minChildrenWidth={140}
        childrenHeight={"90px"}
      >
        {gradCodes.map((code, index) => (
          <Button
            key={index}
            borderRadius={12}
            onPress={() => {
              navigation.navigate("Explore-School", {
                schoolCode: code,
              });
            }}
          >
            {(schoolNames || {})[code]}
          </Button>
        ))}
      </Grid>
    </SafeAreaScrollView>
  );
}
