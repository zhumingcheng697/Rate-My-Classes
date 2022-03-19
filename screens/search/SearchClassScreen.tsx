import { useState } from "react";
import {
  Input,
  Icon,
  ScrollView,
  Text,
  VStack,
  Spacer,
  Pressable,
} from "native-base";
import { Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import type { SearchNavigationParamList, ClassCode } from "../../shared/types";
import { getClassCode } from "../../shared/utils";
import Grid from "../../containers/Grid";
import SearchBar from "../../components/SearchBar";
import TieredTextButton from "../../components/TieredTextButton";
import { SafeAreaView } from "react-native-safe-area-context";

type SearchClassScreenNavigationProp = StackNavigationProp<
  SearchNavigationParamList,
  "Search-Class"
>;

export default function SearchClassScreen() {
  const navigation = useNavigation<SearchClassScreenNavigationProp>();
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView edges={["left", "right"]}>
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <VStack height={"100%"}>
          <SearchBar margin={"10px"} value={query} onChangeText={setQuery} />
          {query ? (
            <ScrollView>
              <Grid minChildrenWidth={140} childrenHeight={"90px"}>
                {["2193", "3193", "4193"].map((classNumber, index) => {
                  const classCode: ClassCode = {
                    schoolCode: "UY",
                    departmentCode: "DM",
                    classNumber,
                  };

                  return (
                    <TieredTextButton
                      key={index}
                      primaryText={"Lorem ipsum dolor sit amet"}
                      secondaryText={getClassCode(classCode)}
                      onPress={() => {
                        navigation.navigate("Search-Detail", {
                          ...classCode,
                          name: classNumber,
                          description:
                            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas modi explicabo fuga, eum libero ipsum magnam. Dolores, vel vero nobis doloribus voluptatibus soluta ratione adipisci repellat voluptatem libero ipsam rerum.",
                        });
                      }}
                    />
                  );
                })}
              </Grid>
            </ScrollView>
          ) : (
            <>
              <Spacer key={"spacer-top"} />
              <Text key={"text-center"} textAlign={"center"}>
                Search Classes by Title or Description
              </Text>
              <Spacer key={"spacer-down"} />
            </>
          )}
        </VStack>
      </Pressable>
    </SafeAreaView>
  );
}
