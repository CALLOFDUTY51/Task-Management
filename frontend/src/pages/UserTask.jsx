import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";  // useParams hook to get the user ID
import Navbar from "../Components/Navbar";

const TaskDetails = () => {
    const { username } = useParams();  // Get the username from the URL
    const [tasks, setTasks] = useState([]);
    console.log(username)
    const navigate=useNavigate()

  const fetchUserTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/user/${username}/tasks`);  // Get tasks of the user
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, [username]);

  const taskDetails = (task) => {
    navigate(`/taskDetails/${task._id}`);
  };

  return (
    <>
    <Navbar/>
    <div className="task-details-container">
      <h2>Task Details for User {username}</h2>
      <Table striped bordered hover className="tasks-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Assigned Date</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id} onClick={()=>{taskDetails(task)}}>
                <td>{task.title}</td>
                <td>{new Date(task.assignedDate).toLocaleDateString()}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>
                  {task.completion === "pending" ? (
                    <span style={{ color: "red" }}>❌ Pending</span> // Use a red cross for pending
                  ) : (
                    <span style={{ color: "green" }}>✅ Completed</span> // Use a green check for completed
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No tasks assigned to this user
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
    </>
    
  );
};

export default TaskDetails;
