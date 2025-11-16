import React, { useState } from "react";
import { Button, Flex, Input, InputGroup, InputRightElement, Spinner, Text } from "@chakra-ui/react";
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

  return (
      <WidgetContainer 
        width="300px" 
        height="100%" 
        paddingX="16px" 
        paddingY="16px"
        loading={getNotesLoading}
        error={getNotesError?.message}
      >
        <Flex
          w="100%"
          flexDir="row"
          justifyContent="flex-start"
          alignItems="center"
          pl="2px"
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

        { error && (
          <Text textStyle="web.b2" color="#E30000" pl="2px">
            {error}
          </Text>
        )}

        <Flex
          w="100%"
          flexGrow={1}
          flexDir="column"
          gap="8px"
          overflowY="auto"
          alignItems="center"
          justifyContent="top"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          { getNotesData?.getNotes.length === 0 ? (
            <Text textStyle="web.b2" color="text.light.secondary" mt="200px">
              No Admin Notes
            </Text>
          ) : (
            getNotesData?.getNotes.map((note: Note) => {
              return (
                <WidgetContainer
                  key={note.nid}
                  width="100%"
                  paddingX="12px"
                  paddingY="10px"
                  bg_color="neutral.100"
                >
                  <Flex width="100%" flexWrap="wrap" overflow="hidden">
                    <Text textStyle="web.b2" color="#000000">
                      {note.message}
                    </Text>
                  </Flex>
                  <Flex
                    width="100%"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    mt="4px"
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
              );
            })
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
          <InputRightElement
            height="100%"
            alignItems="center"   
          >
            { createNoteLoading ? (
              <Spinner size="sm" color="primary.700" />
            ): (
              <Button
                onClick={() => sendNote()}
                bg="transparent"
                padding="0px"
                _hover={{ scale: 1.1 }}
              >
                {/* TODO: Replace with custom icon component */}
                <SendIcon style={{ 
                  color: "#0C727E",
                  width: "16px",
                  height: "16px",
                }} />
              </Button>
            )}
          </InputRightElement>
        </InputGroup>
      </WidgetContainer>
  );
};