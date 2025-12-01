import {
  FiFileText, FiUsers, FiBarChart2, FiVideo, FiAward, FiShield,
  FiBriefcase, FiCalendar, FiUpload
} from 'react-icons/fi';

/**
 * Centralized services data to avoid duplication
 * Used in ServicesPage (overview) and ServiceDetailPage (details)
 */
export const servicesData = [
  {
    id: 'jd-resume-upload',
    icon: FiFileText,
    title: "JD & Resume Upload",
    shortDescription: "AI-powered job description validation with automated section detection. Bulk resume processing with intelligent parsing and instant match scoring against job requirements.",
    videoUrl: "/assets/videos/services/JD & Resume Upload.mp4",
    videoEmbedUrl: "/assets/videos/services/JD & Resume Upload.mp4",
    features: ['JD Validation Engine', 'Bulk Upload (30+ resumes)', 'AI Parsing - 98% Accuracy', 'Instant Match Scoring'],
    color: 'blue'
  },
  {
    id: 'sending-assessment',
    icon: FiUpload,
    title: "Sending Assessment",
    shortDescription: "Streamlined assessment distribution with automated email workflows. Schedule and send customized tests to multiple candidates with one click and track delivery status in real-time.",
    videoUrl: "/assets/videos/services/Sending Assessment.mp4",
    videoEmbedUrl: "/assets/videos/services/Sending Assessment.mp4",
    features: ['Bulk Email Distribution', 'Custom Test Scheduling', 'Delivery Tracking', 'Automated Reminders'],
    color: 'green'
  },
  {
    id: 'candidate-assessment',
    icon: FiAward,
    title: "Candidate Assessment",
    shortDescription: "Multi-format assessments supporting MCQ, text, voice, and video responses. AI-powered evaluation with comprehensive reports generated within 5 minutes of completion.",
    videoUrl: "/assets/videos/services/Candidate Assessment.mp4",
    videoEmbedUrl: "/assets/videos/services/Candidate Assessment.mp4",
    features: ['MCQ + Voice + Video + text', 'AI Auto-Scoring', '5-Min Reports', 'Proctoring & Security'],
    color: 'purple'
  },
{
  id: 'assessment-reports',
  icon: FiBarChart2,
  title: "Assessment Report Analyzer",
  shortDescription: "Generate detailed AI-powered assessment reports with question-wise analysis, multi-format scoring, and downloadable PDFs for informed hiring decisions.",
  videoUrl: "/assets/videos/services/Assessment Report Analyzer.mp4",
  videoEmbedUrl: "/assets/videos/services/Assessment Report Analyzer.mp4",
  features: [
    "Question-wise Evaluation",
    "MCQ, Text, Voice & Video Scoring",
    "AI-Generated Summary Report",
    "Auto Email Delivery (HR & Candidate)",
    "Downloadable PDF Reports"
  ],
  color: "orange"
},
{
  id: 'interview-scheduling',
  icon: FiCalendar,
  title: "Interview Hub - Scheduling",
  shortDescription: "Schedule interviews seamlessly with Google Calendar, Microsoft Teams, and Zoom. Auto-generate meeting links and send calendar invites directly to candidates and interviewers.",
  videoUrl: "/assets/videos/services/Interview Hub — Scheduling.mp4",
  videoEmbedUrl: "/assets/videos/services/Interview Hub — Scheduling.mp4",
  features: [
    'Google / Teams / Zoom Scheduling',
    'Auto-Generated Meeting Links',
    'Calendar Invite Delivery',
    'Interview Timeline Tracking'
  ],
  color: 'pink'
},

{
  id: 'candidate-upload',
  icon: FiUsers,
  title: "Candidate Upload",
  shortDescription: "Secure document collection and verification workflow where candidates upload PAN, Aadhaar, certificates, and experience letters through a public form.",
  videoUrl: "/assets/videos/services/Candidate Upload.mp4",
  videoEmbedUrl: "/assets/videos/services/Candidate Upload.mp4",
  features: [
    "Candidate Document Upload Portal",
    "PAN / Aadhaar / Certificate Submission",
    "HR Approval & Verification Workflow",
    "Secure Public Form Access"
  ],
  color: 'cyan'
},


 {
  id: 'document-verification',
  icon: FiShield,
  title: "Request Documents Workflow",
  shortDescription: "Collect and verify candidate documents through a secure upload portal. HR can review, approve, or reject PAN, Aadhaar, certificates, and experience letters with a structured verification flow.",
  videoUrl: "/assets/videos/services/Request Documents Workflow.mp4",
  videoEmbedUrl: "/assets/videos/services/Request Documents Workflow.mp4",
  features: [
    "Secure Candidate Document Upload",
    "PAN / Aadhaar / Certificate Submission",
    "HR Review & Approval Workflow",
    "Centralized Document Tracking"
  ],
  color: 'teal'
},
{
  id: 'offer-letter-automation',
  icon: FiAward,
  title: "Offer Letter Automation",
  shortDescription: "Generate offer letters instantly using branded templates with auto-filled candidate details. Edit, review, export as PDF, and send directly to candidates in one seamless workflow.",
  videoUrl: "/assets/videos/services/Offer Letter Automation.mp4",
  videoEmbedUrl: "/assets/videos/services/Offer Letter Automation.mp4",
  features: [
    "Branded Template Support",
    "Auto-Filled Candidate Details",
    "Editable Offer Preview",
    "Instant PDF Generation & Delivery"
  ],
  color: 'indigo'
},

{
  id: 'job-posting-portal',
  icon: FiBriefcase,
  title: "Job Marketing & Posting Portal",
  shortDescription: "Create and publish job postings with a unique public URL that candidates can access to apply directly. Share jobs across platforms and receive all applications instantly in your HR dashboard.",
  videoUrl: "/assets/videos/services/Job Marketing & Posting Portal.mp4",
  videoEmbedUrl: "/assets/videos/services/Job Marketing & Posting Portal.mp4",
  features: [
    "Public Job Posting URL",
    "Share Across LinkedIn / Naukri / Platforms",
    "Candidate Apply Form",
    "Instant Resume Collection"
  ],
  color: 'rose'
},

  {
  id: 'applicant-intake',
  icon: FiUsers,
  title: "Applicant Intake Dashboard",
  shortDescription: "View and manage all applications submitted through public job postings. Access candidate details, download resumes, and move applicants directly into your ATS workflow.",
  videoUrl: "/assets/videos/services/Applicant Intake Dashboard.mp4",
  videoEmbedUrl: "/assets/videos/services/Applicant Intake Dashboard.mp4",
  features: [
    "View Public Job Applications",
    "Candidate Detail Access",
    "Resume Downloading",
    "Move to ATS Matching"
  ],
  color: 'amber'
},

];

// Helper function to get service by ID
export const getServiceById = (id) => {
  return servicesData.find(service => service.id === id);
};

// Helper function to get all service IDs
export const getAllServiceIds = () => {
  return servicesData.map(service => service.id);
};
