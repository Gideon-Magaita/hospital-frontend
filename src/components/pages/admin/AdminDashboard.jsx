import React from 'react'
import InfoCard from './InfoCard'

export default function AdminDashboard() {
  return (
    <section className="content">
          <div className="container-fluid">
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
