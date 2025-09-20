import { Link } from 'react-router-dom';
import {
  FiBriefcase, FiUsers, FiBarChart2, FiClock, FiVideo, FiMessageSquare,
  FiFileText, FiUserCheck, FiAward, FiSearch, FiUpload, FiCheckCircle,
  FiStar, FiArrowRight, FiPlay, FiCheck, FiZap
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full">
            <div className="w-full h-full bg-gradient-to-r from-primary-50/30 to-secondary-50/30 blur-3xl"></div>
          </div>
        </div>
        
        <div className="container-modern relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <motion.div className="space-y-8" {...fadeInUp}>
              <div className="space-y-6">
                <Badge variant="gradient" size="lg" className="w-fit">
                  <FiZap className="w-4 h-4" />
                  AI-Powered Recruitment
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Find the <span className="text-gradient-hero">perfect match</span> for every role
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                  SkillMatrix ATS streamlines your recruitment process with AI-powered
                  candidate matching, seamless resume parsing, and comprehensive analytics.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="default" size="lg" className="group">
                    Request Free Trial
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="group">
                  <FiPlay className="w-4 h-4" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-500">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-500">Successful Hires</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-500">Satisfaction</div>
                </div>
              </div>
            </motion.div>
            
            {/* Right Side - Floating Job Card */}
            <motion.div 
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="relative"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Card variant="glass" className="w-72 md:w-80 shadow-2xl border-amber-200/50">
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiBriefcase className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">🚀 Ready to Hire?</h3>
                    <p className="text-sm md:text-base text-gray-600 mb-5">Post a job and we'll promote it!</p>
                    <Link to="/jobportal" className="w-full">
                      <Button variant="default" size="lg" className="w-full">
                        Post a Job
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-modern bg-white">
        <div className="container-modern">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Powerful features for <span className="text-gradient">modern recruiters</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Everything you need to streamline your recruitment process and find the best talent faster.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: FiSearch,
                title: "Smart Resume Parsing",
                description: "Automatically extract and analyze key information from resumes to find the most qualified candidates.",
                color: "text-blue-500"
              },
              {
                icon: FiUpload,
                title: "Easy Job Matching",
                description: "Upload job descriptions and instantly match them with the most relevant candidate profiles.",
                color: "text-green-500"
              },
              {
                icon: FiBarChart2,
                title: "Advanced Analytics",
                description: "Gain valuable insights into your recruitment process with comprehensive reporting and analytics.",
                color: "text-purple-500"
              },
              {
                icon: FiUsers,
                title: "Candidate Management",
                description: "Organize and track candidates throughout the entire recruitment process with custom workflows.",
                color: "text-orange-500"
              },
              {
                icon: FiCheckCircle,
                title: "Skill Assessment",
                description: "Accurately evaluate candidate skills and qualifications with our AI-powered assessment tools.",
                color: "text-emerald-500"
              },
              {
                icon: FiClock,
                title: "Historical Tracking",
                description: "View complete candidate history and track recruitment progress over time for better decision-making.",
                color: "text-indigo-500"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card variant="interactive" className="h-full group">
                  <CardContent className="p-6 md:p-8">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-6 h-6 md:w-7 md:h-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-modern bg-gradient-to-b from-gray-50 to-white">
        <div className="container-modern">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              How <span className="text-gradient">SkillMatrix</span> Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              A simple, streamlined process to find the best candidates for your open positions
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {[
              {
                icon: FiFileText,
                title: "Upload Job Description",
                description: "Start by uploading your job description or create one using our AI-powered templates. Our system analyzes requirements and skills automatically.",
                number: "01"
              },
              {
                icon: FiSearch,
                title: "Smart Resume Parsing",
                description: "Upload candidate resumes individually or in bulk. Our AI automatically extracts and analyzes key information, skills, and experience.",
                number: "02"
              },
              {
                icon: FiUserCheck,
                title: "AI-Powered Matching",
                description: "Our advanced AI algorithms analyze and score candidates based on job requirements, providing detailed matching insights and recommendations.",
                number: "03"
              },
              {
                icon: FiVideo,
                title: "Automated Video Interviews",
                description: "Schedule and conduct AI-powered video interviews. Get intelligent insights on candidate communication, skills, and cultural fit.",
                number: "04"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 mb-12 md:mb-16 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="space-y-4">
                    <Badge variant="outline" className="w-fit">
                      Step {step.number}
                    </Badge>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Icon */}
                <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-gradient rounded-3xl flex items-center justify-center shadow-lg">
                      <step.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-modern">
        <div className="container-modern">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Simple, <span className="text-gradient">Transparent Pricing</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600">Choose the plan that's right for your business</p>
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card variant="gradient" className="max-w-2xl w-full text-center">
              <CardContent className="p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Enterprise Solution</h3>
                <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                  Looking for a custom solution? We offer tailored enterprise packages to meet your specific needs.
                </p>
                <a 
                  href="https://cognitbotz.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                >
                  Contact Enterprise Sales
                  <FiArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-modern bg-gradient-to-b from-blue-50 to-white">
        <div className="container-modern">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  About <span className="text-gradient">SkillMatrix ATS</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  We're revolutionizing the way companies handle their recruitment process through innovative technology and AI-powered solutions.
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Our mission is to simplify and streamline the hiring process, making it easier for companies to find and hire the best talent. With our advanced ATS system, we're helping organizations make better hiring decisions and build stronger teams.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="default" size="lg">
                  <a href="#features">
                    Explore Features
                  </a>
                </Button>
                <Button variant="outline" size="lg">
                  <Link to="/register">
                    Get Started
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card variant="glass" className="p-6 md:p-8">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {[
                    { number: "1000+", label: "Companies Trust Us", color: "text-primary-600" },
                    { number: "50K+", label: "Successful Hires", color: "text-green-600" },
                    { number: "98%", label: "Client Satisfaction", color: "text-purple-600" },
                    { number: "24/7", label: "Support Available", color: "text-orange-600" }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      className="text-center p-4 md:p-6 bg-white rounded-2xl shadow-sm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>
                        {stat.number}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-modern">
        <div className="container-modern">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Trusted by <span className="text-gradient">hiring teams</span> everywhere
            </h2>
            <p className="text-lg md:text-xl text-gray-600">See what our customers have to say about SkillMatrix ATS</p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Alex Brown",
                role: "HR Director, TechCorp",
                avatar: "AB",
                content: "SkillMatrix ATS has completely transformed our hiring process. We've reduced time-to-hire by 40% and found better candidates for our technical roles.",
                rating: 5
              },
              {
                name: "Sarah Johnson",
                role: "Recruitment Lead, Finance Pro",
                avatar: "SJ",
                content: "The resume matching features in SkillMatrix ATS are incredibly accurate. We're now spending less time screening candidates and more time on meaningful interviews.",
                rating: 5
              },
              {
                name: "Michael Patel",
                role: "CEO, StartUp Innovate",
                avatar: "MP",
                content: "As a growing company, we needed an ATS that could scale with us. SkillMatrix has been the perfect solution, helping us build our team efficiently and effectively.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card variant="default" className="h-full">
                  <CardContent className="p-6 md:p-8">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <Avatar variant="primary" size="lg" name={testimonial.name} />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</div>
                        <div className="text-xs md:text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      
    </div>
  )
}

export default LandingPage