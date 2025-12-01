import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  FiBriefcase, FiUsers, FiBarChart2, FiVideo, FiCheckCircle,
  FiFileText, FiAward, FiSearch, FiArrowRight, FiCheck, FiZap, 
  FiCpu, FiTrendingUp, FiShield, FiTarget, FiClock, FiStar,
  FiChevronLeft, FiChevronRight, FiPlayCircle, FiGlobe
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "AI-Powered Resume Screening",
      description: "Process 100+ resumes in minutes with 98% accuracy",
      image: "📄",
      gradient: "from-blue-600 to-cyan-500"
    },
    {
      title: "Smart Candidate Assessments",
      description: "Multi-format tests with AI scoring in 5 minutes",
      image: "🎯",
      gradient: "from-violet-600 to-purple-500"
    },
    {
      title: "Interview Scheduling Made Easy",
      description: "Seamless calendar integration with auto-reminders",
      image: "📅",
      gradient: "from-emerald-600 to-teal-500"
    },
    {
      title: "Automated Offer Letters",
      description: "Professional templates with e-signature ready",
      image: "✉️",
      gradient: "from-orange-600 to-red-500"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Revolutionary Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 pt-32 pb-40">
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
          <motion.div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 60, 0],
              scale: [1, 1.4, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container-modern relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              {/* AI Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md rounded-full border-2 border-cyan-400/30 mb-8 shadow-lg shadow-cyan-500/20"
              >
                <FiZap className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-cyan-100">Powered by Advanced NLP + Generative AI</span>
              </motion.div>

              {/* Job Portal CTA - Top Position with Pulsing Effect */}
              <Link to="/jobportal">
                <motion.div
                  className="inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 backdrop-blur-md rounded-2xl border-2 border-white/30 transition-all duration-300 group cursor-pointer shadow-2xl hover:shadow-emerald-500/60 mb-8 relative overflow-hidden"
                  whileHover={{ scale: 1.05, y: -3 }}
                  animate={{
                    boxShadow: [
                      "0 20px 60px rgba(16, 185, 129, 0.3)",
                      "0 20px 80px rgba(16, 185, 129, 0.5)",
                      "0 20px 60px rgba(16, 185, 129, 0.3)"
                    ]
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FiBriefcase className="w-8 h-8 text-white drop-shadow-lg" />
                  </motion.div>
                  
                  <div className="text-left">
                    <div className="text-lg font-black text-white drop-shadow-lg">🚀 Post a Job Now</div>
                    <div className="text-sm text-white/90 font-bold">Hire top talent instantly • Free trial</div>
                  </div>
                  
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiArrowRight className="w-6 h-6 text-white drop-shadow-lg" />
                  </motion.div>
                  
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-ping" style={{ animationDuration: '2s' }} />
                </motion.div>
              </Link>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-8">
                Hire the <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent drop-shadow-2xl">Best Talent</span>
                <br />10x Faster
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 leading-relaxed mb-10 max-w-2xl font-medium">
                Transform your recruitment with AI-powered automation. From resume screening to offer letters—all in one intelligent platform.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border-2 border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <FiCheckCircle className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">98% Accuracy</div>
                    <div className="text-sm text-cyan-200 font-semibold">AI Matching</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <FiClock className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">5 Minutes</div>
                    <div className="text-sm text-cyan-200 font-semibold">Report Generation</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border-2 border-violet-400/40 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <FiShield className="w-6 h-6 text-violet-300" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">GDPR Compliant</div>
                    <div className="text-sm text-cyan-200 font-semibold">Enterprise Security</div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button
                    size="xl"
                    className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:via-blue-500 hover:to-violet-500 text-white font-black shadow-2xl shadow-blue-500/60 group px-10 py-5 text-lg border-2 border-white/20 hover:scale-105 transition-all duration-300"
                  >
                    Start Free Trial
                    <FiArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button
                    size="xl"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-black px-10 py-5 text-lg hover:scale-105 transition-all duration-300"
                  >
                    <FiPlayCircle className="w-5 h-5" />
                    Our Services
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 mt-16 pt-10 border-t border-cyan-400/20">
               
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-base text-cyan-100 font-medium">Loved by <span className="font-black text-white">1000+ companies</span> worldwide</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl border-2 border-cyan-400/30 p-10 shadow-2xl shadow-blue-500/30">
                {/* Carousel */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    {/* Large Emoji/Icon */}
                    <div className={`w-56 h-56 mx-auto mb-10 bg-gradient-to-br ${slides[currentSlide].gradient} rounded-3xl flex items-center justify-center text-9xl shadow-2xl shadow-blue-500/40 border-4 border-white/20`}>
                      {slides[currentSlide].image}
                    </div>

                    {/* Content */}
                    <h3 className="text-3xl font-black text-white mb-4 drop-shadow-lg">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-cyan-200 text-xl font-semibold">
                      {slides[currentSlide].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mt-10">
                  <button
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all"
                  >
                    <FiChevronLeft className="w-7 h-7" />
                  </button>

                  {/* Dots */}
                  <div className="flex gap-3">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? 'w-10 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50'
                            : 'w-2.5 bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all"
                  >
                    <FiChevronRight className="w-7 h-7" />
                  </button>
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-8 -left-8 bg-gradient-to-br from-white via-blue-50 to-violet-50 rounded-3xl p-6 shadow-2xl border-2 border-blue-200"
              >
                <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent drop-shadow-lg">50K+</div>
                <div className="text-sm text-gray-700 font-bold mt-1">Resumes Processed</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-8 -right-8 bg-gradient-to-br from-white via-emerald-50 to-teal-50 rounded-3xl p-6 shadow-2xl border-2 border-emerald-200"
              >
                <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">1000+</div>
                <div className="text-sm text-gray-700 font-bold mt-1">Companies Trust Us</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features - Modern Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container-modern">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <Badge className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white px-6 py-3 mb-6 shadow-lg shadow-blue-500/50 border border-white/20">
              <FiZap className="w-5 h-5 inline mr-2 animate-pulse" />
              Complete ATS Platform
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              Everything You Need to
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent drop-shadow-lg"> Hire Smarter</span>
            </h2>
            <p className="text-2xl text-gray-600 font-semibold">
              End-to-end recruitment automation powered by cutting-edge AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FiFileText,
                title: "Smart JD Validation",
                description: "AI validates job descriptions, detects missing sections, and suggests improvements instantly.",
                gradient: "from-blue-500 to-cyan-500",
                stat: "98% accuracy"
              },
              {
                icon: FiSearch,
                title: "Intelligent Resume Matching",
                description: "Process Multiple resumes in minutes with semantic AI matching and instant compatibility scores.",
                gradient: "from-violet-500 to-purple-500",
                stat: "10x faster"
              },
              {
                icon: FiTarget,
                title: "Multi-Format Assessments",
                description: "Create MCQ, voice and video evaluation tests with AI auto-scoring in 5 minutes.",
                gradient: "from-emerald-500 to-teal-500",
                stat: "5 min reports"
              },
              
             {
                icon: FiBarChart2,
                title: "AI Insights Dashboard",
                description: "Get AI-generated insights across candidate matching, assessment performance, eligibility scoring, and JD-wise analysis.",
                gradient: "from-orange-500 to-red-500",
                stat: "AI-driven insights"
              },

            {
              icon: FiAward,
              title: "Offer Letter Automation",
              description: "Create polished offer letters in seconds with branded templates, auto-fill fields, and instant PDF dispatch.",
              gradient: "from-indigo-500 to-blue-500",
              stat: "Branded output"
            }

            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group hover:scale-105">
                  <CardContent className="p-10">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-blue-500/30 border-2 border-white/50`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="mb-4">
                      <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-sm font-black border border-gray-300">
                        {feature.stat}
                      </Badge>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-700 leading-relaxed text-base font-semibold">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/features">
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white font-black px-10 py-4 shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20">
                Explore All Features
                <FiArrowRight className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Process Flow */}
      <section className="py-24 bg-white">
        <div className="container-modern">
          <motion.div className="text-center max-w-3xl mx-auto mb-20" {...fadeInUp}>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              Your <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent drop-shadow-lg">Complete Hiring Journey</span>
            </h2>
            <p className="text-2xl text-gray-600 font-semibold">
              From job posting to offer letter in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Upload & Validate",
                description: "Upload JDs and resumes. AI validates and extracts key information.",
                icon: FiFileText,
                color: "blue"
              },
              {
                step: "02",
                title: "Match & Screen",
                description: "AI matches candidates to roles with compatibility scores.",
                icon: FiTarget,
                color: "violet"
              },
              {
                step: "03",
                title: "Assess & Interview",
                description: "Send assessments and schedule interviews.",
                icon: FiCheckCircle,
                color: "emerald"
              },
              {
                step: "04",
                title: "Offer & Onboard",
                description: "Generate offer letters and collect documents seamlessly.",
                icon: FiAward,
                color: "orange"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -z-10" />
                )}

                <div className="text-center">
                  <div className={`w-28 h-28 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center shadow-2xl shadow-${item.color}-500/50 relative border-4 border-white`}>
                    <item.icon className="w-12 h-12 text-white" />
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-2xl flex items-center justify-center border-2 border-gray-200">
                      <span className="text-base font-black text-gray-900">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 text-base font-medium">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="border-3 border-blue-600 text-blue-600 hover:bg-blue-50 font-black px-10 py-4 hover:scale-105 transition-all duration-300 shadow-lg">
                See Detailed Workflow
                <FiArrowRight className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container-modern">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              See SkillMatrix in <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">Action</span>
            </h2>
            <p className="text-2xl text-gray-600 font-semibold">
              Watch our product demos to see how SkillMatrix transforms your hiring workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* External Job Posting Demo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all duration-300"
            >
              <div className="relative pb-[56.25%] h-0"> {/* 16:9 Aspect Ratio */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-b-3xl"
                  src="https://www.youtube.com/embed/VvpWH89J7Yo?si=aCdJjt4TIhJ13qDz"
                  title="External Job Posting Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6">
                  <FiGlobe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">External Job Posting</h3>
                <p className="text-gray-600 text-lg font-semibold mb-6">
                  See how easy it is to create and publish job postings that candidates can apply to directly.
                </p>
              </div>
            </motion.div>

            {/* Main SkillMatrix Demo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all duration-300"
            >
              <div className="relative pb-[56.25%] h-0"> {/* 16:9 Aspect Ratio */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-t-3xl"
                  src="https://www.youtube.com/embed/Q0OeDYSORrI?si=43auqlhvTN7p5fe2"
                  title="Complete SkillMatrix Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                  <FiPlayCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Complete SkillMatrix Demo</h3>
                <p className="text-gray-600 text-lg font-semibold mb-6">
                  Full walkthrough of our AI-powered recruitment platform from start to finish.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Testimonials Section - Social Proof */}
      <section className="section-modern">
        <div className="container-modern">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Trusted by <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">hiring teams</span> everywhere
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-semibold">See what our customers have to say about SkillMatrix ATS</p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
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
              <motion.div key={index} variants={itemVariants}>
                <Card variant="default" className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 hover:scale-105">
                  <CardContent className="p-8 md:p-10">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-lg" />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-800 leading-relaxed mb-8 text-base md:text-lg font-semibold italic">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <Avatar variant="primary" size="lg" name={testimonial.name} />
                      <div>
                        <div className="font-black text-gray-900 text-base md:text-lg">{testimonial.name}</div>
                        <div className="text-sm md:text-base text-gray-500 font-semibold">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTA to view more testimonials */}
          <div className="text-center mt-12">
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-black px-10 py-4 hover:scale-105 transition-all duration-300 shadow-lg">
                More Success Stories
                <FiArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Videos Section */}
     

      {/* FAQ Section */}
      <section className="section-modern bg-gradient-to-b from-gray-50 to-white">
        <div className="container-modern max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Frequently Asked <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-semibold">
              Everything you need to know about SkillMatrix ATS
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: 'How does AI-powered resume matching work?',
                answer: 'Our AI extracts skills, experience, and qualifications from resumes and compares them against job requirements. It provides a percentage match score, highlights relevant experience, and identifies skill gaps automatically.'
              },
              {
                question: 'What types of assessments can I create?',
                answer: 'You can create AI-generated assessments (MCQs, text, voice, video) or upload custom questions via Excel. AI automatically scores all responses and provides detailed reports within 5 minutes.'
              },
              {
                question: 'Is candidate data secure and GDPR compliant?',
                answer: 'Yes! We implement enterprise-grade security with data encryption, role-based access control, and a comprehensive consent management system. Candidates control how their data is shared.'
              },
              {
                question: 'Can I integrate with my existing calendar and meeting tools?',
                answer: 'Absolutely! SkillMatrix integrates seamlessly with Google Calendar, Microsoft Teams, and Zoom for interview scheduling with automatic calendar invites and meeting links.'
              },
              {
                question: 'How long does the AI assessment scoring take?',
                answer: 'Our AI processes and scores assessments in approximately 5 minutes, providing comprehensive reports with per-question breakdowns, confidence scores, and recommendations.'
              },
              {
                question: 'Can I customize offer letter templates?',
                answer: 'Yes! Upload your company letterhead and customize templates with merge fields (name, role, CTC, joining date). The system auto-fills data and lets you edit before finalizing.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="default" className="hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 hover:scale-105">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-black text-gray-900 mb-4">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-base font-semibold">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Social Proof */}
      <section id="pricing" className="section-modern">
        <div className="container-modern">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="gradient" size="lg" className="w-fit mx-auto mb-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 shadow-xl">
              <FiAward className="w-5 h-5" />
              Simple, Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Choose the <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">Perfect Plan</span> for Your Team
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-semibold">Start with a 1-day free trial. No credit card required. Cancel anytime.</p>
          </motion.div>
          
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card variant="default" className="h-full">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Starter</h3>
                    <p className="text-gray-600 text-base font-semibold">Perfect for small teams</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">$99</div>
                    <div className="text-gray-500 text-base font-semibold">/month</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Up to 50 candidates/month',
                      'AI Resume Parsing',
                      'Basic Analytics',
                      '5 Assessment Templates',
                      'Email Support'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="w-full">
                    <Button variant="outline" size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Plan - Popular */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card variant="gradient" className="h-full border-3 border-blue-500 relative shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white px-6 py-2 font-black shadow-xl border-2 border-white">
                    Most Popular
                  </Badge>
                </div>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Professional</h3>
                    <p className="text-gray-600 text-base font-semibold">For growing companies</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">$299</div>
                    <div className="text-gray-500 text-base font-semibold">/month</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Up to 200 candidates/month',
                      'AI Resume + JD Matching',
                      'Advanced Analytics',
                      'Unlimited Assessments',
                      'Interview Scheduling',
                      'Document Verification',
                      'Priority Support'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="w-full">
                    <Button variant="default" size="lg" className="w-full font-black bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:via-blue-500 hover:to-violet-500 shadow-xl hover:scale-105 transition-all duration-300">
                      Start Free Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card variant="default" className="h-full">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Enterprise</h3>
                    <p className="text-gray-600 text-base font-semibold">Custom solutions at scale</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Custom</div>
                    <div className="text-gray-500 text-base font-semibold">Contact us for pricing</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Unlimited candidates',
                      'Custom AI Training',
                      'White-label Solution',
                      'API Access',
                      'Dedicated Account Manager',
                      'SLA Guarantee',
                      '24/7 Premium Support'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://cognitbotz.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" size="lg" className="w-full">
                      Contact Sales
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Trust Badge */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4 text-green-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>1-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-green-500" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Deep Features Section - Removed (duplicates /features page) */}



      {/* About Section */}


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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Trusted by <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">hiring teams</span> everywhere
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-semibold">See what our customers have to say about SkillMatrix ATS</p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
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
              <motion.div key={index} variants={itemVariants}>
                <Card variant="default" className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 hover:scale-105">
                  <CardContent className="p-8 md:p-10">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-lg" />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-800 leading-relaxed mb-8 text-base md:text-lg font-semibold italic">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <Avatar variant="primary" size="lg" name={testimonial.name} />
                      <div>
                        <div className="font-black text-gray-900 text-base md:text-lg">{testimonial.name}</div>
                        <div className="text-sm md:text-base text-gray-500 font-semibold">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTA to view more testimonials */}
          <div className="text-center mt-12">
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-black px-10 py-4 hover:scale-105 transition-all duration-300 shadow-lg">
                More Success Stories
                <FiArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Videos Section */}
      
    </div>
  )
}

export default LandingPage