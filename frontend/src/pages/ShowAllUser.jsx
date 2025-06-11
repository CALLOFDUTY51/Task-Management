import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Button, Pagination } from "react-bootstrap";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const ShowAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [usersPerPage] = useState(5); // Users per page
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9000/user/getAllUser");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    console.log(users)
  }, []);

  // Handle delete confirmation modal
  const handleDeleteClick = (e,userId) => {
    e.stopPropagation()
    console.log(userId)
    setUserToDelete(userId);
    setShowModal(true);
  };

  // Handle user delete
  const handleDelete = async () => {
    try {
      // First, update all tasks assigned to this user to set their assignedTo to null
      await axios.put(`http://localhost:9000/tasks/updateTasksAssignedToUser/${userToDelete}`, { assignedTo: null });
  
      // Then delete the user
      await axios.delete(`http://localhost:9000/user/deleteUser/${userToDelete}`);
      
      // Fetch updated tasks list
      fetchAllUsers();
      setShowModal(false);

    } catch (error) {
      console.error("Error deleting user and updating tasks:", error);
    }
  };

  // Close the modal without deleting
  const handleCloseModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  // Navigate to user task details
  const handleRowClick = (username) => {
    navigate(`/UserTask/${username}`);
  };

  // Calculate users for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Create pagination items
  const totalPages = Math.ceil(users.length / usersPerPage);
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

  return (
    <>
      <Navbar />
      <div className="users-container task-list-container">
        <h2>All Users</h2>
        <Table striped bordered hover className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Total Tasks</th>
              <th>Completed Tasks</th>
              <th>Pending Tasks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user._id}  onClick={() => handleRowClick(user.username)}>
                  <td>{user.username}</td>
                  <td>{user.taskStats.total}</td>
                  <td>{user.taskStats.completed}</td>
                  <td>{user.taskStats.pending}</td>
                  <td>
                    
                    <Delete
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={(e) => handleDeleteClick(e,user._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No users found
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
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
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

export default ShowAllUsers;
