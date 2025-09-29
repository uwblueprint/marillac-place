import { gql } from "apollo-server-express";

const models = gql`
    type Participant {
        participant_id: Int!
        password: String!
        room_number: Int!
        arrival_date: String!
        departure_date: String
        account_creation_date: String!
        account_removal_date: String
        marillac_bucks: Int!
        marillac_bucks_goal: Int

        assigned_tasks: [AssignedTask!]!
        user_announcements: [UserAnnouncement!]!
        logins: [Login!]!
        transactions: [Transaction!]!
        earned_badges: [EarnedBadge!]!
        participant_progress: ParticipantProgress
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
        start_date: String!
        end_date: String!
        marillac_bucks_addition: Int!
        marillac_bucks_deduction: Int!
        comment: String

        participant: Participant!
    }

    type Note {
        note_id: Int!
        message: String!
        creation_date: String!
    }

    type Announcement {
        announcement_id: Int!
        priority: Priority!
        creation_date: String!
        message: String!
        
        user_announcements: [UserAnnouncement!]!
    }

    type UserAnnouncement {
        read: Boolean!
        pinned: Boolean!
        announcement_id: Int!
        participant_id: Int!
        
        announcement: Announcement!
        participant: Participant!
    }

    type Login {
        participant_id: Int!
        login_date: String!
        
        participant: Participant!
    }

    type Transaction {
        transaction_id: Int!
        participant_id: Int!
        transaction_date: String!
        transaction_type: TransactionType!
        description: String
        marillac_bucks: Int!
        
        participant: Participant!
    }

    type Badge {
        badge_id: Int!
        badge_type: BadgeType!
        name: String!
        description: String!
        is_active: Boolean!
        is_consecutive: Boolean!
        icon: Icon!
        offered_levels: [String!]!
        
        badge_level: [BadgeLevel!]!
        earned_badge: [EarnedBadge!]!
    }

    type BadgeLevel {
        badge_id: Int!
        level: Int!
        benchmark: Int!
        marillac_bucks: Int!
        
        badge: Badge!
    }

    type EarnedBadge {
        earned_badge_id: Int!
        participant_id: Int!
        badge_id: Int!
        date_received: String!
        name: String!
        description: String!
        badge_icon: Icon!
        level: Int!
        
        participant: Participant!
        badge: Badge!
    }

    type ParticipantProgress {
        participant_id: Int!
        optional_tasks_completed: Int!
        weeks_optional_tasks_complete: Int!
        weeks_mandatory_tasks_complete: Int!
        weeks_individual_goal_complete: Int!
        days_logged_in: Int!
        total_earnings: Int!
        badges_achieved: [Int!]!
        task_types_tried: [String!]!
        
        participant: Participant!
    }

`;

export default models;
