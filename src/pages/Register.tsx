import { useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { register, resetError } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AppDispatch, RootState } from "../redux/store";

const registerSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleRegister = useCallback(async (values: { username: string; password: string; confirmPassword: string }) => {
    const resultAction = await dispatch(register({ username: values.username, password: values.password }));
    if (register.fulfilled.match(resultAction)) {
      alert("Registration successful! Please log in.");
      navigate("/login");
    }
  }, [navigate, dispatch, register])

  const onNavigate = useCallback(() => {
    dispatch(resetError());
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-500">Register</h2>
        <Formik initialValues={{ username: "", password: "", confirmPassword: "" }} validationSchema={registerSchema} onSubmit={handleRegister}>
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
              <div className="mb-4">
                <Field type="password" name="confirmPassword" placeholder="Confirm Password" className="w-full p-2 border rounded-lg" />
                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm" />
              </div>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span className="text-green-500 cursor-pointer" onClick={onNavigate}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
