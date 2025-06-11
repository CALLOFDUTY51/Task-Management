import React, { useState } from "react";
import axios from "axios";
import "../Styles/CreateTask.scss";
import Navbar from "../Components/Navbar";

function CreateTask() {
  const [taskData, setTaskData] = useState({
    username: "",
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9000/tasks/create", taskData); 
      alert("Task Created Successfully!");
      console.log(response.data);
      setTaskData({
        username: "",
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        assignedDate: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error creating task!");
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
              value={taskData.username}
              placeholder="Assign to"
              name="username"
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
            <select
              value={taskData.priority}
              name="priority"
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "2px solid #28a745",
                backgroundColor: "#444",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="High" style={{ backgroundColor: "#dc3545", color: "#fff" }}>
                High
              </option>
              <option value="Medium" style={{ backgroundColor: "#ffc107", color: "#000" }}>
                Medium
              </option>
              <option value="Low" style={{ backgroundColor: "#28a745", color: "#fff" }}>
                Low
              </option>
            </select>

            <label htmlFor="dueDate" style={{ color: "white", fontSize: "14px" }}>
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />

            <label htmlFor="assignedDate" style={{ color: "white", fontSize: "14px" }}>
              Assigned Date
            </label>
            <input
              type="date"
              id="assignedDate"
              name="assignedDate"
              value={taskData.assignedDate}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />

            <button type="submit">Create Task</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateTask;
