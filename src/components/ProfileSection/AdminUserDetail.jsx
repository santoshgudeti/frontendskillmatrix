import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Card, Form, Button, Container, Row, Col, 
  Badge, Alert, Spinner 
} from 'react-bootstrap';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { axiosInstance } from '../../axiosUtils';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    companyName: '',
    designation: '',
    isApproved: false,
    isUnlimited: false,
    trialEnd: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/admin/users/${id}`, { withCredentials: true });
        setUser(res.data.user);
        setFormData({
          fullName: res.data.user.fullName,
          email: res.data.user.email,
          mobileNumber: res.data.user.mobileNumber,
          companyName: res.data.user.companyName,
          designation: res.data.user.designation,
          isApproved: res.data.user.isApproved,
          isUnlimited: res.data.user.isUnlimited,
          trialEnd: res.data.user.trialEnd ? new Date(res.data.user.trialEnd).toISOString().split('T')[0] : ''
        });
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch user');
        setLoading(false);
        navigate('/dashboard/admin');
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

    const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/admin/delete-user/${id}`,
        { withCredentials: true }
      );
      toast.success('User deleted successfully');
      navigate('/dashboard/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(
        `/admin/update-user/${id}`,
        formData,
        { withCredentials: true }
      );
      toast.success('User updated successfully');
      setUser(res.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button 
        as={Link}
        to="/dashboard/admin"
        variant="outline-primary" 
        className="mb-3"
      >
        <FaArrowLeft /> Back to Admin Dashboard
      </Button>

      <Card>
        <Card.Header>
          <h4>User Management: {user.fullName}</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Status</Form.Label>
                  <div>
                    <Form.Check
                      type="switch"
                      id="isApproved"
                      label={formData.isApproved ? 'Approved' : 'Pending Approval'}
                      name="isApproved"
                      checked={formData.isApproved}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Access Type</Form.Label>
                  <div>
                    <Form.Check
                      type="switch"
                      id="isUnlimited"
                      label={formData.isUnlimited ? 'Unlimited Access' : 'Trial Access'}
                      name="isUnlimited"
                      checked={formData.isUnlimited}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
              {!formData.isUnlimited && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Trial End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="trialEnd"
                      value={formData.trialEnd}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>

            <Button variant="primary" type="submit">
              <FaSave /> Save Changes
            </Button>
            <Button 
                variant="danger" 
                onClick={handleDelete}
                className="ms-2"
            >
                <FaTrash /> Delete User
  </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminUserDetail;