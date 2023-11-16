import { gql } from "apollo-server-express";

//TODO: Look into custom types for dates and date time types  

const residentType = gql`
  type ResidentDTO {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    phone_number: String
    display_name: String!
    profile_picture_link: String
    birthdate: String
    credits: Float
    date_joined: String
    date_left: String
    notification: [NotificationDTO!]
  }

  input CreateResidentDTO {
    first_name: String!
    last_name: String!
    email: String!
    phone_number: String
    display_name: String!
    profile_picture_link: String
    birthdate: String
    credits: Float
    date_joined: String
  }

  input UpdateResidentDTO {
    first_name: String
    last_name: String
    email: String
    phone_number: String
    display_name: String
    profile_picture_link: String
    birthdate: String
    credits: Float
    date_joined: String
    date_left: String
  }

  extend type Query {
    residentsById(id: [ID!]): [ResidentDTO!]
    allResidents: [ResidentDTO!]
  }

  extend type Mutation {
    updateResident(id: ID!, resident: UpdateResidentDTO!): ResidentDTO!
    addResident(resident: CreateResidentDTO!): ResidentDTO!
    deleteResident(id: ID!): ResidentDTO!
  }
`;

export default residentType;
