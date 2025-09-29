import {
  TaskType,
  BadgeType,
  RecurrenceFrequency,
  DayOfWeek,
  TimeOption,
  Priority,
  Status,
  Icon,
} from "@prisma/client";
import { getRecentDate } from "../utils/formatDateTime";

export const participants = [
  {
    participant_id: 1,
    password: "test",
    room_number: 1,
    arrival_date: getRecentDate(0, false),
    account_creation_date: getRecentDate(0, false),
    departure_date: null,
    account_removal_date: null,
    marillac_bucks: 10,
    marillac_bucks_goal: 150,
  },
  {
    participant_id: 2,
    password: "marillac",
    room_number: 3,
    arrival_date: getRecentDate(1, false),
    account_creation_date: getRecentDate(1, false),
    departure_date: null,
    account_removal_date: null,
    marillac_bucks: 120,
    marillac_bucks_goal: null,
  },
  {
    participant_id: 3,
    password: "hello123",
    room_number: 7,
    arrival_date: getRecentDate(8, false),
    account_creation_date: getRecentDate(8, false),
    departure_date: null,
    account_removal_date: null,
    marillac_bucks: 75,
    marillac_bucks_goal: null,
  },
  {
    participant_id: 8,
    password: "sunshine",
    room_number: 8,
    arrival_date: getRecentDate(100, false),
    account_creation_date: getRecentDate(100, false),
    departure_date: getRecentDate(3, false),
    account_removal_date: getRecentDate(3, false),
    marillac_bucks: 50,
    marillac_bucks_goal: 800,
  },
  {
    participant_id: 9,
    password: "blueberry",
    room_number: 9,
    arrival_date: getRecentDate(20, false),
    account_creation_date: getRecentDate(20, false),
    departure_date: getRecentDate(4, false),
    account_removal_date: getRecentDate(4, false),
    marillac_bucks: 60,
    marillac_bucks_goal: 720,
  },
];

export const tasks = [
  // Required tasks
  {
    task_name: "Weekly Review",
    task_type: TaskType.REQUIRED,
    recurrence_preference: RecurrenceFrequency.DAILY,
    repeat_days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    time_preference: TimeOption.SPECIFIC,
    start_time: "09:00",
    end_time: "10:00",
    marillac_bucks_addition: 20,
    marillac_bucks_deduction: 5,
    comment: "Weekly check-in."
  },
  {
    task_name: "Skills Assessment",
    task_type: TaskType.REQUIRED,
    recurrence_preference: RecurrenceFrequency.DAILY,
    repeat_days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    time_preference: TimeOption.ANYTIME,
    start_time: null,
    end_time: null,
    marillac_bucks_addition: 30,
    marillac_bucks_deduction: 10,
    comment: null
  },
  {
    task_name: "Housing Plan Update",
    task_type: TaskType.REQUIRED,
    recurrence_preference: RecurrenceFrequency.DAILY,
    repeat_days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    time_preference: TimeOption.SPECIFIC,
    start_time: "11:00",
    end_time: "12:00",
    marillac_bucks_addition: 25,
    marillac_bucks_deduction: 8,
    comment: "Update your housing plan."
  },
  {
    task_name: "Therapy Session",
    task_type: TaskType.REQUIRED,
    recurrence_preference: RecurrenceFrequency.DAILY,
    repeat_days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    time_preference: TimeOption.SPECIFIC,
    start_time: "15:00",
    end_time: "16:00",
    marillac_bucks_addition: 40,
    marillac_bucks_deduction: 10,
    comment: null
  },
  {
    task_name: "Case Management Meeting",
    task_type: TaskType.REQUIRED,
    recurrence_preference: RecurrenceFrequency.EVERY_SELECTED_DAYS,
    repeat_days: [DayOfWeek.FRIDAY, DayOfWeek.SUNDAY],
    time_preference: TimeOption.ANYTIME,
    start_time: null,
    end_time: null,
    marillac_bucks_addition: 35,
    marillac_bucks_deduction: 7,
    comment: "Biweekly case management."
  },
  // Optional tasks
  {
    task_name: "Art Therapy",
    task_type: TaskType.OPTIONAL,
    recurrence_preference: RecurrenceFrequency.DAILY,
    repeat_days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    time_preference: TimeOption.SPECIFIC,
    start_time: "14:00",
    end_time: "15:00",
    marillac_bucks_addition: 10,
    marillac_bucks_deduction: 0,
    comment: null
  },
  {
    task_name: "Exercise Class",
    task_type: TaskType.OPTIONAL,
    recurrence_preference: RecurrenceFrequency.ANY_SELECTED_DAYS,
    repeat_days: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    time_preference: TimeOption.ANYTIME,
    start_time: null,
    end_time: null,
    marillac_bucks_addition: 15,
    marillac_bucks_deduction: 0,
    comment: "Stay active!"
  },
  {
    task_name: "Cooking Workshop",
    task_type: TaskType.OPTIONAL,
    recurrence_preference: RecurrenceFrequency.PARTICIPANT_PREFERENCE,
    repeat_days: [],
    time_preference: TimeOption.SPECIFIC,
    start_time: "13:00",
    end_time: "15:00",
    marillac_bucks_addition: 12,
    marillac_bucks_deduction: 0,
    comment: null
  },
  {
    task_name: "Meditation Session",
    task_type: TaskType.OPTIONAL,
    recurrence_preference: RecurrenceFrequency.DAILY,
    repeat_days: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    time_preference: TimeOption.SPECIFIC,
    start_time: "10:00",
    end_time: "10:30",
    marillac_bucks_addition: 8,
    marillac_bucks_deduction: 0,
    comment: "Relax and meditate."
  },
  {
    task_name: "Peer Support Group",
    task_type: TaskType.OPTIONAL,
    recurrence_preference: RecurrenceFrequency.EVERY_SELECTED_DAYS,
    repeat_days: [DayOfWeek.THURSDAY],
    time_preference: TimeOption.ANYTIME,
    start_time: null,
    end_time: null,
    marillac_bucks_addition: 10,
    marillac_bucks_deduction: 0,
    comment: null
  },
];

