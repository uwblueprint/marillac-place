import React from "react";
import { Text, Spinner } from "@chakra-ui/react";
import { sayHello } from "../../../middleware/apiHandler";

const HelloPage = (): React.ReactElement => {
  const { loading, data, error } = sayHello();
  console.log(data);

  if (loading) return <Spinner />;
  if (error) return <Text>{error.message}</Text>;

  return <Text>{ data.hello }</Text>;
};

export default HelloPage;
