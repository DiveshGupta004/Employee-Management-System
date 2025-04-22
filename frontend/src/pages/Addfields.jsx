import React from 'react'
import Department from '../components/DepartmentTable'
import Designation from '../components/Designation'
import EventType from "../components/EventType";
import LeaveType from "../components/LeaveType";
function Addfields() {
  return (
    <>
    <Department/>
      <Designation/>
      <EventType />
      <LeaveType/>
    </>
  )
}

export default Addfields
