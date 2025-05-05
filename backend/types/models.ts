import { gql } from "apollo-server-express";

const models = gql`
  type Participant {
    participant_id: Int!
    password: String!
    room_number: Int!
    arrival_date: DateTime!
    departure_date: DateTime
    account_creation_date: DateTime!
    account_removal_date: DateTime
    marillac_bucks: Int!
    marillac_bucks_goal: Int
  }

  type Task {
    task_id: Int!
    task_name: String!
    task_type: TaskType!
    recurrence_preference: RecurrenceFrequency!
    repeat_days: [DayOfWeek!]!
    time_preference: TimeOption!
    start_time: String
    end_time: String
    marillac_bucks_addition: Int!
    marillac_bucks_deduction: Int!
    comment: String
  }

  type AssignedTask {
    assigned_task_id: Int!
    participant_id: Int!
    task_name: String!
    task_status: Status!
    task_type: TaskType!
    goal_name: String
    goal_description: String
    repeats: Boolean!
    start_date: DateTime!
    end_date: DateTime!
    marillac_bucks_addition: Int!
    marillac_bucks_deduction: Int!
    comment: String
  }

  type Note {
    note_id: Int!
    message: String!
    creation_date: DateTime!
  }

  type Announcement {
    announcement_id: Int!
    priority: Priority!
    creation_date: DateTime!
    message: String!
  }

  type UserAnnouncement {
    read: Boolean!
    pinned: Boolean!
    announcement_id: Int!
    participant_id: Int!
  }

  type Login {
    participant_id: Int!
    login_date: DateTime!
  }

  type Transaction {
    transaction_id: Int!
    participant_id: Int!
    transaction_date: DateTime!
    transaction_type: TransactionType!
    marillac_bucks: Int!
  }

  type Badge {
    badge_id: Int!
    badge_type: BadgeType!
    name: String!
    description: String!
    is_active: Boolean!
    is_consecutive: Boolean!
    icon: Icon!
  }

  type BadgeLevel {
    badge_id: Int!
    level: Int!
    benchmark: Int!
    marillac_bucks: Int!
  }

  type EarnedBadge {
    earned_badge_id: Int!
    participant_id: Int!
    date_received: DateTime!
    name: String!
    description: String!
    badge_icon: Icon!
    level: Int!
  }
    
  type ParticipantProgress {
      participant_id: Int!
      optional_tasks_completed: Int!
      first_goals_set_badge_level: Int!
      weeks_optional_tasks_complete: Int!
      perfect_score_optional_badge_level: Int!
      weeks_mandatory_tasks_complete: Int!
      perfect_score_mandatory_badge_level: Int!
      weeks_individual_goal_complete: Int!
      individual_goals_completed_badge_level: Int!
      days_logged_in: Int!
      login_badge_level: Int!
      total_earnings: Int!
      money_earned_badge_level: Int!
      beginner_badges_achieved: Int!
      bronze_badges_achieved: Int!
      silver_badges_achieved: Int!
      gold_badges_achieved: Int!
      diamond_badges_achieved: Int!
      pr_leader_badge_level: Int!
      task_types_tried: [String!]!
      jack_of_all_trades_badge_level: Int!
  }
`;

export default models;
