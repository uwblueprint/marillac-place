import { gql } from "apollo-server-express";

const dataModels = gql`
  type Participant {
    participant_id: Int!          
    room_number: Int!
    arrival: DateTime!
    departure: DateTime
    is_active: Boolean!       
    password: String!
    credit_earned: Int!    
  }

  type Announcement {
    announcement_id: Int!
    from: StaffType!    
    to: [Int!]!         
    createdAt: DateTime!
    message: String!
  }

  type Task {
    task_id: Int!
    room_number: Int
    type: TaskType!
    status: TaskStatus!  
    name: String!
    is_recurring: Boolean!
    start: DateTime!
    end: DateTime!
    credit: Int!
    comment: String
  }
`;

export default dataModels;
