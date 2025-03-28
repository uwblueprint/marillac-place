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
  const [credit, setCredit] = useState(0);
  const [creditChange, setCreditChange] = useState(0)
  const [adding, setAdding] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [reason, setReason] = useState("");
  const [participantIdError, setParticipantIdError] = useState("");
  const [creditError, setCreditError] = useState("");
  const [creditChangeError, setCreditChangeError] = useState("");
  const [addingError, setAddingError] = useState("");

  const [
    getParticipantById,
    {
      loading: getParticipantByIdLoading,
      error: getParticipantByIdError,
      data: getParticipantByIdData,
    },
  ] = useLazyQuery(GET_PARTICIPANT_BY_ID, {
    variables: { participantId, credit },
  });
  console.log(participantId, "od");
  console.log(credit, "cred");
  const [editMarillacBucks] = useMutation(EDIT_MARILLAC_BUCKS);

  const validate = async () => {
    const errors = {
      participantId: "",
      credit: "",
      creditChange: "",
      adding: "",
    };

    if (participantId) {
      console.log(participantId)
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

    if (credit) {
      console.log(credit);
      await getParticipantById({ variables: { credit } });
      setCurrentBalance(credit);
      if (creditError) {
        errors.credit = "Unknown error has occurred.";
      } else if (
        credit && credit != null
      ) {
        errors.credit = "ID already exists";
      } else {
        errors.credit = "";
      }
    } else {
      errors.credit = "ID Number is missing";
    }

    errors.credit = credit ? "" : "Credit is missing";
    errors.creditChange = creditChange ? "" : "New credit is missing";
    errors.adding = adding ? "" : "Adding is missing";

    return errors;
  };
  const updateCredit = () => {
    if (adding) {
      setCredit(credit + creditChange);
    }
    setCredit(credit - creditChange); }
  const handleSubmit = async () => {
    console.log(credit);
    console.log(credit);
    const errors = await validate();
    if (
      !errors.participantId &&
      !errors.credit &&
      !errors.creditChange &&
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
      setCreditChangeError(errors.creditChange);
      setAddingError(errors.adding);
    }
  };

  const reset = () => {
    setParticipantId("");
    setCredit(0);
    setCreditChange(0);
    setAdding(true);
    setParticipantIdError("");
    setCreditError("");
    setCreditChangeError("");
    setAddingError("");
  };

  return (
    <ModalContainer
      title="Marillac Balance"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Flex flexDir="column" gap="20px">
        <h3>Current Balance</h3>
        <input
      type="text"
      value={currentBalance}
      readOnly
      className="w-[120px] px-3 text-[#0C727E] py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C727E] focus:border-[#0C727E] text-sm"
    />   
        <FormInputField
          label="Enter Amount"
          value={creditChange === 0 ? "" : creditChange}
          placeholder="$"
          type="text"
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            setCreditChange(value);
            console.log(value);
            console.log(credit);
            console.log(participantId);
          }}
          required
          error={creditChangeError}
        />
        <div className="flex flex-row items-start space-x-1">
        <input
  type="radio"
  id="add"
  name="action"
  value="Add"
  onChange={(e) => setAdding(e.target.value === "Add")}
  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
/>

                  <p>Add</p>
                </div>
                <div className="flex flex-row items-start space-x-1">
                <input
  type="radio"
  id="add"
  name="action"
  value="Add"
  onChange={(e) => setAdding(e.target.value === "Add")}
  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
/>

                  <p>Remove</p>
                </div>
        <FormInputField
          label="Reason"
          value={reason}
          type="text"
          onChange={(e) => {
            setReason(e.target.value);
          }}
          required
          error={creditChangeError}
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
          <Button variant="primary" onClick={()=>{updateCredit();
          handleSubmit();}}>
            Save
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default AddMarillacBucks;
