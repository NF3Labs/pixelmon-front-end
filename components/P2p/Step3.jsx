import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Spinner,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Exchange } from "./Exchange";
import { useUserContext } from "../../contexts/User";
import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/App";
import { useAccount, useSigner } from "wagmi";
import { infoToast } from "../../pages/_app";
import { FlaggedAssetConfirm } from "../Modals/FlaggedAssetConfirm";
import { useDisclosure } from "@chakra-ui/react";
import { Approve } from "../Modals/Approve";
import { Logo } from "../Icons/Logo";
import axios from 'axios';

export const Step3 = ({ callback }) => {
  const header = useColorModeValue("header.light", "header.dark");
  const title = useColorModeValue("title.light", "title.dark");
  const titleHover = useColorModeValue("titleHover.light", "titleHover.dark");
  const realBg = useColorModeValue("bg.light", "bg.dark");

  const userContext = useUserContext();
  const appContext = useAppContext();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: approveIsOpen,
    onClose: approveOnClose,
    onOpen: approveOnOpen,
  } = useDisclosure();
  const [modalData, setModalData] = useState(undefined);

  const timePeriod = [
    { value: 1, title: "1 hour" },
    { value: 2, title: "2 hours" },
    { value: 6, title: "6 hours" },
    { value: 12, title: "12 hours" },
    { value: 24, title: "24 hours" },
    { value: 48, title: "48 hours" },
  ];
  const [indexPeriod, setIndexPeriod] = useState(timePeriod.length - 1);
  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [flagAssets, setAssets] = useState([]);
  const [isConfirm, setConfirm] = useState(false);

  useEffect(() => {
    const assetData = checkFlaggedToken();

    setConfirm(assetData.length === 0);
    if (assetData.length > 0) {
      setAssets(assetData);
    }
  }, []);

  const checkFlaggedToken = () => {
    let data = [];

    userContext?.selectedActionsState?.p2p_my_nfts.forEach((item) => {
      if (item.nft.is_flagged) {
        data.push(item);
      }
    });

    userContext?.selectedActionsState?.p2p_nfts.forEach((item) => {
      if (item.nft.is_flagged) {
        data.push(item);
      }
    });

    return data;
  };

  const getMerkleTreeIdAndRoot = async (contractAddress, tokenId) => {
    try {
      const response = await axios.post('/api/post/postItemsRoot', {
        params: {
          tokenId: [tokenId],
        }
      });

      return response.data.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getMerkleData = async (item) => {
    const merkle = await getMerkleTreeIdAndRoot(
      item.nft.contract,
      item.nft.token
    );
    return {
      contract: item.nft.contract,
      token: item.nft.token,
      merkleTreeId: merkle.data.treeId,
      merkleRoot: merkle.data.root,
    };
  };

  const createListing = async () => {
    try {
      setIsCreatingListing(true);
      const sdk = await appContext?.getSDK();
      const listing_nfts = userContext?.selectedActionsState?.p2p_my_nfts.map(
        (item) => {
          return { contract: item.nft.contract, token: item.nft.token };
        }
      );
      const listing_fts = userContext?.selectedActionsState?.p2p_my_fts.map(
        (item) => {
          return { contract: item.contract, amount: item.amount };
        }
      );

      if (listing_nfts.length === 0 && listing_fts.length == 0) {
        infoToast("Error", "Please select your assets");
        setIsCreatingListing(false);
        return;
      }
      if (
        userContext?.selectedActionsState?.p2p_nfts.length === 0 &&
        userContext?.selectedActionsState?.p2p_fts.length === 0
      ) {
        infoToast("Error", "Please select counterparty's assets");
        setIsCreatingListing(false);
        return;
      }

      const _nfts = listing_nfts;
      const _erc20 = listing_fts?.map((i) => {
        return { amount: i.amount, ft: { contract: i.contract } };
      });

      const needsApprovalArray = await sdk.sc.approvals.checkIfNeedsApproval(
        _nfts,
        _erc20,
        address
      );
      if (!needsApprovalArray) {
        setIsCreatingListing(false);
        return;
      }
      if (needsApprovalArray?.length > 0) {
        const result = await sdk.sc.approvals.approveNeededContract(
          needsApprovalArray,
          signer
        );
        if (!result) {
          setIsCreatingListing(false);
          return;
        }
      }

      const listingPeriod = timePeriod[indexPeriod].value * 3600;
      const targetted_to =
        userContext?.selectedActionsState?.p2p_trader.address;
      const swaps = [
        {
          index: 0,
          nfts: await Promise.all(
            userContext?.selectedActionsState?.p2p_nfts.map(async (item) => {
              return await getMerkleData(item);
            })
          ),
          fts: userContext?.selectedActionsState?.p2p_fts.map((item) => {
            return { contract: item.contract, amount: item.amount };
          }),
        },
      ];
      const interested_nfts = [];
      const interested_fts = [];
      const reservations = [];

      const response = await axios.get('/api/get/getNonce', {
        params: {
          address: address,
        }
      });
      const nonce = response.data.data;

      const body = await sdk.sc.p2ps.getListingBody(listing_nfts, listing_fts, interested_fts, interested_nfts, swaps, reservations, listingPeriod, targetted_to, signer, address, nonce);

      const res = await axios.post('/api/post/postCreateP2P', {
        body,
      });

      if (res.data.data.success) {
        userContext?.dispatchSelectedActions({
          type: "RESET",
        });
        window.sessionStorage.setItem("p2p-complete", true);
        callback(4);
      }

      setIsCreatingListing(false);
    } catch (error) {
      setIsCreatingListing(false);
      console.log(error);
    }
  };

  const handleContinue = () => {
    if (!isCreatingListing) {
      if (isConfirm) {
        createListing();
      } else {
        onOpen();
      }
    }
  };

  const handleBack = () => {
    callback(-1);
  };

  const handlePrev = () => {
    if (!isCreatingListing) {
      callback(2);
    }
  };

  const handleConfirm = () => {
    onClose();
    setConfirm(true);
    createListing();
  };

  const handleGoBack = () => {
    onClose();
  };

  return (
    <>
      <Box w="full" mt="84px">
        <FlaggedAssetConfirm
          isOpen={isOpen}
          onClose={onClose}
          handleContinue={handleConfirm}
          handleGoBack={handleGoBack}
          data={flagAssets}
        />
        <Box mx="20vh" mt="150px">
          <Exchange
            leftNFT={userContext?.selectedActionsState?.p2p_nfts}
            leftFT={userContext?.selectedActionsState?.p2p_fts}
            leftOwner={userContext?.selectedActionsState?.p2p_trader}
            rightNFT={userContext?.selectedActionsState?.p2p_my_nfts}
            rightFT={userContext?.selectedActionsState?.p2p_my_fts}
            rightOwner={userContext?.selectedActionsState?.p2p_me}
            isSent={true}
            callback={isCreatingListing ? () => {} : callback}
            isEdit={true}
          />
        </Box>
        <Flex>
          <Box m="auto">
            <Flex>
              <Text
                fontWeight="bold"
                fontSize="24px"
                color={title}
                mx="auto"
                mt="30px"
                mb="20px"
              >
                Expiry Period
              </Text>
            </Flex>
            <Flex justify="center">
              <Menu>
                <MenuButton
                  textAlign="inherit"
                  w="237px"
                  bg={realBg}
                  fontSize="14px"
                  as={Button}
                  _active={{ bg: realBg }}
                  _hover={{ bg: realBg }}
                  border={`1px solid`}
                  borderColor={header}
                  rightIcon={<ChevronDownIcon />}
                >
                  {timePeriod[indexPeriod].title}
                </MenuButton>
                <MenuList bg={realBg}>
                  {timePeriod.map((item, index) => {
                    return (
                      <MenuItem
                        bg={realBg}
                        key={index}
                        onClick={() => {
                          setIndexPeriod(index);
                        }}
                      >
                        {item.title}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </Flex>
            <Box
              mt="24px"
              bg={1 === -2 ? "grayer" : "secondary"}
              _hover={!isCreatingListing && { color: "primary" }}
              color={"primary"}
              cursor={isCreatingListing ? "not-allowed" : "pointer"}
              textAlign="center"
              w="336px"
              py="14px"
              borderRadius="4px"
              fontSize="14px"
              fontWeight="bold"
              onClick={isCreatingListing ? () => {} : handleContinue}
              opacity={isCreatingListing ? ".6" : "1"}
            >
              {isCreatingListing && (
                <>
                  <Spinner size="xs" m="-1px" />
                  &nbsp;&nbsp;
                </>
              )}
              SUBMIT OFFER
            </Box>
            <Flex>
              <Text
                as="u"
                fontSize="14px"
                cursor={isCreatingListing ? "not-allowed" : "pointer"}
                color={"secondary"}
                _hover={{ color: titleHover }}
                mx="auto"
                mt="24px"
                mb="40px"
                onClick={handlePrev}
                opacity={isCreatingListing ? ".6" : "1"}
              >
                Back
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Box display={"flex"} justifyContent={"center"} mt="30px" mb='20px'>
          <Logo />
          <Text fontSize="12px" fontWeight="400" px="10px" py="15px">
            Copyright NF3 2023, All rights reserved
          </Text>
        </Box>
      </Box>
      {approveIsOpen && (
        <Approve
          data={modalData}
          isOpen={approveIsOpen}
          onClose={approveOnClose}
          handleContinue={createListing}
        />
      )}
    </>
  );
};
