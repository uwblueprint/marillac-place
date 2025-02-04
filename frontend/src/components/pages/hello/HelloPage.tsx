import React from "react";
import { Text, Spinner } from "@chakra-ui/react";
import { hello } from "../../../middleware/apiHandler";

const HelloPage = (): React.ReactElement => {
  const { loading, data, error } = hello({ name: null });

  if (loading) return <Spinner />;
  if (error) return <Text>{error.message}</Text>;

  return <Text>{data}</Text>;
};

export default HelloPage;
