import React, { useState, useMemo, useEffect } from "react";
import { Box, Button, Input, Text, theme, VStack } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import LabeledInput from "../../components/LabeledInput";
import { RatingSelector, SemesterSelector } from "../../components/Selector";
import LeftAlignedButton from "../../components/LeftAlignedButton";
import AlertPopup from "../../components/AlertPopup";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import {
  type SharedNavigationParamList,
  type Rating,
  RatingType,
} from "../../libs/types";
import { getFullClassCode, hasEditedReview } from "../../libs/utils";
import Semester from "../../libs/semester";
import { useAuth } from "../../mongodb/auth";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";

type ReviewScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Review"
>;

type ReviewScreenRouteProp = RouteProp<SharedNavigationParamList, "Review">;

export default function ReviewScreen() {
  const auth = useAuth();
  const navigation = useNavigation<ReviewScreenNavigationProp>();
  const route = useRoute<ReviewScreenRouteProp>();
  const { classInfo, previousReview } = route.params;
  const [hasEdited, setHasEdited] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [enjoyment, setEnjoyment] = useState<Rating | undefined>(
    previousReview?.enjoyment
  );
  const [difficulty, setDifficulty] = useState<Rating | undefined>(
    previousReview?.difficulty
  );
  const [workload, setWorkload] = useState<Rating | undefined>(
    previousReview?.workload
  );
  const [value, setValue] = useState<Rating | undefined>(previousReview?.value);
  const [semester, setSemester] = useState<Semester | undefined>(
    previousReview ? new Semester(previousReview.semester) : undefined
  );
  const [instructor, setInstructor] = useState(
    previousReview?.instructor ?? ""
  );
  const [comment, setComment] = useState(previousReview?.comment ?? "");

  const semesterOptions = useMemo(
    () =>
      previousReview
        ? [new Semester(previousReview.semester)]
        : Semester.getSemesterOptions(true, false, 12).reverse(),
    []
  );

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigation.goBack();
      return;
    }

    if (
      auth.user &&
      enjoyment &&
      difficulty &&
      workload &&
      value &&
      semester &&
      instructor
    ) {
      if (
        hasEdited ||
        hasEditedReview(
          previousReview,
          enjoyment,
          difficulty,
          workload,
          value,
          comment
        )
      ) {
        setHasEdited(true);
        navigation.setParams({
          newReview: {
            userId: auth.user.id,
            enjoyment,
            difficulty,
            workload,
            value,
            upvotes: previousReview?.upvotes ?? { [auth.user.id]: true },
            downvotes: previousReview?.downvotes ?? {},
            reviewedDate: previousReview?.reviewedDate ?? Date.now(),
            semester: semester.toJSON(),
            instructor,
            comment,
          },
        });
      }
    } else if (route.params.newReview) {
      navigation.setParams({ newReview: undefined });
    }
  }, [
    enjoyment,
    difficulty,
    workload,
    value,
    semester,
    instructor,
    comment,
    auth.isAuthenticated,
  ]);

  return (
    <>
      <AlertPopup
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
        }}
        header={"Delete Review"}
        body={
          "You are about to delete your review. This action is not reversable."
        }
        footerPrimaryButton={
          <Button
            {...colorModeResponsiveStyle((selector) => ({
              background: selector({
                light: theme.colors.red[600],
                dark: theme.colors.red[500],
              }),
            }))}
            onPress={() => {
              setShowAlert(false);
              navigation.navigate("Detail", { classInfo, deleteReview: true });
            }}
          >
            Delete
          </Button>
        }
      />
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"}>{classInfo.name}</Text>
          <Text variant={"h2"}>{getFullClassCode(classInfo)}</Text>
          <VStack marginX={"10px"} marginY={"5px"} space={"8px"}>
            <LabeledInput
              label={"Instructor"}
              isDisabled={!!previousReview}
              showRequiredIcon={!previousReview}
            >
              <Input
                value={instructor}
                onChangeText={setInstructor}
                autoCapitalize={"words"}
                isDisabled={!!previousReview}
              />
            </LabeledInput>
            <LabeledInput
              label={"Semester"}
              isDisabled={!!previousReview}
              showRequiredIcon={!previousReview}
            >
              <SemesterSelector
                selectedSemester={semester}
                semesterOptions={semesterOptions}
                onSelectedSemesterChange={setSemester}
                isDisabled={!!previousReview}
              />
            </LabeledInput>
            <LabeledInput
              label={"Enjoyment"}
              showRequiredIcon={!previousReview}
            >
              <RatingSelector
                selectedRating={enjoyment}
                ratingType={RatingType.enjoyment}
                onSelectedRatingChange={setEnjoyment}
              />
            </LabeledInput>
            <LabeledInput
              label={"Difficulty"}
              showRequiredIcon={!previousReview}
            >
              <RatingSelector
                selectedRating={difficulty}
                ratingType={RatingType.difficulty}
                onSelectedRatingChange={setDifficulty}
              />
            </LabeledInput>
            <LabeledInput label={"Workload"} showRequiredIcon={!previousReview}>
              <RatingSelector
                selectedRating={workload}
                ratingType={RatingType.workload}
                onSelectedRatingChange={setWorkload}
              />
            </LabeledInput>
            <LabeledInput label={"Value"} showRequiredIcon={!previousReview}>
              <RatingSelector
                selectedRating={value}
                ratingType={RatingType.value}
                onSelectedRatingChange={setValue}
              />
            </LabeledInput>
            <LabeledInput label={"Comment"}>
              <Input
                placeholder={"Optional"}
                value={comment}
                onChangeText={setComment}
                multiline
                height={"130px"}
              />
            </LabeledInput>
            {previousReview && (
              <LeftAlignedButton
                title={"Delete"}
                showChevron={false}
                marginTop={"15px"}
                _text={colorModeResponsiveStyle((selector) => ({
                  color: selector({
                    light: theme.colors.red[600],
                    dark: theme.colors.red[500],
                  }),
                }))}
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
