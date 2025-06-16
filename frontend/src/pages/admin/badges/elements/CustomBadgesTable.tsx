import React from "react";
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Flex,
  Text,
} from "@chakra-ui/react";

const CustomBadgesTable = () => {
  return (
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
            <Th width="22%">
              <Flex alignItems="center" gap="8px">
                <Text textStyle="web.s1" color="#000000" textTransform="none">
                  Name
                </Text>
              </Flex>
            </Th>
            <Th width="22%">
              <Flex alignItems="center" gap="8px">
                <Text textStyle="web.s1" color="#000000" textTransform="none">
                  Assigned Days
                </Text>
              </Flex>
            </Th>
            <Th width="22%">
              <Flex alignItems="center" gap="8px">
                <Text textStyle="web.s1" color="#000000" textTransform="none">
                  Assigned Times
                </Text>
              </Flex>
            </Th>
            <Th width="22%">
              <Flex alignItems="center" gap="8px">
                <Text textStyle="web.s1" color="#000000" textTransform="none">
                  Marillac Bucks
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
        {/* <Tbody>
            
          </Tbody> */}
      </Table>
    </TableContainer>
  );
};

export default CustomBadgesTable;
