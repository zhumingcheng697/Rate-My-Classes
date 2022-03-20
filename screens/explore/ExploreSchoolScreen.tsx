import { useMemo } from "react";
import { Text } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type {
  ExploreNavigationParamList,
  DepartmentInfo,
} from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import TieredTextButton from "../../components/TieredTextButton";
import {
  getSchoolName,
  getDepartmentName,
  isObjectEmpty,
} from "../../shared/utils";

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
  const { schoolCode } = route.params;
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const isLoaded = !!departmentNames && !isObjectEmpty(departmentNames);

  const departments = useMemo(() => {
    if (!isLoaded) return [];

    return Object.keys(departmentNames[schoolCode] ?? {}).sort();
  }, [departmentNames]);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Text variant={"h1"}>{getSchoolName(route.params, schoolNames)}</Text>
      <Grid isLoaded={isLoaded} minChildrenWidth={140} childrenHeight={"90px"}>
        {(info) =>
          departments.map((departmentCode, index) => {
            const departmentInfo: DepartmentInfo = {
              ...route.params,
              departmentCode,
            };

            return (
              <TieredTextButton
                key={index}
                {...info}
                primaryText={getDepartmentName(departmentInfo, departmentNames)}
                secondaryText={`${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()}`}
                onPress={() => {
                  navigation.navigate("Explore-Department", departmentInfo);
                }}
              />
            );
          })
        }
      </Grid>
    </KeyboardAwareSafeAreaScrollView>
  );
}
