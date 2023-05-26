import { 
  Box, 
  Grid, 
  GridItem, 
  Avatar, 
  Flex, 
  Text 
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { Step2Me } from "./Step2Me";
import { useUserContext } from "../../contexts/User";
import { useAccount } from "wagmi";

const steps = [
  { label: "1", description: "Find A User" },
  { label: "2", description: "I'm Looking For" },
  { label: "3", description: "I'm Offering" },
  { label: "4", description: "Preview And Submit" },
];

export const Progress = ({ callback }) => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");

  const [tab, setTab] = useState(0);
  const { address } = useAccount();
  const userContext = useUserContext();

  useEffect(() => {
    if (address === undefined) {
      userContext?.dispatchSelectedActions({
        type: "RESET",
      });

      callback();
    } else {
      if (address !== userContext?.selectedActionsState?.p2p_me?.address) {
        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_ME",
          payload: {
            ...userContext?.selectedActionsState?.p2p_me,
            ["address"]: address,
          },
        });

        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_MY_NFT",
          payload: [],
        });
        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_MY_FT",
          payload: [],
        });
      } else if (
        address !== userContext?.selectedActionsState?.p2p_trader?.address
      ) {
        setTab(0);
        userContext?.dispatchSelectedActions({
          type: "RESET",
        });
      }
    }
  }, [address]);

  const handleStep = (index, isEdit = false) => {
    if (index === -1) {
      userContext?.dispatchSelectedActions({
        type: "RESET",
      });

      callback();
    } else {
      setTab(index);
    }
  };

  return (
    <>
      <Box w="full" mt="24px">
        <Box display={"flex"} flexDirection="column">
          <Text
            textAlign={"center"}
            mt='15px'
            mb="65px"
            fontWeight="700"
            fontStyle={"normal"}
            fontSize={"30px"}
            lineHeight={"100%"}
          >
            SECURELY SWAP YOUR PIXELMON NFT(S) PEER TO PEER WITH 0% FEES
          </Text>
          <Grid mx="35vh" templateColumns="repeat(3, 1fr)">
            {new Array(3).fill(0).map((item, index) => {
              return (
                <GridItem
                  key={index}
                  h="2px"
                  position="relative"
                  col={4}
                >
                  <Box
                    position="absolute"
                    top="-25px"
                    left="-90px"
                    textAlign="center"
                  >
                    <Flex
                      display="inline-block"
                      // borderRadius='full'
                      bg={tab === index ? "secondary" : tab > index ? "grayer" : "primary"}
                      border={`2px solid`}
                      borderColor={tab !== index ? tab > index ? "rgba(255, 255, 255, 0.01)" : "grayer" : "bluer"}
                      sx={{ transform: "rotateZ(45deg)" }}
                      borderRadius={"5px"}
                    >
                      <Avatar
                        m="auto"
                        name={steps[index].label}
                        bg={tab === index ? "secondary" : ""}
                        border="none"
                        color={tab === index ? "primary" : tab > index ? "secondary" : "grayer"}
                        sx={{ transform: "rotateZ(-45deg)" }}
                      />
                    </Flex>
                    <Box
                      mt="20px"
                      fontSize="16px"
                      px="30px"
                      py="5px"
                      borderRadius="4px"
                      color={
                        tab > index ? "secondary" : tab === index ? "secondary" : "rgba(255, 255, 255, 0.2)"
                      }
                    >
                      {steps[index].description}
                    </Box>
                  </Box>
                  <Box bg={"grayer"} pos={"absolute"} left="18%" h="1px" top="20px" w="60%" />
                  {index === 2 && (
                    <Box
                      key={4}
                      position="absolute"
                      top="-25px"
                      right="-108px"
                      textAlign="center"
                    >
                      <Flex
                        display="inline-block"
                        // borderRadius='full'
                        bg={tab >= index + 1 ? "secondary" : "primary"}
                        border={`2px solid`}
                        borderColor={tab <= index + 1 ? bg : "bluer"}
                        sx={{ transform: "rotateZ(45deg)" }}
                        borderRadius={"5px"}
                      >
                        <Avatar
                          m="auto"
                          name={steps[index + 1].label}
                          bg={tab >= index + 1 ? "secondary" : ""}
                          border="none"
                          color={tab >= index + 1 ? "primary" : "grayer"}
                          sx={{ transform: "rotateZ(-45deg)" }}
                        />
                      </Flex>
                      <Box
                        mt="20px"
                        fontSize="16px"
                        px="30px"
                        py="5px"
                        borderRadius="4px"
                        // bg={tab <= index + 1 ? "transparent" : "bluer"}
                        color={
                          tab > index + 1
                            ? "secondary"
                            : tab === index + 1
                            ? "secondary"
                            : "rgba(255, 255, 255, 0.2)"
                        }
                      >
                        {steps[index + 1].description}
                      </Box>
                    </Box>
                  )}
                </GridItem>
              );
            })}
          </Grid>
        </Box>
        {tab === 0 ? (
          <Step1 callback={handleStep} />
        ) : tab === 2 ? (
          <Step2Me callback={handleStep} />
        ) : tab === 1 ? (
          <Step2 callback={handleStep} />
        ) : tab === 3 ? (
          <Step3 callback={handleStep} />
        ) : tab === 4 ? (
          <Step4 callback={handleStep} />
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};
