import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFileText, FiUsers, FiBarChart2, FiVideo, FiAward, FiShield,
  FiBriefcase, FiCheckCircle, FiArrowRight, FiPlay, FiCpu,
  FiCalendar, FiUpload, FiZap
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { servicesData } from '../data/servicesData';

const ServicesPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Use centralized services data
  const services = servicesData;

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
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="glass" size="lg" className="mb-8 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400/40 text-white px-6 py-3 shadow-xl">
              <FiZap className="w-5 h-5 animate-pulse" />
              End-to-End Recruitment Ecosystem
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              Complete <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">ATS Platform</span> Services
            </h1>
            <p className="text-2xl text-cyan-100 leading-relaxed mb-10 font-semibold">
              SkillMatrix is an AI-powered, end-to-end recruitment ecosystem designed to streamline 
              the full hiring lifecycle for HR teams, enterprises, and consultancies. It combines JD validation, 
              bulk resume processing, AI matching, assessments (MCQ, text, voice, video), interview scheduling, 
              document verification, offer generation, consent management and public job posting into a single secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="default" size="xl" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-black px-10 py-4 shadow-2xl shadow-blue-500/60 hover:scale-105 transition-all duration-300 border-2 border-white/20">
                  Start Free Trial
                  <FiArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <a href="https://cognitbotz.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="xl" className="border-2 border-white text-black hover:bg-white hover:text-blue-600 font-black px-10 py-4 hover:scale-105 transition-all duration-300">
                  Schedule Demo
                  <FiPlay className="w-6 h-6" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid with Video Previews */}
      <section className="section-modern">
        <div className="container-modern">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl text-white md:text-5xl lg:text-6xl font-black mb-8">
              All Services at a <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">Glance</span>
            </h2>
            <p className="text-xl text-white md:text-2xl text-gray-600 font-semibold">
              Click on any service to watch the demo video and learn more
            </p>
          </motion.div>

          {/* Internal Recruitment Services */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.slice(0, 8).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/services/${service.id}`} className="block h-full">
                  <Card variant="default" className="h-full group hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-gray-200 hover:border-blue-300">
                    <CardContent className="p-0">
                      {/* Video Preview Thumbnail */}
                      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FiPlay className="w-8 h-8 text-primary-600 ml-1" />
                          </div>
                        </div>
                        {/* Color overlay matching service theme */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-${service.color}-400/20 to-${service.color}-600/20`} />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                            <service.icon className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="text-xl font-black text-gray-900">{service.title}</h3>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3 font-semibold">
                          {service.shortDescription}
                        </p>

                        <ul className="space-y-2 mb-6">
                          {service.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-800 font-semibold">
                              <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center justify-between text-blue-600 font-black group-hover:text-blue-700">
                          <span>Learn More</span>
                          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* External Job Posting Services */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12 mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-2xl px-8 py-4 mb-6 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <FiBriefcase className="w-8 h-8" />
                External Job Posting Services
              </h3>
            </div>
            <p className="text-lg text-white font-semibold">
              These services help you attract external candidates by creating public-facing job portals and managing incoming applications from multiple sources.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.slice(8, 10).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/services/${service.id}`} className="block h-full">
                  <Card variant="default" className="h-full group hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-gray-200 hover:border-blue-300">
                    <CardContent className="p-0">
                      {/* Video Preview Thumbnail */}
                      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FiPlay className="w-8 h-8 text-primary-600 ml-1" />
                          </div>
                        </div>
                        {/* Color overlay matching service theme */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-${service.color}-400/20 to-${service.color}-600/20`} />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                            <service.icon className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="text-xl font-black text-gray-900">{service.title}</h3>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3 font-semibold">
                          {service.shortDescription}
                        </p>

                        <ul className="space-y-2 mb-6">
                          {service.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-800 font-semibold">
                              <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center justify-between text-blue-600 font-black group-hover:text-blue-700">
                          <span>Learn More</span>
                          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="section-modern bg-white">
        <div className="container-modern">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
              One Platform, <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">Complete Solution</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-semibold">
              SkillMatrix eliminates the need for multiple disconnected tools. Our integrated platform 
              handles everything from posting jobs to generating offer letters, with AI-powered automation 
              at every step to save you time and improve hiring quality.
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: FiCpu, value: '10+', label: 'Core Services' },
                { icon: FiUsers, value: '1000+', label: 'Companies' },
                { icon: FiCheckCircle, value: '98%', label: 'Accuracy' },
                { icon: FiZap, value: '80%', label: 'Time Saved' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-8 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl border-2 border-blue-200 hover:scale-105 transition-all duration-300">
                  <stat.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-800 font-extrabold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-modern bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container-modern text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
              Ready to Experience All Services?
            </h2>
            <p className="text-2xl text-cyan-100 mb-12 max-w-2xl mx-auto font-semibold">
              Start your 1-day free trial and see how SkillMatrix transforms your entire recruitment workflow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="default" size="xl" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-black px-10 py-4 shadow-2xl shadow-blue-500/60 hover:scale-105 transition-all duration-300 border-2 border-white/20">
                  Start Free Trial
                  <FiArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <a href="https://cognitbotz.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="xl" className="border-2 border-white text-black hover:bg-white hover:text-blue-600 font-black px-10 py-4 hover:scale-105 transition-all duration-300">
                  Talk to Sales
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
