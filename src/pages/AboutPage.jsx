import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiZap, FiTarget, FiShield, FiLayers, FiGlobe, FiAward, FiUsers, FiArrowRight
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const AboutPage = () => {
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
            <Badge className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white px-6 py-3 mb-6 shadow-lg shadow-blue-500/50 border border-white/20">
              <FiGlobe className="w-5 h-5 inline mr-2" />
              Powering Global Recruitment
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              The Future of Recruitment is <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Already Here</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              SkillMatrix isn't just another ATS—it's your intelligent hiring partner. 
              Built with cutting-edge AI and NLP technology, we transform every stage 
              of recruitment from a time-consuming task into a strategic advantage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section-modern">
        <div className="container-modern">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
<motion.div
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
>
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
    Our Mission
  </h2>

  <p className="text-lg text-white leading-relaxed mb-6 font-semibold">
    To empower HR teams, enterprises, and staffing organizations with intelligent, 
    AI-driven recruitment tools that eliminate manual effort, enhance decision-making, 
    and dramatically accelerate time-to-hire.
  </p>

  <p className="text-lg text-white leading-relaxed font-semibold">
    We believe hiring should be simple, fast, and deeply data-driven. SkillMatrix 
    brings together every stage of recruitment—from JD validation and resume 
    intelligence to assessments, interviews, document verification, and offer letters— 
    into one seamless, automated platform that works smarter for you.
  </p>
</motion.div>


            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '1000+', label: 'Companies' },
                    { value: '50K+', label: 'Successful Hires' },
                    { value: '98%', label: 'Client Satisfaction' },
                    { value: '24/7', label: 'Support' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-white rounded-xl">
                      <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Core Values */}
      <div className="text-center mb-12">
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
    Our Core Values
  </h2>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
  {[
    {
      icon: FiZap,
      title: 'Innovation First',
      description:
        'We continuously innovate with AI, automation, and intelligent workflows to simplify and elevate the hiring experience.'
    },
    {
      icon: FiShield,
      title: 'Security & Compliance',
      description:
        'Built with enterprise-grade security, role-based access, consent workflows, and privacy controls you can trust.'
    },
    {
      icon: FiTarget,
      title: 'Data-Driven Decisions',
      description:
        'Every module—from matching to assessments—is designed to provide actionable insights for smarter hiring outcomes.'
    },
    {
      icon: FiUsers,
      title: 'Customer-Centric',
      description:
        'We partner closely with HR teams to ensure smooth adoption, continuous improvement, and real recruitment impact.'
    }
  ].map((value, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 text-center h-full">
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <value.icon className="w-7 h-7 text-primary-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
        <p className="text-gray-700 text-sm font-semibold">{value.description}</p>
      </Card>
    </motion.div>
  ))}
</div>

        </div>
      </section>

      {/* Technology Stack */}
   <section className="section-modern bg-white">
  <div className="container-modern max-w-4xl">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Powered by <span className="text-gradient">Advanced AI</span>
      </h2>
      <p className="text-lg text-gray-600">
        SkillMatrix brings together AI, NLP, and intelligent automation to transform end-to-end hiring.
      </p>
    </div>

    <div className="space-y-6">
      {[
        {
          icon: FiZap,
          title: 'AI-driven resume understanding and skill extraction',
          description: 'Advanced NLP analyzes skills, experience, education, and role relevance from uploaded resumes.'
        },
        {
          icon: FiTarget,
          title: 'Skill-based candidate matching with semantic analysis',
          description: 'AI evaluates candidate suitability using job context, skills, experience, and relevance — not just keyword matches.'
        },
        {
          icon: FiShield,
          title: 'Enterprise-grade security and consent-driven data access',
          description: 'Encrypted storage, role-based permissions, and candidate consent workflows ensure full data protection.'
        },
        {
          icon: FiLayers,
          title: 'Intelligent workflow automation from JD to offer letter',
          description: 'AI connects every stage — JD validation, resume screening, assessments, interviews, verification, and offers.'
        }
      ].map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <item.icon className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-700 font-semibold">{item.description}</p>
          </div>
        </div>
      ))}
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
              Join Us in Transforming Recruitment
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Start your free trial today and see why 1000+ companies trust SkillMatrix
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="default" size="xl" className="bg-white text-primary-600">
                  Start Free Trial
                  <FiArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="https://cognitbotz.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="xl" className="border-2 border-white text-primary-600 hover:bg-white hover:text-blue-600 font-black hover:scale-105 transition-all duration-300">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
