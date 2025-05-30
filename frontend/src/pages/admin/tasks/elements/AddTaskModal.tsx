import { Modal, ModalOverlay, ModalContent, ModalBody, Text, Flex, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import React, { useState } from "react";

type AddTaskModalProps = {
  type: string;
  close: () => void;
}

export default function AddTaskModal({
  type,
  close
}: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    console.log("submitted");
  }

  return (
    <Modal closeOnOverlayClick={false} isOpen onClose={close} isCentered>
      <ModalOverlay/>
      <ModalContent
        boxShadow="xl"
        borderRadius="16px"
        width="550px"
        maxWidth="550px"
        padding="20px"
      >
        <ModalBody>
          <Text textStyle="web.h3" mb="15px">Add Task</Text>
          <Flex
            flexDir="column"
            gap="10px"
          >
            <Flex gap="5px" alignItems="flex-end">
              <Text textStyle="web.s1" color="text.light.secondary">Task Type:</Text>
              <Text textStyle="web.b3" color="text.light.secondary">{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
            </Flex>

            <FormControl>
              <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                <Text textStyle="web.s1" color="text.light.secondary">Task Name</Text>
              </FormLabel>
              <Input
                variant="primary"
                type="text"
                value={taskName}
                onChange={(e: any) => setTaskName(e.target.value)}
              />
            </FormControl>

            { error && <Text textStyle="web.b2" fontWeight="600" color="#E30000">{error}</Text> }

            <Flex
              alignItems="center"
              justifyContent="flex-end"
              gap="15px"
              mt="15px"
            >
              <Button
                variant="white"
                onClick={close}
              >
                <Text textStyle="web.s1">Cancel</Text>
              </Button>

              <Button
                variant="primaryFilled"
                onClick={ handleSubmit }
                // isLoading={loading}
              >
                <Text textStyle="web.s1" color="white">Save</Text>
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}