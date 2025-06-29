import {
  TaskType,
  TransactionType,
  BadgeType,
  RecurrenceFrequency,
  DayOfWeek,
  TimeOption,
  Priority,
  Status,
  Icon,
} from "@prisma/client";

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
      "For someone who put in extra effort or time to achieve their goals and/or complete a task. Going beyond what is strictly required or expected.",
    icon: Icon.WINGS,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
  {
    name: "Consistency Star Badge",
    description: "Awarded for consistent attendance over a month.",
    icon: Icon.FIVE_STAR,
    type: BadgeType.CUSTOM,
    is_consecutive: true,
  },
  {
    name: "Positive Attitude Badge",
    description: "For maintaining a positive attitude throughout the week.",
    icon: Icon.FLOWER,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
];

// Helper to get ISO string for today and previous days
function getRecentDate(daysAgo: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  date.setUTCHours(12, 0, 0, 0); // Set to noon UTC for consistency
  return date.toISOString();
}

export const participants = [
  {
    participant_id: 1,
    password: "test",
    room_number: 1,
    arrival_date: getRecentDate(0),
    account_creation_date: getRecentDate(0),
    marillac_bucks: 10,
  },
  {
    participant_id: 2,
    password: "marillac",
    room_number: 3,
    arrival_date: getRecentDate(1),
    account_creation_date: getRecentDate(1),
    marillac_bucks: 120,
  },
  {
    participant_id: 3,
    password: "hello123",
    room_number: 7,
    arrival_date: getRecentDate(2),
    account_creation_date: getRecentDate(2),
    marillac_bucks: 75,
  },
  {
    participant_id: 4,
    password: "jklkjlsjd",
    room_number: 5,
    arrival_date: getRecentDate(0),
    account_creation_date: getRecentDate(0),
    marillac_bucks: 200,
  },
  {
    participant_id: 5,
    password: "waterloo",
    room_number: 2,
    arrival_date: getRecentDate(1),
    account_creation_date: getRecentDate(1),
    marillac_bucks: 145,
  },
  {
    participant_id: 6,
    password: "comp_sci_1212",
    room_number: 5,
    arrival_date: getRecentDate(10),
    departure_date: getRecentDate(1),
    account_creation_date: getRecentDate(10),
    account_removal_date: getRecentDate(1),
    marillac_bucks: 88,
  },
  {
    participant_id: 7,
    password: "pwd456",
    room_number: 6,
    arrival_date: getRecentDate(14),
    departure_date: getRecentDate(2),
    account_creation_date: getRecentDate(14),
    account_removal_date: getRecentDate(2),
    marillac_bucks: 305,
  },
  {
    participant_id: 8,
    password: "sunshine",
    room_number: 8,
    arrival_date: getRecentDate(100),
    account_creation_date: getRecentDate(100),
    departure_date: getRecentDate(3),
    marillac_bucks: 50,
  },
  {
    participant_id: 9,
    password: "blueberry",
    room_number: 9,
    arrival_date: getRecentDate(20),
    account_creation_date: getRecentDate(20),
    departure_date: getRecentDate(4),
    marillac_bucks: 60,
  },
  {
    participant_id: 10,
    password: "greenapple",
    room_number: 10,
    arrival_date: getRecentDate(50),
    departure_date: getRecentDate(5),
    account_creation_date: getRecentDate(50),
    marillac_bucks: 90,
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
    comment: "Monthly skills review."
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
    comment: "Attend your therapy session."
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
    comment: "Express yourself through art."
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
    repeat_days: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    time_preference: TimeOption.SPECIFIC,
    start_time: "13:00",
    end_time: "15:00",
    marillac_bucks_addition: 12,
    marillac_bucks_deduction: 0,
    comment: "Learn new recipes."
  },
  {
    task_name: "Meditation Session",
    task_type: TaskType.OPTIONAL,
    recurrence_preference: RecurrenceFrequency.DAILY,
    repeat_days: [],
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
    comment: "Support your peers."
  },
];

export const announcements = [
  { priority: Priority.HIGH, creation_date: getRecentDate(0), message: "Welcome to Marillac Place!" },
  { priority: Priority.NORMAL, creation_date: getRecentDate(1), message: "Art Therapy is on Wednesday at 2pm." },
  { priority: Priority.NORMAL, creation_date: getRecentDate(2), message: "Remember to check the bulletin board for updates." },
  { priority: Priority.HIGH, creation_date: getRecentDate(0), message: "Fire drill scheduled for Friday." },
  { priority: Priority.NORMAL, creation_date: getRecentDate(1), message: "Exercise class every Monday, Wednesday, and Friday." },
  { priority: Priority.NORMAL, creation_date: getRecentDate(2), message: "Kitchen will be closed for cleaning on Saturday." },
  { priority: Priority.HIGH, creation_date: getRecentDate(0), message: "Therapy sessions available Thursday afternoons." },
  { priority: Priority.NORMAL, creation_date: getRecentDate(1), message: "Peer support group meets biweekly on Thursdays." },
  { priority: Priority.NORMAL, creation_date: getRecentDate(2), message: "Cooking workshop this Saturday at 1pm." },
  { priority: Priority.HIGH, creation_date: getRecentDate(0), message: "Case management meetings are biweekly on Fridays." },
];

