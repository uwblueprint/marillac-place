import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  Flex,
  Select,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";

import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_AVAILABLE_ROOMS,
  GET_PARTICIPANT_BY_ID,
} from "../../../gql/queries";
import { EDIT_MARILLAC_BUCKS } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/form/FormInputField";
import FormSelectField from "../../common/form/FormSelectField";

type AddMarillacBucksProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddMarillacBucks = ({
  isOpen,
  setIsOpen,
}: AddMarillacBucksProps): React.ReactElement => {
  const [participantId, setParticipantId] = useState("");
  const [credit, setCredit] = useState("");
  const [currentBalance, setCurrentBalance] = useState('')
  const [adding, setAdding] = useState("");

  const [participantIdError, setParticipantIdError] = useState("");
  const [creditError, setCreditError] = useState("");
  const [balanceError, setBalanceError] = useState("");
  const [addingError, setAddingError] = useState("");

  const [
    getParticipantById,
    {
      loading: getParticipantByIdLoading,
      error: getParticipantByIdError,
      data: getParticipantByIdData,
    },
  ] = useLazyQuery(GET_PARTICIPANT_BY_ID, {
    variables: { participantId },
  });

  const [editMarillacBucks] = useMutation(EDIT_MARILLAC_BUCKS);

  const validate = async () => {
    const errors = {
      participantId: "",
      credit: "",
      currentBalance: "",
      adding: "",
    };

    if (participantId) {
      await getParticipantById({ variables: { participantId } });
      if (getParticipantByIdError) {
        errors.participantId = "Unknown error has occurred.";
      } else if (
        getParticipantByIdData &&
        getParticipantByIdData.getParticipantById != null
      ) {
        errors.participantId = "ID already exists";
      } else {
        errors.participantId = "";
      }
    } else {
      errors.participantId = "ID Number is missing";
    }

    errors.credit = credit ? "" : "Credit is missing";
    errors.currentBalance = currentBalance ? "" : "Current Balance is missing";
    errors.adding = adding ? "" : "Adding is missing";

    return errors;
  };

  const handleSubmit = async () => {
    const errors = await validate();
    if (
      !errors.participantId &&
      !errors.credit &&
      !errors.currentBalance &&
      !errors.adding
    ) {
      try {
        await editMarillacBucks({
          variables: {
            participantId,
            credit,
          },
        });
        setIsOpen(false);
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    } else {
      setParticipantIdError(errors.participantId);
      setCreditError(errors.credit);
      setBalanceError(errors.currentBalance);
      setAddingError(errors.adding);
    }
  };

  const reset = () => {
    setParticipantId("");
    setCredit("");
    setCurrentBalance("");
    setAdding("");
    setParticipantIdError("");
    setCreditError("");
    setBalanceError("");
    setAddingError("");
  };

  return (
    <ModalContainer
      title="Marillac Balance"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Flex flexDir="column" gap="20px">
      <FormInputField
          label="ID Number"
          value={participantId}
          type="text"
          onChange={(e) => {
            setParticipantId(e.target.value);
          }}
          required
          error={participantIdError}
        />  
        <FormInputField
          label="ID Number"
          value={participantId}
          type="text"
          onChange={(e) => {
            setParticipantId(e.target.value);
          }}
          required
          error={participantIdError}
        />   
        <FormInputField
          label="Edit Marillac Bucks"
          value={credit}
          type="text"
          onChange={(e) => {
            setCredit(e.target.value);
          }}
          required
          error={creditError}
        />

        <Flex justifyContent="flex-end">
          <Button
            variant="cancel"
            mr="8px"
            onClick={() => {
              setIsOpen(false);
              reset();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default AddMarillacBucks;
