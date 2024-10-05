import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventContentArg } from '@fullcalendar/core';
import React from "react";

const events = [
  { title: 'Meeting', start: new Date('2024-09-29T09:00:00'), end: new Date('2024-09-29T010:00:00') }
]

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

export function ScheduleCalendar() {
  return (
    <div>
      <h1>Demo App</h1>
      <FullCalendar
      plugins={[timeGridPlugin]}
      initialView='timeGridWeek'
      weekends
      events={events}
      slotMinTime="08:00:00"
      slotMaxTime="19:00:00"
      eventContent={renderEventContent}
      eventDisplay="block"
      />
    </div>
  )
}



export default ScheduleCalendar;