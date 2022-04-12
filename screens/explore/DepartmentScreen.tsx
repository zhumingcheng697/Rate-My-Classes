import React, { useEffect, useState } from "react";
import { Text, Box } from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import {
  type ClassInfo,
  type SharedNavigationParamList,
  type ExploreNavigationParamList,
  ErrorType,
} from "../../libs/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import {
  getSchoolName,
  getDepartmentName,
  getFullDepartmentCode,
} from "../../libs/utils";
import Semester from "../../libs/semester";
import { getClasses } from "../../libs/schedge";
import AlertPopup from "../../components/AlertPopup";
import ClassesGrid from "../../components/ClassesGrid";

type DepartmentScreenNavigationProp =
  StackNavigationProp<SharedNavigationParamList>;

type DepartmentScreenRouteProp = RouteProp<
  ExploreNavigationParamList,
  "Department"
>;

export default function DepartmentScreen() {
  const navigation = useNavigation<DepartmentScreenNavigationProp>();
  const route = useRoute<DepartmentScreenRouteProp>();
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const settings = useSelector((state) => state.settings);
  const selectedSemester = new Semester(settings.selectedSemester);
  const isFocused = useIsFocused();

  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);

  const noDataErrorMessage = () => {
    const diff = Semester.between(
      Semester.predictCurrentSemester(),
      selectedSemester
    );

    return `The ${getFullDepartmentCode(route.params)} department ${
      diff > 0
        ? "did not offer"
        : diff < 0
        ? "will not be offering"
        : "is not offering"
    } any classes in ${selectedSemester.toString()}.`;
  };

  useEffect(() => {
    getClasses(route.params, selectedSemester)
      .then((classes) => {
        if (classes && classes.length) {
          setClasses(classes);
        } else {
          setShowAlert(true);
          setError(ErrorType.noData);
        }
      })
      .catch((e) => {
        console.error(e);
        setShowAlert(true);
        setError(ErrorType.network);
      });
  }, [route.params, settings.selectedSemester]);

  return (
    <>
      <AlertPopup
        header={error === ErrorType.noData ? "No Classes Offered" : undefined}
        body={error === ErrorType.noData ? noDataErrorMessage() : undefined}
        isOpen={showAlert && isFocused}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"}>
            {getDepartmentName(route.params, departmentNames)}
          </Text>
          <Text variant={"h2"}>{getSchoolName(route.params, schoolNames)}</Text>
          <ClassesGrid
            isLoaded={!!classes.length && !error}
            classes={classes}
            navigation={navigation}
          />
        </Box>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
