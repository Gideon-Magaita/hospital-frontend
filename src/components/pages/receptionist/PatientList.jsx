import React from 'react'
import PatientTable from './PatientTable'

function PatientList() {
  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          
          <div className="col-md-12">
            <PatientTable/>
          </div>

        </div>
      </div>
    </section>
  )
}

export default PatientList
