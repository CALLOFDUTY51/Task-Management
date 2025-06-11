import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/PriorityManagement.scss";
import Navbar from "../Components/Navbar";

const PriorityManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false); // Loading indicator

  // Fetch tasks from the server
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:9000/tasks/getAllTasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle drag start
  const onDragStart = (event, task) => {
    event.dataTransfer.setData("task", JSON.stringify(task));
  };

  // Allow drag-over
  const onDragOver = (event) => {
    event.preventDefault();
  };

  // Handle drop event
  const onDrop = async (event, newPriority) => {
    event.preventDefault();
    const task = JSON.parse(event.dataTransfer.getData("task"));

    // Optimistically update UI
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t._id === task._id ? { ...t, priority: newPriority } : t
      )
    );

    try {
      // Update priority on the server
      await axios.put(`http://localhost:9000/tasks/updatePriority/${task._id}`, {
        priority: newPriority,
      });
      console.log("Task priority updated successfully");
    } catch (error) {
      console.error("Error updating task priority:", error);

      // Revert UI changes if API call fails
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, priority: task.priority } : t
        )
      );
    }
  };

  // Render tasks based on priority
  const renderTasks = (priority) => {
    return tasks
      .filter((task) => task.priority === priority)
      .map((task) => (
        <div
          key={task._id}
          draggable
          onDragStart={(event) => onDragStart(event, task)}
          className="task"
        >
          <span className="span1">{task.title}</span>
          <span className="span2">{task.description}</span>
        </div>
      ));
  };

  return (
    <>
    <Navbar/>
    <div className="prioritylistpage task-list-container">
      <div className="priority">
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <>
            <div
              className="myDiv"
              onDragOver={onDragOver}
              onDrop={(event) => onDrop(event, "High")}
            >
              <h1>High Priority</h1>
              {renderTasks("High")}
            </div>

            <div
              className="myDiv1"
              onDragOver={onDragOver}
              onDrop={(event) => onDrop(event, "Medium")}
            >
              <h1>Medium Priority</h1>
              {renderTasks("Medium")}
            </div>

            <div
              className="myDiv3"
              onDragOver={onDragOver}
              onDrop={(event) => onDrop(event, "Low")}
            >
              <h1>Low Priority</h1>
              {renderTasks("Low")}
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default PriorityManagement;
