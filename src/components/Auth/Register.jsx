import React,{ useState } from "react";
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobileNumber: '',
    companyName: '',
    designation: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      toast.success(res.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };


  return (
      <div className="container">
      <div className="auth-form bg-white">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Create your account</h2>
          <p className="text-muted">Start your 14-day free trial - no credit card required</p>



          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control bg-white bg-opacity-50"
                id="name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
            type="email"
            className="form-control bg-white bg-opacity-50"
            name="email"
            value={formData.email}
            onChange={handleChange}
             placeholder="Enter Company Mail"
            required
          />
            </div>
            <div className="mb-3">  
              <label htmlFor="password" className="form-label text-black">Password</label>
              <input
            type="password"
            className="form-control bg-white bg-opacity-50"
            name="password"
             placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
            </div>
            <div className="mb-3">
              <label className="form-label">Mobile Number</label>
              <input
               
                className="form-control bg-white bg-opacity-50"
                type="text"
              
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                id="Mobile Number"
                placeholder="Enter mobile number"
             
              />
            </div>
            <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-control bg-white bg-opacity-50"
            name="companyName"
             placeholder="Enter Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Designation/Job Title</label>
          <input
            type="text"
            className="form-control bg-white bg-opacity-50"
            name="designation"
             placeholder="Enter Your Designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>

          <div className="mt-3 text-center">
         
            <Link to="/login" className="text-decoration-none">
              Log in
            </Link>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default Register;

