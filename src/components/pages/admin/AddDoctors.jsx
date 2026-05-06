import React from "react";
import DoctorsTable from "./DoctorsTable";

export default function AddDoctors() {
  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          
          <div className="col-md-12">
            <DoctorsTable />
          </div>

        </div>
      </div>
    </section>
  );
}