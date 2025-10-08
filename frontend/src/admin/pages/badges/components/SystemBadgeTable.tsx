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
  Image as ChakraImage,
  Switch,
} from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_BADGE_STATUS } from "../../../../gql/mutations";
import { Icon } from "../../../../constants/icons";
import EditSystemBadgeModal from "./EditSystemBadgeModal";

type SystemBadgeTableProps = {
  loading: boolean;
  error: any;
  badges: any[];
};

const SystemBadgeTable = ({
  loading,
  error,
  badges,
}: SystemBadgeTableProps) => {
  const levels = ["N", "B", "S", "G", "D"];
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [statuses, setStatuses] = useState(null);
  const [updateBadgeStatus] = useMutation(UPDATE_BADGE_STATUS);

  useEffect(() => {
    setStatuses(
      badges.reduce((acc, badge) => {
        acc[badge.badge_id] = badge.is_active;
        return acc;
      }, {})
    );
  }, [badges]);

  async function changeActivityStatus(badge_id: number, is_active: boolean) {
    try {
      await updateBadgeStatus({
        variables: {
          badge_id,
          is_active,
        },
      });
      setStatuses((prev: any) => ({
        ...prev,
        [badge_id]: is_active,
      }));
    } catch (err: any) {
      console.log(err.message);
    }
  }

  return (
    <>
      <TableContainer
        border="1px solid"
        borderColor="neutral.300"
        borderRadius="8px"
        mb="15px"
        w="100%"
      >
        {edit && selected && (
          <EditSystemBadgeModal
            isOpen={edit}
            onClose={() => setEdit(false)}
            selected={selected}
          />
        )}
        <Table>
          <Thead>
            <Tr backgroundColor="neutral.200" w="100%">
              <Th width="5%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Icon
                  </Text>
                </Flex>
              </Th>
              <Th width="35%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Badge Name
                  </Text>
                </Flex>
              </Th>
              <Th width="40%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Description
                  </Text>
                </Flex>
              </Th>
              <Th width="10%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Offered Levels
                  </Text>
                </Flex>
              </Th>
              <Th width="5%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Status
                  </Text>
                </Flex>
              </Th>
              <Th width="5%">
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
                <Td colSpan={6} textAlign="center">
                  <Spinner />
                </Td>
              </Tr>
            ) : error ? (
              <Tr outline="1px solid" outlineColor="neutral.300">
                <Td colSpan={6}>
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
                    <ChakraImage
                      src={`/badges/${badge.icon.toLowerCase()}.svg`}
                      alt={badge.name}
                      style={{ width: "1.5rem", height: "1.5rem" }}
                      opacity={0.5}
                    />
                  </Td>
                  <Td>
                    <Text
                      textStyle="web.b3"
                      color="#000000"
                      whiteSpace="normal"
                    >
                      {badge.name}
                    </Text>
                  </Td>
                  <Td>
                    <Text
                      textStyle="web.b3"
                      color="#000000"
                      whiteSpace="normal"
                    >
                      {badge.description}
                    </Text>
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {levels.slice(0, badge.badge_level.length).join(", ")}
                    </Text>
                  </Td>
                  <Td alignItems="center">
                    <Flex alignItems="center" justifyContent="center">
                      <Text textStyle="web.b3" color="#000000">
                        {statuses && (
                          <Switch
                            isChecked={statuses[badge.badge_id]}
                            onChange={() =>
                              changeActivityStatus(
                                badge.badge_id,
                                !statuses[badge.badge_id]
                              )
                            }
                          />
                        )}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Flex alignItems="center" justifyContent="center">
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
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SystemBadgeTable;
