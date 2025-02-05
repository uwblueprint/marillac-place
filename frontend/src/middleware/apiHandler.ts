import { useQuery, useMutation } from "@apollo/client";

import HELLO from "../gql/queries";

// import { 
//     CREATE_ANNOUNCEMENT, 
//     UPDATE_ANNOUNCEMENT, 
//     DELETE_ANNOUNCEMENT,
//     CREATE_PARTICIPANT,
//     UPDATE_PARTICIPANT,
//     CREATE_TASK,
//     UPDATE_TASK,
//     DELETE_TASK
// } from "../gql/mutations";

/* eslint-disable react-hooks/rules-of-hooks */

export const sayHello = () => {
  const { loading, error, data, refetch } = useQuery(HELLO);
  return { loading, data, error };
};

export const login = () => {

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

