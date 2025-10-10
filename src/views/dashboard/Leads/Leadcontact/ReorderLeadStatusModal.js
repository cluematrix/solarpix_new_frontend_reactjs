import React from "react";
import { Modal, ListGroup, Button } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ReorderLeadStatusModal = ({
  show,
  onHide,
  leadStatus,
  setLeadStatus,
}) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(leadStatus);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    setLeadStatus(reordered);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Reorder Lead Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="leadStatusList">
            {(provided) => (
              <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
                {leadStatus.map((status, index) => (
                  <Draggable
                    key={status.id}
                    draggableId={String(status.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <ListGroup.Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? "#f1f3f5" : "white",
                          borderRadius: "6px",
                          marginBottom: "6px",
                          cursor: "grab",
                        }}
                      >
                        {status.leadStatus_name}
                      </ListGroup.Item>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ListGroup>
            )}
          </Droppable>
        </DragDropContext>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReorderLeadStatusModal;
