import Realm, { type User } from "realm";

import { type UserDoc, type ClassDoc, Collections } from "./types";
import type {
  ClassCode,
  StarredClassInfo,
  Review,
  Settings,
} from "../libs/types";
import { getFullClassCode } from "../libs/utils";

const servieName = "mongodb-atlas";
const dbName = "RateMyClassesPro";

export function useDB(user: User) {
  const db = user.mongoClient(servieName).db(dbName);

  const isAuthenticated = user.providerType !== "anon-user";

  async function createUserDoc(
    username: string,
    { selectedSemester, showPreviousSemesters }: Settings
  ) {
    if (!isAuthenticated) return;

    await db.collection<UserDoc>(Collections.users).insertOne({
      _id: user.id,
      username,
      starredClasses: {},
      reviewedClasses: {},
      settings: {
        selectedSemester: {
          semester: selectedSemester.semesterCode,
          year: selectedSemester.year,
        },
        showPreviousSemesters,
      },
    });
  }

  async function loadUserDoc() {
    if (!isAuthenticated) return;

    return await db
      .collection<UserDoc>(Collections.users)
      .findOne({ _id: user.id });
  }

  async function updateUserDoc(update: Realm.Services.MongoDB.Update) {
    if (!isAuthenticated) return;

    await db
      .collection<UserDoc>(Collections.users)
      .updateOne({ _id: user.id }, update);
  }

  async function updateUsername(username: string) {
    await updateUserDoc({ $set: { username } });
  }

  async function updateSettings({
    selectedSemester,
    showPreviousSemesters,
  }: Settings) {
    await updateUserDoc({
      $set: {
        settings: {
          selectedSemester: {
            semester: selectedSemester.semesterCode,
            year: selectedSemester.year,
          },
          showPreviousSemesters,
        },
      },
    });
  }

  async function starClass(starredClass: StarredClassInfo) {
    await updateUserDoc({
      $set: {
        [`starredClasses.${getFullClassCode(starredClass)}`]: starredClass,
      },
    });
  }

  async function unstarClass(classCode: ClassCode) {
    await updateUserDoc({
      $unset: {
        [`starredClasses.${getFullClassCode(classCode)}`]: null,
      },
    });
  }

  async function updateClassDoc(
    classCode: ClassCode,
    update: Realm.Services.MongoDB.Update,
    options?: Realm.Services.MongoDB.FindOneAndModifyOptions
  ) {
    return await db
      .collection<ClassDoc>(Collections.classes)
      .findOneAndUpdate({ _id: getFullClassCode(classCode) }, update, options);
  }

  async function upsertReview(classCode: ClassCode, review: Review) {
    return await updateClassDoc(
      classCode,
      {
        $set: {
          [`reviews.${[user.id]}`]: review,
        },
      },
      {
        upsert: true,
        returnNewDocument: true,
      }
    );
  }

  async function upvoteReview(classCode: ClassCode, review: Review) {
    await updateClassDoc(classCode, {
      $inc: {
        [`reviews.${[review.userId]}.upvotes`]: 1,
      },
    });
  }

  async function downvoteReview(classCode: ClassCode, review: Review) {
    await updateClassDoc(classCode, {
      $inc: {
        [`reviews.${[review.userId]}.downvotes`]: -1,
      },
    });
  }

  async function deleteReview(classCode: ClassCode) {
    return await updateClassDoc(classCode, {
      $unset: {
        [`reviews.${[user.id]}`]: null,
      },
    });
  }

  return {
    createUserDoc,
    loadUserDoc,
    updateUsername,
    updateSettings,
    starClass,
    unstarClass,
    upsertReview,
    upvoteReview,
    downvoteReview,
    deleteReview,
  };
}
