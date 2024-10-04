-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('STAFF', 'RESIDENT');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('REQUIRED', 'OPTIONAL', 'CHORE', 'ACHIEVEMENT');

-- CreateEnum
CREATE TYPE "DaysOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDA', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "RecurrenceFrequency" AS ENUM ('ONE_TIME', 'REPEATS_PER_WEEK_SELECTED', 'REPEATS_PER_WEEK_ONCE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING_APPROVAL', 'ASSIGNED', 'INCOMPLETE', 'COMPLETE', 'EXCUSED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "type" "UserType" NOT NULL,
    "auth_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "display_name" TEXT,
    "profile_picture_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "user_id" INTEGER NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "residents" (
    "user_id" INTEGER NOT NULL,
    "resident_id" INTEGER NOT NULL,
    "birth_date" DATE NOT NULL,
    "room_number" INTEGER NOT NULL,
    "credits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date_joined" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_left" DATE,
    "notes" TEXT,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "type" "TaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "credit_value" DOUBLE PRECISION NOT NULL,
    "location_id" INTEGER NOT NULL,
    "end_date" TIMESTAMP(3),
    "recurrence_frequency" "RecurrenceFrequency" NOT NULL,
    "specific_day" "DaysOfWeek",
    "repeat_days" "DaysOfWeek"[],

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_locations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "task_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks_assigned" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "assigner_id" INTEGER,
    "assignee_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "comments" TEXT,

    CONSTRAINT "tasks_assigned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warnings" (
    "id" SERIAL NOT NULL,
    "assigner_id" INTEGER,
    "resident_id" INTEGER NOT NULL,
    "related_task_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date_issued" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications_received" (
    "id" SERIAL NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notifications_received_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "residents_resident_id_key" ON "residents"("resident_id");

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "task_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks_assigned" ADD CONSTRAINT "tasks_assigned_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks_assigned" ADD CONSTRAINT "tasks_assigned_assigner_id_fkey" FOREIGN KEY ("assigner_id") REFERENCES "staff"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks_assigned" ADD CONSTRAINT "tasks_assigned_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "residents"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "warnings_assigner_id_fkey" FOREIGN KEY ("assigner_id") REFERENCES "staff"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "warnings_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "warnings_related_task_id_fkey" FOREIGN KEY ("related_task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications_received" ADD CONSTRAINT "notifications_received_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications_received" ADD CONSTRAINT "notifications_received_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
