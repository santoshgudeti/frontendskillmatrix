import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // For confirmation dialog
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import confirmation dialog CSS
import { FaEdit, FaSave, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa'; // Icons
import { Card, Table, Button, Form, Container, Row, Col } from 'react-bootstrap'; // Modern UI components
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Define navigate function
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    companyName: '',
    designation: '',
    trialEnd: '',
    isUnlimited: false,
  });
  const [extendTrialData, setExtendTrialData] = useState({ userId: '', days: 0 });

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin', { withCredentials: true });
        setUsers(res.data.users);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);



  // Logout function should not be inside useEffect
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      companyName: user.companyName,
      designation: user.designation,
      trialEnd: new Date(user.trialEnd).toISOString().split('T')[0],
      isUnlimited: user.isUnlimited,
    });
  };

  // Confirm before saving changes
  const confirmSave = (userId) => {
    confirmAlert({
      title: 'Confirm Save',
      message: 'Are you sure you want to save these changes?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleUpdate(userId),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  // Update user
  const handleUpdate = async (userId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/update-user/${userId}`,
        formData,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setEditingUser(null);
      setUsers(users.map((user) => (user._id === userId ? res.data.user : user)));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  // Delete user with confirmation
  const handleDelete = (userId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await axios.delete(
                `http://localhost:5000/admin/delete-user/${userId}`,
                { withCredentials: true }
              );
              toast.success(res.data.message);
              setUsers(users.filter((user) => user._id !== userId));
            } catch (error) {
              toast.error(error.response?.data?.message || 'Failed to delete user');
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  // Extend trial
  const handleExtendTrial = async (userId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/extend-trial/${userId}`,
        { days: extendTrialData.days },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setUsers(users.map((user) => (user._id === userId ? res.data.user : user)));
      setExtendTrialData({ userId: '', days: 0 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to extend trial');
    }
  };

  return (
    <Container className="mt-4">
      {/* Admin Details Section */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Admin Information</Card.Title>
          <Card.Text>
            You have full control over user management. Your role is <strong>Admin</strong>.
          </Card.Text>
        </Card.Body>
      </Card>

      {/* User Management Section */}
      <Card>
        <Card.Body>
          <Card.Title>User Management</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Trial End</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {editingUser === user._id ? (
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    ) : (
                      user.fullName
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <Form.Control
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    ) : (
                      user.companyName
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <Form.Control
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                      />
                    ) : (
                      user.designation
                    )}
                  </td>
                  <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                  <td>
                    {editingUser === user._id ? (
                      <Form.Control
                        type="date"
                        name="trialEnd"
                        value={formData.trialEnd}
                        onChange={handleChange}
                        disabled={formData.isUnlimited}
                      />
                    ) : (
                      user.isUnlimited ? 'Unlimited' : new Date(user.trialEnd).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => confirmSave(user._id)}
                        >
                          <FaSave /> Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingUser(null)}
                        >
                          <FaTimes /> Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                         variant="outline-secondary" // Subtle gray with border
                         className="text-dark fw-medium me-2" // Ensures readable dark text
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <FaEdit /> Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="me-2"
                          onClick={() => handleDelete(user._id)}
                        >
                          <FaTrash /> Delete
                        </Button>
                        <Form.Control
                          type="number"
                             size="sm"
                          placeholder="Days"
                          value={extendTrialData.userId === user._id ? extendTrialData.days : ''}
                          onChange={(e) =>
                            setExtendTrialData({ userId: user._id, days: e.target.value })
                          }
                          className="d-inline-block me-2"
                          style={{ width: '80px' }}
                        />
                        
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;