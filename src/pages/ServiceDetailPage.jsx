import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFileText, FiUsers, FiBarChart2, FiVideo, FiAward, FiShield,
  FiBriefcase, FiCheckCircle, FiArrowRight, FiArrowLeft, FiCpu,
  FiCalendar, FiUpload, FiZap, FiTarget, FiTrendingUp, FiPlay,FiGlobe 
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { servicesData } from '../data/servicesData';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();

  // Helper function to get color values
  const getServiceColor = (color, shade) => {
    const colors = {
      blue: {
        100: '#dbeafe',
        500: '#3b82f6',
        700: '#1d4ed8'
      },
      emerald: {
        100: '#d1fae5',
        500: '#10b981',
        700: '#047857'
      },
      purple: {
        100: '#ede9fe',
        500: '#8b5cf6',
        700: '#6d28d9'
      },
      orange: {
        100: '#ffedd5',
        500: '#f97316',
        700: '#c2410c'
      },
      pink: {
        100: '#fce7f3',
        500: '#ec4899',
        700: '#db2777'
      },
      cyan: {
        100: '#cffafe',
        500: '#06b6d4',
        700: '#0e7490'
      },
      teal: {
        100: '#ccfbf1',
        500: '#14b8a6',
        700: '#0f766e'
      },
      indigo: {
        100: '#e0e7ff',
        500: '#6366f1',
        700: '#4338ca'
      },
      rose: {
        100: '#ffe4e6',
        500: '#f43f5e',
        700: '#e11d48'
      },
      amber: {
        100: '#fef3c7',
        500: '#f59e0b',
        700: '#b45309'
      }
    };
    
    return colors[color]?.[shade] || '#6b7280'; // fallback to gray
  };

  // Extended service details (features, benefits, use cases)
