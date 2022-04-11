import { type User } from "realm";

import { type UserDoc, Collections } from "./types";
import { Settings } from "../libs/types";

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
      starredClasses: [],
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

    const userDoc = await db
      .collection<UserDoc>(Collections.users)
      .findOne({ _id: user.id });

    return userDoc;
  }

  async function updateSettings({
    selectedSemester,
    showPreviousSemesters,
  }: Settings) {
    if (!isAuthenticated) return;

    await db.collection<UserDoc>(Collections.users).updateOne(
      { _id: user.id },
      {
        settings: {
          selectedSemester: {
            semester: selectedSemester.semesterCode,
            year: selectedSemester.year,
          },
          showPreviousSemesters,
        },
      }
    );
  }

  return { createUserDoc, loadUserDoc, updateSettings };
}