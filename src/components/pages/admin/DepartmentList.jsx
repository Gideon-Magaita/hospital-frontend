import React from 'react'
import DepartmentTable from './DepartmentTable'

export default function DepartmentList() {
  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          
          <div className="col-md-12">
            <DepartmentTable/>
          </div>

        </div>
      </div>
    </section>
  );
}
