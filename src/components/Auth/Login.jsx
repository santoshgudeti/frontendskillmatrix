import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../axiosUtils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        '/login',
        { email, password },
        { withCredentials: true }
      );

      toast.success('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };
  return (
<div className="container">
      <div className="auth-form bg-white">
        <div className="text-center mb-4">
        <h2 className="fw-bold">Welcome back</h2>
          <p className="text-muted">Sign in to your TalentTrack ATS account</p>
          <div className=" d-flex justify-content-center align-items-center mb-4">
           
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <div className="d-flex justify-content-between">
              <label htmlFor="email" className="form-label text-black">Email</label>
              </div>
              <input
                type="email"
                className="form-control bg-white bg-opacity-50"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3"> 
               <div className="d-flex justify-content-between">
              <label htmlFor="password" className="form-label text-black">Password</label>
              </div> 
              <input
                type="password"
                className="form-control bg-white bg-opacity-50"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <div className="mt-3 text-center">
            <Link to="/forgot-password" className="text-black text-decoration-none">
          
            </Link>
          </div>

          <div className="mt-3 text-center">
            Don't have an account?{" "}
            <Link to="/Register" className="text-decoration-none">
              Register
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Login;

