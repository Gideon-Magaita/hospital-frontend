import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllSpecialization,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "../services/SpecializationService";

import ConfirmModal from "../../common/ConfirmModal";

import $ from "jquery";

// Bootstrap Modal
import { Modal } from "bootstrap";

// DataTables
import "datatables.net";
import "datatables.net-bs5";

// Buttons
import "datatables.net-buttons";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";

// CSS
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";

// Export dependencies
import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

window.JSZip = jszip;
pdfMake.vfs = pdfFonts.vfs;

export const SpecializationTable = () => {

  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  // =========================
  // STATES
  // =========================
  const [specializations, setSpecializations] = useState([]);

  const [specialization, setSpecialization] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);

  // EDIT STATES
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // DELETE STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =========================
  // FETCH
  // =========================
  const fetchSpecializations = () => {

    getAllSpecialization()
      .then((response) => setSpecializations(response.data))
      .catch(() => toast.error("Failed to load specializations"));

  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  // =========================
  // DATATABLE
  // =========================
  useEffect(() => {

    if (!specializations || specializations.length === 0) return;

    const timer = setTimeout(() => {

      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      dataTableRef.current = $(tableRef.current).DataTable({
        pageLength: 5,
        responsive: true,
        destroy: true,
        dom:
          "<'row mb-3 align-items-center'<'col-md-6'l><'col-md-6 d-flex justify-content-end'B>>" +
          "<'row'<'col-12'fr>>" +
          "<'row'<'col-12'<'table-responsive't>>>" +
          "<'row mt-3'<'col-md-5'i><'col-md-7'p>>",

        buttons: [
          {
            extend: "excel",
            className: "btn btn-success btn-sm",
            title: "Specialization Details",
          },
          {
            extend: "pdf",
            className: "btn btn-danger btn-sm",
            title: "Specialization Details",
          },
          {
            extend: "print",
            className: "btn btn-secondary btn-sm",
            title: "Specialization Details",
          },
        ],
      });

    }, 100);

    return () => clearTimeout(timer);

  }, [specializations]);

  // =========================
  // OPEN DELETE MODAL
  // =========================
  const handleDeleteClick = (id) => {

    setSelectedSpecializationId(id);
    setShowDeleteModal(true);

  };

  // =========================
  // CONFIRM DELETE
  // =========================
  const confirmDelete = async () => {

    try {

      setDeleteLoading(true);

      await deleteSpecialization(selectedSpecializationId);

      toast.success("Specialization deleted successfully");

      setShowDeleteModal(false);

      fetchSpecializations();

    } catch (error) {

      console.error(error);

      toast.error("Failed to delete specialization");

    } finally {

      setDeleteLoading(false);

    }
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const handleEdit = (item) => {

    setIsEdit(true);

    setEditId(item.id);

    setSpecialization(item.specialization);

    setPrice(item.price);

    const modal = new Modal(
      document.getElementById("specializationModal")
    );

    modal.show();

  };

  // =========================
  // SAVE / UPDATE
  // =========================
  const saveSpecialization = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {

      const specializationData = {
        specialization,
        price,
      };

      if (isEdit) {

        await updateSpecialization(editId, specializationData);

        toast.success("Specialization updated successfully");

        setSpecializations((prev) =>
          prev.map((item) =>
            item.id === editId
              ? {
                  ...item,
                  specialization,
                  price,
                }
              : item
          )
        );

      } else {

        const response = await createSpecialization(
          specializationData
        );

        setSpecializations((prev) => [
          ...prev,
          response.data,
        ]);

        toast.success("Specialization added successfully");

      }

      // RESET
      setSpecialization("");
      setPrice("");

      setIsEdit(false);
      setEditId(null);

      // CLOSE MODAL
      const modal = Modal.getInstance(
        document.getElementById("specializationModal")
      );

      modal?.hide();

    } catch (error) {

      console.log(error);

      toast.error("Operation failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      <div className="container-fluid">

        <div className="page-inner">

          {/* CARD */}
          <div className="card shadow-sm mt-5">

            <div className="card-header">

              <div className="d-flex justify-content-between align-items-center w-100">

                <h3 className="mb-0 text-bold">Specialization List</h3>

                <button
                  className="btn btn-primary btn-lg"
                  data-bs-toggle="modal"
                  data-bs-target="#specializationModal"
                  onClick={() => {

                    setIsEdit(false);

                    setSpecialization("");

                    setPrice("");

                  }}
                >
                  Add Specialization
                </button>

              </div>

            </div>

            <div className="card-body">

              <table
                ref={tableRef}
                className="table table-striped"
              >

                <thead>

                  <tr>
                    <th>#</th>
                    <th>Specialization</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {specializations.map((item, index) => (

                    <tr key={item.id}>

                      <td>{index + 1}</td>

                      <td>{item.specialization}</td>

                      <td>{item.price}</td>

                      <td>

                        <div className="d-flex justify-content-between">

                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDeleteClick(item.id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* MODAL */}
          <div
            className="modal fade"
            id="specializationModal"
          >

            <div className="modal-dialog">

              <div className="modal-content">

                <div className="modal-header">

                  <h5>
                    {isEdit
                      ? "Edit Specialization"
                      : "Add Specialization"}
                  </h5>

                  <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                  />

                </div>

                <div className="modal-body">

                  <form onSubmit={saveSpecialization}>

                    {/* SPECIALIZATION */}
                    <div className="mb-3">

                      <label className="form-label">
                        Specialization
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={specialization}
                        onChange={(e) =>
                          setSpecialization(e.target.value)
                        }
                        placeholder="Enter specialization"
                        required
                      />

                    </div>

                    {/* PRICE */}
                    <div className="mb-3">

                      <label className="form-label">
                        Price
                      </label>

                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={price}
                        onChange={(e) =>
                          setPrice(e.target.value)
                        }
                        placeholder="Enter price"
                        required
                      />

                    </div>

                    {/* BUTTONS */}
                    <div className="d-flex justify-content-between mt-3">

                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={loading}
                      >
                        Close
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>

                    </div>

                  </form>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* DELETE MODAL */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Specialization"
        message="Are you sure you want to delete this specialization?"
        loading={deleteLoading}
      />
    </>
  );
};

export default SpecializationTable;