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
import {
  CREATE_NOTE,
  DELETE_NOTE,
  GET_NOTES,
} from "../../../../gql/noteRequests";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { Airplane } from "../../../../ui/icons/ActionIcons";
import { Note } from "../../../../types/models";
import { formatDateV3 } from "../../../../helpers/formatDateTime";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";

const NoteSection = () => {
  const [newNote, setNewNote] = useState("");

  const [createNote, { loading: createNoteLoading, error: createNoteError }] =
    useMutation(CREATE_NOTE, {
      refetchQueries: [{ query: GET_NOTES }],
      awaitRefetchQueries: true,
    });
  const [deleteNote, { loading: deleteNoteLoading, error: deleteNoteError }] =
    useMutation(DELETE_NOTE, {
      refetchQueries: [{ query: GET_NOTES }],
      awaitRefetchQueries: true,
    });
  const {
    loading: getNotesLoading,
    error: getNotesError,
    data: getNotesData,
  } = useQuery(GET_NOTES);

  async function sendNote() {
    if (newNote === "") {
      return;
    }
    await createNote({
      variables: {
        message: newNote,
      },
    });
    setNewNote("");
  }

  async function dismissNote(nid: number) {
    await deleteNote({
      variables: {
        nid,
      },
    });
  }

  return (
    <WidgetContainer
      bg_color="transparent"
      width="100%"
      height="100%"
      paddingY="12px"
      paddingX="20px"
      loading={getNotesLoading}
      error={getNotesError?.message}
    >
      <Flex
        w="100%"
        h="40px"
        flexDir="row"
        justifyContent="flex-start"
        alignItems="baseline"
        gap="10px"
        paddingBottom="10px"
      >
        <Text textStyle="h3" color="brand.primaryDark" pl="5px">
          Internal Notes
        </Text>
        <Text textStyle="b2" color="text.light">
          Expires in 48h
        </Text>
      </Flex>

      <Flex
        gap="10px"
        flexDir="column"
        alignItems="center"
        overflow="scroll"
        w="100%"
        height="calc(100% - 90px)"
        justifyContent={getNotesData?.getNotes.length > 0 ? "top" : "center"}
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {getNotesData?.getNotes.length === 0 ? (
          <Text textStyle="b1" color="text.light">
            No Admin Notes Yet
          </Text>
        ) : (
          getNotesData?.getNotes.map((note: Note) => {
            return (
              <WidgetContainer
                key={note.nid}
                bg_color="background.highlight"
                width="100%"
                height="fit-content"
                paddingY="10px"
              >
                <Flex
                  width="100%"
                  maxHeight="200px"
                  flexWrap="wrap"
                  overflow="hidden"
                >
                  <Text textStyle="b2" color="text.dark">
                    {note.message}
                  </Text>
                </Flex>

                <Flex
                  width="100%"
                  justifyContent="space-between"
                  alignItems="baseline"
                  mt="6px"
                >
                  <Text textStyle="b2" color="text.medium">
                    {formatDateV3(new Date(note.date))}
                  </Text>
                  <UnderlineButton
                    label="Dismiss"
                    action={() => dismissNote(note.nid)}
                  />
                </Flex>
              </WidgetContainer>
            );
          })
        )}
      </Flex>

      <Flex
        width="100%"
        height="60px"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        bottom="0"
        left="0"
        paddingX="20px"
        paddingY="10px"
      >
        <InputGroup width="100%" height="100%">
          <Input
            width="100%"
            height="100%"
            fontFamily="Nunito"
            fontWeight="400"
            fontSize="12px"
            color="text.dark"
            placeholder="Write a note"
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            border="1px solid"
            borderColor="background.border"
            borderRadius="8px"
            _focus={{
              borderColor: "background.border",
              boxShadow: "none",
            }}
          />
          <InputRightElement width="fit-content" height="100%">
            <Button
              onClick={() => sendNote()}
              bg="transparent"
              padding="0px"
              _hover={{ bg: "transparent" }}
            >
              <Airplane color="brand.primaryDark" size={16} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </WidgetContainer>
  );
};

export default NoteSection;
