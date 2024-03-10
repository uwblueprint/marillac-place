import React from "react";
import { Center, Image, Flex, Badge, Text } from "@chakra-ui/react";
import CreateForm from "../crud/CreateForm";
import SideBar from "../common/SideBar";

const TasksPage = () => {
  return (
    <div className="grid gap-6">
      <SideBar />
    </div>
  );
};

export default TasksPage;
