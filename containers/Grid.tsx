import { type ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import {
  Flex,
  type IFlexProps,
  Skeleton,
  type ISkeletonProps,
} from "native-base";

type GridRenderItemInfo = {
  width: string;
  margin: string;
  height: string | number;
};

type GridProps = {
  isLoaded?: boolean;
  skeletonCount?: number;
  skeletonProps?: ISkeletonProps;
  spacing?: number;
  minChildrenWidth: number;
  childrenHeight: number | string;
  children: (info: GridRenderItemInfo) => ReactNode;
};

export default function Grid({
  isLoaded = true,
  skeletonCount = 12,
  skeletonProps,
  spacing = 5,
  minChildrenWidth: minChildWidth,
  childrenHeight: childHeight,
  children,
  ...rest
}: GridProps & Omit<IFlexProps, keyof GridProps>) {
  skeletonProps = Object.assign({ borderRadius: 10 }, skeletonProps);

  const acutalMargin = Math.max(spacing, 2);
  const actualChildWidth = Math.max(minChildWidth, 60);

  const insets = useSafeAreaInsets();
  const windowWidth = useWindowDimensions().width - insets.left - insets.right;

  const ratio =
    (windowWidth - acutalMargin * 2) / (actualChildWidth + acutalMargin * 2);
  const columns = Math.max(Math.floor(ratio), 1);

  const actualChildren: (info: GridRenderItemInfo) => ReactNode = isLoaded
    ? children
    : (info) =>
        [...Array(skeletonCount)].map((_, index) => (
          <Skeleton key={index} {...info} {...skeletonProps} />
        ));

  return (
    <Flex
      {...rest}
      flexDirection={"row"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      alignContent={"center"}
      flexWrap={"wrap"}
      marginX={acutalMargin + "px"}
    >
      {actualChildren({
        width:
          (windowWidth - acutalMargin * (columns + 1) * 2) / columns + "px",
        height: childHeight,
        margin: acutalMargin + "px",
      })}
    </Flex>
  );
}
