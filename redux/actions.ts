import { type Dispatch } from "redux";
import { SchoolNameRecord, DepartmentNameRecord } from "../shared/types";
import { SchoolNameAction, DepartmentNameAction } from "./types";

export const updateSchoolNameRecord =
  (dispath: Dispatch<SchoolNameAction>) =>
  (schoolNameRecord: SchoolNameRecord) => {
    dispath({ type: "update-school-name-record", payload: schoolNameRecord });
  };

export const updateDepartmentNameRecord =
  (dispath: Dispatch<DepartmentNameAction>) =>
  (schoolNameRecord: DepartmentNameRecord) => {
    dispath({ type: "update-school-name-record", payload: schoolNameRecord });
  };
