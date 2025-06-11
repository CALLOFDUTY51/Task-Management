import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Button, Pagination } from "react-bootstrap";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const ShowAllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [tasksPerPage] = useState(5); // Tasks per page
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch all tasks
  const fetchAllTasks = async () => {
    try {
      const response = await axios.get("http://localhost:9000/tasks/getAllTasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Handle delete confirmation modal
  const handleDeleteClick = (e,taskId) => {
    e.stopPropagation()
    setTaskToDelete(taskId);
    setShowModal(true);
  };

  // Handle task delete
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:9000/tasks/delete/${taskToDelete}`);
      setTasks(tasks.filter((task) => task._id !== taskToDelete));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Close the modal without deleting
  const handleCloseModal = () => {
    setShowModal(false);
    setTaskToDelete(null);
  };

  // Handle task edit
  const handleEdit = (e,taskId) => {
    e.stopPropagation()
    navigate(`/UpdateTask/${taskId}`);
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  // Calculate tasks for the current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Create pagination items
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  const taskDetails = (task) => {
    navigate(`/taskDetails/${task._id}`);
  };

  return (
    <>
    <Navbar/>
    <div className="task-details-container task-list-container">
      <h2>All Task Details</h2>
      <Table striped bordered hover className="tasks-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Assigned To</th>
            <th>Assigned Date</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <tr key={task._id}  onClick={() => taskDetails(task)}>
                <td>{task.title}</td>
                <td>{task.assignedTo?.username || "No one"}</td>

                <td>{new Date(task.assignedDate).toLocaleDateString()}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{task.priority}</td>
                <td>
                  {task.completion === "pending" ? (
                    <span style={{ color: "red" }}>❌ Pending</span>
                  ) : (
                    <span style={{ color: "green" }}>✅ Completed</span>
                  )}
                </td>
                <td>
                  <Edit
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={(e) => handleEdit(e, task._id)}
                  />
                  <Delete
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={(e) => handleDeleteClick(e,task._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>{paginationItems}</Pagination>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default ShowAllTasks;
