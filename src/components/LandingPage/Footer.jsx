import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faArrowUp,
  faHeart,
  faStar,
  faRocket,
  faBrain,
  faShield,
  faGlobe,
  faAward,
  faLightbulb,
  faUsers,
  faChartLine,
  faClock,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faGithub,
  faInstagram,
  faYoutube,
  faDiscord
} from '@fortawesome/free-brands-svg-icons';
import SMlogo from "../../assets/SMlogo.png";

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If element not found on current page, navigate to home and then scroll
      window.location.href = `/#${sectionId}`;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-purple-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        
        {/* Animated Premium Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <motion.div 
            className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-40 right-32 w-24 h-24 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 blur-2xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-32 left-1/3 w-40 h-40 rounded-full bg-gradient-to-r from-cyan-500/15 to-blue-500/15 blur-3xl"
            animate={{
              x: [0, 60, 0],
              y: [0, -40, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Sparkle Effects */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container-modern py-16 md:py-20">
          {/* Top Section */}
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <FontAwesomeIcon icon={faRocket} className="text-yellow-400" />
              <span className="text-white font-medium">Transforming Talent Assessment</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Ready to Revolutionize
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Hiring Process?
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Join thousands of companies worldwide who trust SkillMatrix to identify exceptional talent 
              through intelligent, AI-powered assessments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <FontAwesomeIcon icon={faRocket} />
                  Start Free Trial
                </span>
              </motion.button>
              
              <motion.button
                className="group px-6 py-3 border-2 border-white/30 rounded-lg text-white font-semibold backdrop-blur-md hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.6)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLightbulb} />
                  Watch Demo
                </span>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            variants={itemVariants}
          >
            {[
              { icon: faUsers, value: "50K+", label: "Happy Clients" },
              { icon: faChartLine, value: "1M+", label: "Assessments Completed" },
              { icon: faAward, value: "99.9%", label: "Accuracy Rate" },
              { icon: faGlobe, value: "150+", label: "Countries Served" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: index * 0.2 }}
              >
                <motion.div 
                  className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ 
                    background: "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
                  }}
                >
                  <FontAwesomeIcon icon={stat.icon} className="text-xl text-blue-300" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12"
            variants={itemVariants}
          >
            {/* Brand Section */}
            <motion.div 
              className="lg:col-span-1"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 mb-5">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <img
                    src={SMlogo}
                    alt="SkillMatrix Logo"
                    className="relative w-12 h-12 rounded-full border-2 border-white/30 shadow-xl"
                  />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">SkillMatrix</h3>
                  <p className="text-blue-200 text-xs font-medium">AI-Powered Talent Assessment</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-5">
                Revolutionizing recruitment with intelligent AI matching, 
                comprehensive assessments, and seamless candidate management.
              </p>
              
              {/* Trust Indicators */}
              <div className="space-y-3">
                {[
                  { icon: faShield, text: "Enterprise Security", color: "text-green-400" },
                  { icon: faBrain, text: "AI Technology", color: "text-blue-400" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 text-gray-300"
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-6 h-6 rounded-md bg-white/10 flex items-center justify-center ${feature.color}`}>
                      <FontAwesomeIcon icon={feature.icon} className="text-xs" />
                    </div>
                    <span className="text-xs font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <FontAwesomeIcon icon={faRocket} className="text-blue-400" />
                Product
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Features', action: () => scrollToSection('features') },
                  { label: 'Pricing', action: () => scrollToSection('pricing') },
                  { label: 'AI Matching', href: '/register' },
                  { label: 'Assessments', href: '/register' },
                  { label: 'Analytics', href: '/register' }
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.action ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          item.action();
                        }}
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 group flex items-center gap-2 w-full text-left text-sm"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200" />
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 group flex items-center gap-2 text-sm"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200" />
                        {item.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                Resources
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Documentation', href: 'https://cognitbotz.com' },
                  { label: 'API Reference', href: 'https://cognitbotz.com' },
                  { label: 'Help Center', href: 'https://cognitbotz.com' },
                  { label: 'Case Studies', href: '#' },
                  { label: 'Best Practices', href: '#' }
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : '_self'}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 group flex items-center gap-2 text-sm"
                    >
                      <span className="w-1 h-1 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform duration-200" />
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <FontAwesomeIcon icon={faHeart} className="text-red-400" />
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', action: () => scrollToSection('about') },
                  { label: 'Careers', href: '#' },
                  { label: 'Contact', href: 'https://cognitbotz.com' },
                  { label: 'Enterprise Details', href: 'https://cognitbotz.com' },
                  { label: 'Partners', href: '#' }
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.action ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          item.action();
                        }}
                        className="text-gray-300 hover:text-red-400 transition-colors duration-200 group flex items-center gap-2 w-full text-left text-sm"
                      >
                        <span className="w-1 h-1 bg-red-400 rounded-full group-hover:scale-150 transition-transform duration-200" />
                        {item.label}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : '_self'}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                        className="text-gray-300 hover:text-red-400 transition-colors duration-200 group flex items-center gap-2 text-sm"
                      >
                        <span className="w-1 h-1 bg-red-400 rounded-full group-hover:scale-150 transition-transform duration-200" />
                        {item.label}
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-green-400" />
                Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <FontAwesomeIcon icon={faEnvelope} className="text-blue-400 mt-1 flex-shrink-0" />
                  <a href="mailto:info@cognitbotz.com" className="hover:text-blue-400 transition-colors duration-200">
                    info@cognitbotz.com
                  </a>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-400 mt-1 flex-shrink-0" />
                  <span>Hyderabad, India</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <FontAwesomeIcon icon={faPhone} className="text-green-400 mt-1 flex-shrink-0" />
                  <span>+91 9876543210</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                {[
                  { icon: faLinkedin, href: '#', color: 'hover:text-blue-500' },
                  { icon: faTwitter, href: '#', color: 'hover:text-sky-400' },
                  { icon: faFacebook, href: '#', color: 'hover:text-blue-600' },
                  { icon: faGithub, href: '#', color: 'hover:text-gray-400' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 backdrop-blur-sm hover:scale-110 hover:bg-white/20`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon icon={social.icon} className="text-base" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-12"
            variants={itemVariants}
          >
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Stay Connected</h4>
                <p className="text-gray-300 text-sm mb-4">Get the latest updates and insights in AI recruitment technology.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-sm"
                />
                <motion.button
                  className="px-5 py-3 bg-primary-gradient text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            className="border-t border-white/10 pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Legal Links */}
              <div className="flex flex-wrap justify-center gap-5">
                {[
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Terms of Service', href: '#' },
                  { label: 'Cookie Policy', href: '#' },
                  { label: 'Security', href: '#' }
                ].map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </div>
              
              {/* Copyright & Company */}
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm mb-1">
                  © 2024 SkillMatrix ATS. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs">
                  Proudly built by{' '}
                  <a 
                    href="https://cognitbotz.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                  >
                    COGNITBOTZ Solutions
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-primary-gradient text-white rounded-full shadow-xl flex items-center justify-center z-20 backdrop-blur-sm border border-white/20"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-base" />
        </motion.button>
      </motion.div>
    </footer>
  );
};

export default Footer;