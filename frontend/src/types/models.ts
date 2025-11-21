import {
  Level,
  Priority,
  TaskType,
  TaskStatus,
  Icon,
  GoalAction,
  DayPreference,
  DayOfWeek,
  TimePreference,
  TransactionType,
} from "./enums";

export interface AchievedBadgeLevel {
  name: string;
  level: Level;
  pid: number;
  date: string;

  badge_level?: BadgeLevel;
  participant?: Participant;
}

export interface Announcement {
  aid: number;
  date: string;
  message: string;
  priority: Priority;

  ReceivedAnnouncement?: ReceivedAnnouncement[];
}

export interface AssignedTask {
  aid: number;
  pid: number;
  tid: number;
  name: string;
  type: TaskType;
  status: TaskStatus;
  value: number;
  penalty: number;
  comment?: string;
  start_date: string;
  end_date: string;

  participant?: Participant;
}

export interface BadgeLevel {
  name: string;
  level: Level;
  value: number;
  benchmark: number;

  AchievedBadgeLevel?: AchievedBadgeLevel[];
  BadgeLevelProgress?: BadgeLevelProgress[];

  system_badge?: SystemBadge;
}

export interface BadgeLevelProgress {
  name: string;
  level: Level;
  pid: number;
  progress: number;

  badge_level?: BadgeLevel;
  participant?: Participant;
}

export interface CustomBadge {
  cid: number;
  name: string;
  icon: Icon;
  description: string;
}

export interface EarningGoal {
  pid: number;
  action: GoalAction;
  date: string;
  value: number;

  participant?: Participant;
}

export interface EarnedCustomBadge {
  eid: number;
  pid: number;
  name: string;
  icon: Icon;
  description: string;

  participant?: Participant;
}

export interface LoginHistory {
  pid: number;
  date: string;

  participant?: Participant;
}

export interface Note {
  nid: number;
  message: string;
  date: string;
}

export interface Participant {
  pid: number;
  password: string;
  room: number;
  arrival: string;
  departure?: string;
  balance: number;
  total_earnings: number;

  Transaction?: Transaction[];
  EarningGoal?: EarningGoal[];
  LoginHistory?: LoginHistory[];
  ReceivedAnnouncement?: ReceivedAnnouncement[];
  AssignedTask?: AssignedTask[];
  EarnedCustomBadge?: EarnedCustomBadge[];
  AchievedBadgeLevel?: AchievedBadgeLevel[];
  BadgeLevelProgress?: BadgeLevelProgress[];
}

export interface ReceivedAnnouncement {
  aid: number;
  pid: number;
  read: boolean;
  pinned: boolean;

  participant?: Participant;
  announcement?: Announcement;
}

export interface ReportRecipient {
  email: string;
  weekly: boolean;
  monthly: boolean;
}

export interface SystemBadge {
  name: string;
  icon: Icon;
  description: string;
  is_active: boolean;

  BadgeLevel?: BadgeLevel[];
}

export interface Task {
  tid: number;
  name: string;
  type: TaskType;
  value: number;
  penalty: number;
  comment?: string;
  day_preference: DayPreference;
  days: DayOfWeek[];
  time_preference: TimePreference;
  start_time?: string;
  end_time?: string;
}

export interface Transaction {
  pid: number;
  date: string;
  amount: number;
  type: TransactionType;
  reason: string;

  participant?: Participant;
}
