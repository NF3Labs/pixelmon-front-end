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
  TabList,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { Search } from "../Icons/Search";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NFT } from "./NFT";
import { getBeautifulAddress } from "../../utils/formatters";
import { SelectToken } from "./SelectToken";
import { AddButtons } from "./AddButtons";
import { useUserContext } from "../../contexts/User";
import { Verified } from "../Icons/Verified";
import { Flag } from "../Icons/Flag";
import { Logo } from "../Icons/Logo";
import { POLYGON_CHAIN } from "../../constants/chain";
import { CHAIN } from "../../constants/chain";
import {
  useNetwork,
  useSwitchNetwork,
  useAccount,
  useConnect,
  useDisconnect,
} from "wagmi";
import { NF3Spinner } from "../Spinner/NF3Spinner";
import { errorToast } from "../../pages/_app";
import axios from 'axios';

export const Step2 = ({ callback, trader }) => {
  const userContext = useUserContext();

  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { switchNetworkAsync, chains, status } = useSwitchNetwork({
    onError: (error) => {
      errorToast(
        "Failed to switch networks !",
        "To use NF3 on Polygon, switch the newtork in your wallet's setting"
      );
    },
  });

  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const title = useColorModeValue("title.light", "title.dark");
  const titleHover = useColorModeValue("titleHover.light", "titleHover.dark");
  const input = useColorModeValue("input.light", "input.dark");
  const realBg = useColorModeValue("bg.light", "bg.dark");
  const h = useColorModeValue("placeholder.light", "placeholder.dark");

  const [nftSearch, setNFTSearch] = useState("");
  const [nftSelect, setNFTSelect] = useState(0);
  const [tempTokens, setTempTokens] = useState([]);
  const [tokenHeaders, setTokenHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [tokens, setTokens] = useState([]);

  const getList = async (address, isEth) => {
    try {
      if (address === "") return;

      setIsLoading(true);
      const response = await axios.get('/api/get/getWalletNfts', {
        params: {
          address: address,
        }
      });

      const returnedData = response.data.data;
      let cleanedERCData = [];
      let cleanedHeaderData = [];

      returnedData?.collections.forEach((i) => {
        let tokensTemp = [];
        i.ownerships.forEach((x) => {
          let temp = { nft: x.nft, quantity: x.quantity };
          tokensTemp.push(temp);
        });
        cleanedERCData.push({
          type: i.type,
          nfts: tokensTemp,
          Amount: i.ownerships.length,
          name: i.name,
          total: i.token_count,
          whitelisted: i.is_whitelisted,
        });
        cleanedHeaderData.push({
          name: i.name,
          type: i.type,
        });
      });

      setTokenHeaders(
        [{ name: "Collections(All)", type: "all" }].concat(cleanedHeaderData)
      );
      setTempTokens(cleanedERCData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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

  useEffect(() => {
    if (userContext?.selectedActionsState?.p2p_trader) {
      getList(
        userContext?.selectedActionsState?.p2p_trader.address,
        userContext?.selectedActionsState?.p2p_trader.isEth
      );
    }
  }, [userContext?.selectedActionsState?.p2p_trader.isEth]);

  useEffect(() => {
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_TRADER",
      payload: {
        ...userContext?.selectedActionsState?.p2p_trader,
        ["isEth"]: chains.findIndex((i) => i.id === chain.id),
      },
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_ME",
      payload: {
        ...userContext?.selectedActionsState?.p2p_me,
        ["address"]: address,
        ["isEth"]: chains.findIndex((i) => i.id === chain.id),
      },
    });

    setNFTSelect(0);
    const connectorId = window.localStorage.getItem(
      "nf3marketplace-connector-choice"
    );
    if (!address && connectorId !== "null") {
      const type = connectors.find((i) => i.id === connectorId);
      if (!isConnected) {
        connect({ connector: type });
      }
    }
  }, [chain]);

  useEffect(() => {
    if (tempTokens.length > 0 && tokenHeaders.length > 0) {
      if (nftSelect === 0) {
        let temp = [];
        tempTokens.forEach((i) => {
          let tempList = [];
          tempList =
            nftSearch === ""
              ? i.nfts
              : i.nfts.filter((item) =>
                  item.nft.name.toLowerCase().includes(nftSearch.toLowerCase())
                );
          tempList.forEach((j) => {
            temp.push({ ...j, ["is_whitelisted"]: i.whitelisted });
          });
        });

        setTokens(temp);
      } else {
        tempTokens
          .filter((i) => i.name === tokenHeaders[nftSelect].name)
          .forEach((j) => {
            setTokens(
              nftSearch === ""
                ? j.nfts.map((item) => ({
                    ...item,
                    ["is_whitelisted"]: j.whitelisted,
                  }))
                : j.nfts
                    .filter((item) =>
                      item.nft.name
                        .toLowerCase()
                        .includes(nftSearch.toLowerCase())
                    )
                    .map((item) => ({
                      ...item,
                      ["is_whitelisted"]: j.whitelisted,
                    }))
            );
          });
      }
    } else {
      setTokens([]);
    }
    // setIsLoading(false);
  }, [nftSelect, nftSearch, tempTokens, tokenHeaders]);

  const emptyData = () => {
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_NFT",
      payload: [],
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_FT",
      payload: [],
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_MY_NFT",
      payload: [],
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_MY_FT",
      payload: [],
    });
  };

  const handleContinue = () => {
    if (
      userContext?.selectedActionsState?.p2p_nfts.length === 0 &&
      userContext?.selectedActionsState?.p2p_fts.length === 0
    )
      return;

    callback(2);
  };

  const handleBack = () => {
    callback(-1);
  };

  const handlePrev = () => {
    emptyData();

    callback(0);
  };

  const handleTabsChange = (index) => {
    if (isLoading) return;
    switchNetworkAsync(chains[index].id)
      .then(() => {
        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_TRADER",
          payload: {
            ...userContext?.selectedActionsState?.p2p_trader,
            ["isEth"]: index,
          },
        });

        emptyData();
      })
      .catch(() => {});
  };

  const handleNft = (e) => {
    setNFTSearch(e.target.value);
  };

  const handleFTRemove = (index) => {
    const newData = userContext?.selectedActionsState?.p2p_fts.filter(
      (i, idx) => idx !== index
    );
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_FT",
      payload: newData,
    });
  };

  const handleNFTRemove = (index) => {
    const newData = userContext?.selectedActionsState?.p2p_nfts.filter(
      (i, idx) => idx !== index
    );
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_NFT",
      payload: newData,
    });
  };

  return (
    <>
      <Box w="full">
        <Grid mx="20vh" mt="110px" templateColumns="repeat(7, 1fr)">
          <GridItem colSpan={2}>
            <Tabs variant="unstyled" isFitted>
              <TabList
                border={"2px solid"}
                borderColor={"grayer"}
                borderRadius="8px"
              >
                <Tab
                  py="3"
                  borderLeftRadius="8px"
                  borderRightRadius='8px'
                  fontSize="14px"
                  onClick={() => {
                    handleTabsChange(0);
                  }}
                  bg={
                    userContext?.selectedActionsState?.p2p_trader.isEth === 0
                      ? "secondary"
                      : ""
                  }
                  color={
                    userContext?.selectedActionsState?.p2p_trader.isEth === 0 &&
                    "primary"
                  }
                >
                  Ethereum
                </Tab>
                {/* <Tab
                  py="3"
                  fontSize="14px"
                  borderRightRadius="8px"
                  onClick={() => {
                    handleTabsChange(1);
                  }}
                  bg={
                    userContext?.selectedActionsState?.p2p_trader.isEth === 1
                      ? "secondary"
                      : ""
                  }
                  color={
                    userContext?.selectedActionsState?.p2p_trader.isEth === 1 &&
                    "primary"
                  }
                >
                  Polygon
                </Tab> */}
              </TabList>
            </Tabs>
            <Box
              mt="12px"
              border={`2px solid`}
              borderColor={"grayer"}
              bg={bg}
              borderRadius="8px"
              px="12px"
              py="16px"
            >
              <Flex alignItems="center">
                <Verified />
                <Text fontSize="12px">&nbsp;: Verified Collection</Text>
              </Flex>
              <Flex mt="5px" alignItems="center">
                <Flag />
                <Text ml="2px" fontSize="12px">
                  &nbsp;: Flagged Asset
                </Text>
              </Flex>
            </Box>
            <Box
              mt="12px"
              border={`2px solid`}
              borderColor={"grayer"}
              bg={bg}
              borderRadius="8px"
              px="12px"
              py="16px"
            >
              <Text fontSize="14px" color={title} fontWeight="bold">
                {`Chosen User`}
              </Text>
              <Box mt="12px">
                <Flex
                  border={`2px solid`}
                  borderColor={bg}
                  px="12px"
                  py="16px"
                  borderRadius="8px"
                >
                  <Avatar
                    name={
                      userContext?.selectedActionsState?.p2p_trader
                        ? userContext?.selectedActionsState?.p2p_trader.name
                        : ""
                    }
                    src={
                      userContext?.selectedActionsState?.p2p_trader
                        ? userContext?.selectedActionsState?.p2p_trader.image
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
                        ? getBeautifulAddress(
                            userContext?.selectedActionsState?.p2p_trader
                              .address
                          )
                        : ""}
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Box
                overflowY="auto"
                h="250px"
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
                <Box mt="20px">
                  <Text fontWeight="bold" fontSize="14px">
                    Tokens ({userContext?.selectedActionsState?.p2p_fts.length})
                  </Text>
                  {userContext?.selectedActionsState?.p2p_fts.length === 0 ? (
                    <Text fontWeight="bold" fontSize="14px">
                      -
                    </Text>
                  ) : (
                    <SimpleGrid
                      minChildWidth="100px"
                      overflow="hidden"
                      spacing="12px"
                      pt="5"
                    >
                      {userContext?.selectedActionsState?.p2p_fts.map(
                        (item, index) => {
                          return (
                            <SelectToken
                              key={index}
                              isEdit={true}
                              m="auto"
                              type="ft"
                              handleRemove={(i) => {
                                handleFTRemove(i);
                              }}
                              index={index}
                              tokenId={item.symbol}
                              tokenName={item.amount}
                              tokenLogo={item.logo}
                              tokenImage={""}
                            />
                          );
                        }
                      )}
                      <Box height="100%" />
                      <Box height="100%" />
                      <Box height="100%" />
                    </SimpleGrid>
                  )}
                </Box>
                <Box mt="20px">
                  <Text fontWeight="bold" fontSize="14px">
                    NFTs ({userContext?.selectedActionsState?.p2p_nfts.length})
                  </Text>
                  {userContext?.selectedActionsState?.p2p_nfts.length === 0 ? (
                    <Text fontWeight="bold" fontSize="14px">
                      -
                    </Text>
                  ) : (
                    <SimpleGrid
                      minChildWidth="100px"
                      overflow="hidden"
                      spacing="12px"
                      pt="5"
                      pb="5"
                    >
                      {userContext?.selectedActionsState?.p2p_nfts.map(
                        (item, index) => {
                          return (
                            <SelectToken
                              key={index}
                              index={index}
                              isEdit={true}
                              type="nft"
                              handleRemove={(i) => {
                                handleNFTRemove(i);
                              }}
                              tokenId={item?.nft?.token}
                              tokenName={item?.nft?.collection_name}
                              tokenImage={item.image_url}
                              chainId={item?.nft?.chain}
                            />
                          );
                        }
                      )}
                      <Box height="100%" />
                      <Box height="100%" />
                      <Box height="100%" />
                    </SimpleGrid>
                  )}
                </Box>
              </Box>
              <Box
                mt="12px"
                bg={
                  userContext?.selectedActionsState?.p2p_nfts.length === 0 &&
                  userContext?.selectedActionsState?.p2p_fts.length === 0
                    ? "grayer"
                    : "secondary"
                }
                _hover={{ color: "primary" }}
                color={
                  userContext?.selectedActionsState?.p2p_nfts.length === 0 &&
                  userContext?.selectedActionsState?.p2p_fts.length === 0
                    ? "primary"
                    : "primary"
                }
                cursor={
                  userContext?.selectedActionsState?.p2p_nfts.length === 0 &&
                  userContext?.selectedActionsState?.p2p_fts.length === 0
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
                mb="40px"
                onClick={handlePrev}
              >
                Back
              </Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={5}>
            <Box px="40px" pb="16px">
              <Flex
                p="8px"
                border={`2px solid`}
                borderColor={bg}
                borderRadius="8px"
                alignItems="center"
              >
                <Text pl="8px" flex="1" fontSize="14px" fontWeight="bold">
                  Add a Token
                </Text>
                <AddButtons
                  address={
                    userContext?.selectedActionsState?.p2p_trader.address
                  }
                  type={false}
                  allowETH={true}
                />
              </Flex>
              <Text mt="15px" fontSize="14px" fontWeight="bold">
                {`Select NFTs from your chosen users wallet`}
              </Text>
              <Flex mt="10px">
                <InputGroup flex="1" mr="10px">
                  <InputLeftElement color={title} pl="1.5" pointerEvents="none">
                    <Search />
                  </InputLeftElement>
                  <Input
                    type="text"
                    color={input}
                    bg={bg}
                    fontSize="14px"
                    border="none"
                    placeholder="Search collections or assets"
                    _focus={{ boxShadow: "none", border: "none" }}
                    _placeholder={{ color: h }}
                    onChange={handleNft}
                    value={nftSearch}
                  />
                </InputGroup>
                {
                  <Menu>
                    <MenuButton
                      bg={bg}
                      fontSize="14px"
                      as={Button}
                      _active={{ bg: bg }}
                      _hover={{ bg: bg }}
                      rightIcon={<ChevronDownIcon />}
                    >
                      {tokenHeaders.length > 0
                        ? tokenHeaders[nftSelect].name
                        : "Collections(All)"}
                    </MenuButton>
                    <MenuList bg={realBg}>
                      {tokenHeaders.map((item, idx) => {
                        return (
                          <MenuItem
                            bg={realBg}
                            key={idx}
                            onClick={() => {
                              setNFTSelect(idx);
                            }}
                          >
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Menu>
                }
              </Flex>
              <Box h="600px">
                {isLoading ? (
                  <Flex>
                    <Box m="auto" mt="200px">
                      <NF3Spinner />
                    </Box>
                  </Flex>
                ) : (
                  <>
                    <SimpleGrid
                      my="15px"
                      maxHeight="600px"
                      overflowY="auto"
                      overflowX="hidden"
                      minChildWidth="200px"
                      spacing="12px"
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
                      {tokens.map((item, index) => {
                        return (
                          <NFT
                            type={false}
                            key={index}
                            item={item}
                            isEdit={true}
                            is1155={true}
                          />
                        );
                      })}
                      <Box height="100%" />
                      <Box height="100%" />
                      <Box height="100%" />
                    </SimpleGrid>
                  </>
                )}
              </Box>
            </Box>
          </GridItem>
        </Grid>
        <Box display={"flex"} justifyContent={"center"} mt="30px" mb='20px'>
          <Logo />
          <Text fontSize="12px" fontWeight="400" px="10px" py="15px">
            Copyright NF3 2023, All rights reserved
          </Text>
        </Box>
      </Box>
    </>
  );
};
