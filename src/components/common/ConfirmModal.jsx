import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

function ConfirmModal({
  show,
  onHide,
  onConfirm,
  title,
  message,
  loading = false,
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {message}
      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={onHide}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                className="me-2"
              />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>

      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;