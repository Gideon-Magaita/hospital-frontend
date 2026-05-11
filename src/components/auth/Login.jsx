import React, { useState } from 'react';
import { loginUser, saveLoggedInUser, storeToken,redirectUserByRole } from '../pages/services/AuthService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!username.trim()) {
        formErrors.username = "Username or Email is required";
    }

    if (!password.trim()) {
        formErrors.password = "Password is required";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
        try {
            setLoading(true);

            const response = await loginUser(username, password);
            console.log("Login Response:", response.data);

            //JWT implementation
            const token = 'Bearer ' + response.data.accessToken;
            const role  = response.data.role;
            storeToken(token);

            toast.success("Login successful!");

            saveLoggedInUser(username,role);
            setTimeout(() => {
                redirectUserByRole(role, navigate);//redirect users by roles
            }, 1500);


        } catch (error) {
            console.error(error);

            if (error.response && error.response.data) {
                toast.error(error.response.data.message || "Invalid credentials");
            } else {
                toast.error("Network error. Try again.");
            }
        } finally {
            setLoading(false);
        }
    }
};
    return (
        <div className='container'>
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card mt-5 shadow">
                        <div className="card-header text-center bg-dark text-white">
                            <h4>Login</h4>
                        </div>

                        <div className="card-body">
                            <form onSubmit={handleSubmit}>

                                {/* Username or Email */}
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.username && 'is-invalid'}`}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username or email"
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback">
                                            {errors.username}
                                        </div>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password && 'is-invalid'}`}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-dark form-control"
                                        disabled={loading}
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </button>
                                </div>

                            </form>
                        </div>

                        <div className="card-footer text-center">
                            <small>
                                Don’t have an account?{" "}
                                <span
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </span>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;