export const notes = [
  { participant_id: 1, message: "Participant showed great progress this week.", creation_date: getRecentDate(0) },
  { participant_id: 2, message: "Needs to attend more classes.", creation_date: getRecentDate(1) },
  { participant_id: 3, message: "Excellent participation in group activities.", creation_date: getRecentDate(2) },
  { participant_id: 4, message: "Missed therapy session.", creation_date: getRecentDate(0) },
  { participant_id: 5, message: "Helped another participant with chores.", creation_date: getRecentDate(1) },
  { participant_id: 6, message: "Positive attitude all week.", creation_date: getRecentDate(2) },
  { participant_id: 1, message: "Completed all assigned tasks.", creation_date: getRecentDate(0) },
  { participant_id: 2, message: "Needs to improve punctuality.", creation_date: getRecentDate(1) },
  { participant_id: 3, message: "Great effort in cooking workshop.", creation_date: getRecentDate(2) },
  { participant_id: 4, message: "Attended all meetings.", creation_date: getRecentDate(0) },
];

export const assignedTasks = [
  // 20 assigned tasks, mix of required/optional, various participants
  { participant_id: 1, task_name: "Weekly Review", task_status: Status.ASSIGNED, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(0), end_date: getRecentDate(1), marillac_bucks_addition: 20, marillac_bucks_deduction: 5, comment: "Complete your weekly review." },
  { participant_id: 2, task_name: "Art Therapy", task_status: Status.COMPLETE, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(1), end_date: getRecentDate(2), marillac_bucks_addition: 10, marillac_bucks_deduction: 0, comment: "Great job participating!" },
  { participant_id: 3, task_name: "Skills Assessment", task_status: Status.ASSIGNED, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(2), end_date: getRecentDate(0), marillac_bucks_addition: 30, marillac_bucks_deduction: 10, comment: "Monthly assessment due." },
  { participant_id: 4, task_name: "Exercise Class", task_status: Status.COMPLETE, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(0), end_date: getRecentDate(1), marillac_bucks_addition: 15, marillac_bucks_deduction: 0, comment: "Keep up the good work!" },
  { participant_id: 5, task_name: "Housing Plan Update", task_status: Status.ASSIGNED, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(1), end_date: getRecentDate(2), marillac_bucks_addition: 25, marillac_bucks_deduction: 8, comment: "Update your plan." },
  { participant_id: 6, task_name: "Cooking Workshop", task_status: Status.ASSIGNED, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(2), end_date: getRecentDate(0), marillac_bucks_addition: 12, marillac_bucks_deduction: 0, comment: "Try a new recipe." },
  { participant_id: 1, task_name: "Meditation Session", task_status: Status.COMPLETE, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(0), end_date: getRecentDate(1), marillac_bucks_addition: 8, marillac_bucks_deduction: 0, comment: "Relax and meditate." },
  { participant_id: 2, task_name: "Peer Support Group", task_status: Status.ASSIGNED, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(1), end_date: getRecentDate(2), marillac_bucks_addition: 10, marillac_bucks_deduction: 0, comment: "Support your peers." },
  { participant_id: 3, task_name: "Case Management Meeting", task_status: Status.ASSIGNED, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(2), end_date: getRecentDate(0), marillac_bucks_addition: 35, marillac_bucks_deduction: 7, comment: "Attend your meeting." },
  { participant_id: 4, task_name: "Therapy Session", task_status: Status.COMPLETE, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(0), end_date: getRecentDate(1), marillac_bucks_addition: 40, marillac_bucks_deduction: 10, comment: "Therapy session complete." },
  // 10 more for 20 total
  { participant_id: 5, task_name: "Weekly Review", task_status: Status.ASSIGNED, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(1), end_date: getRecentDate(2), marillac_bucks_addition: 20, marillac_bucks_deduction: 5, comment: "Complete your weekly review." },
  { participant_id: 6, task_name: "Art Therapy", task_status: Status.COMPLETE, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(2), end_date: getRecentDate(0), marillac_bucks_addition: 10, marillac_bucks_deduction: 0, comment: "Great job participating!" },
  { participant_id: 1, task_name: "Skills Assessment", task_status: Status.ASSIGNED, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(0), end_date: getRecentDate(1), marillac_bucks_addition: 30, marillac_bucks_deduction: 10, comment: "Monthly assessment due." },
  { participant_id: 2, task_name: "Exercise Class", task_status: Status.COMPLETE, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(1), end_date: getRecentDate(2), marillac_bucks_addition: 15, marillac_bucks_deduction: 0, comment: "Keep up the good work!" },
  { participant_id: 3, task_name: "Housing Plan Update", task_status: Status.ASSIGNED, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(2), end_date: getRecentDate(0), marillac_bucks_addition: 25, marillac_bucks_deduction: 8, comment: "Update your plan." },
  { participant_id: 4, task_name: "Cooking Workshop", task_status: Status.ASSIGNED, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(0), end_date: getRecentDate(1), marillac_bucks_addition: 12, marillac_bucks_deduction: 0, comment: "Try a new recipe." },
  { participant_id: 5, task_name: "Meditation Session", task_status: Status.COMPLETE, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(1), end_date: getRecentDate(2), marillac_bucks_addition: 8, marillac_bucks_deduction: 0, comment: "Relax and meditate." },
  { participant_id: 6, task_name: "Peer Support Group", task_status: Status.ASSIGNED, task_type: TaskType.OPTIONAL, goal_name: null, goal_description: null, start_date: getRecentDate(2), end_date: getRecentDate(0), marillac_bucks_addition: 10, marillac_bucks_deduction: 0, comment: "Support your peers." },
  { participant_id: 1, task_name: "Case Management Meeting", task_status: Status.ASSIGNED, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(0), end_date: getRecentDate(1), marillac_bucks_addition: 35, marillac_bucks_deduction: 7, comment: "Attend your meeting." },
  { participant_id: 2, task_name: "Therapy Session", task_status: Status.COMPLETE, task_type: TaskType.REQUIRED, goal_name: null, goal_description: null, start_date: getRecentDate(1), end_date: getRecentDate(2), marillac_bucks_addition: 40, marillac_bucks_deduction: 10, comment: "Therapy session complete." },
  // Add an INDIVIDUAL_GOAL assigned task
  {
    participant_id: 4,
    task_name: "Personal Development Goal",
    task_status: Status.ASSIGNED,
    task_type: TaskType.INDIVIDUAL_GOAL,
    goal_name: "Complete Resume",
    goal_description: "Finish and submit an updated resume to staff.",
    start_date: getRecentDate(0),
    end_date: getRecentDate(1),
    marillac_bucks_addition: 15,
    marillac_bucks_deduction: 0,
    comment: "Great progress on your personal goal!",
  },
];

