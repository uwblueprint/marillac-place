import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { CalendarEvent, AssignedTask } from "./ScheduleTypes";
import { GET_PARTICIPANT_BY_ROOM } from "../../../../gql/example";
import {
  formatDateFromDateString,
  getWeekBounds,
} from "../../../../utils/formatDate";

export const useScheduleData = (selectedRoom: number) => {
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [marillacBucks, setMarillacBucks] = useState<number>(0);
  const [specificTasks, setSpecificTasks] = useState<CalendarEvent[]>([]);
  const [anytimeTasks, setAnytimeTasks] = useState<CalendarEvent[]>([]);
  const [anydayTasks, setAnydayTasks] = useState<CalendarEvent[]>([]);

  const [fetchData, { loading, error, data }] = useLazyQuery(
    GET_PARTICIPANT_BY_ROOM
  );

  function groupTasks(tasks: AssignedTask[]) {
    const { weekStart, weekEnd } = getWeekBounds();

    const specific: CalendarEvent[] = [];
    const anytime: CalendarEvent[] = [];
    const anyday: CalendarEvent[] = [];

    for (const task of tasks) {
      const start = formatDateFromDateString(task.start_date);
      const end = formatDateFromDateString(task.end_date);

      if (task.start_date >= weekStart || task.start_date <= weekEnd) {
        const isSameDay = start.toDateString() === end.toDateString();
        const isDayStart = start.getHours() === 0 && start.getMinutes() === 0;
        const isDayEnd = end.getHours() === 23 && end.getMinutes() === 59;

        const event: CalendarEvent = {
          id: task.assigned_task_id,
          title: task.task_name,
          start,
          end,
          allDay: !isSameDay || (isDayStart && isDayEnd),
          task_status: task.task_status,
          task_type: task.task_type,
          goalName: task.goal_name ?? "",
          goalDescription: task.goal_description ?? "",
          marillacBucksAddition: task.marillac_bucks_addition,
          marillac_bucks_deduction: task.marillac_bucks_deduction,
          comment: task.comment,
        };

        if (!isSameDay) {
          anyday.push(event);
        } else if (isDayStart && isDayEnd) {
          anytime.push(event);
        } else {
          specific.push(event);
        }
      }
    }

    setSpecificTasks(specific);
    setAnytimeTasks(anytime);
    setAnydayTasks(anyday);
  }

  useEffect(() => {
    setParticipantId(null);
    setMarillacBucks(0);
    setSpecificTasks([]);
    setAnytimeTasks([]);
    setAnydayTasks([]);
    fetchData({ variables: { room_number: selectedRoom } });
  }, [selectedRoom, fetchData]);

  useEffect(() => {
    if (!loading && !error && data && data.getParticipantByRoom) {
      const participant = data.getParticipantByRoom;
      setParticipantId(participant.participant_id);
      setMarillacBucks(participant.marillac_bucks);
      groupTasks(participant.assigned_tasks);
    }
  }, [data, loading, error]);

  return {
    loading,
    error,
    participantId,
    marillacBucks,
    specificTasks,
    anytimeTasks,
    anydayTasks,
  };
};
