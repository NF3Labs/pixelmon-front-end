import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  Input,
  Image,
  Button,
  Wrap,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { X } from "../Icons/X";
import { useState, useEffect } from "react";
import { TokenItem } from "../Items/Items";

export const SelectToken = ({
  isOpen,
  onClose,
  handleConfirm,
  tokenOptions,
  selectedTokens,
  handleRemove,
  erc20Balance,
  isUser,
}) => {
  const menuBg = useColorModeValue("bg.light", "bg.dark");
  const selected = useColorModeValue("lightBg.light", "lightBg.dark");
  const [amount, setAmount] = useState("");
  const [contract, setContract] = useState("");
  const [validation, setValidation] = useState(false);
  const selectedToken =
    contract !== "" && erc20Balance?.filter((i) => i.contract === contract)[0];

  useEffect(() => {
    if (!isOpen && amount !== "" && contract !== "") {
      setAmount("");
      setContract("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, amount, contract]);

  const confirm = () => {
    handleConfirm(contract, amount);
    onClose();
  };

  const chakraStyles = {
    control: () => ({
      display: "flex",
      width: "135px",
      pt: "1.5",
      cursor: "pointer",
    }),
    menuList: () => ({
      bg: menuBg,
    }),
    option: (provided, state) => ({
      bg: state.isSelected ? selected : menuBg,
      py: "2",
      px: "3",
    }),
  };

  const options = tokenOptions?.map((i, idx) => ({
    label: (
      <Flex gap="1">
        <Box>{i.symbol}</Box>
        {i.thumbnail && <Image alt="" src={i.thumbnail} w="20px" h="20px" />}
      </Flex>
    ),
    value: i.contract,
  }));

  const handleChange = (e) => {
    const regex =
      /^(([1-9]\d{0,5})|([1-9]\d{0,5})((?:\.([1-9]{1,4}))|(?:\.(0[1-9]{1,3}))|(?:\.([0-9]{1}0[1-9]{1,2}))|(?:\.([0-9]{2}0[1-9]{1})))|(0((?:\.([1-9]{1,4}))|(?:\.(0[1-9]{1,3}))|(?:\.([0-9]{1}0[1-9]{1,2}))|(?:\.([0-9]{2}0[1-9]{1})))))?$/gm;

    setAmount(e.target.value);
    if (regex.exec(e.target.value)) {
      setValidation(false);
    } else {
      setValidation(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent bgColor={useColorModeValue("bg.light", "bg.dark")}>
        <Box py="5" px="20" pos="relative">
          <Box
            pos="absolute"
            top="7"
            right="7"
            color={useColorModeValue("content.light", "content.dark")}
            onClick={onClose}
            cursor="pointer"
          >
            <X width="20px" />
          </Box>
          <Text fontSize="24px" fontWeight="bold" textAlign="center" mt="7">
            Select fungible token
          </Text>
          <Text
            fontSize="16px"
            textAlign="center"
            mt="6"
            color={useColorModeValue("content.light", "content.dark")}
          >
            {" "}
            Select token and amount of token to include in your swap
          </Text>
          <Flex
            border={"2px solid"}
            borderColor="secondary"
            borderRadius="4px"
            w="250px"
            h="48px"
            mx="auto"
            mt="10"
            mb="2"
          >
            <Input
              variant="unstyled"
              borderLeftRadius="8px"
              borderRight={"2px solid"}
              borderColor="secondary"
              borderRightRadius="0px"
              bg="transparent"
              pl="3"
              placeholder="0"
              value={amount}
              onChange={handleChange}
              type="number"
            />
            <Select
              isSearchable={false}
              openMenuOnFocus={false}
              onChange={(e) => setContract(e.value)}
              value={options?.find((item) => item.value === contract) ?? null}
              options={options}
              placeholder={"ERC20"}
              border="none"
              borderLeftRadius="0px"
              bg="transparent"
              chakraStyles={chakraStyles}
              useBasicStyles
            />
          </Flex>
          {contract !== "" && selectedToken && isUser ? (
            <Flex
              pb="2"
              gap="1"
              overflow={'hidden'}
              justifyContent={"center"}
              whiteSpace={"nowrap"}
            >
              <Box>{selectedToken?.symbol} Balance: </Box>
              <Box>{selectedToken?.balanceFormatted}</Box>
            </Flex>
          ) : null}
          {validation ? (
            <Box
              textColor={"red"}
              display={"flex"}
              alignItems={"center"}
            >
              Max digit of token value is 6 and decimal is 4.
            </Box>
          ) : (
            <Box
              textColor={"red"}
              display={"flex"}
              alignItems={"center"}
            ></Box>
          )}
          <Wrap pt="2" mx="auto" justify="center" maxW="lg" spacing="4">
            {selectedTokens?.map((i, idx) => (
              <TokenItem
                key={idx}
                contractAddress={i.contract}
                amount={i.amount}
                hasRemoveOption={true}
                handleRemove={() => handleRemove(i.contract, i.amount)}
              />
            ))}
          </Wrap>

          <Flex pb="4" gap="4" justify="center" mt="6">
            <Button
              border={"2px solid"}
              borderColor="secondary"
              borderRadius="8px"
              textAlign="center"
              py="6"
              px="6"
              fontWeight="bold"
              onClick={onClose}
              cursor="pointer"
              bg="transparent"
              _hover={{ bg: "transparent" }}
              _focus={{ bg: "transparent" }}
            >
              CANCEL
            </Button>
            <Button
              cursor="pointer"
              bg="secondary"
              _hover={{ bg: "secondary" }}
              _focus={{ bg: "secondary" }}
              color="primary"
              borderRadius="8px"
              textAlign="center"
              py="6"
              px="6"
              isDisabled={
                isUser
                  ? contract === "" ||
                    amount === "" ||
                    validation ||
                    Number(selectedToken?.balanceFormatted) < Number(amount)
                  : contract === "" || amount === "" || validation
              }
              onClick={confirm}
              fontWeight="bold"
            >
              CONFIRM
            </Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};
