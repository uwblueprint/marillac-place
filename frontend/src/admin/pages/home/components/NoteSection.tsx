import React, { useState } from "react";
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Spinner, Text } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import SendIcon from "@mui/icons-material/Send";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { CREATE_NOTE, DELETE_NOTE, GET_NOTES } from "../../../../gql/noteRequests";
import useNotification from "../../../../hooks/useNotification";
import { Note } from "../../../../types/models";
import { formatDateTimeString } from "../../../../helpers/formatDateTime";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";

export default function NoteSection() {
  const [newNote, setNewNote] = useState("");
  const { sendNotification } = useNotification();
  const [error, setError] = useState("");

  const {
    loading: getNotesLoading,
    error: getNotesError,
    data: getNotesData,
    refetch,
  } = useQuery<{ getNotes: Note[] }>(GET_NOTES);
  const [createNote, { loading: createNoteLoading }] = useMutation(CREATE_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);

  const sendNote = async () => {
    if (!newNote.trim()) return;
    setError("");
    try {
      await createNote({
        variables: {
          message: newNote,
        },
      });
      setNewNote("");
      await refetch();
      sendNotification("Note created.");
    } catch (err) {
      setError("failed to create note.");
    }
  };

  const dismissNote = async (noteId: number) => {
    setError("");
    try {
      await deleteNote({
        variables: {
          nid: noteId,
        },
      });
      await refetch();
      sendNotification("Note dismissed.");
    } catch (err) {
      setError("failed to dismiss note.");
    }
  };

  const notes = getNotesData?.getNotes ?? [];
  const hasNotes = notes.length > 0;

  return (
    <WidgetContainer
      width="275px"
      height="100%"
      paddingX="16px"
      paddingY="12px"
      loading={getNotesLoading}
      error={getNotesError?.message}
    >
      <Flex w="100%" h="100%" flexDir="column" gap="8px" minH={0}>
        <Flex
          w="100%"
          flexDir="row"
          justifyContent="flex-start"
          alignItems="center"
          pb="4px"
          gap="12px"
        >
          <Text textStyle="web.h3" color="primary.700">
            Internal Notes
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" mt="5px">
            Expires in 48h
          </Text>
        </Flex>

        {error && (
          <Text textStyle="web.b2" color="#E30000">
            {error}
          </Text>
        )}

        <Flex
          w="100%"
          flex="1"
          flexDir="column"
          gap="8px"
          alignItems={hasNotes ? "stretch" : "center"}
          justifyContent={hasNotes ? "flex-start" : "center"}
          overflowY="auto"
          minH={0}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {hasNotes ? (
            notes.map((note: Note) => (
              <WidgetContainer
                key={note.nid}
                width="100%"
                paddingX="12px"
                paddingY="8px"
                bg_color="neutral.100"
              >
                <Text
                  textStyle="web.b2"
                  color="#000000"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  {note.message}
                </Text>
                <Flex
                  width="100%"
                  justifyContent="space-between"
                  alignItems="flex-end"
                  pt="4px"
                >
                  <Text textStyle="web.b3" color="text.light.secondary">
                    {formatDateTimeString(note.date)}
                  </Text>
                  <UnderlineButton
                    label="Dismiss"
                    action={() => dismissNote(note.nid)}
                  />
                </Flex>
              </WidgetContainer>
            ))
          ) : (
            <Text textStyle="web.b2" color="text.light.secondary">
              No Admin Notes
            </Text>
          )}
        </Flex>

        <InputGroup pt="4px">
          <Input
            type="text"
            value={newNote}
            placeholder="Write a note"
            onChange={(e) => setNewNote(e.target.value)}
            width="100%"
            height="40px"
            paddingX="12px"
            paddingY="6px"
            border="1px"
            borderColor="#C5C8D8"
            borderRadius="8px"
            fontFamily="Nunito"
            fontWeight="400"
            fontSize="12px"
            color="#000000"
            _focus={{
              borderColor: "#C5C8D8",
              boxShadow: "none",
            }}
          />
          <InputRightElement>
            {createNoteLoading ? (
              <Spinner size="sm" color="primary.700" />
            ) : (
              <Button
                onClick={() => sendNote()}
                padding="0px"
                bg="transparent"
                _hover={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
              >
                {/* TODO: Replace with custom icon component */}
                <SendIcon
                  style={{
                    color: "#0C727E",
                    width: "16px",
                    height: "16px",
                    marginTop: "8px",
                    backgroundColor: "transparent",
                  }}
                />
              </Button>
            )}
          </InputRightElement>
        </InputGroup>
      </Flex>
    </WidgetContainer>
  );
};