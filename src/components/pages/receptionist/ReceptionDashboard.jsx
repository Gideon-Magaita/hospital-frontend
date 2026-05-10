import React from 'react'
import InfoCard from './InfoCard'
import { getLoggedInUser, isUserLoggedIn } from "../services/AuthService";

export default function ReceptionDashboard() {

    const isAuth = isUserLoggedIn();
   
    const username = getLoggedInUser();

    
  return (
    <section className="content">
          <div className="container-fluid">


         {/* welcome user badge  */}
          <div className="d-flex align-items-center justify-content-end">
            <div
              className="shadow-sm px-4 py-2 rounded bg-white border"
              style={{
                borderLeft: "5px solid #053174",
                fontSize: "16px",
                marginTop:"20px", 
              }}
            >
              <i className="fas fa-user-circle text-primary me-2"></i>

              <span className="text-muted me-1">
                Welcome,
              </span>

              <span className="fw-bold text-dark text-uppercase">
                {username}
              </span>
            </div>
          </div>
        {/* welcome user badge  */}


            <div className="row">
    
              <InfoCard
                icon="fas fa-cog"
                bg="bg-info"
                title="CPU Traffic"
                value="10%"
              />
    
              <InfoCard
                icon="fas fa-thumbs-up"
                bg="bg-danger"
                title="Likes"
                value="41,410"
              />
    
              <InfoCard
                icon="fas fa-shopping-cart"
                bg="bg-success"
                title="Sales"
                value="760"
              />
    
              <InfoCard
                icon="fas fa-users"
                bg="bg-warning"
                title="New Members"
                value="2,000"
              />
    
            </div>
            
          </div>
        </section>
  )
}
