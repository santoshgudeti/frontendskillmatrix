import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInstagram, 
  faFacebookF, 
  faTwitter, 
  faBehance, 
  faDribbble 
} from '@fortawesome/free-brands-svg-icons';

function LandingPage() {
  return (
    <div className="landing-wrapper min-vh-100 w-100 position-relative overflow-hidden">
      {/* Gradient circles */}
      <div className="gradient-circle gradient-circle-1"></div>
      <div className="gradient-circle gradient-circle-2"></div>
      <div className="gradient-circle gradient-circle-3"></div>
      
      <div className="container py-4 position-relative">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="glass-card">
              <div className="card-body p-5 p-sm-3">
                {/* Navigation */}
                <nav className="navbar navbar-expand-lg navbar-light mb-5">
                  <div className="navbar-brand">
                  
                    <div className="brand-circle col-md-6">
                  <img src="/assets/SMlogo.png" alt="Businessman" className="img-fluid rounded-circle" />
                 
                    </div>
                  </div>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"  aria-controls="navbarNav"
  aria-expanded="false"
  aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                      <li className="nav-item">
                        <Link to="/" className="nav-link active">Home</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="#" className="nav-link">License</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="#" className="nav-link">Free Download</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="#" className="nav-link">Fee</Link>
                      </li>
                    </ul>
                    <div className="nav-buttons">
                      <Link to="/login" className="btn  me-2">Log In</Link>
                      <Link to="/Register" className="btn btn-light">Register</Link>
                    </div>
                  </div>
                </nav>

                {/* Content */}
                <div className="row align-items-center">
                  <div className="col-lg-6 mb-5 mb-lg-0">
                       <h1 className="display-4 fw-bold mb-4">Application Tracking System</h1>
                       <p className="lead mb-5">
                      Don't let the difficulty of finding best candidtes make you sad. Get the subscription ATS . Free and paid features available, try it for a week. I'm waiting for your subscription
                    </p>
                    <div className="buttons mb-5">
                    <Link to="/Register" className="btn btn-primary me-3">Start free trail</Link>
                  
                    
                    </div>
                    <div className="social-links">
                      <a href="#" className="social-link">
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                      <a href="#" className="social-link">
                        <FontAwesomeIcon icon={faFacebookF} />
                      </a>
                      <a href="#" className="social-link">
                        <FontAwesomeIcon icon={faTwitter} />
                      </a>
                      <a href="#" className="social-link">
                        <FontAwesomeIcon icon={faBehance} />
                      </a>
                      <a href="#" className="social-link">
                        <FontAwesomeIcon icon={faDribbble} />
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6">
                  <img src="/assets/image.png" alt="Businessman" className="img-fluid rounded-circle" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
