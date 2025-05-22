import { Link } from 'react-router-dom'

import SMlogo from "../../assets/SMlogo.png";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
           <div className="col-6 col-lg-3 mb-4 mb-lg-0">
            <div className="d-flex align-items-center text-white mb-3">
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
              <span className="ms-2 fw-bold">Skill Matrix</span>
            </div>
            <p className="small text-white">
              Skill Matrix ATS is an intelligent recruitment solution that transforms how companies find, evaluate, and hire top talent.
            </p>
            <p className="small text-muted mt-3">
              © 2023 Skill Matrix ATS. All rights reserved.
            </p>
          </div>
          
          <div className="col-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="mb-3 fw-bold">Product</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="#" className="text-white">Features</Link></li>
              <li className="mb-2"><Link to="#" className="text-white">Pricing</Link></li>
              <li className="mb-2"><Link to="#" className="text-white">Customers</Link></li>
              <li className="mb-2"><Link to="#" className="text-white">Integrations</Link></li>
            </ul>
          </div>
          
          <div className="col-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="mb-3 fw-bold">Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="#" className="text-white">Blog</Link></li>
              <li className="mb-2"><Link to="#" className="text-white">Guides</Link></li>
              <li className="mb-2"><Link to="#" className="text-white">Webinars</Link></li>
              <li className="mb-2"><Link to="#" className="text-white">Help Center</Link></li>
            </ul>
          </div>
          
          <div className="col-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="mb-3 fw-bold">Company</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="#" className="text-white">About Us</Link></li>
              <li className="mb-2"><Link to="#" className="text-white">Careers</Link></li>
              <li className="mb-2"><Link to="#" className="text-white">Contact</Link></li>
              <li className="mb-2"><Link to="#" className="text-white">Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="row mt-4 pt-4 border-top border-secondary">
          <div className="col-md-6 mb-3 mb-md-0">
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-3">
                <Link to="#" className="text-white small">Privacy Policy</Link>
              </li>
              <li className="list-inline-item me-3">
                <Link to="#" className="text-white small">Terms of Service</Link>
              </li>
              <li className="list-inline-item">
                <Link to="#" className="text-white small">Cookies</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer