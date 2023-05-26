import { Box, Image, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/">
    <Box minW="75px" cursor={"pointer"}>
      <Image
        src={useColorModeValue("/images/logo.png", "/images/logo-dark.png")}
        alt=""
        width="75px"
      />
    </Box>
  </Link>
);
