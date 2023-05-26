import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Avatar,
  SimpleGrid
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { NFT } from "./NFT";
import { SelectToken } from "./SelectToken";
import { ExchangeGray } from "../Icons/ExchangeGray";
import { CHAIN } from "../../constants/chain";

export const Exchange = ({
  isSent,
  isEdit,
  callback,
  isOwner,
  leftNFT,
  leftFT,
  leftOwner,
  rightNFT,
  rightFT,
  rightOwner
}) => {

  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const title = useColorModeValue("title.light", "title.dark");
  const titleHover = useColorModeValue("titleHover.light", "titleHover.dark");
  const input = useColorModeValue("input.light", "input.dark");

  const handleEdit = (type) => {
    callback(type === 1 ? 1 : 2, true)
  }

  return (
    <>
      <Grid templateColumns='repeat(15, 1fr)'>
        <GridItem colSpan={7}>
          <Text textAlign='center' fontSize='14px' fontWeight='bold' color={input}>
            IN
          </Text>
          <Box
            mt='20px'
            border={`2px solid`}
            borderColor={"grayer"}
            bg={bg}
            borderRadius='8px'
            px='12px'
            py='16px'
          >
            <Text fontSize='14px' color={title} fontWeight='bold'>{!isSent ? 'Other User' : `Chosen User`}</Text>
            <Box mt='12px'>
              <Flex
                border={`2px solid`}
                borderColor={bg}
                px='12px'
                py='16px'
                borderRadius='8px'
              >
                <Avatar name={isOwner ? 'You' : leftOwner.name} src={leftOwner.image} />
                <Box
                  flex='1'
                  ml='12px'
                  w='5%'
                  alignSelf='center'
                >
                  <Text
                    fontWeight='bold'
                    fontSize='16px'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{isOwner ? 'You' : leftOwner.name}</Text>
                  <Text
                    fontSize='14px'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                    {leftOwner.address}
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box
              overflowY='auto'
              overflowX='hidden'
              h='310px'
              sx={{
                "&::-webkit-scrollbar": {
                  width: "3px",
                  borderRadius: "2px",
                  backgroundColor: 'transparent',
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: input,
                  borderRadius: "2px",
                },
              }}>
              <Box mt='20px'>
                {leftFT.length !== 0 && <>
                  <Text fontWeight='bold' fontSize='14px'>Tokens ({leftFT.length})</Text>
                  <SimpleGrid
                    minChildWidth="100px"
                    overflow="hidden"
                    spacing="12px"
                    pt="5"
                  >
                    {leftFT.map((item, index) => {
                      return <SelectToken
                        key={index}
                        isEdit={false}
                        m='auto'
                        type='ft'
                        handleRemove={(i) => {
                          handleFTRemove(i);
                        }}
                        index={index}
                        tokenId={isEdit ? item.symbol : item.ft.symbol}
                        tokenName={item.amount}
                        tokenLogo={item.ft ? item.ft.logo : item.logo}
                        tokenImage={''}
                      />
                    })}
                    <Box height="100%" />
                    <Box height="100%" />
                    <Box height="100%" />
                    <Box height="100%" />
                  </SimpleGrid>
                </>}
              </Box>
              <Box mt='20px'>
                {leftNFT.length !== 0 && <>
                  <Text fontWeight='bold' fontSize='14px'>NFTs ({leftNFT.length})</Text>
                  <SimpleGrid minChildWidth='150px' overflow='hidden' spacing='12px' pt="5" pb="5">
                    {leftNFT.map((item, index) => {
                      return <NFT
                        isEth={item.nft.chain === CHAIN.toString()}
                        key={index}
                        width={'150px'}
                        isEdit={false}
                        collectionName={''}
                        item={item}
                      />
                    })}
                    <Box height='100%' />
                    <Box height='100%' />
                    <Box height='100%' />
                  </SimpleGrid>
                </>}
              </Box>
            </Box>
            {isEdit && <Box
              mt='12px'
              border={`2px solid`}
              borderColor={title}
              _hover={{ border: `2px solid`, borderColor: titleHover }}
              color={title}
              cursor='pointer'
              textAlign='center'
              w='full'
              py='14px'
              borderRadius='4px'
              fontSize='14px'
              fontWeight='bold'
              onClick={() => { handleEdit(1) }}
            >
              EDIT
            </Box>}
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex h='full'>
            <Box m='auto'>
              <ExchangeGray />
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={7}>
          <Text textAlign='center' fontSize='14px' fontWeight='bold' color={input}>
            OUT
          </Text>
          <Box
            mt='20px'
            border={`2px solid`}
            borderColor={"grayer"}
            bg={bg}
            borderRadius='8px'
            px='12px'
            py='16px'
          >
            <Text fontSize='14px' color={title} fontWeight='bold'>{!isOwner ? 'Your Wallet' : `Chosen User`}</Text>
            <Box mt='12px'>
              <Flex
                border={`2px solid`}
                borderColor={bg}
                px='12px'
                py='16px'
                borderRadius='8px'
              >
                <Avatar name={rightOwner.name} src={rightOwner.image} />
                <Box
                  flex='1'
                  ml='12px'
                  w='5%'
                  alignSelf='center'
                >
                  <Text
                    fontWeight='bold'
                    fontSize='16px'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{rightOwner.name}</Text>
                  <Text
                    fontSize='14px'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                    {rightOwner.address}
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box
              overflowY='auto'
              overflowX='hidden'
              h='310px'
              sx={{
                "&::-webkit-scrollbar": {
                  width: "3px",
                  borderRadius: "2px",
                  backgroundColor: 'transparent',
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: input,
                  borderRadius: "2px",
                },
              }}>
              <Box mt='20px'>
                {rightFT.length !== 0 && <>
                  <Text fontWeight='bold' fontSize='14px'>Tokens ({rightFT.length})</Text>
                  <SimpleGrid
                    minChildWidth="100px"
                    overflow="hidden"
                    spacing="12px"
                    pt="5"
                  >
                    {rightFT.map((item, index) => {
                      return <SelectToken
                        key={index}
                        isEdit={false}
                        m='auto'
                        type='ft'
                        handleRemove={(i) => {
                          handleFTRemove(i);
                        }}
                        index={index}
                        tokenId={isEdit ? item.symbol : item.ft.symbol}
                        tokenName={item.amount}
                        tokenLogo={item.ft ? item.ft.logo : item.logo}
                        tokenImage={''}
                      />
                    })}
                    <Box height="100%" />
                    <Box height="100%" />
                    <Box height="100%" />
                    <Box height="100%" />
                  </SimpleGrid>
                </>}
              </Box>
              <Box mt='20px'>
                {rightNFT.length !== 0 && <>
                  <Text fontWeight='bold' fontSize='14px'>NFTs ({rightNFT.length})</Text>
                  <SimpleGrid minChildWidth='150px' overflow='hidden' spacing='12px' pt="5" pb="5">
                    {rightNFT.map((item, index) => {
                      return <NFT
                        isEth={item.nft.chain === CHAIN.toString()}
                        key={index}
                        width={'150px'}
                        isEdit={false}
                        collectionName={''}
                        item={item}
                      />
                    })}
                    <Box height='100%' />
                    <Box height='100%' />
                    <Box height='100%' />
                  </SimpleGrid>
                </>}
              </Box>
            </Box>
            {isEdit && <Box
              mt='12px'
              border={`2px solid`}
              borderColor={title}
              _hover={{ border: `2px solid`, borderColor: titleHover }}
              color={title}
              cursor='pointer'
              textAlign='center'
              w='full'
              py='14px'
              borderRadius='4px'
              fontSize='14px'
              fontWeight='bold'
              onClick={() => { handleEdit(2) }}
            >
              EDIT
            </Box>}
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};
