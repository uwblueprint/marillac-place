import { useQuery, useMutation } from "@apollo/client";
import { helloRequestType } from "../types/api/requestTypes";

import { 
    HELLO, 
    GET_AUTHORIZATION_TOKEN, 
    GET_SUMMARY,
    GET_ALL_ANNOUNCEMENTS,
    GET_ANNOUNCEMENTS_BY_TYPE,
    GET_ANNOUNCEMENTS_BY_DATE,
    GET_ALL_PARTICIPANTS,
    GET_PARTICIPANT_CREDIT,
    GET_TASKS_BY_TYPE,
    GET_TASKS_BY_DATE_AND_ROOM,
    GET_TASKS_BY_STATUS
} from "../gql/queries";

import { 
    CREATE_ANNOUNCEMENT, 
    UPDATE_ANNOUNCEMENT, 
    DELETE_ANNOUNCEMENT,
    CREATE_PARTICIPANT,
    UPDATE_PARTICIPANT,
    CREATE_TASK,
    UPDATE_TASK,
    DELETE_TASK
} from "../gql/mutations";

/* eslint-disable react-hooks/rules-of-hooks */

export const hello = (helloRequest: helloRequestType) => {
  const { loading, error, data, refetch } = useQuery(HELLO, {
    variables: { helloRequest },
  });
  return { loading, data, error };
};

export const login = () => {

};

export const getSummary = () => {

};

export const getAllAnnouncements = () => {

};

export const getPrivateAnnouncements = () => {

};

export const getGroupAnnouncements = () => {

};

export const getAnnouncementsThisWeek = () => {

};

export const getAllParticipants = () => {

};

export const getMarillacBucks = () => {

};

export const getRequiredTasks = () => {

};

export const getOptionalTasks = () => {

};

export const getChores = () => {

};

export const getUnassignedTasks = () => {

};

export const getTasksByDateAndRoom = () => {

};

/* eslint-enable react-hooks/rules-of-hooks */

