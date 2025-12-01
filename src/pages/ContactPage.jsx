import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare, FiUser, FiBriefcase
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import axios from 'axios';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    service: ''
  });
  const [errors, setErrors] = useState({});

  const services = [
    'JD & Resume Upload',
    'Sending Assessment',
    'Candidate Assessment',
    'Assessment Report Analyzer',
    'Interview Hub - Scheduling',
    'Candidate Upload',
    'Request Documents Workflow',
    'Offer Letter Automation',
    'Job Marketing & Posting Portal',
    'Applicant Intake Dashboard',
    'Complete ATS Platform'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.contact)) {
      newErrors.contact = 'Invalid contact number';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/save-lead', formData);
      
      if (response.status === 200) {
        // Success - show message and reset form
        alert('Thank you for contacting us! We will get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          contact: '',
          service: ''
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"
            animate={{
              x: [0, 120, 0],
              y: [0, -60, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container-modern relative z-10">
        <div className="container-modern">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white px-6 py-3 mb-6 shadow-lg shadow-blue-500/50 border border-white/20">
              <FiMessageSquare className="w-5 h-5 inline mr-2" />
              Get in Touch
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              We're Here to <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Help</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Have questions? Want to schedule a demo? Our team is ready to assist you.
            </p>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-modern">
        <div className="container-modern">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 shadow-xl">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiUser className="inline w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiMail className="inline w-4 h-4 mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Contact Number Field */}
                  <div>
                    <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiPhone className="inline w-4 h-4 mr-2" />
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.contact ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="+1 234 567 8900"
                    />
                    {errors.contact && (
                      <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
                    )}
                  </div>

                  {/* Service Dropdown */}
                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiBriefcase className="inline w-4 h-4 mr-2" />
                      Service Interest *
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white ${
                        errors.service ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select a service...</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="text-red-500 text-xs mt-1">{errors.service}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="default"
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-bold py-4 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FiSend className="w-5 h-5 mr-2" />
                        Send Message
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By submitting, you agree to receive communications from SkillMatrix.
                  </p>
                </form>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl text-white font-bold text-gray-900 mb-6">Contact Information</h2>
                  <p className="text-gray-700 text-white mb-8 font-semibold">
                    Reach out to us directly or schedule a personalized demo
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: FiMail,
                      title: 'Email',
                      value: 'admin@skillmatrix.com',
                      link: 'mailto:contact@skillmatrix.com'
                    },
                    {
                      icon: FiPhone,
                      title: 'Phone',
                      value: '+91 9346575094',
                      link: 'tel:+15551234567'
                    },
                    {
                      icon: FiMapPin,
                      title: 'Address',
                      value: 'Cognitbotz Solutions Pvt Ltd,4rth Floor,3rd Avenue, Patrika Nagar, HITEC City, Madhapur Hyderabad, Telangana 500081',
                      link: null
                    }
                  ].map((item, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                          {item.link ? (
                            <a href={item.link} className="text-primary-600 hover:underline whitespace-pre-line">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-gray-600 whitespace-pre-line">{item.value}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
                  <h3 className="font-bold text-gray-900 mb-2">Business Hours</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                    <p>Saturday - Sunday: Closed</p>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-modern bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600">
        <div className="container-modern text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prefer to Try It Yourself?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Start your free 14-day trial. No credit card required.
            </p>
            <Link to="/register">
              <Button variant="default" size="xl" className="bg-white text-primary-600">
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
