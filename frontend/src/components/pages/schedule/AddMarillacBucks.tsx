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
  GET_PARTICIPANT_BY_ROOM,
} from "../../../gql/queries";
import { EDIT_MARILLAC_BUCKS } from "../../../gql/mutations";
import ExportToCSV from "../../common/ExportToCSV";
import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/form/FormInputField";
import FormSelectField from "../../common/form/FormSelectField";

type AddMarillacBucksProps = {
  currentRoom: number;
  credit: number;
  setCredit: React.Dispatch<React.SetStateAction<number>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddMarillacBucks = ({
  currentRoom,
  credit, 
  setCredit,
  isOpen,
  setIsOpen,
}: AddMarillacBucksProps): React.ReactElement => {
  const [participantId, setParticipantId] = useState("");
  const [creditChange, setCreditChange] = useState(0)
  const [adding, setAdding] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [reason, setReason] = useState("");
  const [participantIdError, setParticipantIdError] = useState("");
  const [creditError, setCreditError] = useState("");
  const [creditChangeError, setCreditChangeError] = useState("");
  const [addingError, setAddingError] = useState("");

  const [
    getParticipantByRoom,
    {
      loading: getParticipantByIdLoading,
      error: getParticipantByRoomError,
      data: getParticipantByRoomData,
    },
  ] = useLazyQuery(GET_PARTICIPANT_BY_ROOM, {
    variables: {currentRoom},
  });

  useEffect(() => {
    if (currentRoom) {
      getParticipantByRoom(); 
    }
  }, [currentRoom, getParticipantByRoom]);
  
  useEffect(() => {
    if (getParticipantByRoomData) {
      console.log(getParticipantByRoomData, "Participant data fetched");
      if (getParticipantByRoomData.getParticipantByRoom) {
        setCurrentBalance(getParticipantByRoomData.getParticipantByRoom.credit);
        setParticipantId(getParticipantByRoomData.getParticipantByRoom.participantId);
      }
    }
  }, [getParticipantByRoomData]);
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
      await getParticipantByRoom({ variables: { currentRoom } });
      if (getParticipantByRoomError) {
        errors.participantId = "Unknown error has occurred.";
      } else if (
        getParticipantByRoomData &&
        getParticipantByRoomData.getParticipantById != null
      ) {
        errors.participantId = "ID already exists";
      } else {
        errors.participantId = "";
      }
    } else {
      errors.participantId = "ID Number is missing";
    }

    
    errors.creditChange = creditChange ? "" : "New credit is missing";

    return errors;
  };
useEffect(() => {
  console.log(adding);
},[adding])
  const handleSubmit = async () => {
    const updatedCredit = adding? currentBalance + creditChange : currentBalance - creditChange;
    console.log(updatedCredit, 'cred');
    const errors = await validate();
    console.log('validated');
    if (
      !errors.participantId &&
      !errors.credit &&
      !errors.creditChange &&
      !errors.adding
    ) {
      try {
        console.log('trying');
          setCredit(updatedCredit);
      } catch (err) {
        console.error(err);
      }
    } else {
      setParticipantIdError(errors.participantId);
      setCreditError(errors.credit);
      setCreditChangeError(errors.creditChange);
      setAddingError(errors.adding);
      console.log('errors', errors);
    }
  };
  const reset = () => {
    setCreditChange(0);
    setAdding(true);
    setCreditChangeError("");
    setAddingError("");
  };
  useEffect(()=>{
    console.log('called', credit, )
    const executeMutation = async () => {
      try {
        await editMarillacBucks({
          variables: {
            participantId,
            credit,
          },
        });
        console.log('success')
        setIsOpen(false);
        setCurrentBalance(credit);
        reset();
        // window.location.reload();
      }
      catch (err) {
        console.error(err);
      }
    }
    if (credit !== currentBalance){
      console.log('executing mutation')
      executeMutation();
    }
  }, [credit])
  

  return (
    <ModalContainer
      title="Marillac Balance"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Flex flexDir="column" gap="20px">
        <div className='flex flex-row space-y-1'>

        <p className='text-lg text-[#626262] font-semibold'>Current Balance</p>
        <input
            type="text"
            value={currentBalance}
            readOnly
            className="w-[120px] px-3 py-2 text-[#0C727E] bg-[#FAFAFA] border border-[##C5C8D8] rounded-lg border-[1px]"
          />   
        </div>
        <FormInputField
          label="Enter Amount"
          value={creditChange === 0 ? "" : creditChange}
          placeholder="$"
          type="text"
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            setCreditChange(value);
          }}
          required
          error={creditChangeError}
        />
<div className="flex flex-col space-y-2">
  <div className="flex flex-row items-center space-x-10">
    <input
      type="radio"
      id="add"
      name="action"
      value="Add"
      defaultChecked
      onChange={(e) => {
        setAdding(e.target.value === "Add");
         console.log(e);}}
      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
    />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor="add" className='ml-2'>Add</label>
  </div>

  <div className="flex flex-row items-center space-x-10">
    <input
      type="radio"
      id="remove"
      name="action"
      value="Remove"
      onChange={(e) => {
        setAdding(e.target.value === "Add");
         console.log(e);}}
      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
    />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor="remove" className='ml-2'>Remove</label>
  </div>
</div>

        <FormInputField
          label="Reason"
          value={reason}
          type="text"
          onChange={(e) => {
            setReason(e.target.value);
          }}
          error={creditChangeError}
        />

        <Flex justifyContent="flex-end">
          {/* <ExportToCSV/> */}
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
