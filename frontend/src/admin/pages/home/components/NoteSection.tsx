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
        <Text textStyle="web.h3" color="primary.700" pl="5px">
          Internal Notes
        </Text>
        <Text textStyle="web.b3" color="text.light.secondary">
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
          <Text textStyle="web.b2" color="text.light.secondary">
            No Admin Notes Yet
          </Text>
        ) : (
          getNotesData?.getNotes.map((note: Note) => {
            return (
              <WidgetContainer
                key={note.nid}
                bg_color="neutral.100"
                width="100%"
                height="fit-content"
              >
                <Flex
                  width="100%"
                  maxHeight="200px"
                  flexWrap="wrap"
                  overflow="hidden"
                >
                  <Text textStyle="web.b2" color="#000000">
                    {note.message}
                  </Text>
                </Flex>

                <Flex
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                  mt="5px"
                >
                  <Text textStyle="web.b3" color="text.light.secondary">
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
        paddingTop="10px"
        paddingBottom="12px"
      >
        <InputGroup width="100%" height="100%">
          <Input
            width="100%"
            height="100%"
            fontFamily="Nunito"
            fontWeight="400"
            fontSize="14px"
            color="#000000"
            placeholder="Write a note"
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            border="1px solid"
            borderColor="neutral.300"
            borderRadius="8px"
            _focus={{
              borderColor: "neutral.300",
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
              <Airplane color="primary.700" size={16} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </WidgetContainer>
  );
};

export default NoteSection;
