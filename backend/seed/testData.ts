// Test data for production testing
// This is a minimal set of test accounts that can be used in production
// for testing purposes without cluttering the database with full mock data

export const testParticipants = [
  {
    participant_id: 100,
    password: "test123",
    room_number: 100,
    arrival_date: new Date(),
    account_creation_date: new Date(),
    departure_date: null,
    account_removal_date: null,
    marillac_bucks: 50,
    marillac_bucks_goal: 200,
  },
  {
    participant_id: 101,
    password: "test123",
    room_number: 101,
    arrival_date: new Date(),
    account_creation_date: new Date(),
    departure_date: null,
    account_removal_date: null,
    marillac_bucks: 75,
    marillac_bucks_goal: 300,
  },
];
