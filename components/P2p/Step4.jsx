import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { CheckGreen } from "../Icons/CheckGreen";
import { Logo } from "../Icons/Logo";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useUserContext } from "../../contexts/User";

export const Step4 = () => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const title = useColorModeValue("title.light", "title.dark");

  const router = useRouter();
  const { address } = useAccount();
  const userContext = useUserContext();

  const handleContinue = () => {
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_TRADER",
      payload: undefined,
    });
    router.push({
      pathname: `/`,
    });
  };

  return (
    <>
      <Box w="full" mt="84px">
        <Flex>
          <Box m="auto" mt="100px">
            <Flex justify="center">
              <CheckGreen width="100px" height="100px" />
            </Flex>
            <Flex mt="30px">
              <Text m="auto" fontSize="14px" fontWeight="bold" color={title}>
                Swap offer submitted to
              </Text>
            </Flex>
            <Flex
              border={`2px solid`}
              borderColor={"grayer"}
              bg={bg}
              px="12px"
              py="16px"
              mt="12px"
              borderRadius="8px"
            >
              <Avatar
                name={
                  userContext?.selectedActionsState?.p2p_trader
                    ? userContext?.selectedActionsState?.p2p_trader.name
                    : ""
                }
              />
              <Box flex="1" ml="12px" w="5%" alignSelf="center">
                <Text
                  fontWeight="bold"
                  fontSize="16px"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userContext?.selectedActionsState?.p2p_trader
                    ? userContext?.selectedActionsState?.p2p_trader.name
                    : ""}
                </Text>
                <Text
                  fontSize="14px"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userContext?.selectedActionsState?.p2p_trader
                    ? userContext?.selectedActionsState?.p2p_trader.address
                    : ""}
                </Text>
              </Box>
            </Flex>
            <Flex mt="30px">
              <Text m="auto" textAlign="center" fontSize="12px" color={title}>
                As we are in beta, we are working on getting notifications set
                up.
                <br />
                Until then, please use the P2P dashboard to check if your offer
                has been accepted.
              </Text>
            </Flex>
            <Flex>
              <Box
                m="auto"
                mt="24px"
                bg={1 === -2 ? "grayer" : "secondary"}
                _hover={{ color: "primary" }}
                color={"primary"}
                cursor="pointer"
                textAlign="center"
                w="336px"
                py="14px"
                borderRadius="4px"
                fontSize="14px"
                fontWeight="bold"
                onClick={handleContinue}
              >
                GO TO P2P DASHBOARD
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Box display={"flex"} justifyContent={"center"} mt='100px'>
          <Logo />
          <Text fontSize="12px" fontWeight="400" px="10px" py="15px">
            Copyright NF3 2023, All rights reserved
          </Text>
        </Box>
      </Box>
    </>
  );
};
