import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/TaskDetails.scss"
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
const TaskDetails = () => {
  const { taskId } = useParams();  // Get task ID from URL
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/tasks/getTask/${taskId}`);
        setTask(response.data);  // Set task details
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);  // Re-run if taskId changes

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <>
    <Navbar/>
    <div className="task-details-container">
      {task ? (
        <>
          <div className="task-details">
  <div className="task-details_content">
    <h1 className="task-title">{task.title}</h1>
    <p className="task-description">{task.description}</p>
    <div className="task-info">
      <div>
        <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
      </div>
      <div>
        <strong>Priority:</strong> {task.priority}
      </div>
      <div>
        <strong>Completion Status:</strong>{" "}
        <span className={task.completion === "completed" ? "status-completed" : "status-pending"}>
          {task.completion}
        </span>
      </div>
    </div>
    <button className="back-button" onClick={handleBack}>Back to Tasks</button>
  </div>
</div>


        </>
      ) : (
        <p>Loading task details...</p>
      )}
    </div>
    </>
  );
};

export default TaskDetails;
