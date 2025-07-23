import React from 'react';
import ParticipantPageHeader from '../../../components/participant/PageHeader';
import TodoListWidget from './elements/TodoListWidget';

export default function ParticipantsHomePage() {
  return (
    <>
      <ParticipantPageHeader currentPage="Home" />
      <TodoListWidget />
    </>
  )
}