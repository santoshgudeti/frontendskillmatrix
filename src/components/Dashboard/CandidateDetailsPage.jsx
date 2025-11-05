import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faFileAlt, 
  faChartBar, 
  faCalendarAlt, 
  faDownload, 
  faEye,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faMicrophone,
  faVideo,
  faGraduationCap,
  faBuilding,
  faIdBadge,
  faBriefcase,
  faStar,
  faHandshake,
  faUserTimes,
  faEdit,
  faComments,
  faThumbsUp,
  faThumbsDown,
  faExclamationTriangle,
  faVideo as faVideoIcon,
  faFileContract,
  faEnvelopeOpen,
  faExternalLinkAlt,
  faChevronDown,
  faChevronUp,
  faFileUpload,
  faSync,
  faFile,
  faPaperclip,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand, faMicrosoft as faMicrosoftBrand} from '@fortawesome/free-brands-svg-icons';
import { debouncedToast, documentToast, useEffectToast } from '../../utils/toastUtils';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../axiosUtils';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../ui/Dialog';
import AdvancedOfferEditor from './AdvancedOfferEditor';
import DocumentCollectionForm from './DocumentCollection/DocumentCollectionForm';

const CandidateDetailsPage = () => {
  const { candidateId, assessmentSessionId } = useParams();
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSchedulingDropdown, setShowSchedulingDropdown] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState('not-scheduled'); // not-scheduled, scheduled, completed
  const [interviewFeedback, setInterviewFeedback] = useState({
    rating: 0,
    feedback: '',
    strengths: '',
    areasForImprovement: '',
    recommendation: 'pending' // pending, proceed, reject
  });
  const [showDocumentCollectionModal, setShowDocumentCollectionModal] = useState(false);
  // 🔥 ENHANCED STATE MANAGEMENT: Centralized document status with better initialization
  const [documentCollectionState, setDocumentCollectionState] = useState({
    status: 'unknown', // unknown, requested, uploaded, verified, rejected
    collection: null,
    collectionId: null,
    lastUpdate: null,
    isLoading: false,
    error: null
  });
  
  // Derived state for backward compatibility
  const documentCollectionStatus = documentCollectionState.status;
  const documentCollection = documentCollectionState.collection;
  const documentCollectionId = documentCollectionState.collectionId;
  
  // Legacy setters for backward compatibility
  const setDocumentCollectionStatus = (status) => {
    setDocumentCollectionState(prev => ({
      ...prev,
      status: typeof status === 'function' ? status(prev.status) : status,
      lastUpdate: Date.now()
    }));
  };
  
  const setDocumentCollection = (collection) => {
    setDocumentCollectionState(prev => ({
      ...prev,
      collection: typeof collection === 'function' ? collection(prev.collection) : collection,
      lastUpdate: Date.now()
    }));
  };
  
  const setDocumentCollectionId = (id) => {
    setDocumentCollectionState(prev => ({
      ...prev,
      collectionId: typeof id === 'function' ? id(prev.collectionId) : id,
      lastUpdate: Date.now()
    }));
  };
  
  // 🔥 CENTRALIZED DOCUMENT STATUS UPDATER: Single source of truth for all document status changes
  const updateDocumentCollectionState = useCallback((updates, source = 'unknown') => {
    console.log('📊 [STATE UPDATE] Centralized document status update:', {
      updates,
      source,
      timestamp: new Date().toISOString(),
      currentState: documentCollectionState
    });
    
    setDocumentCollectionState(prev => {
      const newState = {
        ...prev,
        ...updates,
        lastUpdate: Date.now(),
        error: null // Clear any previous errors
      };
      
      // Validate status transitions
      const validStatuses = ['unknown', 'requested', 'uploaded', 'verified', 'rejected'];
      if (updates.status && !validStatuses.includes(updates.status)) {
        console.warn('⚠️ [STATE UPDATE] Invalid status transition:', updates.status);
        return prev; // Don't update with invalid status
      }
      
      console.log('✅ [STATE UPDATE] State updated successfully:', {
        previous: prev,
        new: newState,
        source,
        buttonShouldBeEnabled: newState.status === 'verified'
      });
      
      // Trigger button state re-evaluation
      setLastRefresh(Date.now());
      
      // Show appropriate notifications with deduplication
      if (updates.status === 'verified' && prev.status !== 'verified' && newState.collectionId) {
        documentToast.verified(newState.collectionId, candidateData?.name || displayName);
      } else if (updates.status === 'rejected' && prev.status !== 'rejected' && newState.collectionId) {
        documentToast.rejected(newState.collectionId, newState.rejectionReason || '');
      }
      
      return newState;
    });
  }, [documentCollectionState]);
  const [showRejectDocumentsModal, setShowRejectDocumentsModal] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [rejectionReason, setRejectionReason] = useState('');

  const [interviewEnsured, setInterviewEnsured] = useState(false); // 🔥 FIX: Track if interview was already ensured

  // Compute a human-friendly display name (avoid showing email as name)
  const computeDisplayName = (name, email) => {
    // If we have a proper name (not an email), use it
    if (name && typeof name === 'string' && name.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(name)) {
      return name.trim();
    }
    // If we have an email, try to create a readable name from it
    if (email && typeof email === 'string') {
      const raw = email.split('@')[0].replace(/[._-]+/g, ' ');
      const pretty = raw
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
        .trim();
      return pretty || 'Candidate';
    }
    // Fallback
    return 'Candidate';
  };
  
  // Use either the displayName function or the name from candidateData
  const displayName = candidateData?.name && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(candidateData.name) 
    ? candidateData.name 
    : computeDisplayName(candidateData?.name, candidateData?.email);

  // Ensure an Interview exists server-side before opening feedback modal
  const ensureInterviewForSession = async () => {
    // 🔥 FIX: Prevent duplicate calls
    if (interviewEnsured) {
      console.log('⚠️ Interview already ensured, skipping duplicate call');
      return { success: true, existed: true };
    }
    
    try {
      console.log('[Interview] Ensuring interview exists for session:', {
        assessmentSessionId,
        candidateId
      });
      
      const response = await axiosInstance.post('/api/interviews/ensure-by-session', {
        assessmentSessionId,
        candidateId,
      });
      
      console.log('[Interview] Ensure interview response:', response.data);
      setInterviewEnsured(true); // 🔥 FIX: Mark as ensured
      return response.data;
      
    } catch (error) {
      console.error('Failed to ensure interview:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = 'Unable to prepare interview record for feedback.';
      
      if (error.response?.status === 404) {
        errorMessage = 'Assessment session not found. Please verify the candidate data.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid interview data. Please check candidate and session details.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      debouncedToast.error(`❌ ${errorMessage}`, 'interview-ensure-error');
      throw error;
    }
  };

  // Check existing interview status
  const checkInterviewStatus = async () => {
    // 🔥 FIX: Prevent multiple calls if already ensured
    if (interviewEnsured) {
      console.log('⚠️ Interview already ensured, skipping status check');
      return;
    }
    
    try {
      // Try to ensure interview exists and get its status
      const response = await axiosInstance.post('/api/interviews/ensure-by-session', {
        assessmentSessionId,
        candidateId,
      });
      
      const interview = response.data.data;
      
      if (interview && interview.status) {
        console.log('🗓️ Found existing interview with status:', interview.status);
        
        // 🔥 FIX: Only update status if it's a meaningful status
        if (interview.status !== 'not-scheduled') {
          setInterviewStatus(interview.status);
        } else {
          // Keep default 'not-scheduled' for proper workflow
          setInterviewStatus('not-scheduled');
        }
        
        // If interview has feedback, update the feedback state
        if (interview.feedback) {
          setInterviewFeedback(prev => ({
            ...prev,
            rating: interview.rating || 0,
            feedback: interview.feedback || '',
            strengths: interview.structuredFeedback?.strengths || '',
            areasForImprovement: interview.structuredFeedback?.areasForImprovement || '',
            recommendation: interview.structuredFeedback?.recommendation || 'pending',
            feedbackSubmitted: !!interview.feedback
          }));
        }
        
        console.log('🔄 Interview status set to:', interview.status);
        
        // 🔥 FIX: Mark as ensured to prevent future duplicate calls
        setInterviewEnsured(true);
      } else {
        console.log('⚠️ Interview exists but no specific status, keeping default not-scheduled');
        setInterviewStatus('not-scheduled');
      }
    } catch (error) {
      console.log('🚨 Error checking interview status (normal if no interview exists):', error.response?.status);
      // If no interview exists or error occurs, keep default 'not-scheduled' status
      setInterviewStatus('not-scheduled');
    }
  };

  // Compose placeholders into the current draft HTML
  const composeOfferHtml = (baseHtml) => {
    let html = baseHtml || offerHtml || '';
    const candidateFullBlock = [
      displayName,
      candidateData?.employeeId ? `Employee Id: ${candidateData.employeeId}` : '',
      candidateData?.address ? `Address: ${candidateData.address}` : '',
    ]
      .filter(Boolean)
      .join('<br/>');

    const interviewDate = assessmentData?.createdAt
      ? new Date(assessmentData.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString();

    const benefitsList = (offerData.benefits || '')
      .split('\n')
      .filter(Boolean)
      .map((b) => `<li>${b}</li>`) 
      .join('');

    // Simple INR words fallback
    const numToWordsIndian = (numStr) => {
      const n = Number(String(numStr).replace(/[^0-9.]/g, '')) || 0;
      if (!n) return 'Zero Rupees';
      try {
        const intl = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
        return `${intl.format(n)} Rupees`;
      } catch { return `${n} Rupees`; }
    };

    // Sample salary split if HR didn't provide granular inputs
    // Use structured editor rows when present; otherwise estimate
    const gross = Number(String(offerData.salary || '').replace(/[^0-9.]/g, '')) || 0;
    const monthly = Math.round(gross / 12);
    const ePairs = (earnings && earnings.length && earnings.some(r=>r.amount))
      ? earnings.map(r => [r.name || '', Number(String(r.amount).replace(/[^0-9.]/g, '')) || 0])
      : [
          ['Basic Wage', Math.round(monthly * 0.5)],
          ['HRA', Math.round(monthly * 0.2)],
          ['Conveyance Allowance', 1600],
          ['Medical Allowances', 1250],
          ['Other Allowances', Math.max(0, monthly - Math.round(monthly * 0.5) - Math.round(monthly * 0.2) - 1600 - 1250)],
        ];
    const dPairs = (deductions && deductions.length && deductions.some(r=>r.amount))
      ? deductions.map(r => [r.name || '', Number(String(r.amount).replace(/[^0-9.]/g, '')) || 0])
      : [
          ['PF', Math.round(monthly * 0.06)],
          ['ESI/Health Insurance', 150],
          ['Professional Tax', 200],
          ['Loan Recovery', 0],
          ['EPF', Math.round(monthly * 0.06)],
        ];
    const totalEarnings = ePairs.reduce((s, [, v]) => s + v, 0);
    const totalDeductions = dPairs.reduce((s, [, v]) => s + v, 0);
    const netSalary = totalEarnings - totalDeductions;
    const earningsRows = ePairs.map(([k, v]) => `<tr><td>${k}</td><td>₹${v.toLocaleString('en-IN')}</td></tr>`).join('');
    const deductionsRows = dPairs.map(([k, v]) => `<tr><td>${k}</td><td>₹${v.toLocaleString('en-IN')}</td></tr>`).join('');

    // Terms list for templates that use {{termsBlock}}
    const termsList = [
      "You will not publish or make public any material related to the company's products or projects without written permission.",
      'Maintain utmost secrecy of project documents, commercial offers, design docs, estimates, and intellectual property.',
      'Comply with all rules and regulations issued by the company.',
      'Do not disclose confidential information during or after employment.',
      'Your current place of posting is as per HR communication; disciplinary actions may be taken for violations.',
      'Employee agrees to a bond of not leaving the company for a minimum period of one year from the date of joining.',
      'Non-compete: You agree not to compete with the company during employment and for one year following termination.',
      'Do not accept any present, commission, or gratification from clients or vendors.',
    ];
    const termsBlock = `<ol style="margin:8px 0 0 18px;">${termsList.map(t=>`<li style='margin-bottom:6px; line-height:1.5;'>${t}</li>`).join('')}</ol>`;

    // Salary matrix for 4-column layout templates
    const maxRows = Math.max(ePairs.length, dPairs.length);
    const rows = [];
    for (let i = 0; i < maxRows; i++) {
      const e = ePairs[i] || ['', 0];
      const d = dPairs[i] || ['', 0];
      rows.push(`<tr><td>${e[0]}</td><td>₹${(e[1]||0).toLocaleString('en-IN')}</td><td>${d[0]}</td><td>₹${(d[1]||0).toLocaleString('en-IN')}</td></tr>`);
    }
    rows.push(`<tr><td><strong>Total Earnings</strong></td><td><strong>₹${totalEarnings.toLocaleString('en-IN')}</strong></td><td><strong>Total Deductions</strong></td><td><strong>₹${totalDeductions.toLocaleString('en-IN')}</strong></td></tr>`);
    const salaryMatrix = rows.join('');

    html = html
      .replaceAll('{{candidateFullBlock}}', candidateFullBlock)
      .replaceAll('{{interviewDate}}', interviewDate)
      .replaceAll('{{startDate}}', offerData.startDate ? new Date(offerData.startDate).toLocaleDateString() : 'To be determined')
      .replaceAll('{{salary}}', offerData.salary || 'To be discussed')
      .replaceAll('{{benefitsList}}', benefitsList || '<li>As per company policy</li>')
      .replaceAll('{{notes}}', offerData.notes || '')
      .replaceAll('{{earningsRows}}', earningsRows)
      .replaceAll('{{deductionsRows}}', deductionsRows)
      .replaceAll('{{totalEarnings}}', `₹${totalEarnings.toLocaleString('en-IN')}`)
      .replaceAll('{{totalDeductions}}', `₹${totalDeductions.toLocaleString('en-IN')}`)
      .replaceAll('{{netSalary}}', `₹${netSalary.toLocaleString('en-IN')}`)
      .replaceAll('{{annualTakeHome}}', `₹${(netSalary * 12).toLocaleString('en-IN')}`)
      .replaceAll('{{salaryInWords}}', numToWordsIndian(offerData.salary))
      .replaceAll('{{termsBlock}}', termsBlock)
      .replaceAll('{{salaryMatrix}}', salaryMatrix);

    return html;
  };
  const [offerData, setOfferData] = useState({
    position: '',
    salary: '',
    startDate: '',
    benefits: '',
    notes: ''
  });
  const [offerHtml, setOfferHtml] = useState('');
  const [offerPreviewTab, setOfferPreviewTab] = useState('form'); // form | preview
  const [offerTemplate, setOfferTemplate] = useState('branded'); // branded | appointment | simple
  const [splitPreview, setSplitPreview] = useState(false); // live split preview beside editor
  const [inlinePreviewEdit, setInlinePreviewEdit] = useState(false); // enable editing inside preview A4
  const [earnings, setEarnings] = useState([
    { name: 'Basic Wage', amount: '' },
    { name: 'HRA', amount: '' },
    { name: 'Conveyance Allowance', amount: '' },
  ]);
  const [deductions, setDeductions] = useState([
    { name: 'PF', amount: '' },
    { name: 'ESI/Health Insurance', amount: '' },
    { name: 'Professional Tax', amount: '' },
  ]);
  const [rejectionData, setRejectionData] = useState({
    reason: '',
    customReason: '',
    feedback: ''
  });
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  // Build a professional HTML from current offerData and candidate/assessment context
  const buildOfferHtml = () => {
    const companyName = 'Your Company';
    const jobTitle = offerData.position || assessmentData?.jobTitle || 'Position';
    const candidateName = displayName;
    const startDate = offerData.startDate ? new Date(offerData.startDate).toLocaleDateString() : 'To be determined';
    const today = new Date().toLocaleDateString();
    const benefitsList = (offerData.benefits || '').split('\n').filter(Boolean).map(b => `<li>${b}</li>`).join('');

    return `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 780px; margin: 0 auto; color: #111827;">
        <div style="display:flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
          <div>
            <h1 style="margin:0; font-size: 22px; color:#111827;">Offer of Employment</h1>
            <p style="margin:4px 0; font-size: 12px; color:#6b7280;">${today}</p>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:600;">${companyName}</div>
            <div style="font-size:12px; color:#6b7280;">Human Resources</div>
          </div>
        </div>

        <p style="margin-top: 24px;">Dear <strong>${candidateName}</strong>,</p>
        <p>
          We are pleased to extend to you an offer of employment for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
          Following your assessment and interview, we believe your skills and experience will be a great addition to our team.
        </p>

        <h3 style="margin-top: 20px; font-size: 16px;">Position Details</h3>
        <ul style="margin: 8px 0 0 18px;">
          <li><strong>Position:</strong> ${jobTitle}</li>
          <li><strong>Start Date:</strong> ${startDate}</li>
          <li><strong>Salary:</strong> ${offerData.salary || 'To be discussed'}</li>
        </ul>

        ${benefitsList ? `
          <h3 style="margin-top: 16px; font-size: 16px;">Benefits</h3>
          <ul style="margin: 8px 0 0 18px;">${benefitsList}</ul>
        ` : ''}

        ${offerData.notes ? `
          <h3 style="margin-top: 16px; font-size: 16px;">Additional Terms</h3>
          <p>${offerData.notes}</p>
        ` : ''}

        <p style="margin-top: 16px;">
          Please confirm your acceptance of this offer by replying to this email. We look forward to welcoming you to the team.
        </p>

        <div style="margin-top: 28px;">
          <div>Best regards,</div>
          <div style="margin-top: 12px;">HR Team</div>
          <div>${companyName}</div>
        </div>
      </div>
    `;
  };

  // TipTap editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: offerHtml,
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[160px] w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      // When editing in Form, keep offerHtml in sync.
      // When editing inline in Preview, do not override preview edits.
      if (!inlinePreviewEdit) {
        setOfferHtml(editor.getHTML());
      }
    },
  });

  // Reusable loader for draft
  const loadDraft = async () => {
    try {
      if (!showOfferModal) return;
      setOfferPreviewTab('form');
      const draftRes = await axiosInstance.post('/api/offers/draft', {
        candidateId,
        assessmentSessionId,
        template: offerTemplate,
      });
      let draft = draftRes?.data?.draftHtml || buildOfferHtml();
      draft = composeOfferHtml(draft);
      setOfferHtml(draft);
      setTimeout(() => editor?.commands.setContent(draft), 0);
    } catch (e) {
      console.error('Failed to load offer draft:', e);
      const fallback = buildOfferHtml();
      setOfferHtml(fallback);
      setTimeout(() => editor?.commands.setContent(fallback), 0);
    }
  };

  // Load draft on modal open
  useEffect(() => { loadDraft(); /* eslint-disable-next-line */ }, [showOfferModal]);
  // Refresh draft when template changes while modal is open
  useEffect(() => { if (showOfferModal) loadDraft(); /* eslint-disable-next-line */ }, [offerTemplate]);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  useEffect(() => {
    fetchCandidateDetails();
  }, [candidateId, assessmentSessionId]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching candidate details for:', {
        candidateId: candidateId,
        assessmentSessionId: assessmentSessionId
      });
      
      const response = await axiosInstance.get(`/api/candidates/${candidateId}/details`, {
        params: { assessmentSessionId }
      });
      
      console.log('API Response:', response.data);
      
      setCandidateData(response.data.candidate);
      setAssessmentData(response.data.assessment);
      
      // Check for existing document collection
      checkDocumentCollectionStatus();
      
      // Check for existing interview status
      checkInterviewStatus();
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      console.error('Error details:', error.response?.data);
      debouncedToast.error('Failed to fetch candidate details', 'candidate-fetch');
    } finally {
      setLoading(false);
    }
  };



  // 🔥 ENHANCED: Create controlled toast for status changes
  const statusChangeToast = useEffectToast.createControlled('CandidateDetailsPage', 'statusChange');
  
  // 🔥 FIX: Add specific useEffect to monitor documentCollectionStatus changes with deduplication
  useEffect(() => {
    if (documentCollectionStatus) {
      console.log('📝 Document Collection Status Changed:', {
        newStatus: documentCollectionStatus,
        timestamp: new Date().toISOString(),
        shouldEnableButton: documentCollectionStatus === 'verified',
        documentCollectionId
      });
      
      // Force component re-render by updating lastRefresh
      setLastRefresh(Date.now());
      
      // Show status change notification with deduplication
      if (documentCollectionStatus === 'verified' && documentCollectionId) {
        documentToast.verified(documentCollectionId, displayName);
      }
    }
  }, [documentCollectionStatus, documentCollectionId]); // 🔥 FIX: Add documentCollectionId to dependencies

  // Add useEffect to check document collection status periodically and on focus
  useEffect(() => {
    let intervalId;
    
    if (documentCollectionId) {
      // 🔥 FIX: Check document collection status every 3 seconds (more frequent for real-time updates)
      intervalId = setInterval(() => {
        console.log('🔄 Periodic refresh triggered for document collection:', documentCollectionId);
        refreshDocumentCollectionStatus();
      }, 3000); // Reduced from 10 seconds to 3 seconds for faster updates
    }
    
    // Also refresh when window gains focus
    const handleFocus = () => {
      if (documentCollectionId) {
        console.log('🔄 Window focus refresh triggered');
        refreshDocumentCollectionStatus();
      }
    };
    
    // 🔥 FIX: Also refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && documentCollectionId) {
        console.log('🔄 Tab visibility refresh triggered');
        setTimeout(() => refreshDocumentCollectionStatus(), 300);
      }
    };
    
    // Listen for document verification events from other components
    const handleDocumentVerified = (event) => {
      const { documentCollectionId: verifiedId, status, data, timestamp } = event.detail;
      
      console.log('🔔 [EVENT DEBUG] Received document verification event:', {
        verifiedId,
        currentId: documentCollectionId,
        status,
        timestamp,
        eventData: data
      });
      
      // 🔥 ENHANCED: Update states if this is our document collection using centralized updater
      if (verifiedId === documentCollectionId) {
        console.log('✅ [EVENT DEBUG] Event matches current document collection, updating status');
        
        updateDocumentCollectionState({
          status: status,
          collection: data || documentCollection,
          collectionId: verifiedId
        }, 'verification-event');
        
        console.log('✅ [EVENT DEBUG] States updated from verification event:', status);
        
        // Additional backup refresh after a delay
        setTimeout(() => {
          console.log('🔄 [EVENT DEBUG] Performing delayed backup refresh after event...');
          refreshDocumentCollectionStatus();
        }, 1000);
      } else {
        console.log('⚠️ [EVENT DEBUG] Event for different document collection, ignoring:', {
          eventId: verifiedId,
          currentId: documentCollectionId
        });
      }
    };
    
    window.addEventListener('documentVerified', handleDocumentVerified);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    
    console.log('📡 [EVENT DEBUG] Event listeners attached for document collection:', {
      documentCollectionId,
      listenersAttached: ['documentVerified', 'focus', 'visibilitychange']
    });

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      console.log('📡 [EVENT DEBUG] Cleaning up event listeners for:', documentCollectionId);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('documentVerified', handleDocumentVerified);
    };
  }, [documentCollectionId]); // 🔥 FIX: Remove documentCollectionStatus from dependencies to avoid stale closure

  const refreshDocumentCollectionStatus = async () => {
    if (documentCollectionId) {
      try {
        console.log('🔄 [REFRESH DEBUG] Starting document status refresh:', {
          documentCollectionId,
          currentStatus: documentCollectionStatus,
          timestamp: new Date().toISOString()
        });
        
        // Set loading state
        updateDocumentCollectionState({ isLoading: true }, 'refresh-start');
        
        const response = await axiosInstance.get(`/api/document-collection/${documentCollectionId}`);
        const collectionData = response.data.data;
        
        console.log('📊 [REFRESH DEBUG] API Response received:', {
          id: collectionData._id,
          status: collectionData.status,
          previousStatus: documentCollectionStatus,
          documentsCount: collectionData.documents?.length || 0,
          verifiedAt: collectionData.verifiedAt,
          verifiedBy: collectionData.verifiedBy
        });
        
        // 🔥 ENHANCED: Use centralized state updater for atomic updates
        updateDocumentCollectionState({
          status: collectionData.status,
          collection: collectionData,
          collectionId: collectionData._id,
          isLoading: false
        }, 'api-refresh');
        
        console.log('✅ [REFRESH DEBUG] Document collection status updated successfully:', {
          newStatus: collectionData.status,
          timestamp: new Date().toISOString(),
          selectButtonShouldBeEnabled: collectionData.status === 'verified'
        });
        
        // 🔥 FIX: Force candidate data refresh to trigger button re-evaluation
        setCandidateData(prev => ({
          ...prev,
          _documentStatusUpdate: Date.now(), // Force re-evaluation of button state
          _lastDocumentStatus: collectionData.status
        }));
        
        console.log('🔄 [REFRESH DEBUG] All states updated. Component should re-render now.');
        
      } catch (error) {
        console.error('❌ [REFRESH DEBUG] Error refreshing document collection status:', error);
        
        // Update error state
        updateDocumentCollectionState({
          isLoading: false,
          error: error.message
        }, 'api-error');
        
        // Try to refresh from the main list as fallback
        console.log('🔁 [REFRESH DEBUG] Attempting fallback refresh...');
        checkDocumentCollectionStatus();
      }
    } else {
      console.log('⚠️ [REFRESH DEBUG] No document collection ID available for refresh');
    }
  };

  const checkDocumentCollectionStatus = async () => {
    try {
      console.log('🔍 [CHECK DEBUG] Checking document collection status for candidate:', {
        candidateId,
        assessmentSessionId,
        timestamp: new Date().toISOString()
      });
      
      // Try to find existing document collection for this candidate
      const response = await axiosInstance.get('/api/document-collection');
      const collections = response.data.data;
      
      console.log('📋 [CHECK DEBUG] All document collections:', {
        totalCollections: collections.length,
        targetCandidate: candidateId,
        targetAssessment: assessmentSessionId
      });
      
      // Find collection for this candidate and assessment - 🔥 FIX: Handle populated candidateId objects
      const collection = collections.find(col => {
        // Handle both populated objects and direct IDs
        const colCandidateId = col.candidateId?._id || col.candidateId;
        const colAssessmentId = col.assessmentSessionId?._id || col.assessmentSessionId;
        
        const candidateMatch = colCandidateId?.toString() === candidateId?.toString();
        const assessmentMatch = colAssessmentId?.toString() === assessmentSessionId?.toString();
        
        console.log('🔍 [CHECK DEBUG] Collection matching:', {
          collectionId: col._id,
          colCandidateId: colCandidateId?.toString(),
          targetCandidateId: candidateId,
          candidateMatch,
          colAssessmentId: colAssessmentId?.toString(),  
          targetAssessmentId: assessmentSessionId,
          assessmentMatch,
          overallMatch: candidateMatch && assessmentMatch
        });
        
        return candidateMatch && assessmentMatch;
      });
      
      if (collection) {
        console.log('✅ [CHECK DEBUG] Found document collection:', {
          id: collection._id,
          status: collection.status,
          documentsCount: collection.documents?.length || 0,
          candidateName: collection.candidateName
        });
        
        // 🔥 FIX: Use centralized state updater instead of individual setters
        updateDocumentCollectionState({
          status: collection.status,
          collection: collection,
          collectionId: collection._id
        }, 'initial-check');
        
        console.log('✅ [CHECK DEBUG] Document collection state updated successfully');
        
        // Show info message for uploaded but not verified documents with deduplication
        if (collection.status === 'uploaded') {
          documentToast.uploaded(collection._id, collection.candidateName || displayName);
        } else if (collection.status === 'verified') {
          documentToast.verified(collection._id, collection.candidateName || displayName);
        }
      } else {
        console.log('⚠️ [CHECK DEBUG] No document collection found for this candidate');
        
        // Reset to unknown state
        updateDocumentCollectionState({
          status: 'unknown',
          collection: null,
          collectionId: null
        }, 'no-collection-found');
      }
    } catch (error) {
      console.error('❌ [CHECK DEBUG] Error checking document collection status:', error);
      
      // Set error state
      updateDocumentCollectionState({
        status: 'unknown',
        collection: null,
        collectionId: null,
        error: error.message
      }, 'check-error');
    }
  };

  const handleExternalScheduling = async (platform) => {
    const candidateEmail = candidateData?.email || '';
    const candidateName = displayName;
    const jobTitle = assessmentData?.jobTitle || 'Position';
    const hrEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '';

    const eventTitle = `Interview - ${jobTitle}`;
    const eventDescription = `Interview with ${candidateName} for ${jobTitle} position`;
    
    let calendarUrl = '';
    
    switch (platform) {
      case 'google-meet':
        calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&add=${encodeURIComponent(candidateEmail)}&add=${encodeURIComponent(hrEmail)}`;
        break;
      case 'microsoft-teams':
        calendarUrl = `https://outlook.office.com/calendar/0/deeplink/compose?to=${encodeURIComponent(candidateEmail)}&subject=${encodeURIComponent(eventTitle)}&body=${encodeURIComponent(eventDescription)}`;
        break;
      case 'zoom':
        calendarUrl = `https://zoom.us/schedule?email=${encodeURIComponent(candidateEmail)}&topic=${encodeURIComponent(eventTitle)}`;
        break;
      default:
        calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&add=${encodeURIComponent(candidateEmail)}`;
    }

    // Ensure interview exists and mark as scheduled
    try {
      console.log('📅 External scheduling initiated:', {
        platform,
        candidateEmail,
        candidateName,
        jobTitle
      });
      
      await ensureInterviewForSession();
      
      // 🔥 FIX: Update interview status to 'scheduled' in backend
      try {
        await axiosInstance.put('/api/interviews/update-status', {
          assessmentSessionId,
          candidateId,
          status: 'scheduled',
          platform: platform === 'google-meet' ? 'Google Calendar' : platform === 'microsoft-teams' ? 'Microsoft Teams' : 'Zoom'
        });
        
        console.log('✅ Interview status updated to scheduled in backend');
      } catch (statusError) {
        console.error('❌ Failed to update interview status in backend:', statusError);
        // Continue with local state update as fallback
      }
      
      // Update local state
      setInterviewStatus('scheduled');
      
      console.log('✅ Interview status updated to scheduled locally');
    } catch (e) {
      console.error('❌ Error ensuring interview for session:', e);
      // Continue to open calendar anyway
    }
    
    setShowSchedulingDropdown(false);
    
    // Open external calendar platform
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
    
    debouncedToast.success(`📅 Opening ${platform === 'google-meet' ? 'Google Calendar' : platform === 'microsoft-teams' ? 'Microsoft Teams' : 'Zoom'} for scheduling. Status marked as Scheduled.`, 
      `schedule-${platform}`);
  };

  const handleInterviewCompleted = async () => {
    try {
      console.log('[Interview] Marking interview as completed:', {
        candidateId,
        assessmentSessionId,
        currentStatus: interviewStatus
      });
      
      await ensureInterviewForSession();
      setInterviewStatus('completed');
      
      debouncedToast.success('✅ Interview marked as completed. Please add feedback.', 
        'interview-completed', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      
      // Automatically open feedback modal after marking complete
      setTimeout(() => {
        setShowFeedbackModal(true);
      }, 1500);
      
    } catch (error) {
      console.error('Error marking interview as completed:', error);
      debouncedToast.error('❌ Failed to mark interview as completed. Please try again.', 'interview-complete-error');
      
      // Provide more specific error feedback
      if (error.response?.status === 404) {
        debouncedToast.error('⚠️ Interview session not found. Please ensure the interview was properly scheduled.', 'interview-not-found');
      } else if (error.response?.status === 400) {
        debouncedToast.error('⚠️ Invalid interview data. Please check the candidate and assessment details.', 'interview-invalid');
      }
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await axiosInstance.post('/api/interviews/feedback', {
        candidateId,
        assessmentSessionId,
        ...interviewFeedback
      });
      
      debouncedToast.success('Interview feedback submitted successfully!', 'feedback-submit');
      setShowFeedbackModal(false);
      
      // Enable decision making after feedback is submitted
      setInterviewFeedback(prev => ({ ...prev, feedbackSubmitted: true }));
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      debouncedToast.error('Failed to submit feedback', 'feedback-error');
    }
  };

  const handleSelectCandidate = async (offerPayload) => {
    console.log('[Submit] Select Candidate', { candidateId, assessmentSessionId, offerPayload });
    
    // Check if feedback is required and not submitted
    if (interviewStatus === 'completed' && !interviewFeedback.feedbackSubmitted) {
      debouncedToast.warning('Please submit interview feedback before making a decision.', 'feedback-required');
      setShowFeedbackModal(true);
      return;
    }

    // Check if documents have been collected and verified
    if (documentCollectionStatus !== 'verified') {
      debouncedToast.warning('Please collect and verify required documents before sending the offer letter.', 'docs-required');
      // Show the document collection modal
      handleRequestDocuments();
      return;
    }

    // Validate required offer fields
    if (!offerPayload.position || !offerPayload.salary || !offerPayload.startDate) {
      debouncedToast.error('Please fill Position, Salary, and Start Date before sending the offer.', 'offer-fields-required');
      return;
    }
    
    if (!offerPayload.offerContent || offerPayload.offerContent.trim().length < 30) {
      debouncedToast.error('Offer content is empty. Please review and update the letter.', 'offer-content-empty');
      return;
    }

    try {
      setIsSubmittingOffer(true);
      const response = await axiosInstance.post('/api/candidates/select', {
        candidateId,
        assessmentSessionId,
        offerData: offerPayload,
        offerHtml: offerPayload.offerContent, // HTML content for PDF generation
        interviewFeedback: interviewFeedback.feedbackSubmitted ? interviewFeedback : null,
        documentCollectionId
      });
      console.log('[API] /api/candidates/select response', response?.data);
      
      debouncedToast.success('Professional offer letter sent to candidate with PDF attachment!', 'offer-sent');
      debouncedToast.success('HR copy sent successfully!', 'hr-copy-sent');
      setShowOfferModal(false);
      navigate('/dashboard/candidates');
      
    } catch (error) {
      console.error('Error selecting candidate:', error);
      debouncedToast.error('Failed to send offer letter', 'offer-send-error');
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const handleRejectCandidate = async () => {
    console.log('[Submit] Reject Candidate', { candidateId, assessmentSessionId, rejectionData });
    
    // Validate rejection data
    if (!rejectionData.reason) {
      toast.error('Please select a reason for rejection.');
      return;
    }
    
    if (rejectionData.reason === 'custom' && !rejectionData.customReason.trim()) {
      toast.error('Please provide a custom reason for rejection.');
      return;
    }
    
    // Check if feedback is required and not submitted
    if (interviewStatus === 'completed' && !interviewFeedback.feedbackSubmitted) {
      toast.warning('Please submit interview feedback before making a decision.');
      setShowFeedbackModal(true);
      return;
    }

    try {
      setIsSubmittingReject(true);
      const response = await axiosInstance.post('/api/candidates/reject', {
        candidateId,
        assessmentSessionId,
        rejectionData,
        interviewFeedback: interviewFeedback.feedbackSubmitted ? interviewFeedback : null
      });
      console.log('[API] /api/candidates/reject response', response?.data);
      
      debouncedToast.success('Candidate rejected successfully!', 'candidate-rejected');
      debouncedToast.success(`Professional rejection email sent to ${candidateData.email}`, 'rejection-email-sent');
      setShowRejectModal(false);
      navigate('/dashboard/candidates');
      
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      debouncedToast.error('Failed to reject candidate', 'reject-candidate-error');
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const viewDocument = async (documentCollectionId, documentIndex) => {
    try {
      // Use view=true parameter for inline viewing with signed URLs
      const response = await axiosInstance.get(`/api/document-collection/${documentCollectionId}/documents/${documentIndex}?view=true`);
      
      if (response.data.success && response.data.url) {
        console.log('Opening document for viewing:', {
          url: response.data.url,
          filename: response.data.filename,
          mode: response.data.mode
        });
        
        // Open in new tab for inline viewing
        window.open(response.data.url, '_blank');
        
        // Show success notification
        debouncedToast.success(`📄 Opening ${response.data.filename} for viewing`, 'doc-view-success');
      } else {
        debouncedToast.error('❌ Failed to generate viewing link for document', 'doc-view-link-error');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      debouncedToast.error('❌ Failed to view document', 'doc-view-error');
    }
  };

  const downloadDocument = async (type, documentId, filename) => {
    try {
      const endpoint = type === 'resume' 
        ? `/api/resumes/${documentId}` 
        : `/api/job-descriptions/${documentId}`;
      
      const response = await axiosInstance.get(endpoint, {
        params: { download: true }
      });
      
      if (response.data.url) {
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = filename || `${type}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(`Failed to download ${type}`);
      }
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
      toast.error(`Failed to download ${type}`);
    }
  };

  const handleRequestDocuments = () => {
    setShowDocumentCollectionModal(true);
  };

  const handleDocumentsUploaded = async (documentCollectionId) => {
    // Update the document collection status after upload
    if (documentCollectionId) {
      try {
        console.log('📎 [UPLOAD COMPLETE DEBUG] Documents uploaded, fetching updated status:', {
          documentCollectionId,
          timestamp: new Date().toISOString()
        });
        
        const response = await axiosInstance.get(`/api/document-collection/${documentCollectionId}`);
        const collectionData = response.data.data;
        
        console.log('📊 [UPLOAD COMPLETE DEBUG] Updated collection data:', {
          id: collectionData._id,
          status: collectionData.status,
          documentsCount: collectionData.documents?.length || 0
        });
        
        // 🔥 FIX: Use centralized state updater instead of individual setters
        updateDocumentCollectionState({
          status: collectionData.status,
          collection: collectionData,
          collectionId: documentCollectionId
        }, 'upload-complete');
        
        toast.success('✅ Documents uploaded successfully! You can now verify them.');
        
        console.log('✅ [UPLOAD COMPLETE DEBUG] Document states updated after upload:', {
          newStatus: collectionData.status,
          documentsCount: collectionData.documents?.length || 0
        });
        
      } catch (error) {
        console.error('❌ [UPLOAD COMPLETE DEBUG] Error fetching updated document collection:', error);
        
        // Set error state
        updateDocumentCollectionState({
          error: error.message
        }, 'upload-complete-error');
      }
    }
  };

  const verifyDocuments = async () => {
    if (!documentCollectionId) {
      toast.error('No document collection found');
      return;
    }
    
    try {
      console.log('🔍 [VERIFY DEBUG] Starting document verification from CandidateDetailsPage:', {
        documentCollectionId,
        currentStatus: documentCollectionStatus,
        timestamp: new Date().toISOString()
      });
      
      const response = await axiosInstance.put(`/api/document-collection/${documentCollectionId}/verify`, {
        verifiedBy: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null,
        verificationNotes: 'Documents verified successfully'
      });
      
      console.log('✅ [VERIFY DEBUG] Document verification API response:', {
        success: response.data.success,
        status: response.data.data?.status,
        message: response.data.message
      });
      
      // 🔥 FIX: Use centralized state updater instead of individual setters
      const verifiedData = response.data.data;
      
      updateDocumentCollectionState({
        status: 'verified',
        collection: verifiedData
      }, 'direct-verification');
      
      console.log('✅ [VERIFY DEBUG] Document states updated after verification');
      
      // Force component refresh
      setLastRefresh(Date.now());
      
      // Show success message
      toast.success('✅ Documents verified successfully! Select Candidate button is now enabled.');
      
      // Force a delayed refresh to ensure consistency
      setTimeout(() => {
        console.log('🔄 [VERIFY DEBUG] Performing delayed refresh after verification...');
        refreshDocumentCollectionStatus();
      }, 1000);
      
    } catch (error) {
      console.error('❌ [VERIFY DEBUG] Error verifying documents:', error);
      toast.error('❌ Failed to verify documents');
      
      // Set error state
      updateDocumentCollectionState({
        error: error.message
      }, 'verification-error');
    }
  };

  const rejectDocuments = async () => {
    if (!documentCollectionId) {
      debouncedToast.error('No document collection found', 'reject-docs-no-collection');
      return;
    }
    
    if (!rejectionReason.trim()) {
      debouncedToast.error('Please provide a rejection reason', 'reject-docs-no-reason');
      return;
    }
    
    try {
      const response = await axiosInstance.put(`/api/document-collection/${documentCollectionId}/reject`, {
        rejectedBy: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null,
        rejectionReason: rejectionReason
      });
      
      setDocumentCollection(response.data.data); // Update with full data
      setDocumentCollectionStatus('rejected');
      setRejectionReason('');
      setShowRejectDocumentsModal(false);
      
      // Use deduplicated toast
      documentToast.rejected(documentCollectionId, rejectionReason);
      
      // Refresh the document collection status
      setTimeout(refreshDocumentCollectionStatus, 1000);
    } catch (error) {
      console.error('Error rejecting documents:', error);
      debouncedToast.error('Failed to reject documents', `reject-docs-error-${documentCollectionId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-blue-600 mb-4" />
          <p className="text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faTimesCircle} size="3x" className="text-red-500 mb-4" />
          <p className="text-gray-600 mb-4">Candidate details not found</p>
          <Button onClick={() => navigate('/dashboard/candidates')}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Candidates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/candidates')}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {displayName || 'Candidate Details'}
                </h1>
                <p className="text-gray-600">{candidateData.email}</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Interview Scheduling */}
              {interviewStatus === 'not-scheduled' && (
                <div className="relative">
              <Button
                    onClick={() => setShowSchedulingDropdown(!showSchedulingDropdown)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Schedule Interview
                    <FontAwesomeIcon 
                      icon={showSchedulingDropdown ? faChevronUp : faChevronDown} 
                      className="ml-2" 
                    />
                  </Button>
                  
{showSchedulingDropdown && (
  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
    <div className="p-2">
      <button
        onClick={() => handleExternalScheduling('google-meet')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
      >
        <FontAwesomeIcon icon={faGoogleBrand} className="mr-2 text-blue-500" />
        Google Calendar
        <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-auto text-xs" />
      </button>
      <button
        onClick={() => handleExternalScheduling('microsoft-teams')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
      >
        <FontAwesomeIcon icon={faMicrosoftBrand} className="mr-2 text-blue-600" />
        Microsoft Teams
        <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-auto text-xs" />
      </button>
      <button
        onClick={() => handleExternalScheduling('zoom')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
      >
        <FontAwesomeIcon icon={faVideo} className="mr-2 text-blue-700" /> {/* Replaced faZoom with faVideo */}
        Zoom
        <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-auto text-xs" />
      </button>
    </div>
  </div>
)}                </div>
              )}

              {/* Interview Completed Button */}
              {interviewStatus === 'scheduled' && (
                <Button
                  onClick={handleInterviewCompleted}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Mark Interview Complete
                </Button>
              )}

              {/* Interview Feedback Button */}
              {interviewStatus === 'completed' && !interviewFeedback.feedbackSubmitted && (
                <Button
                  onClick={async () => { try { await ensureInterviewForSession(); setShowFeedbackModal(true); } catch(e){} }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FontAwesomeIcon icon={faComments} className="mr-2" />
                  Add Interview Feedback
              </Button>
              )}

              {/* Decision Buttons - Enhanced with optimized button component */}
              <>
                {/* 🔥 DIAGNOSTIC: Real-time status monitor */}
                <div className="mb-4 p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">🔍 Document Status Diagnostic</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Status: <span className="font-mono bg-yellow-100 px-1 rounded">{documentCollectionStatus || 'null'}</span></div>
                    <div>Collection ID: <span className="font-mono bg-blue-100 px-1 rounded">{documentCollectionId ? 'Set' : 'null'}</span></div>
                    <div>Collection Object: <span className="font-mono bg-green-100 px-1 rounded">{documentCollection?.status || 'null'}</span></div>
                    <div>Last Refresh: <span className="font-mono bg-purple-100 px-1 rounded">{new Date(lastRefresh).toLocaleTimeString()}</span></div>
                    <div>Button Enabled: <span className={`font-mono px-1 rounded ${documentCollectionStatus === 'verified' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{documentCollectionStatus === 'verified' ? 'YES' : 'NO'}</span></div>
                    <div>State Update: <span className="font-mono bg-orange-100 px-1 rounded">{documentCollectionState.lastUpdate ? new Date(documentCollectionState.lastUpdate).toLocaleTimeString() : 'none'}</span></div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button 
                      onClick={() => {
                        console.log('🔄 [MANUAL REFRESH] Forcing document status refresh from diagnostic panel');
                        refreshDocumentCollectionStatus();
                      }}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      🔄 Force Refresh
                    </button>
                    <button 
                      onClick={() => {
                        console.log('📊 [STATE DEBUG] Current component state:', {
                          documentCollectionState,
                          documentCollectionStatus,
                          documentCollectionId,
                          documentCollection,
                          lastRefresh
                        });
                      }}
                      className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                      📊 Log State
                    </button>
                  </div>
                </div>
                
                <OptimizedSelectCandidateButton 
                  documentCollectionStatus={documentCollectionStatus}
                  documentCollectionId={documentCollectionId}
                  documentCollection={documentCollection}
                  lastRefresh={lastRefresh}
                  onSelectCandidate={() => setShowOfferModal(true)}
                  onRefreshDocuments={refreshDocumentCollectionStatus}
                />
                
                <Button
                  onClick={async () => {
                    try {
                      console.log('[UI] Sending Interview Invitation');
                      await axiosInstance.post('/api/interviews/send-invitation', {
                        candidateId,
                        assessmentSessionId,
                        interviewDetails: {
                          dateTime: 'To be scheduled',
                          platform: 'To be confirmed',
                          duration: '45-60 minutes'
                        }
                      });
                      toast.success('🎉 Interview invitation sent to candidate successfully!');
                      toast.success('📧 HR notification sent - Check your email for confirmation!');
                    } catch (error) {
                      console.error('Error sending interview invitation:', error);
                      toast.error('Failed to send interview invitation');
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FontAwesomeIcon icon={faEnvelopeOpen} className="mr-2" />
                  Send Interview Invitation
                </Button>
                
                <Button
                  onClick={() => {
                    console.log('[UI] Open Reject Modal');
                    setShowRejectModal(true);
                  }}
                  variant="outline"
                  className={`border-red-300 text-red-600 hover:bg-red-50 ${isSubmittingReject ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmittingReject}
                >
                  <FontAwesomeIcon icon={faUserTimes} className="mr-2" />
                  {isSubmittingReject ? 'Processing…' : 'Reject'}
                </Button>
              </>

              {/* Feedback Submitted Indicator */}
              {interviewFeedback.feedbackSubmitted && (
                <div className="flex items-center text-green-600">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                  <span className="text-sm">Feedback Submitted</span>
                </div>
              )}

              {/* Document Collection Button - Dynamic text based on status */}
              <Button
                onClick={() => {
                  setShowDocumentCollectionModal(true);
                  // Refresh status when modal is opened
                  setTimeout(refreshDocumentCollectionStatus, 1000);
                }}
                className={`${
                  documentCollectionId 
                    ? (documentCollectionStatus === 'verified' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                      )
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
              >
                <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                {documentCollectionId
                  ? (documentCollectionStatus === 'verified' 
                      ? 'Documents Verified ✓' 
                      : documentCollectionStatus === 'uploaded'
                        ? 'Documents Uploaded - Pending Verification'
                        : documentCollectionStatus === 'rejected'
                          ? 'Documents Rejected - Request Again'
                          : 'Documents Requested'
                    )
                  : 'Request Documents'
                }
              </Button>

              {/* Add a refresh button for document collection status */}
              {documentCollectionId && (
                <div className="flex gap-2">
                  <Button
                    onClick={refreshDocumentCollectionStatus}
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <FontAwesomeIcon icon={faSync} className="mr-2" />
                    Refresh Document Status
                  </Button>
                  
                  {/* Debug button - remove in production */}
                  <Button
                    onClick={() => {
                      console.log('DEBUG - Current States:', {
                        documentCollectionId,
                        documentCollectionStatus,
                        documentCollection,
                        candidateId,
                        assessmentSessionId,
                        lastRefresh: new Date(lastRefresh).toISOString()
                      });
                      toast.info(`Status: ${documentCollectionStatus || 'null'} | ID: ${documentCollectionId || 'null'}`);
                    }}
                    variant="outline"
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs px-2"
                  >
                    Debug Status
                  </Button>
                  
                  {/* Force verification test button */}
                  {documentCollectionId && documentCollectionStatus === 'uploaded' && (
                    <Button
                      onClick={() => {
                        console.log('🧪 Testing manual verification trigger');
                        const testEvent = new CustomEvent('documentVerified', {
                          detail: {
                            documentCollectionId,
                            status: 'verified',
                            data: { ...documentCollection, status: 'verified' },
                            timestamp: new Date().toISOString()
                          }
                        });
                        window.dispatchEvent(testEvent);
                        toast.info('🧪 Test verification event dispatched');
                      }}
                      variant="outline"
                      className="bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs px-2"
                    >
                      Test Verify Event
                    </Button>
                  )}
                </div>
              )}

              {/* Document Collection Status Indicator with better feedback */}
              {documentCollectionId && (
                <div className="flex items-center gap-2">
                  {documentCollectionStatus === 'requested' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                      Documents Requested
                    </span>
                  )}
                  {documentCollectionStatus === 'uploaded' && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <FontAwesomeIcon icon={faFileUpload} className="mr-1" />
                        Documents Uploaded
                      </span>
                      <Button
                        onClick={verifyDocuments}
                        variant="outline"
                        className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300 animate-pulse"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Verify Documents
                      </Button>
                      <Button
                        onClick={() => setShowRejectDocumentsModal(true)}
                        variant="outline"
                        className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
                      >
                        <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                        Reject Documents
                      </Button>
                    </div>
                  )}
                  {documentCollectionStatus === 'verified' && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 animate-pulse">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Documents Verified ✓
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        ✅ Select Candidate button is now enabled!
                      </span>
                    </div>
                  )}
                  {documentCollectionStatus === 'rejected' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                      Documents Rejected
                    </span>
                  )}
                </div>
              )}
              
              {/* Show message when no documents are requested yet */}
              {!documentCollectionId && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <span className="text-sm font-medium">Documents not requested yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: faUser },
                { id: 'assessment', label: 'Assessment Report', icon: faChartBar },
                { id: 'documents', label: 'Documents', icon: faFileAlt },
                { id: 'interview', label: 'Interview History', icon: faCalendarAlt }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4" />
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{candidateData.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4" />
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{candidateData.mobile_number || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faBriefcase} className="text-gray-400 w-4" />
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{candidateData.experience || 'N/A'} years</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidateData.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      )) || <span className="text-gray-500">No skills listed</span>}
                    </div>
                  </div>
                </div>

                {/* Assessment Summary */}
                {assessmentData && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartBar} className="text-indigo-600" />
                      Assessment Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          {assessmentData.testResult?.score?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">MCQ Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {assessmentData.testResult?.audioScore?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Audio Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {assessmentData.testResult?.videoScore?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Video Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {assessmentData.testResult?.combinedScore?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Combined Score</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assessment' && assessmentData && (
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Assessment Results</h3>
                  {/* Assessment details would go here */}
                  <p className="text-gray-600">Detailed assessment analysis and insights...</p>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Document Collection</h3>
                  <Button
                    onClick={() => setShowDocumentCollectionModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                    Manage Documents
                  </Button>
                </div>
                
                {documentCollectionId ? (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-md font-medium text-gray-900">Document Collection Status</h4>
                        <p className="text-sm text-gray-500">
                          Collection ID: {documentCollectionId}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {documentCollectionStatus === 'requested' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                            Documents Requested
                          </span>
                        )}
                        {documentCollectionStatus === 'uploaded' && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              <FontAwesomeIcon icon={faFileUpload} className="mr-1" />
                              Documents Uploaded
                            </span>
                            <Button
                              onClick={verifyDocuments}
                              variant="outline"
                              className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                            >
                              <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                              Verify Documents
                            </Button>
                            <Button
                              onClick={() => setShowRejectDocumentsModal(true)}
                              variant="outline"
                              className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
                            >
                              <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                              Reject Documents
                            </Button>
                          </div>
                        )}
                        {documentCollectionStatus === 'verified' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                            Documents Verified
                          </span>
                        )}
                        {documentCollectionStatus === 'rejected' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                            Documents Rejected
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {documentCollection?.documents?.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-md font-medium text-gray-900 mb-4">Uploaded Documents</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {documentCollection.documents.map((document, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faFile} className="text-gray-400 text-xl" />
                                <div>
                                  <div className="font-medium text-gray-900">{document.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {document.type} • {(document.size / 1024).toFixed(1)} KB
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Uploaded: {new Date(document.uploadedAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => viewDocument(documentCollectionId, index)}
                                variant="outline"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FontAwesomeIcon icon={faEye} className="mr-1" />
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={refreshDocumentCollectionStatus}
                        variant="outline"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        <FontAwesomeIcon icon={faSync} className="mr-2" />
                        Refresh Status
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <FontAwesomeIcon icon={faFileUpload} className="text-gray-400 text-3xl mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Document Collection</h4>
                    <p className="text-gray-500 mb-4">
                      No documents have been requested from this candidate yet.
                    </p>
                    <Button
                      onClick={() => setShowDocumentCollectionModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <FontAwesomeIcon icon={faPaperclip} className="mr-2" />
                      Request Documents
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'interview' && (
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview History</h3>
                  <p className="text-gray-600">No interviews scheduled yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interview Scheduling Modal */}
        {/* Advanced Offer Letter Editor */}
        <AdvancedOfferEditor
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
          candidateData={candidateData}
          assessmentData={assessmentData}
          onSave={handleSelectCandidate}
        />

        {/* Reject Candidate Modal */}
        <Dialog
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Candidate"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
              <select
                value={rejectionData.reason}
                onChange={(e) => setRejectionData({ ...rejectionData, reason: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select a reason</option>
                <option value="requirements-not-matching">Requirements not matching</option>
                <option value="location-not-suitable">Location not suitable</option>
                <option value="resume-referred-other-roles">Resume referred for other roles</option>
                <option value="custom">Custom reason</option>
              </select>
            </div>
            {rejectionData.reason === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Reason</label>
                <input
                  type="text"
                  value={rejectionData.customReason}
                  onChange={(e) => setRejectionData({ ...rejectionData, customReason: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter custom reason"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (Optional)</label>
              <textarea
                value={rejectionData.feedback}
                onChange={(e) => setRejectionData({ ...rejectionData, feedback: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                placeholder="Provide constructive feedback to the candidate"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectCandidate}
                className={`bg-red-600 hover:bg-red-700 text-white ${
                  !rejectionData.reason || (rejectionData.reason === 'custom' && !rejectionData.customReason.trim()) || isSubmittingReject
                    ? 'opacity-70 cursor-not-allowed' 
                    : ''
                }`}
                disabled={!rejectionData.reason || (rejectionData.reason === 'custom' && !rejectionData.customReason.trim()) || isSubmittingReject}
              >
                <FontAwesomeIcon icon={faUserTimes} className="mr-2" />
                {isSubmittingReject ? 'Processing...' : 'Reject Candidate'}
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Interview Feedback Modal */}
        <Dialog
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          title="Interview Feedback"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setInterviewFeedback({ ...interviewFeedback, rating })}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      interviewFeedback.rating >= rating
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {interviewFeedback.rating === 0 && 'Please select a rating'}
                {interviewFeedback.rating === 1 && 'Poor'}
                {interviewFeedback.rating === 2 && 'Below Average'}
                {interviewFeedback.rating === 3 && 'Average'}
                {interviewFeedback.rating === 4 && 'Good'}
                {interviewFeedback.rating === 5 && 'Excellent'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Feedback</label>
              <textarea
                value={interviewFeedback.feedback}
                onChange={(e) => setInterviewFeedback({ ...interviewFeedback, feedback: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="4"
                placeholder="Detailed feedback about the interview performance..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
              <textarea
                value={interviewFeedback.strengths}
                onChange={(e) => setInterviewFeedback({ ...interviewFeedback, strengths: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                placeholder="What are the candidate's key strengths?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Areas for Improvement</label>
              <textarea
                value={interviewFeedback.areasForImprovement}
                onChange={(e) => setInterviewFeedback({ ...interviewFeedback, areasForImprovement: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                placeholder="What areas could the candidate improve?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation</label>
              <select
                value={interviewFeedback.recommendation}
                onChange={(e) => setInterviewFeedback({ ...interviewFeedback, recommendation: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="pending">Pending Decision</option>
                <option value="proceed">Proceed to Next Round</option>
                <option value="reject">Reject Candidate</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!interviewFeedback.feedback.trim() || interviewFeedback.rating === 0}
              >
                <FontAwesomeIcon icon={faComments} className="mr-2" />
                Submit Feedback
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Document Collection Modal */}
        <AnimatePresence>
          {showDocumentCollectionModal && (
            <DocumentCollectionForm
              candidateId={candidateId}
              assessmentSessionId={assessmentSessionId}
              candidateData={candidateData}
              onClose={() => setShowDocumentCollectionModal(false)}
              onDocumentsUploaded={handleDocumentsUploaded}
            />
          )}
        </AnimatePresence>

        {/* Reject Documents Modal */}
        <AnimatePresence>
          {showRejectDocumentsModal && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faTimesCircle} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Reject Documents</h2>
                        <p className="text-gray-600 text-sm">Provide a reason for rejecting the documents</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowRejectDocumentsModal(false);
                        setRejectionReason('');
                      }}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Please provide a reason for rejecting these documents..."
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectDocumentsModal(false);
                        setRejectionReason('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={rejectDocuments}
                      disabled={!rejectionReason.trim()}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                      Reject Documents
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

// 🔥 OPTIMIZED SELECT CANDIDATE BUTTON: Memoized component for better performance
const OptimizedSelectCandidateButton = React.memo(({
  documentCollectionStatus,
  documentCollectionId,
  documentCollection,
  lastRefresh,
  onSelectCandidate,
  onRefreshDocuments
}) => {
  console.log('🔄 [BUTTON RENDER] OptimizedSelectCandidateButton rendering:', {
    documentCollectionStatus,
    isEnabled: documentCollectionStatus === 'verified',
    timestamp: new Date().toISOString()
  });
  
  const handleClick = useCallback(async () => {
    // 🔥 DEBUG: Comprehensive button state logging
    const currentState = {
      documentCollectionStatus,
      documentCollectionId,
      documentCollection: documentCollection?.status,
      isEnabled: documentCollectionStatus === 'verified',
      lastRefresh: new Date(lastRefresh).toISOString(),
      timestamp: new Date().toISOString()
    };
    
    console.log('🎯 [BUTTON CLICK DEBUG] Select Candidate Button State:', currentState);
    
    if (documentCollectionStatus !== 'verified') {
      console.log('❌ [BUTTON CLICK DEBUG] Documents not verified. Current status:', documentCollectionStatus);
      console.log('🔄 [BUTTON CLICK DEBUG] Forcing document status refresh...');
      
      try {
        await onRefreshDocuments();
        console.log('✅ [BUTTON CLICK DEBUG] Refresh completed. Checking status again...');
        
        // Use a promise to wait for state update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Re-check status after refresh
        if (documentCollectionStatus === 'verified') {
          console.log('✅ [BUTTON CLICK DEBUG] Status verified after refresh. Opening modal...');
          onSelectCandidate();
        } else {
          console.log('❌ [BUTTON CLICK DEBUG] Status still not verified after refresh:', documentCollectionStatus);
          toast.warning(`⚠️ Documents status: ${documentCollectionStatus || 'unknown'}. Please verify documents first.`);
        }
      } catch (error) {
        console.error('❌ [BUTTON CLICK DEBUG] Refresh failed:', error);
        toast.error('Failed to refresh document status');
      }
      return;
    }
    
    console.log('✅ [BUTTON CLICK DEBUG] Documents verified. Opening offer modal...');
    onSelectCandidate();
  }, [documentCollectionStatus, documentCollectionId, documentCollection, lastRefresh, onSelectCandidate, onRefreshDocuments]);
  
  const isEnabled = documentCollectionStatus === 'verified';
  const buttonText = isEnabled 
    ? 'Select Candidate' 
    : `Documents Required (${documentCollectionStatus || 'none'})`;
  
  return (
    <Button
      onClick={handleClick}
      className={`bg-green-600 hover:bg-green-700 text-white transition-all duration-200 ${
        !isEnabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'opacity-100'
      }`}
      disabled={!isEnabled}
    >
      <FontAwesomeIcon icon={faHandshake} className="mr-2" />
      {buttonText}
      {/* Enhanced debug info */}
      <span className="ml-2 text-xs opacity-75">
        {isEnabled ? '✅' : '❌'}
      </span>
      {/* Real-time status indicator */}
      <span className="ml-1 text-xs opacity-60">
        [{documentCollectionStatus || 'none'}]
      </span>
      {/* Debug timestamp */}
      <span className="ml-1 text-xs opacity-40">
        {new Date(lastRefresh).toLocaleTimeString()}
      </span>
    </Button>
  );
});

OptimizedSelectCandidateButton.displayName = 'OptimizedSelectCandidateButton';

export default CandidateDetailsPage;