export const assignedTasks = [
  {
    participant_id: 1,
    task_name: "Personal Development Goal",
    task_status: Status.ASSIGNED,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Complete Resume",
    goal_description: "Finish and submit an updated resume to staff.",
    start_date: getRecentDate(0, true, "10:30"),
    end_date: getRecentDate(0, true, "14:00"),
    marillac_bucks_addition: 15,
    marillac_bucks_deduction: 0,
    comment: "Great progress on your personal goal!",
  },
  {
    participant_id: 1,
    task_name: "Budget Planning Session",
    task_status: Status.COMPLETE,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Create Monthly Budget",
    goal_description: "Develop a comprehensive monthly budget plan with staff guidance.",
    start_date: getRecentDate(1, true, "09:00"),
    end_date: getRecentDate(1, true, "11:00"),
    marillac_bucks_addition: 25,
    marillac_bucks_deduction: 0,
    comment: null,
  },
  {
    participant_id: 1,
    task_name: "Job Interview Preparation",
    task_status: Status.ASSIGNED,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Practice Interview Skills",
    goal_description: "Complete mock interview sessions and prepare responses to common questions.",
    start_date: getRecentDate(2, true, "14:00"),
    end_date: getRecentDate(2, true, "16:00"),
    marillac_bucks_addition: 20,
    marillac_bucks_deduction: 0,
    comment: "Keep practicing - you're doing great!",
  },
  {
    participant_id: 1,
    task_name: "Community Service Project",
    task_status: Status.ASSIGNED,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Volunteer Hours",
    goal_description: "Complete 10 hours of community service at local food bank.",
    start_date: getRecentDate(3, true, "08:00"),
    end_date: getRecentDate(3, true, "18:00"),
    marillac_bucks_addition: 30,
    marillac_bucks_deduction: 0,
    comment: null,
  },
  {
    participant_id: 1,
    task_name: "Life Skills Workshop",
    task_status: Status.INCOMPLETE,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Learn Basic Cooking",
    goal_description: "Attend cooking workshop and prepare a complete meal independently.",
    start_date: getRecentDate(4, true, "12:00"),
    end_date: getRecentDate(4, true, "15:00"),
    marillac_bucks_addition: 18,
    marillac_bucks_deduction: 5,
    comment: "Please reschedule - this is important for independent living.",
  },
  {
    participant_id: 1,
    task_name: "Housing Application Review",
    task_status: Status.ASSIGNED,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Submit Housing Applications",
    goal_description: "Review and submit applications for permanent housing options.",
    start_date: getRecentDate(5, true, "13:00"),
    end_date: getRecentDate(5, true, "15:00"),
    marillac_bucks_addition: 35,
    marillac_bucks_deduction: 0,
    comment: null,
  },
  // Tasks for participant 2
  {
    participant_id: 2,
    task_name: "Financial Literacy Course",
    task_status: Status.COMPLETE,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Complete Financial Education",
    goal_description: "Attend all sessions of the financial literacy course.",
    start_date: getRecentDate(1, true, "10:00"),
    end_date: getRecentDate(1, true, "12:00"),
    marillac_bucks_addition: 25,
    marillac_bucks_deduction: 0,
    comment: "Excellent completion of the course!",
  },
  {
    participant_id: 2,
    task_name: "Mental Health Check-in",
    task_status: Status.ASSIGNED,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Weekly Therapy Sessions",
    goal_description: "Attend weekly one-on-one therapy sessions for mental health support.",
    start_date: getRecentDate(0, true, "15:00"),
    end_date: getRecentDate(0, true, "16:00"),
    marillac_bucks_addition: 20,
    marillac_bucks_deduction: 0,
    comment: null,
  },
  {
    participant_id: 2,
    task_name: "Peer Mentor Training",
    task_status: Status.ASSIGNED,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Become Peer Mentor",
    goal_description: "Complete training to become a peer mentor for new participants.",
    start_date: getRecentDate(2, true, "09:00"),
    end_date: getRecentDate(2, true, "17:00"),
    marillac_bucks_addition: 40,
    marillac_bucks_deduction: 0,
    comment: "Great leadership potential!",
  },
  // Tasks for participant 3
  {
    participant_id: 3,
    task_name: "Education Planning",
    task_status: Status.ASSIGNED,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Enroll in GED Program",
    goal_description: "Complete enrollment process for GED preparation classes.",
    start_date: getRecentDate(1, true, "11:00"),
    end_date: getRecentDate(1, true, "13:00"),
    marillac_bucks_addition: 30,
    marillac_bucks_deduction: 0,
    comment: null,
  },
  {
    participant_id: 3,
    task_name: "Substance Abuse Counseling",
    task_status: Status.COMPLETE,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Complete Counseling Sessions",
    goal_description: "Attend all required substance abuse counseling sessions.",
    start_date: getRecentDate(3, true, "14:00"),
    end_date: getRecentDate(3, true, "15:30"),
    marillac_bucks_addition: 25,
    marillac_bucks_deduction: 0,
    comment: "Proud of your commitment to recovery!",
  },
  {
    participant_id: 3,
    task_name: "Family Reconnection Session",
    task_status: Status.ASSIGNED,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Rebuild Family Relationships",
    goal_description: "Participate in mediated family therapy session.",
    start_date: getRecentDate(4, true, "16:00"),
    end_date: getRecentDate(4, true, "17:30"),
    marillac_bucks_addition: 35,
    marillac_bucks_deduction: 0,
    comment: null,
  },
  // Tasks for departed participant 8
  {
    participant_id: 8,
    task_name: "Transition Planning",
    task_status: Status.COMPLETE,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Prepare for Departure",
    goal_description: "Complete all exit requirements and transition planning.",
    start_date: getRecentDate(5, true, "10:00"),
    end_date: getRecentDate(5, true, "16:00"),
    marillac_bucks_addition: 50,
    marillac_bucks_deduction: 0,
    comment: "Successfully completed all transition requirements!",
  },
  // Tasks for departed participant 9
  {
    participant_id: 9,
    task_name: "Exit Interview",
    task_status: Status.COMPLETE,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Program Completion",
    goal_description: "Complete final evaluation and exit interview process.",
    start_date: getRecentDate(6, true, "13:00"),
    end_date: getRecentDate(6, true, "14:30"),
    marillac_bucks_addition: 25,
    marillac_bucks_deduction: 0,
    comment: null,
  },
];

