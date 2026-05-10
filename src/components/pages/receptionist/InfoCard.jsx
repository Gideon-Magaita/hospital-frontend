import React from "react";


export default function InfoCard({ icon, bg, title, value }) {
  return (
    <div className="col-12 col-sm-6 col-md-3 mt-5">
      <div className="info-box">
        <span className={`info-box-icon ${bg} elevation-1`}>
          <i className={icon}></i>
        </span>

        <div className="info-box-content">
          <span className="info-box-text">{title}</span>
          <span className="info-box-number">{value}</span>
        </div>
      </div>
    </div>
  );
}