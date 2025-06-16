import React, { useState } from "react";
import {Flex, Text} from '@chakra-ui/react'
import CustomBadgesTable from "./elements/CustomBadgesTable";

export default function AdminBadgesPage() {
  return (
    <Flex w="100%" flexDir="column" minHeight="fit-content">
      <Text textStyle="web.h2" color="primary.700" mb="10px">Current Participants</Text>
      <CustomBadgesTable/>
    </Flex>
  )
}