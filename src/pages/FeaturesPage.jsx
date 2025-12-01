import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFileText, FiSearch, FiTarget, FiCheckCircle, FiVideo, FiShield,
  FiUsers, FiBarChart2, FiZap, FiCpu, FiArrowRight, FiAward
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const FeaturesPage = () => {
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
              AI-Powered Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              Powerful Features for <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Modern Recruiters</span>
            </h1>
            <p className="text-2xl text-cyan-100 leading-relaxed mb-10 font-semibold">
              Everything you need to streamline your recruitment process and find the best talent faster. 
              From AI-powered matching to automated assessments, SkillMatrix has you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="default" size="xl" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-black px-10 py-4 shadow-2xl shadow-blue-500/60 hover:scale-105 transition-all duration-300 border-2 border-white/20">
                  Start Free Trial
                  <FiArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="border-2 border-white text-text-blue-600  hover:bg-white hover:text-blue-600 font-black px-10 py-4 hover:scale-105 transition-all duration-300">
                  Explore Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-modern">
        <div className="container-modern">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl text-white md:text-5xl lg:text-6xl font-black mb-8">
              Complete <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">Feature Set</span>
            </h2>
            <p className="text-xl text-white md:text-2xl text-gray-600 font-semibold">
              9 core features that transform your hiring process
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: FiFileText,
                title: "JD Validation & Processing",
                description: "AI-powered job description validation with automated suggestions for missing sections, role clarity, and formatting improvements.",
                color: "text-blue-500"
              },
              {
                icon: FiSearch,
                title: "Intelligent Resume Parsing",
                description: "Bulk upload resumes with AI extraction of skills, experience, education, and automatic JD-resume matching with percentage scores.",
                color: "text-green-500"
              },
              {
                icon: FiTarget,
                title: "AI-Powered Matching",
                description: "Get precise candidate-job fit scores with skill mapping, experience relevance, and eligibility classification in real-time.",
                color: "text-purple-500"
              },
              {
                icon: FiCheckCircle,
                title: "Smart Assessments",
                description: "Auto-generate MCQs, text, voice, and video assessments. Get AI-scored results with detailed reports in 5 minutes.",
                color: "text-orange-500"
              },
              {
                icon: FiVideo,
                title: "Interview Management",
                description: "Schedule interviews with Google Calendar, Teams, and Zoom integration. Track feedback and maintain complete candidate timelines.",
                color: "text-emerald-500"
              },
              {
                icon: FiShield,
                title: "Document Verification",
                description: "Secure document collection and verification workflow for PAN, Aadhaar, certificates, and experience letters.",
                color: "text-indigo-500"
              },
              {
                icon: FiAward,
                title: "Offer Letter Generation",
                description: "Create professional offer letters with custom letterheads, merge fields, and automated distribution with tracking.",
                color: "text-pink-500"
              },
              {
                icon: FiUsers,
                title: "Consent Management",
                description: "GDPR-compliant consent system with recommended profiles pool and privacy-first candidate data sharing controls.",
                color: "text-cyan-500"
              },
              {
                icon: FiBarChart2,
                title: "Advanced Analytics",
                description: "Comprehensive recruitment dashboards with application tracking, test completion rates, high scorer identification, and JD-wise reports.",
                color: "text-red-500"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card variant="interactive" className="h-full group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-gray-200 hover:border-blue-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-700 leading-relaxed font-semibold">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-modern bg-white">
        <div className="container-modern">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
                Why Choose <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">SkillMatrix</span>?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: FiZap,
                    title: 'Reduce Time-to-Hire by 80%',
                    description: 'Automate screening, assessments, and scheduling with AI-powered workflows'
                  },
                  {
                    icon: FiTarget,
                    title: '98% Matching Accuracy',
                    description: 'AI algorithms ensure perfect candidate-job fit'
                  },
                  {
                    icon: FiShield,
                    title: 'Enterprise-Grade Security',
                    description: 'GDPR compliant with encrypted storage'
                  },
                  {
                    icon: FiBarChart2,
                    title: 'Data-Driven Insights',
                    description: 'Comprehensive analytics optimize your hiring'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 font-medium">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="p-10 border-2 border-blue-200 shadow-2xl">
                <h3 className="text-3xl font-black text-gray-900 mb-8">Platform Statistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '1000+', label: 'Companies' },
                    { value: '50K+', label: 'Successful Hires' },
                    { value: '98%', label: 'Match Accuracy' },
                    { value: '5 min', label: 'Report Time' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl border-2 border-blue-200">
                      <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-700 font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
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
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-2xl text-cyan-100 mb-12 max-w-2xl mx-auto font-semibold">
              Join 1000+ companies using SkillMatrix to hire faster and smarter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="default" size="xl" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-black px-10 py-4 shadow-2xl shadow-blue-500/60 hover:scale-105 transition-all duration-300 border-2 border-white/20">
                  Start Free Trial
                  <FiArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/pricing">
               <Button variant="default" size="xl" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-black px-10 py-4 shadow-2xl shadow-blue-500/60 hover:scale-105 transition-all duration-300 border-2 border-white/20">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
