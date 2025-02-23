import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, addTask, deleteTask, updateTask, TaskStatus } from "../redux/taskSlice";
import { logout } from "../redux/authSlice";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "../redux/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUndo, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const taskSchema = yup.object().shape({
  title: yup.string().min(3, "Title must be at least 3 characters").required("Title is required"),
});

const Dashboard = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState<{ id: number; title: string; status: TaskStatus } | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = async (values: { title: string; status: string }, { resetForm }: any) => {
    await dispatch(addTask(values));
    resetForm();
  };

  const handleUpdateTask = async (values: { title: string; status: TaskStatus }, { resetForm }: any) => {
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask.id, title: values.title, status: values.status }));
      setEditingTask(null);
      resetForm();
    }
  };

  const handleDeleteTask = async (id: number) => {
    await dispatch(deleteTask(id));
  };

  const startEdit = (task: { id: number; title: string; status: TaskStatus }) => {
    setEditingTask(task);
  };

  const cancelEdit = (resetForm: any) => {
    setEditingTask(null);
    resetForm();
  };

  const toggleStatus = async (task: { id: number; title: string; status: string }) => {
    const newStatus = task.status === "pending" ? "done" : "pending";
    await dispatch(updateTask({ ...task, status: newStatus }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 pb-2 rounded-lg shadow-lg max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-center">Task Management</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>

        <Formik
          initialValues={{ title: editingTask ? editingTask.title : "", status: editingTask ? editingTask.status : "pending" }}
          enableReinitialize
          validationSchema={taskSchema}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        >
          {({ isSubmitting, resetForm }) => (
            <Form>
              <div className="mb-4">
                <label>Task name</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Add or edit task"
                  className="w-full p-2 border rounded-lg"
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className={`w-full ${editingTask ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 rounded-lg transition flex items-center justify-center`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (editingTask ? "Updating..." : "Adding...") : (editingTask ? <FaCheck /> : <FaPlus />)}
                </button>
                {editingTask && (
                  <button
                    type="button"
                    onClick={() => cancelEdit(resetForm)}
                    className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition flex items-center justify-center"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
        <ul className="mt-6 space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-gray-50 p-4 rounded-lg border"
            >
              <div>
                <span className="text-lg font-medium pe-2">{task.title}</span>
                <span className={`inline-block px-2 py-1 text-sm rounded-lg ${task.status === "done" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
                  {task.status}
                </span>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(task)}
                  className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex-1 flex justify-center"
                >
                  {task.status === "pending" ? <FaCheck /> : <FaUndo />}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(task)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition flex-1 flex justify-center"
                >
                  <FaEdit />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition flex-1 flex justify-center"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
