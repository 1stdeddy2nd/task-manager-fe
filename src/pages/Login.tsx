import { useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login, resetError } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AppDispatch, RootState } from "../redux/store";

const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = useCallback(async (values: { username: string; password: string }) => {
    const resultAction = await dispatch(login(values));
    if (login.fulfilled.match(resultAction)) {
      navigate("/");
    }
  }, [dispatch, navigate, login])

  const onNavigate = useCallback(() => {
    dispatch(resetError());
    navigate('/register');
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">Login</h2>
        <Formik initialValues={{ username: "", password: "" }} validationSchema={loginSchema} onSubmit={handleLogin}>
          {() => (
            <Form>
              <div className="mb-4">
                <Field type="text" name="username" placeholder="Username" className="w-full p-2 border rounded-lg" />
                <ErrorMessage name="username" component="p" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <Field type="password" name="password" placeholder="Password" className="w-full p-2 border rounded-lg" />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
              </div>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={onNavigate}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
