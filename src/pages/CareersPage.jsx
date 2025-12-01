import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMapPin, FiClock, FiBriefcase, FiArrowRight, FiHeart,
  FiTrendingUp, FiUsers, FiAward, FiZap, FiGlobe, FiCode,
  FiBarChart2, FiLayers
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const CareersPage = () => {
 const jobOpenings = [
  {
    id: 1,
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    experience: '5+ years',
    icon: FiCode,
    description: 'Design and build high-performance features across our AI-powered ATS using React, Node.js, and cloud-native services. Work closely with the product and AI teams to deliver scalable, secure, and intuitive experiences for HR users.',
    skills: ['React', 'Node.js', 'Python', 'MongoDB', 'AWS', 'Microservices']
  },
  {
    id: 2,
    title: 'AI/ML Engineer',
    department: 'AI & Research',
    location: 'Remote / Bangalore',
    type: 'Full-time',
    experience: '3+ years',
    icon: FiZap,
    description: 'Build and optimize NLP and ML models for resume intelligence, skill extraction, candidate matching, and automated assessments. Deploy and scale machine learning systems for real-world hiring workflows.',
    skills: ['Python', 'NLP', 'TensorFlow / PyTorch', 'LLMs', 'ML Ops', 'Docker']
  },
  {
    id: 3,
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco',
    type: 'Full-time',
    experience: '4+ years',
    icon: FiLayers,
    description: 'Drive product strategy and roadmap for our AI-powered ATS. Collaborate with engineering, design, and customers to define features that simplify recruitment and elevate HR productivity.',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'SaaS']
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    experience: '3+ years',
    icon: FiHeart,
    description: 'Design modern, accessible interfaces for recruiters and candidates. Create design systems, wireframes, and prototypes that deliver exceptional user experiences across web and mobile.',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems', 'UX Research']
  },
  {
    id: 5,
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote / New York',
    type: 'Full-time',
    experience: '2+ years',
    icon: FiUsers,
    description: 'Partner with HR teams to ensure smooth onboarding, adoption, and long-term success with SkillMatrix. Provide training, support, and insights to help customers achieve measurable recruitment impact.',
    skills: ['Communication', 'SaaS', 'Customer Engagement', 'Account Management', 'CRM Tools']
  },
  {
    id: 6,
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Remote',
    type: 'Full-time',
    experience: '2+ years',
    icon: FiBarChart2,
    description: 'Analyze platform usage, hiring trends, candidate behavior, and recruitment data to generate insights that shape product decisions and customer success strategies.',
    skills: ['SQL', 'Python', 'Data Visualization', 'Statistics', 'Dashboarding']
  }
];


 const benefits = [
  {
    icon: FiGlobe,
    title: 'Remote-First Flexibility',
    description: 'Work from anywhere with flexible hours designed for productivity and work–life balance.'
  },
  {
    icon: FiTrendingUp,
    title: 'Career Development',
    description: 'Access continuous learning, skill-building programs, and growth opportunities across teams.'
  },
  {
    icon: FiHeart,
    title: 'Health & Wellness Support',
    description: 'Comprehensive health insurance, wellness programs, and mental-health resources.'
  },
  {
    icon: FiAward,
    title: 'Equity & Rewards',
    description: 'Competitive compensation with stock options at a fast-growing, product-driven company.'
  },
  {
    icon: FiUsers,
    title: 'Strong Team Culture',
    description: 'Collaborate with passionate, talented individuals through team events and virtual meetups.'
  },
  {
    icon: FiZap,
    title: 'Modern Tech Stack',
    description: 'Build and innovate using AI, cloud-native architecture, automation, and cutting-edge tools.'
  }
];

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
              <FiBriefcase className="w-5 h-5 inline mr-2" />
              Join Our Team
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              Build the Future of <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Recruitment</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Join a team of passionate builders revolutionizing how companies hire. 
              We're solving real problems with AI and making recruitment smarter for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#openings">
                <Button variant="default" size="xl" className="bg-white text-blue-600 hover:bg-gray-100">
                  View Open Positions
                  <FiArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/about">
                <Button variant="outline" size="xl" className="border-2 border-white text-blue-600 hover:bg-white hover:text-blue-600 font-black hover:scale-105 transition-all duration-300">
                  Learn About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="section-modern">
        <div className="container-modern">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl text-white md:text-4xl lg:text-5xl font-bold mb-6">
              Why Join <span className="text-gradient">SkillMatrix</span> ?
            </h2>
            <p className="text-lg md:text-xl text-white">
              We're building something special. Here's what makes SkillMatrix a great place to work.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="default" className="h-full group hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-7 h-7 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-700 font-semibold">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="section-modern bg-white">
        <div className="container-modern">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Open <span className="text-gradient">Positions</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              {jobOpenings.length} opportunities to make an impact
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="default" className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <job.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {job.title}
                          </h3>
                          <Badge variant="outline" size="sm">{job.department}</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary-50 group-hover:border-primary-300 w-fit">
                        Apply Now
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiBriefcase className="w-4 h-4" />
                        <span>{job.experience}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 mb-4">
              Don't see a perfect fit? We're always looking for talented people.
            </p>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Send Us Your Resume
                <FiArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-modern bg-gradient-to-b from-gray-50 to-white">
        <div className="container-modern">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600">
                What drives us every day
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  title: 'Customer Obsession',
                  description: 'We build for our customers, not for ourselves. Every decision starts with "How does this help recruiters hire better?"'
                },
                {
                  title: 'Innovation & Excellence',
                  description: 'We push boundaries with AI and automation while maintaining the highest quality standards in everything we do.'
                },
                {
                  title: 'Transparency & Trust',
                  description: 'We communicate openly, admit mistakes quickly, and build trust through consistent actions.'
                },
                {
                  title: 'Diversity & Inclusion',
                  description: 'We believe diverse teams build better products. We actively create an inclusive environment where everyone thrives.'
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="default" className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-700 leading-relaxed font-semibold">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
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
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join our mission to transform recruitment with AI. Apply to an open position today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#openings">
              <Button variant="outline" size="xl" className="border-2 border-white text-blue-600 hover:bg-white hover:text-blue-600 font-black hover:scale-105 transition-all duration-300">
                  View Open Positions
                  <FiArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="outline" size="xl" className="border-2 border-white text-blue-600 hover:bg-white hover:text-blue-600 font-black hover:scale-105 transition-all duration-300">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
