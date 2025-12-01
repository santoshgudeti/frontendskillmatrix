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
  faShield
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

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/10 via-blue-600/10 to-violet-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-20 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/15 to-blue-600/15 blur-3xl"
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
            className="absolute bottom-32 right-32 w-96 h-96 rounded-full bg-gradient-to-r from-violet-600/15 to-purple-600/15 blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
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
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={SMlogo}
                    alt="SkillMatrix Logo"
                    className="relative w-12 h-12 rounded-full border-2 border-cyan-400/50 shadow-2xl shadow-blue-500/50"
                  />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">SkillMatrix</h3>
                  <p className="text-cyan-300 text-xs font-bold tracking-wide">AI-Powered Talent Assessment</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                Revolutionizing recruitment with intelligent AI matching, 
                comprehensive assessments, and seamless candidate management.
              </p>
              
              {/* Trust Indicators */}
              <div className="space-y-3">
                {[
                  { icon: faShield, text: "Enterprise Security", color: "text-emerald-400" },
                  { icon: faBrain, text: "AI Technology", color: "text-cyan-400" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 text-gray-300"
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center ${feature.color} shadow-lg`}>
                      <FontAwesomeIcon icon={feature.icon} className="text-sm" />
                    </div>
                    <span className="text-sm font-bold">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-5 flex items-center gap-2">
                <FontAwesomeIcon icon={faRocket} className="text-cyan-400" />
                Platform
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Features', to: '/features' },
                  { label: 'Services', to: '/services' },
                  { label: 'Pricing', to: '/pricing' },
                  { label: 'How It Works', to: '/how-it-works' },
                  { label: 'Blog', to: '/blog' }
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={item.to}
                      className="text-gray-300 hover:text-cyan-400 transition-all duration-300 group flex items-center gap-2 text-sm font-medium"
                    >
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full group-hover:scale-150 transition-transform duration-200" />
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-5 flex items-center gap-2">
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
                      className="text-gray-300 hover:text-yellow-400 transition-all duration-300 group flex items-center gap-2 text-sm font-medium"
                    >
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full group-hover:scale-150 transition-transform duration-200" />
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-5 flex items-center gap-2">
                <FontAwesomeIcon icon={faHeart} className="text-pink-400" />
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', to: '/about' },
                  { label: 'Careers', to: '/careers' },
                  { label: 'Contact', to: '/contact' },
                  { label: 'Enterprise Details', href: 'https://cognitbotz.com' }
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="text-gray-300 hover:text-pink-400 transition-all duration-300 group flex items-center gap-2 text-sm font-medium"
                      >
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-red-400 rounded-full group-hover:scale-150 transition-transform duration-200" />
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-pink-400 transition-all duration-300 group flex items-center gap-2 text-sm font-medium"
                      >
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-red-400 rounded-full group-hover:scale-150 transition-transform duration-200" />
                        {item.label}
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-5 flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-emerald-400" />
                Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <FontAwesomeIcon icon={faEnvelope} className="text-cyan-400 mt-1 flex-shrink-0" />
                  <a href="mailto:info@cognitbotz.com" className="hover:text-cyan-400 transition-all duration-300 font-medium">
                    info@cognitbotz.com
                  </a>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-violet-400 mt-1 flex-shrink-0" />
                  <span className="font-medium">Hyderabad, India</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <FontAwesomeIcon icon={faPhone} className="text-emerald-400 mt-1 flex-shrink-0" />
                  <span className="font-medium">+91 9876543210</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                {[
                  { icon: faLinkedin, href: '#', gradient: 'from-blue-500 to-blue-600' },
                  { icon: faTwitter, href: '#', gradient: 'from-sky-400 to-blue-500' },
                  { icon: faFacebook, href: '#', gradient: 'from-blue-600 to-indigo-600' },
                  { icon: faGithub, href: '#', gradient: 'from-gray-700 to-gray-900' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${social.gradient} border border-white/20 flex items-center justify-center text-white shadow-lg hover:shadow-2xl transition-all duration-300`}
                    whileHover={{ y: -4, scale: 1.1 }}
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
            className="bg-gradient-to-r from-blue-900/30 via-violet-900/30 to-purple-900/30 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-12 shadow-2xl"
            variants={itemVariants}
          >
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">Stay Connected</h4>
                <p className="text-gray-300 text-sm mb-4 font-medium">Get the latest updates and insights in AI recruitment technology.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 text-sm font-medium"
                />
                <motion.button
                  className="px-6 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 text-sm border border-white/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            className="border-t border-white/20 pt-8"
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
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-all duration-300 relative group font-medium"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </div>
              
              {/* Copyright & Company */}
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm mb-1 font-medium">
                  © 2024 SkillMatrix ATS. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs">
                  Proudly built by{' '}
                  <a 
                    href="https://cognitbotz.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-bold"
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
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white rounded-2xl shadow-2xl shadow-blue-500/50 flex items-center justify-center z-20 backdrop-blur-sm border-2 border-white/30 hover:shadow-cyan-500/60"
          whileHover={{ scale: 1.15, y: -4, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 300 }}
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-lg" />
        </motion.button>
      </motion.div>
    </footer>
  );
};

export default Footer;