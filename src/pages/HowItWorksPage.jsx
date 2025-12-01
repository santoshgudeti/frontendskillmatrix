import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFileText, FiSearch, FiUserCheck, FiVideo, FiCheckCircle,
  FiAward, FiArrowRight, FiPlayCircle
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const HowItWorksPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
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
              <FiPlayCircle className="w-5 h-5 inline mr-2" />
              Simple 4-Step Process
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 drop-shadow-2xl">
              How <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent drop-shadow-lg">SkillMatrix</span> Works
            </h1>
            <p className="text-2xl text-cyan-100 leading-relaxed mb-10 font-semibold max-w-3xl mx-auto">
              A streamlined, AI-powered workflow that takes you from job posting 
              to offer letter in record time. No complexity, just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="default" size="xl" className="bg-white text-blue-600 hover:bg-cyan-50 font-black px-10 py-4 hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/50">
                  Get Started Now
                  <FiArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="border-2 border-white text-blue-600 hover:bg-white hover:text-blue-600 font-black px-10 py-4 hover:scale-105 transition-all duration-300">
                  <FiPlayCircle className="w-5 h-5" />
                  Watch Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="section-modern bg-gradient-to-b from-gray-50 to-white">
        <div className="container-modern">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white px-6 py-3 mb-6 shadow-lg shadow-blue-500/50">
              Complete Workflow
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Your <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">Step-by-Step</span> Journey
            </h2>
            <p className="text-xl text-gray-600 font-semibold">
              From posting a job to sending offer letters - see exactly how our AI-powered platform streamlines your entire recruitment process
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
          {[
            {
              icon: FiFileText,
              title: "Upload Job Description",
              description: "Start by uploading your job description or create one using our AI-powered templates. Our system analyzes requirements and skills automatically, validating for completeness and clarity.",
              number: "01",
              features: ['AI validation', 'Missing section detection', 'Role clarity checks', 'Formatting suggestions']
            },
            {
              icon: FiSearch,
              title: "Smart Resume Parsing",
              description: "Upload candidate resumes individually or in bulk (up to 30 at once). Our AI automatically extracts and analyzes key information, skills, and experience with 98% accuracy.",
              number: "02",
              features: ['Bulk processing', 'Skill extraction', 'Experience mapping', 'Instant match scoring']
            },
            {
              icon: FiUserCheck,
              title: "AI-Powered Matching & Assessment",
              description: "Our advanced AI algorithms analyze and score candidates based on job requirements. Create multi-format assessments (MCQ, voice, video) and get results in 5 minutes.",
              number: "03",
              features: ['98% match accuracy', 'Auto-generated tests', 'AI scoring', 'Detailed reports']
            },
            {
              icon: FiVideo,
              title: "Interview & Offer Generation",
              description: "Schedule interviews with calendar integration (Google/Teams/Zoom). Once decided, generate professional offer letters with custom letterheads and e-signature support.",
              number: "04",
              features: ['Auto scheduling', 'Video conferencing', 'Offer templates', 'Document tracking']
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              className="relative mb-20 last:mb-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 md:p-10">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                    {/* Step Number & Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-14 h-14 md:w-20 md:h-20 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl border-4 border-white">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <Badge className="bg-gradient-to-r from-blue-100 to-violet-100 text-blue-700 border border-blue-200 mb-4">
                        Step {step.number}
                      </Badge>
                      <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6 font-semibold">
                        {step.description}
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {step.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 rounded-xl border border-emerald-200">
                            <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <span className="text-gray-800 font-bold text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connecting Line (except for last item) */}
              {index < 3 && (
                <div className="absolute left-1/2 -bottom-10 w-1 h-10 bg-gradient-to-b from-blue-300 to-violet-300 hidden lg:block" />
              )}
            </motion.div>
          ))}
          </div>
        </div>
      </section>

      {/* Timeline Visualization */}
      <section className="section-modern bg-gradient-to-br from-blue-50 via-violet-50 to-cyan-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-violet-300 to-purple-400 rounded-full blur-3xl" />
        </div>

        <div className="container-modern relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-white text-blue-600 border-2 border-blue-300 px-6 py-3 mb-6 shadow-lg">
              ⚡ Lightning Fast
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              From Job Post to Offer in <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">Days, Not Weeks</span>
            </h2>
            <p className="text-xl text-gray-700 font-semibold max-w-2xl mx-auto">
              See how SkillMatrix accelerates every stage of hiring with AI-powered automation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { day: 'Day 1', task: 'Post JD & Upload Resumes', icon: FiFileText, gradient: 'from-cyan-500 to-blue-600' },
              { day: 'Day 2', task: 'Review AI Matches & Send Assessments', icon: FiSearch, gradient: 'from-blue-500 to-violet-600' },
              { day: 'Day 3-4', task: 'Conduct Interviews', icon: FiVideo, gradient: 'from-violet-500 to-purple-600' },
              { day: 'Day 5', task: 'Generate & Send Offers', icon: FiAward, gradient: 'from-purple-500 to-pink-600' }
            ].map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                <Card className="text-center p-8 bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 group h-full">
                  <div className={`w-20 h-20 bg-gradient-to-br ${stage.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                    <stage.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-3">
                    {stage.day}
                  </div>
                  <div className="text-gray-800 font-bold text-base leading-snug">{stage.task}</div>
                </Card>
                
                {/* Arrow connector */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <FiArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Stats Row */}
          <motion.div
            className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { value: '80%', label: 'Faster Hiring', icon: '⚡' },
              { value: '5 Days', label: 'Average Time-to-Offer', icon: '📅' },
              { value: '98%', label: 'Match Accuracy', icon: '🎯' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-xl text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-modern bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          <motion.div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-600/30 to-blue-600/30 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-600/30 to-purple-600/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -80, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container-modern text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-white/10 backdrop-blur-md border-2 border-cyan-400/50 text-white px-6 py-3 mb-8 shadow-xl">
              🚀 Start Your Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 drop-shadow-2xl">
              Ready to See It in Action?
            </h2>
            <p className="text-2xl text-cyan-100 mb-12 max-w-3xl mx-auto font-semibold leading-relaxed">
              Start your 1-day free trial today and experience the future of AI-powered recruitment. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register">
                <Button variant="default" size="xl" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-black px-12 py-5 text-lg shadow-2xl shadow-blue-500/60 hover:scale-105 transition-all duration-300 border-2 border-white/20">
                  Start Free Trial
                  <FiArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="border-2 border-white text-black hover:bg-white hover:text-blue-600 font-black px-12 py-5 text-lg hover:scale-105 transition-all duration-300">
                  View All Services
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-cyan-100">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-6 h-6 text-emerald-400" />
                <span className="font-semibold">1-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-6 h-6 text-emerald-400" />
                <span className="font-semibold">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-6 h-6 text-emerald-400" />
                <span className="font-semibold">Cancel Anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
