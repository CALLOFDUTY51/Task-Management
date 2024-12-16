import React, { useState, useEffect } from "react";
import "../Styles/UserDisplay.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { Table, Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UserDisplay = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Display 5 tasks per page
  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/tasks/getTasks/${username}`);
      setTasks(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask); // Get tasks for the current page

  const totalPages = Math.ceil(tasks.length / tasksPerPage); // Total pages

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination Items
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

  const toggleCompletion = async (e,taskId, currentCompletionStatus) => {
    e.stopPropagation()
    const newCompletionStatus = currentCompletionStatus === "completed" ? "pending" : "completed";

    try {
      await axios.put(`http://localhost:9000/tasks/updateCompletion/${taskId}`, { completion: newCompletionStatus });
      fetchTasks(); // Fetch updated tasks after completion change
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  const taskDetails = (task) => {
    navigate(`/taskDetails/${task._id}`);
  };

  return (
    <>
      <Navbar />

      <div className="task-list-container">
        <div className="task-list-content">
          <h2>Assigned Tasks</h2>
          <div className="task-list-form">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.length > 0 ? (
                  currentTasks.map((task) => (
                    <tr onClick={() => taskDetails(task)} key={task._id}>
                      <td>{task.title}</td>
                      <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td>{task.priority}</td>
                      <td>
                        <FontAwesomeIcon
                          icon={task.completion === "pending" ? faTimesCircle : faCheckCircle}
                          color={task.completion === "pending" ? "red" : "green"}
                          onClick={(e) => toggleCompletion(e,task._id, task.completion)}
                          style={{ cursor: "pointer", fontSize: "20px" }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "white" }}>
                      No tasks assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="justify-content-center">{paginationItems}</Pagination>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDisplay;
