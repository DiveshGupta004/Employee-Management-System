import React from 'react'
import EventCalendar from '../components/EventCalendar'
import CreateEvent from '../components/CreateEvent'
import EventList from '../components/EventList'
function Events() {
  return (
    <>
    <EventCalendar />
    <CreateEvent />
      <EventList />
    </>
  )
}

export default Events