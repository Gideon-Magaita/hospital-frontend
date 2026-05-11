import React from 'react'
import AppointmentTable from './AppointmentTable'


function AppointmentList() {
  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          
          <div className="col-md-12">
            <AppointmentTable/>
          </div>

        </div>
      </div>
    </section>
  )
}

export default AppointmentList
