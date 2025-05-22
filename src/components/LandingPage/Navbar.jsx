import { Link, useLocation } from 'react-router-dom'

import SMlogo from "../../assets/SMlogo.png";
const Navbar = () => {
  const location = useLocation()
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
              <img
            src={SMlogo}
            alt="SM Logo"
            className="rounded-circle img-fluid"
            style={{
              width: "50px",
              height: "50px",
              border: "2px solid black",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)"
            }}
          />
        <div className="ms-2">
        <span className="fw-bold d-block  pb-0">
          Skill Matrix
        </span>
      </div>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item text-dark">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item text-dark">
              <Link 
                className={`nav-link ${location.pathname === '/features' ? 'active' : ''}`} 
                to="#features"
              >
                Features
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`} 
                to="#pricing"
              >
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} 
                to="#about"
              >
                About
              </Link>
            </li>
          </ul>
          
          <div className="d-flex">
            <Link 
              to="/login" 
              className={`btn btn-outline-primary me-2 ${location.pathname === '/login' ? 'd-none' : ''}`}
            >
              Log in
            </Link>
            <Link 
              to="/Register" 
              className={`btn btn-primary ${location.pathname === '/signup' ? 'd-none' : ''}`}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar