// components/Modals/WelcomeModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const WelcomeModal = ({ show, onClose, userName }) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton style={{ background: '#f0f8ff' }}>
        <Modal.Title className="w-100 text-center" style={{ fontWeight: 'bold', color: '#4e73df' }}>
          🎉 Welcome to SkillMatrix ATS! 🎉
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center" style={{ backgroundColor: '#fefefe' }}>
        <h5 className="mb-3 text-dark">Hi {userName || 'User'} 🙏</h5>
        <p className="text-bold">
        💖 You have successfully logged in. We're glad to see you 💖!
        </p>
        <p style={{ fontSize: '0.9rem', color: 'black' }}>
          Head to the Upload section to begin your journey with us .  🚀🚀🚀
        </p>
        <img
          src="https://media.giphy.com/media/OkJat1YNdoD3W/giphy.gif"
          alt="welcome"
          className="img-fluid rounded-circle mt-3"
          style={{ maxHeight: '375px', maxWidth: '375px' }}
        />

      </Modal.Body>
      <Modal.Footer className="justify-content-center" style={{ backgroundColor: '#f0f8ff' }}>
        <Button
          variant="primary"
          onClick={onClose}
          style={{
            borderRadius: '30px',
            padding: '10px 30px',
            background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
            border: 'none',
            fontWeight: '600',
          }}
        >
          Let’s Go!
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WelcomeModal;
