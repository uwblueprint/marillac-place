import { gql } from "@apollo/client";

export const HELLO = gql`
    query hello($helloRequest: helloRequestType) {
        hello(helloRequest: $helloRequest)
    }
`;

export const GET_AUTHORIZATION_TOKEN = gql``;

export const GET_ALL_ANNOUNCEMENTS = gql``;

export const GET_ANNOUNCEMENTS_BY_TYPE = gql``;

export const GET_ANNOUNCEMENTS_BY_DATE = gql``;

export const GET_ALL_PARTICIPANTS = gql``;

export const GET_PARTICIPANT_CREDIT = gql``;

export const GET_TASKS_BY_TYPE = gql``;

export const GET_TASKS_BY_DATE_AND_ROOM = gql``;

export const GET_TASKS_BY_STATUS = gql``;

