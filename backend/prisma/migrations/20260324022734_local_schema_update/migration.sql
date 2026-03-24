-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EARNING', 'PURCHASE', 'REFUND');

-- CreateEnum
CREATE TYPE "GoalAction" AS ENUM ('SET', 'REACHED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('REQUIRED', 'OPTIONAL', 'INDIVIDUAL_GOAL');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('ASSIGNED', 'INCOMPLETE', 'COMPLETE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "DayPreference" AS ENUM ('DAILY', 'EVERY_SELECTED_DAYS', 'DAY_RANGE', 'PARTICIPANT_PREFERENCE');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "TimePreference" AS ENUM ('ANYTIME', 'SPECIFIC', 'PARTICIPANT_PREFERENCE');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('NOVICE', 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND');

-- CreateEnum
CREATE TYPE "Icon" AS ENUM ('FIVE_STAR', 'FOUR_STAR', 'GROUP', 'HEART', 'HOME', 'BABY', 'WINGS', 'FLOWER', 'MONEY', 'GEMSTONE', 'DIAMOND', 'PENCIL', 'TOOL', 'PLANT');

-- CreateTable
CREATE TABLE "participant" (
    "pid" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "room" INTEGER NOT NULL,
    "arrival" TIMESTAMP(3) NOT NULL,
    "departure" TIMESTAMP(3),
    "balance" INTEGER NOT NULL DEFAULT 0,
    "total_earnings" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "participant_pkey" PRIMARY KEY ("pid")
);

-- CreateTable
CREATE TABLE "transaction" (
    "pid" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'EARNING',
    "reason" TEXT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("pid","date")
);

-- CreateTable
CREATE TABLE "earning_goal" (
    "pid" INTEGER NOT NULL,
    "action" "GoalAction" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" INTEGER NOT NULL,

    CONSTRAINT "earning_goal_pkey" PRIMARY KEY ("pid","date")
);

-- CreateTable
CREATE TABLE "login_history" (
    "pid" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("pid","date")
);

-- CreateTable
CREATE TABLE "announcement" (
    "aid" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topic" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("aid")
);

-- CreateTable
CREATE TABLE "received_announcement" (
    "aid" INTEGER NOT NULL,
    "pid" INTEGER NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "received_announcement_pkey" PRIMARY KEY ("aid","pid")
);

-- CreateTable
CREATE TABLE "task" (
    "tid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "value" INTEGER NOT NULL,
    "penalty" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "day_preference" "DayPreference" NOT NULL,
    "days" "DayOfWeek"[],
    "time_preference" "TimePreference" NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),

    CONSTRAINT "task_pkey" PRIMARY KEY ("tid")
);

-- CreateTable
CREATE TABLE "assigned_task" (
    "aid" SERIAL NOT NULL,
    "pid" INTEGER NOT NULL,
    "tid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'ASSIGNED',
    "value" INTEGER NOT NULL,
    "penalty" INTEGER NOT NULL,
    "comment" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assigned_task_pkey" PRIMARY KEY ("aid")
);

-- CreateTable
CREATE TABLE "custom_badge" (
    "cid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" "Icon" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "custom_badge_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "earned_custom_badge" (
    "eid" SERIAL NOT NULL,
    "pid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" "Icon" NOT NULL,
    "description" TEXT NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "earned_custom_badge_pkey" PRIMARY KEY ("eid")
);

-- CreateTable
CREATE TABLE "system_badge" (
    "name" TEXT NOT NULL,
    "icon" "Icon" NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "system_badge_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "badge_level" (
    "name" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "value" INTEGER NOT NULL,
    "benchmark" INTEGER NOT NULL,

    CONSTRAINT "badge_level_pkey" PRIMARY KEY ("name","level")
);

-- CreateTable
CREATE TABLE "achieved_badge_level" (
    "name" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "pid" INTEGER NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achieved_badge_level_pkey" PRIMARY KEY ("name","level","pid")
);

-- CreateTable
CREATE TABLE "badge_level_progress" (
    "name" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "pid" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL,

    CONSTRAINT "badge_level_progress_pkey" PRIMARY KEY ("name","level","pid")
);

-- CreateTable
CREATE TABLE "note" (
    "nid" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_pkey" PRIMARY KEY ("nid")
);

-- CreateTable
CREATE TABLE "report_recipient" (
    "email" TEXT NOT NULL,
    "weekly" BOOLEAN NOT NULL DEFAULT true,
    "monthly" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "report_recipient_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_name_key" ON "task"("name");

-- CreateIndex
CREATE UNIQUE INDEX "custom_badge_name_key" ON "custom_badge"("name");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_pid_fkey" FOREIGN KEY ("pid") REFERENCES "participant"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earning_goal" ADD CONSTRAINT "earning_goal_pid_fkey" FOREIGN KEY ("pid") REFERENCES "participant"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_pid_fkey" FOREIGN KEY ("pid") REFERENCES "participant"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "received_announcement" ADD CONSTRAINT "received_announcement_aid_fkey" FOREIGN KEY ("aid") REFERENCES "announcement"("aid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "received_announcement" ADD CONSTRAINT "received_announcement_pid_fkey" FOREIGN KEY ("pid") REFERENCES "participant"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_task" ADD CONSTRAINT "assigned_task_pid_fkey" FOREIGN KEY ("pid") REFERENCES "participant"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earned_custom_badge" ADD CONSTRAINT "earned_custom_badge_pid_fkey" FOREIGN KEY ("pid") REFERENCES "participant"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_level" ADD CONSTRAINT "badge_level_name_fkey" FOREIGN KEY ("name") REFERENCES "system_badge"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achieved_badge_level" ADD CONSTRAINT "achieved_badge_level_name_level_fkey" FOREIGN KEY ("name", "level") REFERENCES "badge_level"("name", "level") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achieved_badge_level" ADD CONSTRAINT "achieved_badge_level_pid_fkey" FOREIGN KEY ("pid") REFERENCES "participant"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_level_progress" ADD CONSTRAINT "badge_level_progress_name_level_fkey" FOREIGN KEY ("name", "level") REFERENCES "badge_level"("name", "level") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_level_progress" ADD CONSTRAINT "badge_level_progress_pid_fkey" FOREIGN KEY ("pid") REFERENCES "participant"("pid") ON DELETE CASCADE ON UPDATE CASCADE;
