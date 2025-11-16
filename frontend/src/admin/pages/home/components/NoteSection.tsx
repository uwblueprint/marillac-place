import React, { useMemo, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";
import OrangeButton from "../../../../ui/buttons/OrangeButton";
import { CREATE_NOTE, DELETE_NOTE, GET_NOTES } from "../../../../gql/noteRequests";

type Note = {
  nid: number;
  message: string;
  date: string;
};

export default function NoteSection() {
  const [newNote, setNewNote] = useState("");

  const {
    loading: getNotesLoading,
    error: getNotesError,
    data: getNotesData,
    refetch,
  } = useQuery<{ getNotes: Note[] }>(GET_NOTES);

  const [createNote, { loading: createNoteLoading }] =
    useMutation(CREATE_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);

  const sortedNotes = useMemo(
    () =>
      getNotesData?.getNotes
        ?.slice()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ) ?? [],
    [getNotesData]
  );

  const sendNote = async () => {
    const trimmedNote = newNote.trim();
    if (!trimmedNote) {
      return;
    }

    try {
      await createNote({
        variables: {
          message: trimmedNote,
        },
      });
      setNewNote("");
      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const dismissNote = async (noteId: number) => {
    try {
      await deleteNote({
        variables: {
          nid: noteId,
        },
      });
      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex flexGrow={1}>
      <WidgetContainer width="100%" height="100%" paddingX="20px" paddingY="15px">
        <Flex
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          mb="12px"
        >
          <Text textStyle="web.h3" color="primary.700">
            Internal Notes
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" mt="5px">
            Expires in 48h
          </Text>
        </Flex>
        <Flex
          flex="1"
          flexDir="column"
          gap="10px"
          overflowY="auto"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {getNotesLoading ? (
            <Text textStyle="web.b2" color="text.light.secondary" textAlign="center">
              Loading...
            </Text>
          ) : getNotesError ? (
            <Text textStyle="web.b2" color="text.light.secondary" textAlign="center">
              {getNotesError.message}
            </Text>
          ) : sortedNotes.length === 0 ? (
            <Text textStyle="web.b2" color="text.light.secondary" textAlign="center">
              No Admin Notes Yet
            </Text>
          ) : (
            sortedNotes.map((note) => {
              const creation = new Date(note.date).toLocaleString("en-CA", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                month: "short",
                day: "numeric",
              });

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
                    mt="6px"
                  >
                    <Text textStyle="web.b3" color="text.light.secondary">
                      {creation}
                    </Text>
                    <Text
                      onClick={() => dismissNote(note.nid)}
                      _hover={{ textDecoration: "none" }}
                      textStyle="web.b3"
                      color="#000000"
                      textDecoration="underline"
                      fontWeight={600}
                      cursor="pointer"
                    >
                      Dismiss
                    </Text>
                  </Flex>
                </WidgetContainer>
              );
            })
          )}
        </Flex>
        <Flex flexDir="column" gap="10px" mt="16px">
          <TextAreaInput
            label="Write a note"
            current_value={newNote}
            update_action={setNewNote}
            size="large"
          />
          <OrangeButton
            label={createNoteLoading ? "Sending..." : "Send Note"}
            action={sendNote}
            is_active={Boolean(newNote.trim())}
          />
        </Flex>
      </WidgetContainer>
    </Flex>
  );
};