import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import "../Styles/Dashboard.scss";

function Dashboard() {
  const [taskData, setTaskData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [completionData, setCompletionData] = useState([]);

  const COLORS = ["#FF8042", "#0088FE", "#00C49F"]; // Colors for pie slices

  const loadData = async () => {
    try {
      const res = await axios.get("http://localhost:9000/tasks/getAllTasks");
      setTaskData(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (taskData.length > 0) {
      let high = 0, medium = 0, low = 0;
      let completed = 0, pending = 0;

      taskData.forEach((task) => {
        // Count tasks by priority
        if (task.priority === "High") high++;
        if (task.priority === "Medium") medium++;
        if (task.priority === "Low") low++;

        // Count tasks by completion
        if (task.completion === "completed") completed++;
        if (task.completion === "pending") pending++;
      });

      // Set processed data
      setPriorityData([
        { name: "High", value: high },
        { name: "Medium", value: medium },
        { name: "Low", value: low },
      ]);

      setCompletionData([
        { name: "Completed", value: completed },
        { name: "Pending", value: pending },
      ]);
    }
  }, [taskData]);

  return (
    <>
      <Navbar />
      <div className="Piechart">
        <div className="piechart-container">
          <div className="chart">
            <h3>Task Priority Distribution</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="chart">
            <h3>Task Completion Status</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={completionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
