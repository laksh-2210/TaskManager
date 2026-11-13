import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = "https://YOUR-RENDER-BACKEND-URL";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await axios.post(`${API}/tasks`, { title });
      setTitle("");
      fetchTasks();
    } catch (error) {
      alert("Could not add task. Check backend server.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      alert("Could not update task.");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await axios.delete(`${API}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      alert("Could not delete task.");
    }
  };

  const columns = ["Pending", "Ongoing", "Completed"];

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <div className="app-container">
      <nav className="navbar navbar-dark app-navbar">
        <div className="container">
          <span className="navbar-brand fw-bold">
            <span className="brand-icon">✓</span> TaskFlow
          </span>
          <span className="navbar-text">Personal Task Manager</span>
        </div>
      </nav>

      <main className="container py-5">
        <div className="welcome-section mb-4">
          <p className="text-uppercase small fw-bold text-primary mb-2">
            WORKSPACE
          </p>
          <h1 className="fw-bold">Manage your tasks</h1>
          <p className="text-muted">
            Organize your work, track progress and get things done.
          </p>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="summary-card">
              <p>Total Tasks</p>
              <h2>{tasks.length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="summary-card">
              <p>In Progress</p>
              <h2>{tasks.filter((t) => t.status === "Ongoing").length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="summary-card">
              <p>Completed</p>
              <h2>{completedCount}</h2>
            </div>
          </div>
        </div>

        <div className="add-task-card mb-5">
          <h5 className="fw-bold mb-3">Add a New Task</h5>

          <form onSubmit={addTask} className="d-flex gap-2">
            <input
              type="text"
              className="form-control task-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button className="btn add-button" type="submit">
              + Add Task
            </button>
          </form>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">My Board</h4>
          <span className="text-muted small">{tasks.length} tasks</span>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div className="row g-4">
            {columns.map((status) => {
              const columnTasks = tasks.filter(
                (task) => task.status === status
              );

              return (
                <div className="col-lg-4" key={status}>
                  <div className="task-column">
                    <div className="column-heading">
                      <h6 className="fw-bold mb-0">{status}</h6>
                      <span className="task-count">
                        {columnTasks.length}
                      </span>
                    </div>

                    {columnTasks.length === 0 && (
                      <p className="empty-message">No tasks here yet.</p>
                    )}

                    {columnTasks.map((task) => (
                      <div className="task-card" key={task._id}>
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="fw-bold">{task.title}</h6>
                          <button
                            className="delete-button"
                            onClick={() => deleteTask(task._id)}
                            title="Delete task"
                          >
                            ×
                          </button>
                        </div>

                        <span
                          className={`status-badge ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                        <div className="task-actions mt-3">
                          {status === "Pending" && (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                updateStatus(task._id, "Ongoing")
                              }
                            >
                              Start Task
                            </button>
                          )}

                          {status === "Ongoing" && (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() =>
                                updateStatus(task._id, "Completed")
                              }
                            >
                              Mark Completed
                            </button>
                          )}

                          {status === "Completed" && (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                updateStatus(task._id, "Pending")
                              }
                            >
                              Move to Pending
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="text-center py-4 text-muted small">
        TaskFlow · Stay organized. Get things done.
      </footer>
    </div>
  );
}

export default App;