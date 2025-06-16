import React from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { DELETE_CUSTOM_BADGE } from "../../../../gql/mutations";

type DeleteBadgeButtonProps = {
  badgeId: number;
  onSuccess?: () => void;
};

const DeleteBadgeButton = ({ badgeId, onSuccess }: DeleteBadgeButtonProps) => {
  const toast = useToast();

  const [deleteCustomBadge, { loading }] = useMutation(DELETE_CUSTOM_BADGE, {
    variables: { badge_id: badgeId },
    onCompleted: (data) => {
      if (data.deleteCustomBadge) {
        toast({
          title: "Badge deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Failed to delete badge.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleClick = () => {
    const confirmation = window.prompt(`Type DELETE to confirm deletion of badge ${badgeId}`);
    if (confirmation === "DELETE") {
      deleteCustomBadge();
    } else if (confirmation !== null) {
      toast({
        title: "Cancelled",
        description: "Badge deletion was not confirmed.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button colorScheme="red" onClick={handleClick} isLoading={loading}>
      Delete Badge
    </Button>
  );
};

export default DeleteBadgeButton;
