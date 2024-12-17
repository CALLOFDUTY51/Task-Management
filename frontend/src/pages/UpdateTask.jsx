import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // For routing
import "../Styles/CreateTask.scss";
import Navbar from "../Components/Navbar";

const UpdateTask = () => {
  const { id } = useParams(); // Get task ID from URL
  const [taskData, setTaskData] = useState({
    newusername: "",
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedDate: "",
    assignedTo:{}
  });
  const navigate = useNavigate();

  // Fetch the task data by ID
  const fetchTaskData = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/tasks/getTask/${id}`);
      const task = response.data;
      console.log(task)

      // Convert dates to 'YYYY-MM-DD' format
      setTaskData({
        ...task,
        dueDate: new Date(task.dueDate).toISOString().split("T")[0],
        assignedDate: new Date(task.assignedDate).toISOString().split("T")[0],
        newusername:task.assignedTo?.username 
      });
    } catch (err) {
      console.error(err);
      alert("Error fetching task data!");
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(taskData)
    try {
      const response = await axios.put(`http://localhost:9000/tasks/updateTask/${id}`, taskData);
      alert("Task Updated Successfully!");
      console.log(response.data);
      navigate("/ShowAllTasks"); // Redirect to the tasks list after update
    } catch (err) {
      console.error(err);
      alert("Error updating task!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register">
        <div className="register_content">
          <form className="register_content_form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={taskData.newusername}
              placeholder="Assign to"
              name="newusername"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              value={taskData.title}
              placeholder="Task Title"
              name="title"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              value={taskData.description}
              placeholder="Task Description"
              name="description"
              onChange={handleChange}
              required
            />
            <select style={{
                padding: "10px",
                borderRadius: "5px",
                border: "2px solid #28a745",
                backgroundColor: "#444",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
              }}
              value={taskData.priority}
              name="priority"
              onChange={handleChange}
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              required
            />

            <label htmlFor="assignedDate">Assigned Date</label>
            <input
              type="date"
              id="assignedDate"
              name="assignedDate"
              value={taskData.assignedDate}
              onChange={handleChange}
              required
            />

            <button type="submit">Update Task</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateTask;
