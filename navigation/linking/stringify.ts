import { ParamListBase } from "@react-navigation/native";

import type {
  RootNavigationParamList,
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
  ClassInfo,
  StarredOrReviewed,
} from "../../libs/types";

type StackNavigationParamList =
  | ExploreNavigationParamList
  | SearchNavigationParamList
  | MeNavigationParamList;

type RouteToPathMap<ParamList extends ParamListBase> = {
  [Screen in keyof ParamList]: (param: ParamList[Screen]) => string;
};

const getPathForClass = (classInfo: ClassInfo) =>
  `${encodeURIComponent(classInfo.schoolCode)}/${encodeURIComponent(
    classInfo.departmentCode
  )}/${encodeURIComponent(classInfo.classNumber)}`;

const addQueryParam = (query: string | undefined) =>
  query ? `?query=${encodeURIComponent(query)}` : "";

const checkStarredOrReviewed = (
  starredOrReviewed: StarredOrReviewed | undefined
) => starredOrReviewed?.toLowerCase() || "starred";

function stringifyExploreRoute<Screen extends keyof ExploreNavigationParamList>(
  screen: Screen,
  params: ExploreNavigationParamList[Screen]
) {
  const exploreRouteToPathMap: RouteToPathMap<ExploreNavigationParamList> = {
    University: () => "/explore",
    School: ({ schoolCode }) => `/explore/${schoolCode}`,
    Department: ({ schoolCode, departmentCode }) =>
      `/explore/${schoolCode}/${departmentCode}`,
    Detail: ({ classInfo }) => `/explore/${getPathForClass(classInfo)}`,
    Review: ({ classInfo }) => `/explore/${getPathForClass(classInfo)}/review`,
    Schedule: ({ classInfo }) =>
      `/explore/${getPathForClass(classInfo)}/schedule`,
    SignInSignUp: ({ classInfo, isSigningUp }) =>
      classInfo
        ? `/explore/${getPathForClass(classInfo)}/${
            isSigningUp ? "sign-up" : "sign-in"
          }`
        : isSigningUp
        ? "sign-up"
        : "sign-in",
  };

  return exploreRouteToPathMap[screen](params);
}

function stringifySearchRoute<Screen extends keyof SearchNavigationParamList>(
  screen: Screen,
  params: SearchNavigationParamList[Screen]
) {
  const searchRouteToPathMap: RouteToPathMap<SearchNavigationParamList> = {
    Search: ({ query }) => "/search" + addQueryParam(query),
    Detail: ({ classInfo, query }) =>
      `/search/${getPathForClass(classInfo)}` + addQueryParam(query),
    Review: ({ classInfo, query }) =>
      `/search/${getPathForClass(classInfo)}/review` + addQueryParam(query),
    Schedule: ({ classInfo, query }) =>
      `/search/${getPathForClass(classInfo)}/schedule` + addQueryParam(query),
    SignInSignUp: ({ classInfo, isSigningUp, query }) =>
      classInfo
        ? `/search/${getPathForClass(classInfo)}/${
            isSigningUp ? "sign-up" : "sign-in"
          }` + addQueryParam(query)
        : isSigningUp
        ? "sign-up"
        : "sign-in",
  };

  return searchRouteToPathMap[screen](params);
}

function stringifyMeRoute<Screen extends keyof MeNavigationParamList>(
  screen: Screen,
  params: MeNavigationParamList[Screen]
) {
  const meRouteToPathMap: RouteToPathMap<MeNavigationParamList> = {
    Account: () => "/account",
    Starred: () => "/starred",
    Reviewed: () => "/reviewed",
    Settings: () => "/settings",
    Detail: ({ classInfo, starredOrReviewed }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classInfo
      )}`,
    Review: ({ classInfo, starredOrReviewed }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classInfo
      )}/review`,
    Schedule: ({ classInfo, starredOrReviewed }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classInfo
      )}/schedule`,
    SignInSignUp: ({ classInfo, isSigningUp, starredOrReviewed }) =>
      classInfo
        ? `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
            classInfo
          )}/${isSigningUp ? "sign-up" : "sign-in"}`
        : isSigningUp
        ? "sign-up"
        : "sign-in",
  };

  return meRouteToPathMap[screen](params);
}

export default function stringnify<
  Tab extends keyof RootNavigationParamList,
  Screen extends keyof StackNavigationParamList,
  Params extends StackNavigationParamList[Screen]
>(tab: Tab, screen: Screen, params: Params) {
  const rootRouteToPathMap: {
    [T in keyof RootNavigationParamList]: (
      screen: keyof (T extends "ExploreTab"
        ? ExploreNavigationParamList
        : T extends "SearchTab"
        ? SearchNavigationParamList
        : MeNavigationParamList),
      params: StackNavigationParamList[keyof StackNavigationParamList]
    ) => string;
  } = {
    ExploreTab: stringifyExploreRoute,
    SearchTab: stringifySearchRoute,
    MeTab: stringifyMeRoute,
  };

  return rootRouteToPathMap[tab](screen, params);
}
