import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, Button, Modal, Container, Row, Col } from 'react-bootstrap';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/user', { withCredentials: true });
        setUser(res.data.user);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch user details');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  if (!user) return <div>Loading...</div>;

  return (
    <Container className="py-5" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            {/* Profile Header with Blue Gradient */}
            <div style={{
              background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
              height: '120px',
              position: 'relative'
            }}>
              {/* Logout button in top right corner */}
              <Button 
                variant="link" 
                onClick={handleLogout}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: 'white',
                  textDecoration: 'none',
                  zIndex: 1
                }}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </Button>
              
              {/* Profile Picture Placeholder */}
              <div style={{
                position: 'absolute',
                bottom: '-50px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#fff',
                border: '5px solid #fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4e73df',
                fontSize: '40px',
                fontWeight: 'bold'
              }}>
                {user.fullName.charAt(0)}
              </div>
            </div>

            {/* Profile Body */}
            <Card.Body className="pt-5 px-4 pb-4">
              <div className="text-center mt-4 mb-4">
                <h2 className="mb-1" style={{ fontWeight: '600', color: '#2e3a4d' }}>{user.fullName}</h2>
                <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                  <i className="fas fa-map-marker-alt me-1"></i> 
                </p>
                <p className="mb-3" style={{ color: '#4e73df', fontWeight: '500' }}>
                  Hyderabad-Telangana<br />
                  India
                </p>
                
                {/* Stats Row */}
                

                {/* Buttons */}
                <div className="d-flex justify-content-center gap-3">
                  <Button 
                    variant="outline-primary" 
                    className="px-4 py-2" 
                    style={{ 
                      borderRadius: '20px',
                      fontWeight: '600',
                      borderWidth: '2px'
                    }}
                    onClick={handleShowModal}
                  >
                    <i className="fas fa-pen me-2"></i> Edit Profile
                  </Button>
                  <Button 
                    variant="primary" 
                    className="px-4 py-2" 
                    style={{ 
                      borderRadius: '20px',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
                      border: 'none'
                    }}
                  >
                    <i className="fas fa-paper-plane me-2"></i> Message
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
          <Modal.Title style={{ color: '#333', fontWeight: '600' }}>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
          <form>
            <div className="form-group mb-3">
              <label style={{ color: '#333', fontWeight: '500' }}>Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                defaultValue={user.fullName} 
                style={{ 
                  borderRadius: '8px', 
                  border: '1px solid #ddd',
                  padding: '10px'
                }} 
              />
            </div>
            <div className="form-group mb-3">
              <label style={{ color: '#333', fontWeight: '500' }}>Email</label>
              <input 
                type="email" 
                className="form-control" 
                defaultValue={user.email} 
                style={{ 
                  borderRadius: '8px', 
                  border: '1px solid #ddd',
                  padding: '10px'
                }} 
              />
            </div>
            <div className="form-group mb-3">
              <label style={{ color: '#333', fontWeight: '500' }}>Phone</label>
              <input 
                type="text" 
                className="form-control" 
                defaultValue="123456789" 
                style={{ 
                  borderRadius: '8px', 
                  border: '1px solid #ddd',
                  padding: '10px'
                }} 
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #ddd' }}>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal} 
            style={{ 
              borderRadius: '20px',
              padding: '8px 20px',
              fontWeight: '500',
              border: 'none'
            }}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCloseModal} 
            style={{ 
              borderRadius: '20px',
              padding: '8px 20px',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
              border: 'none'
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;