export const userAnnouncements = [
  { announcement_id: 1, participant_id: 1, is_read: false, read_date: null },
  { announcement_id: 2, participant_id: 2, is_read: true, read_date: getRecentDate(0) },
  { announcement_id: 3, participant_id: 3, is_read: false, read_date: null },
  { announcement_id: 4, participant_id: 4, is_read: false, read_date: null },
  { announcement_id: 5, participant_id: 5, is_read: false, read_date: null },
  { announcement_id: 6, participant_id: 6, is_read: false, read_date: null },
  { announcement_id: 7, participant_id: 7, is_read: true, read_date: getRecentDate(1) },
  { announcement_id: 8, participant_id: 8, is_read: false, read_date: null },
  { announcement_id: 9, participant_id: 9, is_read: false, read_date: null },
  { announcement_id: 10, participant_id: 4, is_read: false, read_date: null },
  { announcement_id: 1, participant_id: 2, is_read: true, read_date: getRecentDate(2) },
  { announcement_id: 5, participant_id: 3, is_read: true, read_date: getRecentDate(0) },
  { announcement_id: 7, participant_id: 5, is_read: false, read_date: null },
  { announcement_id: 8, participant_id: 6, is_read: true, read_date: getRecentDate(1) },
  { announcement_id: 10, participant_id: 1, is_read: false, read_date: null },
];

export const earnedBadges = [
  {
    earned_badge_id: 1,
    participant_id: 1,
    date_received: getRecentDate(0),
    name: "Log-in Badge",
    description: "Logged in for 1 day",
    badge_icon: Icon.FIVE_STAR,
    level: 0,
  },
  {
    earned_badge_id: 2,
    participant_id: 2,
    date_received: getRecentDate(1),
    name: "Perfect Score Badge for Optional Tasks",
    description: "Completed 4 optional tasks",
    badge_icon: Icon.FLOWER,
    level: 1,
  },
  {
    earned_badge_id: 3,
    participant_id: 3,
    date_received: getRecentDate(2),
    name: "Individual Goals Completed Badge",
    description: "Completed 1 individual goal",
    badge_icon: Icon.GEMSTONE,
    level: 0,
  },
];