const serviceDetails = {
 'jd-resume-upload': {
  tagline: "Validate job descriptions and process multiple resumes instantly",
  description:
    "Upload a job description and multiple resumes to generate AI-powered candidate matching. SkillMatrix extracts key skills, relevant experience, designations, and job alignment to produce clear match scores.",
  color: 'from-blue-500 to-indigo-600',
  accentColor: 'blue',

  features: [
    {
      title: 'JD Validation',
      description:
        'Validates job descriptions for clarity and role consistency before AI matching begins.',
      icon: FiTarget
    },
    {
      title: 'Multi-Resume Upload',
      description:
        'Upload multiple PDF resumes at once for rapid AI screening and comparison.',
      icon: FiUpload
    },
    {
      title: 'Skill & Experience Extraction',
      description:
        'Automatically extracts skills, experience years, relevant keywords, and job suitability.',
      icon: FiFileText
    },
    {
      title: 'AI Match Scoring',
      description:
        'Each resume receives a match percentage based on skill fit, experience relevance, and JD alignment.',
      icon: FiUsers
    }
  ],

  benefits: [
    'Faster initial screening',
    'Accurate candidate matching',
    'No manual resume reading',
    'Consistent scoring for every candidate'
  ],

  useCases: [
    {
      title: 'Resume Shortlisting',
      description: 'Quickly shortlist aligned candidates for any role.'
    },
    {
      title: 'Bulk Resume Evaluation',
      description: 'Process multiple resumes in one go during hiring drives.'
    },
    {
      title: 'JD Quality Check',
      description: 'Ensure job descriptions are clear and complete before use.'
    }
  ]
},


 'sending-assessment': {
  tagline: "Send AI-generated or custom assessments to candidates instantly",
  description:
    "Dispatch assessments to candidates via email with automated report generation. Supports both AI-generated questions and custom uploaded assessments.",
  color: 'from-emerald-500 to-teal-600',
  accentColor: 'emerald',

  features: [
    {
      title: 'One-Click Assessment Sending',
      description:
        'Send assessment links directly to candidates from the dashboard.',
      icon: FiUpload
    },
    {
      title: 'AI-Generated Questions',
      description:
        'Automatically generates 10 MCQs and 5 descriptive/voice/video questions based on the JD.',
      icon: FiCpu
    },
    {
      title: 'Custom Assessment Upload',
      description:
        'Upload Excel files to send custom HR-created assessments.',
      icon: FiFileText
    },
    {
      title: 'Auto Report Delivery',
      description:
        'HR automatically receives a detailed assessment report within minutes of completion.',
      icon: FiZap
    }
  ],

  benefits: [
    'Instant assessment generation',
    'No manual question creation',
    'Easy evaluation with automated scoring',
    'Better decision-making with detailed reports'
  ],

  useCases: [
    {
      title: 'Role-Based Assessments',
      description: 'Send skill-specific tests tailored to JD requirements.'
    },
    {
      title: 'Custom HR Assessments',
      description: 'Use Excel-based assessments for internal evaluation.'
    }
  ]
},


 'candidate-assessment': {
  tagline: "Evaluate candidates with MCQ, text, voice and video responses",
  description:
    "Candidates complete MCQs and open-ended text, voice, or video questions. SkillMatrix analyzes responses and produces a structured report.",
  color: 'from-purple-500 to-pink-600',
  accentColor: 'purple',

  features: [
    {
      title: 'Multi-Format Questions',
      description:
        'Supports MCQs, descriptive text responses, voice answers, and video submissions.',
      icon: FiVideo
    },
    {
      title: 'Automated Scoring',
      description:
        'MCQs are auto-scored; descriptive answers analyzed using AI; voice/video evaluated for clarity and communication.',
      icon: FiCpu
    },
    {
      title: '5-Minute Report Generation',
      description:
        'A full candidate report is generated within minutes after test submission.',
      icon: FiZap
    },
    {
      title: 'Secure Candidate Verification',
      description:
        'Enforces camera/mic access, environment validation, and full-screen mode.',
      icon: FiShield
    }
  ],

  benefits: [
    'Evaluates both technical and communication skills',
    'Fast and objective scoring',
    'Simple experience for HR and candidates'
  ],

  useCases: [
    {
      title: 'Technical Screening',
      description: 'Evaluate job-specific knowledge and reasoning.'
    },
    {
      title: 'Voice/Communication Roles',
      description: 'Assess speech clarity and client-facing readiness.'
    }
  ]
},

  'assessment-reports': {
  tagline: "Detailed performance reports for every candidate assessment",
  description:
    "SkillMatrix generates structured assessment reports that include MCQ scores, text evaluation, voice/video analysis, and combined weighted scoring.",
  color: 'from-orange-500 to-red-600',
  accentColor: 'orange',

  features: [
    {
      title: 'MCQ + Subjective Scoring',
      description:
        'Includes MCQ scores, text analysis, voice/video scoring and final weighted results.',
      icon: FiBarChart2
    },
    {
      title: 'Question-Wise Breakdown',
      description:
        'Each question displays candidate answer, correct answer, and evaluation result.',
      icon: FiTarget
    },
    {
      title: 'Downloadable Report',
      description:
        'HR receives the full assessment report automatically by email.',
      icon: FiArrowRight
    },
    {
      title: 'Score Visibility in Dashboard',
      description:
        'Assessment scores appear in the candidate list for quick comparison.',
      icon: FiUsers
    }
  ],

  benefits: [
    'Transparent evaluation',
    'Easy decision-making',
    'Complete evidence for hiring decisions'
  ],

  useCases: [
    {
      title: 'HR Evaluation',
      description: 'Quickly compare assessment performance across candidates.'
    }
  ]
},


  'interview-scheduling': {
  tagline: "Schedule interviews directly through Teams, Google Calendar, or Zoom",
  description:
    "SkillMatrix connects with Microsoft Teams, Zoom, and Google Calendar to schedule candidate interviews with automated invite emails.",
  color: 'from-pink-500 to-rose-600',
  accentColor: 'pink',

  features: [
    {
      title: 'One-Click Calendar Scheduling',
      description:
        'Schedule interviews using Google Calendar, Zoom, Teams, or Outlook.',
      icon: FiCalendar
    },
    {
      title: 'Auto-Generated Meeting Links',
      description:
        'Meeting links are automatically added to the invitation.',
      icon: FiVideo
    },
    {
      title: 'Email Notifications',
      description:
        'Candidates and HR receive instant confirmation emails.',
      icon: FiZap
    },
    {
      title: 'Document Request Workflow',
      description:
        'Interview flow continues into document collection and verification.',
      icon: FiUsers
    }
  ],

  benefits: [
    'Saves HR time',
    'Clear communication',
    'Integrated interview workflow'
  ],

  useCases: [
    {
      title: 'Final Interviews',
      description: 'Schedule candidate interviews after assessment.'
    }
  ]
},

'candidate-upload': {
  tagline: "Collect candidate details instantly through public apply forms",
  description:
    "Candidates applying from public job posting pages submit their name, email, phone and resume, which automatically appear in the HR dashboard.",
  color: 'from-cyan-500 to-blue-600',
  accentColor: 'cyan',

  features: [
    {
      title: 'Public Apply Form',
      description:
        'Candidates fill name, email, phone and upload resume from the job posting link.',
      icon: FiUpload
    },
    {
      title: 'Auto Profile Creation',
      description:
        'Submitted applications automatically create new candidate entries.',
      icon: FiUsers
    },
    {
      title: 'Resume Download',
      description:
        'HR can view and download resumes directly.',
      icon: FiFileText
    },
    {
      title: 'ATS Integration',
      description:
        'Candidates are moved into the main ATS for AI matching and assessments.',
      icon: FiTarget
    }
  ],

  benefits: [
    'Instant candidate pipeline',
    'All applications stored in one dashboard',
    'Easy resume access'
  ],

  useCases: [
    {
      title: 'Job Posting Applications',
      description: 'Collect applications directly from public job links.'
    }
  ]
},

  'document-verification': {
  tagline: "Collect and verify candidate documents securely",
  description:
    "HR can request PAN, Aadhaar, certificates, and experience letters from candidates. Candidates upload documents through a secure portal.",
  color: 'from-teal-500 to-green-600',
  accentColor: 'teal',

  features: [
    {
      title: 'Document Request',
      description:
        'HR requests required documents from candidates with one click.',
      icon: FiUpload
    },
    {
      title: 'Secure Candidate Upload',
      description:
        'Candidates upload documents securely using the provided link.',
      icon: FiShield
    },
    {
      title: 'Centralized Document Storage',
      description:
        'HR can preview, verify, approve or reject submitted documents.',
      icon: FiUsers
    },
    {
      title: 'Automatic Status Updates',
      description:
        'HR dashboard shows document submission and verification status.',
      icon: FiCheckCircle
    }
  ],

  benefits: [
    'Eliminates email-based document sharing',
    'Faster onboarding readiness',
    'All documents stored in one place'
  ],

  useCases: [
    {
      title: 'Pre-Onboarding Verification',
      description: 'Collect all joining documents before offer release.'
    }
  ]
},

 'offer-letter-automation': {
  tagline: "Generate and send offer letters instantly",
  description:
    "HR uploads company letterhead and enters offer details. SkillMatrix auto-generates the final offer letter and emails it to both HR and the candidate.",
  color: 'from-indigo-500 to-purple-600',
  accentColor: 'indigo',

  features: [
    {
      title: 'Custom Letterhead Support',
      description:
        'Upload your company letterhead to generate branded offer letters.',
      icon: FiFileText
    },
    {
      title: 'Editable Offer Preview',
      description:
        'Modify the offer details before generating the final PDF.',
      icon: FiBriefcase
    },
    {
      title: 'Instant PDF Generation',
      description:
        'The system generates a clean, formatted PDF offer letter.',
      icon: FiZap
    },
    {
      title: 'Auto Email Delivery',
      description:
        'Offer letter is emailed to both the HR and candidate automatically.',
      icon: FiArrowRight
    }
  ],

  benefits: [
    'Fast offer creation',
    'Professional branding',
    'No manual formatting',
    'Fully automated delivery'
  ],

  useCases: [
    {
      title: 'Final Selection',
      description: 'Generate offers once verification is complete.'
    }
  ]
},


  'job-posting-portal': {
  tagline: "Publish jobs publicly and collect direct applications",
  description:
    "Post jobs inside SkillMatrix and generate a public link that candidates can use to view job details and apply instantly.",
  color: 'from-rose-500 to-pink-600',
  accentColor: 'rose',

  features: [
    {
      title: 'Job Posting Form',
      description:
        'Enter job title, description, skills, salary, and upload JD PDF.',
      icon: FiBriefcase
    },
    {
      title: 'Public Job Page',
      description:
        'A dedicated job page is generated for easy sharing.',
      icon: FiGlobe
    },
    {
      title: 'Direct Apply Form',
      description:
        'Candidates submit their details directly from the job page.',
      icon: FiUsers
    },
    {
      title: 'Application Tracking',
      description:
        'HR can view all applicants inside the dashboard.',
      icon: FiBarChart2
    }
  ],

  benefits: [
    'Share jobs easily on LinkedIn & WhatsApp',
    'Capture more candidates without paid job boards',
    'Central application repository'
  ],

  useCases: [
    {
      title: 'Hiring Campaigns',
      description: 'Promote job openings widely using public links.'
    }
  ]
},

'applicant-intake': {
  tagline: "View all incoming job applications in one place",
  description:
    "SkillMatrix displays all candidates who applied from public job links. HR can view resumes, download files, and move candidates into the ATS for matching and assessments.",
  color: 'from-amber-500 to-orange-600',
  accentColor: 'amber',

  features: [
    {
      title: 'Centralized Applications',
      description:
        'Every application submitted through public job pages appears here.',
      icon: FiUsers
    },
    {
      title: 'Resume Preview & Download',
      description:
        'View or download resumes directly from the dashboard.',
      icon: FiFileText
    },
    {
      title: 'Candidate Details',
      description:
        'See candidate name, email, phone, and upload timestamp.',
      icon: FiTarget
    },
    {
      title: 'ATS Integration',
      description:
        'Move candidates into the main ATS for AI matching and assessment.',
      icon: FiArrowRight
    }
  ],

  benefits: [
    'All applicants in one place',
    'No email-based resume collection',
    'Smooth transition into the ATS'
  ],

  useCases: [
    {
      title: 'Public Job Applications',
      description: 'Track incoming applications from job posting links.'
    }
  ]
},

};


  // Get base service data from servicesData
  const baseService = servicesData.find(s => s.id === serviceId);
  const details = serviceDetails[serviceId];

  if (!baseService || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button variant="default">
              <FiArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Merge base service data with extended details
  const service = {
    ...baseService,
    ...details
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video */}
      <section className={`relative bg-gradient-to-r ${service.color} py-16 md:py-24 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/5" />
        <div className="container-modern relative z-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
            <FiArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to All Services</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <Badge variant="glass" className="text-white border-white/30">
                  Core Service
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {service.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
                {service.tagline}
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                {service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="default" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    Start Free Trial
                    <FiArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
               
              </div>
            </motion.div>

            {/* Service Video Player with Animations */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20 backdrop-blur-xl">
                {/* Video Player */}
                <motion.video
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full h-full object-cover"
                  src={service.videoEmbedUrl}
                  controls
                  autoPlay={false}
                  loop
                  muted
                  playsInline
                />
                
                {/* Video Overlay Gradient */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `linear-gradient(to bottom right, ${getServiceColor(service.accentColor, 500)}20, ${getServiceColor(service.accentColor, 700)}20)`
                }} />
                
              </div>
              
              {/* Video Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-center"
              >
                <h3 className="text-xl font-bold text-white">
                  {service.title} Demo
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Watch how this feature works in practice
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-modern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600">
              Powerful capabilities designed to streamline your recruitment workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {service.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="default" className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{
                      backgroundColor: `${getServiceColor(service.accentColor, 100)}40`
                    }}>
                      <feature.icon className="w-6 h-6" style={{
                        color: getServiceColor(service.accentColor, 600)
                      }} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-modern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits & Advantages
            </h2>
            <p className="text-lg text-gray-600">
              See the tangible impact on your recruitment efficiency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {service.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm"
              >
                <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-modern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real-World Use Cases
            </h2>
            <p className="text-lg text-gray-600">
              How leading companies leverage this service
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {service.useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="default" className="h-full">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-gray-700">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 md:py-20 bg-gradient-to-r ${service.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/5" />
        <div className="container-modern relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Hiring Process?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of companies using SkillMatrix to hire smarter and faster
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="default" size="xl" className="bg-white text-gray-900 hover:bg-gray-100">
                  Start Free Trial
                  <FiArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="border-2 border-white text-black hover:bg-white hover:text-blue-600 font-semibold">
                  Explore All Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
