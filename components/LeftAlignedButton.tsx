import {
  Flex,
  Spacer,
  Icon,
  Button,
  type IButtonProps,
  Text,
  type ITextProps,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

type LeftAlignedButtonProps = {
  title: string;
  _text?: ITextProps;
  showChevron?: boolean;
};

export default function LeftAlignedButton({
  title,
  _text,
  showChevron = true,
  ...rest
}: LeftAlignedButtonProps & Omit<IButtonProps, keyof LeftAlignedButtonProps>) {
  return (
    <Button {...rest} variant={"subtle"}>
      <Flex
        justifyContent={"space-evenly"}
        flexDirection={"row"}
        alignItems={"center"}
        alignContent={"center"}
        width={"100%"}
      >
        <Text {..._text} variant={"subtleButton"}>
          {title}
        </Text>
        <Spacer />
        {showChevron && (
          <Icon
            marginRight={"-5px"}
            size={"5"}
            as={<Ionicons name={"chevron-forward"} />}
          />
        )}
      </Flex>
    </Button>
  );
}