import React from 'react'
import { SpecializationTable } from './SpecializationTable'


export const SpecializationList = () => {
  return (
     <section className="content">
      <div className="container-fluid">
        <div className="row">
          
          <div className="col-md-12">
            <SpecializationTable/>
          </div>

        </div>
      </div>
    </section>
  )
}

export default SpecializationList;
