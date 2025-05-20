import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/login',
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
    <div className="min-vh-100 w-100 d-flex align-items-center justify-content-center p-4" style={{background: 'linear-gradient(135deg, #ff6b6b,rgb(175, 160, 215), #45b7d1)'}}>
      <div className="card bg-white bg-opacity-10 shadow-lg rounded-4 backdrop-blur" style={{maxWidth: '400px'}}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4 text-black">
       Login
          </h2>

          <div className=" d-flex justify-content-center align-items-center mb-4">
           
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-black">Email</label>
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
              <label htmlFor="password" className="form-label text-black">Password</label>
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
      <div className="position-absolute top-0 start-0 bg-pink rounded-circle filter-blur opacity-25" style={{width: '256px', height: '256px', transform: 'translate(-50%, -50%)'}}></div>
      <div className="position-absolute bottom-0 end-0 bg-info rounded-circle filter-blur opacity-25" style={{width: '256px', height: '256px', transform: 'translate(50%, 50%)'}}></div>
    </div>
  );
}

export default Login;

