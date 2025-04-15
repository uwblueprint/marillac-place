import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import SendSvg from "../../../assets/svg/SendSvg";
import { CREATE_NOTE, DELETE_NOTE } from "../../../gql/mutations";
import { GET_NOTES } from "../../../gql/queries";

const NoteSection = () => {
  const [newNote, setNewNote] = useState("");

  const [createNote] = useMutation(CREATE_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);
  const {
    loading: getNotesLoading,
    error: getNotesError,
    data: getNotesData,
  } = useQuery(GET_NOTES);

  async function sendNote() {
    if (newNote === "") {
      return;
    }
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const date = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formatted = `${time}, ${date}`;
    try {
      await createNote({
        variables: {
          message: newNote,
          date: now.toISOString(),
          formattedDate: formatted,
        },
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  async function dismissNote(noteId: string) {
    try {
      await deleteNote({
        variables: {
          noteId,
        },
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Flex
      margin="10px"
      paddingY="15px"
      paddingX="20px"
      w="300px"
      border="2px"
      borderColor="gray.200"
      borderRadius="md"
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex
        w="100%"
        h="25px"
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="lg" fontWeight="600" color="teal.main" mb="0px">
          Admin Notes
        </Text>
        <Text fontSize="xs" fontWeight="400" color="gray.500" mb="0px">
          Expires in 48h
        </Text>
      </Flex>
      <Flex
        alignItems="center"
        overflow="scroll"
        height="85%"
        justifyContent="center"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {getNotesLoading ? (
          <Text fontSize="sm" fontWeight="500" color="gray.500">
            Loading...
          </Text>
        ) : getNotesError ? (
          <Text
            fontSize="sm"
            fontWeight="500"
            color="gray.500"
            textAlign="center"
            width="100%"
            flexWrap="wrap"
            overflow="hidden"
          >
            {getNotesError.message}
          </Text>
        ) : getNotesData?.getNotes ? (
          getNotesData.getNotes.length === 0 ? (
            <Text fontSize="sm" fontWeight="500" color="gray.500">
              No Admin Notes Yet
            </Text>
          ) : (
            <Flex
              width="100%"
              height="100%"
              flexDir="column"
              justifyContent="flex-start"
              gap="15px"
            >
              {getNotesData.getNotes.map((note: any) => (
                <Flex
                  key={note.noteId}
                  flexDir="column"
                  width="100%"
                  bg="#F7FAFC"
                  border="solid"
                  borderColor="gray.200"
                  rounded="md"
                  paddingX="10px"
                  paddingY="5px"
                  gap="5px"
                >
                  <Flex
                    width="100%"
                    flexWrap="wrap"
                    overflow="hidden"
                    fontSize="sm"
                  >
                    {note.message}
                  </Flex>
                  <Flex
                    width="100%"
                    justifyContent="space-between"
                    alignItems="flex-end"
                  >
                    <Flex fontSize="sm" color="gray.500">
                      {note.formattedDate}
                    </Flex>
                    <Flex
                      onClick={() => dismissNote(note.noteId)}
                      _hover={{ textDecoration: "none" }}
                      fontSize="sm"
                      fontWeight="500"
                      textDecoration="underline"
                      cursor="pointer"
                    >
                      Dismiss
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )
        ) : (
          <Text fontSize="sm" fontWeight="500" color="gray.500">
            An unknown issue has occured
          </Text>
        )}
      </Flex>
      <InputGroup>
        <Input
          variant="outline"
          placeholder="Write a note"
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          border="solid"
          borderColor="gray.200"
        />

        <InputRightElement>
          <Button
            onClick={() => sendNote()}
            bg="transparent"
            padding="0px"
            _hover={{ bg: "transparent" }}
          >
            <SendSvg />
          </Button>
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default NoteSection;
