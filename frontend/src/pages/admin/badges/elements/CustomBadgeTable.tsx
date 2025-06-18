import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { useState } from "react";
import EditCustomBadgeModal from "./EditCustomBadgeModal";
import { Icon } from "../../../../constants/icons";

type CustomBadgeTableProps = {
  loading: boolean;
  error: any;
  badges: any[];
};

const CustomBadgeTable = ({
  loading,
  error,
  badges,
}: CustomBadgeTableProps) => {
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  // tried to use enum from constants but didnt work
  const iconToSvg = new Map<string, string>([
    ["FIVE_STAR", "five_star.svg"],
    ["FOUR_STAR", "four_star.svg"],
    ["GROUP", "group.svg"],
    ["HEART", "heart.svg"],
    ["HOME", "home.svg"],
    ["BABY", "baby.svg"],
    ["WINGS", "wings.svg"],
    ["FLOWER", "flower.svg"],
    ["MONEY", "money.svg"],
    ["GEMSTONE", "gemstone.svg"],
    ["DIAMOND", "diamond.svg"],
    ["PENCIL", "pencil.svg"],
    ["TOOL", "tool.svg"],
  ]);

  return (
    <>
      <TableContainer
        border="1px solid"
        borderColor="neutral.300"
        borderRadius="8px"
        mb="15px"
        w="100%"
      >
        <Table>
          <Thead>
            <Tr backgroundColor="neutral.200" w="100%">
              <Th width="12%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Icon
                  </Text>
                </Flex>
              </Th>
              <Th width="22%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Badge Name
                  </Text>
                </Flex>
              </Th>
              <Th width="54%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Description
                  </Text>
                </Flex>
              </Th>
              <Th width="12%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Actions
                  </Text>
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr outline="1px solid" outlineColor="neutral.300">
                <Td colSpan={4} textAlign="center">
                  <Spinner />
                </Td>
              </Tr>
            ) : error ? (
              <Tr outline="1px solid" outlineColor="neutral.300">
                <Td colSpan={4}>
                  <Text textStyle="web.b3" color="#000000" textAlign="center">
                    {error.message}
                  </Text>
                </Td>
              </Tr>
            ) : (
              badges.map((badge: any, index: number) => (
                <Tr
                  key={badge.badge_id}
                  outline={index % 2 ? "0px solid" : "1px solid"}
                  outlineColor="neutral.300"
                >
                  <Td>
                    <img
                      src={`/badges/${iconToSvg.get(badge.icon)}`}
                      alt={badge.name}
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {badge.name}
                    </Text>
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {badge.description}
                    </Text>
                  </Td>
                  <Td>
                    <Flex
                      alignItems="center"
                      justifyContent="flex-start"
                      gap="15px"
                    >
                      <Flex
                        cursor="pointer"
                        onClick={() => {
                          setSelected(badge);
                          setEdit(true);
                        }}
                      >
                        <EditIcon
                          style={{
                            width: "1.2rem",
                            height: "1.2rem",
                            color: "#000000",
                            cursor: "pointer",
                          }}
                        />
                      </Flex>
                      <Flex cursor="pointer" onClick={() => {}}>
                        <DeleteOutlineIcon
                          style={{
                            width: "1.3rem",
                            height: "1.3rem",
                            color: "#D34C5C",
                          }}
                        />
                      </Flex>
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {edit && selected && (
        <EditCustomBadgeModal isOpen={edit} onClose={() => setEdit(false)} />
      )}
    </>
  );
};

export default CustomBadgeTable;