export const announcements = [
  {
    priority: Priority.HIGH,
    creation_date: getRecentDate(0, true),
    message: "Welcome to Marillac Place!"
  },
  {
    priority: Priority.NORMAL,
    creation_date: getRecentDate(1, true),
    message: "Art Therapy is on Wednesday at 2pm."
  },
  {
    priority: Priority.NORMAL,
    creation_date: getRecentDate(1, true),
    message: "Remember to check the bulletin board for updates."
  },
  {
    priority: Priority.CRITICAL,
    creation_date: getRecentDate(0, true),
    message: "Fire drill scheduled for Friday."
  },
  {
    priority: Priority.NORMAL,
    creation_date: getRecentDate(1, true),
    message: "Exercise class every Monday, Wednesday, and Friday."
  },
  {
    priority: Priority.NORMAL,
    creation_date: getRecentDate(2, true),
    message: "Kitchen will be closed for cleaning on Saturday."
  },
  {
    priority: Priority.HIGH,
    creation_date: getRecentDate(0, true),
    message: "Therapy sessions available Thursday afternoons."
  },
];

export const userAnnouncements = [
  {
    announcement_id: 1,
    participant_id: 1,
    is_read: false,
    read_date: null
  },
  {
    announcement_id: 1,
    participant_id: 3,
    is_read: true,
    read_date: getRecentDate(2, true)
  },
  {
    announcement_id: 1,
    participant_id: 2,
    is_read: false,
    read_date: null
  },
  {
    announcement_id: 2,
    participant_id: 1,
    is_read: false,
    read_date: null
  },
  {
    announcement_id: 3,
    participant_id: 3,
    is_read: false,
    read_date: null
  },
  {
    announcement_id: 3,
    participant_id: 2,
    is_read: false,
    read_date: null
  },
  {
    announcement_id: 4,
    participant_id: 3,
    is_read: false,
    read_date: null
  },
  {
    announcement_id: 5,
    participant_id: 1,
    is_read: false,
    read_date: null
  },
  {
    announcement_id: 6,
    participant_id: 2,
    is_read: false,
    read_date: null
  },
  {
    announcement_id: 7,
    participant_id: 3,
    is_read: false,
    read_date: null
  },
];

