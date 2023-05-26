import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Avatar,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getBeautifulAddress } from "../../utils/formatters";
import { Search } from "../Icons/Search";
import { Logo } from "../Icons/Logo";
import { useUserContext } from "../../contexts/User";
import { useAccount, useNetwork, useSwitchNetwork, useDisconnect } from "wagmi";
import { useDebounce } from "use-hooks";
import { useRouter } from "next/router";
import axios from "axios";

export const Step1 = ({ callback }) => {
  const userContext = useUserContext();

  const { chain } = useNetwork();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const { chains } = useSwitchNetwork();

  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const header = useColorModeValue("header.light", "header.dark");
  const title = useColorModeValue("title.light", "title.dark");
  const titleHover = useColorModeValue("titleHover.light", "titleHover.dark");
  const input = useColorModeValue("input.light", "input.dark");
  const h = useColorModeValue("placeholder.light", "placeholder.dark");

  const { address } = useAccount();

  const [selectHistory, setSelectHistory] = useState(-1);
  const [selectResult, setSelectResult] = useState(-1);

  const [history, setHistory] = useState([]);
  const [result, setResult] = useState([]);
  const [value, setValue] = useState("");

  const debounceValue = useDebounce(value, 500);

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (debounceValue !== "") {
      getSearchList(debounceValue);
    } else {
      setResult([]);
      setSelectResult(-1);
    }
  }, [debounceValue]);

  const getList = async () => {
    try {
      if (address === undefined) return;

      const response = await axios.get('/api/get/getP2PTraders', {
        params: {
          address: address,
        }
      });

      const returnedData = response.data.data;
      let cleanedData = [];

      returnedData?.forEach((i) => {
        cleanedData.push({
          address: i.address,
          name: i.name,
          image: i.image,
        });
      });

      setHistory(cleanedData);
    } catch (error) {
      if (
        error?.response?.status === 401 &&
        window.localStorage.getItem("CSRF")
      ) {
        router.push("/");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");
      }
    }
  };

  const getSearchList = async (key) => {
    try {
      if (address === undefined) return;
      
      const response = await axios.get('/api/get/getSearchAdd', {
        params: {
          key: key,
        }
      }); 

      const returnedData = response.data.data;
      let cleanedData = [];

      returnedData?.forEach((i) => {
        if (address !== i.address) {
          cleanedData.push({
            address: i.address,
            name: i.name,
            image: i.image,
          });
        }
      });

      setResult(cleanedData);
      setSelectResult(-1);
      setSelectHistory(-1);
    } catch (error) {
      if (
        error?.response?.status === 401 &&
        window.localStorage.getItem("CSRF")
      ) {
        router.push("/");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");
      }
    }
  };

  const handleOwner = (index, type) => {
    let temp = {};
    if (type === 2) {
      temp = result[index];
      setSelectResult(index);
      setSelectHistory(-1);
    } else {
      temp = history[index];
      setSelectHistory(index);
      setSelectResult(-1);
    }
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_TRADER",
      payload: {
        name: temp.name,
        address: temp.address,
        image: temp.image,
        isEth: chains.findIndex((i) => i.id === chain.id),
      },
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_ME",
      payload: {
        name: "You",
        address: address,
        isEth: 0,
      },
    });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleContinue = () => {
    if (selectHistory !== -1 || selectResult !== -1) {
      callback(1);
    }
  };

  const handleBack = () => {
    callback(-1);
  };

  return (
    <>
      <Box w="full" mt="84px">
        <Grid mx="20vh" mt="110px" templateColumns="repeat(7, 1fr)">
          <GridItem colSpan={2}>
            <Box
              border={`2px solid`}
              borderColor={"grayer"}
              bg={bg}
              borderRadius="8px"
              px="12px"
              py="16px"
            >
              <Text fontSize="14px" color={title} fontWeight="bold">
                {`Recent Contacts`}
              </Text>
              <Box
                mt="12px"
                h="300px"
                overflowY="auto"
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "3px",
                    borderRadius: "2px",
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: input,
                    borderRadius: "2px",
                  },
                }}
              >
                {history.map((item, index) => {
                  return (
                    <Flex
                      cursor="pointer"
                      key={index}
                      mt={index > 0 ? "12px" : ""}
                      border={`2px solid`}
                      borderColor={selectHistory === index ? "secondary" : bg}
                      px="12px"
                      py="16px"
                      borderRadius="8px"
                      onClick={() => {
                        handleOwner(index, 1);
                      }}
                    >
                      <Avatar name={item.name} src={item.image} />
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
                          {item.name}
                        </Text>
                        <Text
                          fontSize="14px"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getBeautifulAddress(item.address)}
                        </Text>
                      </Box>
                      <Flex>
                        {selectHistory === index ? (
                          <Flex
                            m="auto"
                            borderRadius="4px"
                            bg={"secondary"}
                            w="36px"
                            h="36px"
                          >
                            <CheckIcon m="auto" color={"primary"} />
                          </Flex>
                        ) : (
                          <Box
                            m="auto"
                            borderRadius="4px"
                            bg={"grayer"}
                            w="36px"
                            h="36px"
                          ></Box>
                        )}
                      </Flex>
                    </Flex>
                  );
                })}
              </Box>
              <Box
                mt="12px"
                bg={
                  selectResult === -1 && selectHistory === -1
                    ? "grayer"
                    : "secondary"
                }
                _hover={{ color: "primary" }}
                color={
                  selectResult === -1 && selectHistory === -1
                    ? "primary"
                    : "primary"
                }
                cursor={
                  selectResult === -1 && selectHistory === -1
                    ? "not-allowed"
                    : "pointer"
                }
                textAlign="center"
                w="full"
                py="14px"
                borderRadius="4px"
                fontSize="14px"
                fontWeight="bold"
                onClick={handleContinue}
              >
                CONTINUE
              </Box>
            </Box>
            <Flex>
              <Text
                as="u"
                fontSize="14px"
                cursor="pointer"
                color={"secondary"}
                _hover={{ color: titleHover }}
                m="auto"
                mt="20px"
                onClick={handleBack}
              >
                Back
              </Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={5}>
            <Box px="40px" py="16px">
              <Text fontSize="14px" fontWeight="bold">
                Who do you want to swap with?
              </Text>
              <Text fontSize="12px" color={h} mt="5px">
                {`Enter the wallet address of the person you wish to swap with.`}
              </Text>
              <InputGroup mt="10px">
                <InputLeftElement color={title} pl="1.5" pointerEvents="none">
                  <Search />
                </InputLeftElement>
                <Input
                  type="text"
                  color={input}
                  bg={bg}
                  fontSize="14px"
                  border="none"
                  placeholder="Search Username or Wallet Address"
                  _focus={{ boxShadow: "none", border: "none" }}
                  _placeholder={{ color: h }}
                  onChange={handleChange}
                  value={value}
                />
              </InputGroup>
              <Text fontSize="12px" mb="12px" color={h} mt="30px">
                Is this the user you’re looking for?
              </Text>
              <Box
                h="260px"
                overflowY="auto"
                overflowX="hidden"
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "3px",
                    borderRadius: "2px",
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: input,
                    borderRadius: "2px",
                  },
                }}
              >
                {1 !== 1 ? (
                  <Flex mt="100px" justify="center">
                    <Box textAlign={"center"}>
                      The address does not hold any NFTs
                    </Box>
                  </Flex>
                ) : (
                  result.map((item, index) => {
                    return (
                      <Flex
                        cursor="pointer"
                        key={index}
                        mt={index === 0 ? "" : "12px"}
                        border={`2px solid`}
                        borderColor={selectResult === index ? "secondary" : bg}
                        px="12px"
                        py="16px"
                        borderRadius="8px"
                        onClick={() => {
                          handleOwner(index, 2);
                        }}
                      >
                        <Avatar name={item.name} src={item.image} />
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
                            {item.name}
                          </Text>
                          <Text
                            fontSize="14px"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.address}
                          </Text>
                        </Box>
                        <Flex>
                          {selectResult === index ? (
                            <Flex
                              m="auto"
                              borderRadius="4px"
                              bg={"secondary"}
                              w="36px"
                              h="36px"
                            >
                              <CheckIcon m="auto" color={"primary"} />
                            </Flex>
                          ) : (
                            <Box
                              m="auto"
                              borderRadius="4px"
                              bg={"grayer"}
                              w="36px"
                              h="36px"
                            ></Box>
                          )}
                        </Flex>
                      </Flex>
                    );
                  })
                )}
              </Box>
            </Box>
          </GridItem>
        </Grid>
        <Box display={"flex"} justifyContent={"center"} mx="50px">
          <Logo />
          <Text fontSize="12px" fontWeight="400" px="10px" py="15px">
            Copyright NF3 2023, All rights reserved
          </Text>
        </Box>
      </Box>
    </>
  );
};
