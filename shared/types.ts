import Semester from "./semester";

export type SchoolNameRecord = Record<string, string>;

export type DepartmentNameRecord = Record<string, Record<string, string>>;

export type StarredClassRecord = Record<string, ClassInfo>;

export type SchoolInfo = {
  schoolCode: string;
};

export type DepartmentInfo = SchoolInfo & {
  departmentCode: string;
};

export type ClassCode = DepartmentInfo & {
  classNumber: string;
};

export type ClassInfo = ClassCode & {
  name: string;
  description?: string;
};

export enum ErrorType {
  loadFailed = "LOAD_FAILED",
  noData = "NO_DATA",
}

export type Settings = {
  selectedSemester: Semester;
  showPreviousSemesters: boolean;
};

export type ExploreNavigationParamList = {
  University: undefined;
  School: SchoolInfo;
  Department: DepartmentInfo;
  Detail: ClassInfo;
  Review: ClassInfo;
};

export type SearchNavigationParamList = {
  Search: undefined;
  Detail: ClassInfo;
  Review: ClassInfo;
};

export type MeNavigationParamList = {
  Account: undefined;
  Starred: undefined;
  Reviewed: undefined;
  Settings: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Detail: ClassInfo;
  Review: ClassInfo;
};
export type RootNavigationParamList = {
  "Explore-Tab": undefined;
  "Search-Tab": undefined;
  "Me-Tab": undefined;
};
