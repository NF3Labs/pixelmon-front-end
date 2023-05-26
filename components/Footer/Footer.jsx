import {
  Box,
  Flex,
  Image,
  Stack,
  Spacer,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { Search } from "../Icons/Search";
import { Plus } from "../Icons/Plus";
import { useRouter } from "next/router";
import { Logo } from "../Icons/Logo";
import { Discord } from "../Icons/Discord";
import { Mail } from "../Icons/Mail";
import { Twitter } from "../Icons/Twitter";

export const Footer = () => {
  const router = useRouter();
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const header = useColorModeValue("header.light", "header.dark");

  return (
    <Flex
      bg={bg}
      bottom="0"
      right="0"
      w="full"
      py="20px"
      px="40px"
      borderTop={`1px solid ${header}`}
      alignItems="center"
    >
      <Logo />
      <Text ml="28px" fontSize="12px" fontWeight="bold">
        Copyright NF3 2023, All rights reserved
      </Text>
      <Spacer />
      <Text fontSize="12px">Audited by:&nbsp;</Text>
      <Link
        href="https://skynet.certik.com/projects/nf3x"
        target="_blank"
        mr="32px"
        display="flex"
      >
        <Text color="bluer" as="u" fontSize="12px">
          Certik
        </Text>
      </Link>
      <Link href="https://discord.gg/CzvRf6Gkqs" target="_blank" mr="21px">
        <Discord />
      </Link>
      <Link href="https://twitter.com/nf3exchange" target="_blank" mr="21px">
        <Twitter />
      </Link>
      <Link href="mailto:hello@nf3x.io" target="_blank">
        <Mail />
      </Link>
    </Flex>
  );
};
