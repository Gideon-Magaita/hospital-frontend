import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDepartmentById } from "../services/DepartmentService";
import { toast } from "react-toastify";

export default function DepartmentDetails() {

  const { id } = useParams();

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDepartment = async () => {

      try {

        const response = await getDepartmentById(id);
        setDepartment(response.data);

      } catch (error) {

        console.log(error);
        toast.error("Failed to load department details");

      } finally {

        setLoading(false);

      }

    };

    fetchDepartment();

  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="text-center mt-5">
        <h4>Department not found</h4>
      </div>
    );
  }

  return (
    <section className="content">

      <div className="container-fluid">

        <div className="row">

          <div className="col-md-12">

            <div className="card shadow-sm mt-5">

              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">
                  Department Details
                </h3>
              </div>

              <div className="card-body">

                <div className="mb-3">
                  <strong>ID:</strong> {department.id}
                </div>

                <div className="mb-3">
                  <strong>Name:</strong> {department.name}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}