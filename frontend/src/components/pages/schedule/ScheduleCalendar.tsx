import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import { DayHeaderContentArg, EventContentArg } from '@fullcalendar/core';
import React, { useEffect, useRef } from "react";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";

const events = [
  { title: 'test', start: new Date('2024-09-29T09:00:00'), end: new Date('2024-09-29T10:00:00' ), allDay: true },
]

function renderEventContent(eventInfo: EventContentArg) {
  const isAllDay = eventInfo.event.allDay;
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: isAllDay ? 'row' : 'column',
      padding: '5px', 
      borderRadius: '5px', 
      border: '0px', 
      borderLeft: '5px solid #255B9A', 
      backgroundColor: '#C5DCF8', 
      color: '#255B9A', 
      justifyContent: isAllDay ? 'space-between' : 'flex-start',
    }}>
      <div><b>{eventInfo.event.title}</b></div>
      {isAllDay ? '' : `${new Date(eventInfo.event.start!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(eventInfo.event.end!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      <ModeCommentOutlinedIcon fontSize="inherit" style={{marginTop: '3px'}} />
    </div>
  )
}

function renderHeaderContent(date: DayHeaderContentArg) {
  const dayOfWeek = date.date.toLocaleString('en-US', { weekday: 'long' });
  const dayOfMonth = date.date.getDate();

  return (
    <div style={{ textAlign: 'center'}}>
      {dayOfWeek.substring(0, 3).toUpperCase()}
      <br />
      {dayOfMonth}
    </div>
  )
}

export function ScheduleCalendar() {  
  const calendarRef = useRef<any>(null);
  const handleAllDayContent = (arg: any) => {
    return <span>{arg.text ? '' : ''}</span>;
  };
  return (
    <div>
      <FullCalendar
      plugins={[timeGridPlugin]}
      initialView='timeGridWeek'
      weekends
      events={events}
      slotMinTime="08:00:00"
      slotMaxTime="19:00:00"
      slotDuration={{ minute: 20 }}
      slotLabelInterval={{ hours: 1 }}
      eventContent={renderEventContent}
      dayHeaderContent={renderHeaderContent}
      eventDisplay="block"
      firstDay={1} // Set the first day of the week to Monday
      slotLabelFormat={{ hour: 'numeric', minute: '2-digit', hour12: true }} // Format slots as H:MM am/pm
      allDayContent={handleAllDayContent}
      eventBackgroundColor='transparent'
      eventBorderColor='transparent'
      slotEventOverlap={false}
      />
    </div>
  )
}

export default ScheduleCalendar;