import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import TaskDetails from "./components/TaskDetails";
import CompletedTasks from "./components/CompletedTasks";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("jwtToken")
  );

  const [tasks, setTasks] = useState([
    {
      id: 1,
      description: "Complete React Assignment",
      priority: "High",
      category: "Study",
      due: "2026-08-28",
      status: "Pending",
    },
    {
      id: 2,
      description: "Prepare project presentation",
      priority: "Medium",
      category: "Work",
      due: "2026-08-28",
      status: "Pending",
    },
    {
      id: 3,
      description: "Read React documentation",
      priority: "Low",
      category: "Study",
      due: "2026-08-28",
      status: "Completed",
    },
  ]);

  const [filter, setFilter] = useState("All");

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const completeTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: "Completed" }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}

      {isAuthenticated && (
        <div className="logout-container">
          <button onClick={logout}>Logout</button>
        </div>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard tasks={tasks} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Tasks
                tasks={tasks}
                completeTask={completeTask}
                deleteTask={deleteTask}
                filter={filter}
                setFilter={setFilter}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-task"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AddTask addTask={addTask} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TaskDetails tasks={tasks} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/completed"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CompletedTasks tasks={tasks} />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;