export const customBadges = [
  {
    name: "Housing Plan Badge",
    description:
      "Completed housing plan",
    icon: Icon.HOME,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
  {
    name: "Helping Hands Badge",
    description:
      "For someone who did a thoughtful deed or action to help support staff and/or another participant",
    icon: Icon.HEART,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
  {
    name: "Back on the Wagon Badge",
    description:
      "For someone who pulls together after a bad start to their week",
    icon: Icon.GROUP,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
  {
    name: "Above and Beyond Badge",
    description:
      "For someone who put in extra effort or time to achieve their goals and/or complete a task",
    icon: Icon.WINGS,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
  {
    name: "Consistency Star Badge",
    description: "Awarded for consistent attendance over a month",
    icon: Icon.FIVE_STAR,
    type: BadgeType.CUSTOM,
    is_consecutive: true,
  },
  {
    name: "Positive Attitude Badge",
    description: "For maintaining a positive attitude throughout the week",
    icon: Icon.FLOWER,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
];

export const earnedBadges = [
  {
    earned_badge_id: 1,
    participant_id: 1,
    date_received: getRecentDate(0, false),
    name: "Log-in Badge",
    description: "Logged in for 1 day",
    badge_icon: Icon.FIVE_STAR,
    level: 0,
  },
  {
    earned_badge_id: 2,
    participant_id: 2,
    date_received: getRecentDate(1, false),
    name: "Perfect Score Badge for Optional Tasks",
    description: "Completed 4 optional tasks",
    badge_icon: Icon.FLOWER,
    level: 1,
  },
  {
    earned_badge_id: 3,
    participant_id: 3,
    date_received: getRecentDate(7, false),
    name: "Individual Goals Completed Badge",
    description: "Completed 1 individual goal",
    badge_icon: Icon.GEMSTONE,
    level: 0,
  },
];

export const notes = [
  {
    message: "Need to contact organizations for Marie's housing plan",
    creation_date: getRecentDate(0, true),
  },
  {
    message: "More classes to be scheduled",
    creation_date: getRecentDate(1, true)
  },
  {
    message: "Excellent participation in group activities overall this week",
    creation_date: getRecentDate(1, true)
  },
  {
    message: "Therapy session on Thursday",
    creation_date: getRecentDate(0, true)
  },
  {
    message: "Help another participant with chores",
    creation_date: getRecentDate(2, true)
  },
];



