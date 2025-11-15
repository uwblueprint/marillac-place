import React from "react";
import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../types";

type UnderlineButtonProps = Omit<ButtonProps, "is_active" | "action" | "icon"> & {
  href: string;
};

export default function UnderlineButton({ 
  label, 
  href,
}: UnderlineButtonProps) {
  return (
    <Link
      href={href}
      cursor="pointer"
      textDecoration="underline"
      textAlign="center"
      textStyle="web.b3"
      fontFamily="Nunito"
      fontWeight={600}
      color="black"
      _hover={{
        textDecoration: "none",
      }}
    >
      {label}
    </Link>
  );
}