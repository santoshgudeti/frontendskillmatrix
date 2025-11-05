import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faEye, 
  faDownload, 
  faPrint, 
  faUndo, 
  faRedo,
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faFont,
  faPalette,
  faImage,
  faTable,
  faCode,
  faExpand,
  faCompress,
  faFileContract,
  faEdit,
  faCheck,
  faArrowLeft,
  faArrowRight,
  faCog,
  faInfoCircle,
  faLightbulb,
  faRocket,
  faMagic
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../axiosUtils';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../ui/Dialog';
import ComprehensiveOfferForm from './ComprehensiveOfferForm';

// Professional Rich Text Editor Component
const RichTextEditor = ({ content, onChange, readOnly = false }) => {
  const editorRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [wordCount, setWordCount] = useState(0);
  
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
      updateWordCount();
    }
  }, [content]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
    updateWordCount();
  };

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
    updateWordCount();
  };

  const updateActiveFormats = () => {
    const formats = new Set();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    setActiveFormats(formats);
  };

  const updateWordCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      setWordCount(text.length);
    }
  };

  const insertProfessionalTable = () => {
    const tableHTML = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <thead>
          <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <th style="border: 1px solid #e2e8f0; padding: 16px; text-align: left; font-weight: 600;">Component</th>
            <th style="border: 1px solid #e2e8f0; padding: 16px; text-align: right; font-weight: 600;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #e2e8f0; padding: 12px;">Basic Salary</td>
            <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">50,000</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e2e8f0; padding: 12px;">HRA</td>
            <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">15,000</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #e2e8f0; padding: 12px; font-weight: 600;">Total</td>
            <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right; font-weight: 600;">65,000</td>
          </tr>
        </tbody>
      </table>
    `;
    document.execCommand('insertHTML', false, tableHTML);
    handleInput();
  };

  const insertModernSignature = () => {
    const signatureHTML = `
      <div style="margin-top: 50px; padding: 30px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 12px; border-left: 4px solid #4f46e5;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div>
            <h4 style="color: #1e293b; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">For the Company</h4>
            <div style="margin-top: 60px;">
              <div style="border-bottom: 2px solid #1e293b; width: 200px; margin-bottom: 8px;"></div>
              <p style="margin: 0; font-weight: 600; color: #374151;">Authorized Signatory</p>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">HR Manager</p>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Date: _______________</p>
            </div>
          </div>
          <div>
            <h4 style="color: #1e293b; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Candidate Acceptance</h4>
            <div style="margin-top: 60px;">
              <div style="border-bottom: 2px solid #1e293b; width: 200px; margin-bottom: 8px;"></div>
              <p style="margin: 0; font-weight: 600; color: #374151;">Candidate Signature</p>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Name: _______________</p>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Date: _______________</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.execCommand('insertHTML', false, signatureHTML);
    handleInput();
  };

  const insertLetterhead = () => {
    const letterheadHTML = `
      <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">COMPANY NAME</h1>
        <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Professional Excellence • Innovation • Growth</p>
        <div style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
          <span>📧 hr@company.com</span> • <span>📞 +91-XXXXXXXXXX</span> • <span>🌐 www.company.com</span>
        </div>
      </div>
    `;
    document.execCommand('insertHTML', false, letterheadHTML);
    handleInput();
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      {/* Professional Toolbar */}
      <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* History Group */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => execCommand('undo')}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Undo (Ctrl+Z)"
            >
              <FontAwesomeIcon icon={faUndo} />
            </button>
            <button
              onClick={() => execCommand('redo')}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Redo (Ctrl+Y)"
            >
              <FontAwesomeIcon icon={faRedo} />
            </button>
          </div>

          {/* Text Formatting Group */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => execCommand('bold')}
              className={`px-3 py-2 rounded-md transition-all ${
                activeFormats.has('bold') 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Bold (Ctrl+B)"
            >
              <FontAwesomeIcon icon={faBold} />
            </button>
            <button
              onClick={() => execCommand('italic')}
              className={`px-3 py-2 rounded-md transition-all ${
                activeFormats.has('italic') 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Italic (Ctrl+I)"
            >
              <FontAwesomeIcon icon={faItalic} />
            </button>
            <button
              onClick={() => execCommand('underline')}
              className={`px-3 py-2 rounded-md transition-all ${
                activeFormats.has('underline') 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Underline (Ctrl+U)"
            >
              <FontAwesomeIcon icon={faUnderline} />
            </button>
          </div>

          {/* Alignment Group */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => execCommand('justifyLeft')}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Align Left"
            >
              <FontAwesomeIcon icon={faAlignLeft} />
            </button>
            <button
              onClick={() => execCommand('justifyCenter')}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Align Center"
            >
              <FontAwesomeIcon icon={faAlignCenter} />
            </button>
            <button
              onClick={() => execCommand('justifyRight')}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Align Right"
            >
              <FontAwesomeIcon icon={faAlignRight} />
            </button>
          </div>

          {/* Lists Group */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => execCommand('insertUnorderedList')}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Bullet List"
            >
              <FontAwesomeIcon icon={faListUl} />
            </button>
            <button
              onClick={() => execCommand('insertOrderedList')}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Numbered List"
            >
              <FontAwesomeIcon icon={faListOl} />
            </button>
          </div>

          {/* Font Controls */}
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => execCommand('fontSize', e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Font Size"
            >
              <option value="1">Small</option>
              <option value="2">Small+</option>
              <option value="3" defaultValue>Normal</option>
              <option value="4">Medium</option>
              <option value="5">Large</option>
              <option value="6">X-Large</option>
              <option value="7">XX-Large</option>
            </select>
            
            <input
              type="color"
              onChange={(e) => execCommand('foreColor', e.target.value)}
              className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer shadow-sm"
              title="Text Color"
              defaultValue="#000000"
            />
          </div>

          {/* Insert Elements */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={insertLetterhead}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Insert Company Letterhead"
            >
              <FontAwesomeIcon icon={faFileContract} />
            </button>
            <button
              onClick={insertProfessionalTable}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Insert Professional Table"
            >
              <FontAwesomeIcon icon={faTable} />
            </button>
            <button
              onClick={insertModernSignature}
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-all"
              title="Insert Signature Block"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <div className="ml-auto">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-sm transition-all font-medium"
              title="Toggle Fullscreen"
            >
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="mr-2" />
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </button>
          </div>
        </div>

        {/* Editor Tips */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
            <span>Use keyboard shortcuts: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline)</span>
          </div>
          <div className="text-sm text-gray-500">
            {wordCount} characters
          </div>
        </div>
      </div>
      
      {/* Editor Content Area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!readOnly}
          onInput={handleInput}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          className={`p-8 focus:outline-none ${
            isFullscreen ? 'min-h-[calc(100vh-250px)]' : 'min-h-[600px]'
          } prose prose-lg max-w-none`}
          style={{
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#1f2937',
            backgroundColor: '#ffffff'
          }}
          suppressContentEditableWarning={true}
        />
        
        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
          <span>Professional Offer Letter Editor</span>
          <span>{wordCount} characters • Ready to send</span>
        </div>
      </div>
    </div>
  );
};

// Professional Template Selector Component
const TemplateSelector = ({ selectedTemplate, onTemplateChange, templates }) => {
  const getTemplateIcon = (templateId) => {
    switch (templateId) {
      case 'professional': return faFileContract;
      case 'executive': return faRocket;
      case 'startup': return faLightbulb;
      case 'formal': return faCog;
      default: return faFileContract;
    }
  };

  const getTemplateColor = (templateId) => {
    switch (templateId) {
      case 'professional': return 'from-blue-500 to-blue-600';
      case 'executive': return 'from-purple-500 to-purple-600';
      case 'startup': return 'from-green-500 to-green-600';
      case 'formal': return 'from-gray-500 to-gray-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <FontAwesomeIcon icon={faEdit} className="text-white text-lg" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Choose Your Template</h3>
          <p className="text-gray-600">Select a professional template that matches your company style</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`group cursor-pointer rounded-xl transition-all duration-300 transform hover:scale-105 ${
              selectedTemplate === template.id
                ? 'ring-4 ring-blue-500 ring-opacity-50 shadow-2xl'
                : 'shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200">
              {/* Template Preview */}
              <div className={`h-32 bg-gradient-to-br ${getTemplateColor(template.id)} flex items-center justify-center relative`}>
                <FontAwesomeIcon 
                  icon={getTemplateIcon(template.id)} 
                  className="text-white text-3xl opacity-80" 
                />
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-sm" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              
              {/* Template Info */}
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-1">{template.name}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                
                {selectedTemplate === template.id && (
                  <div className="mt-3 flex items-center gap-2 text-blue-600">
                    <FontAwesomeIcon icon={faCheck} className="text-sm" />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Template Features */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Template Features</h4>
            <p className="text-sm text-blue-700">
              All templates include professional formatting, company branding, salary breakdown tables, 
              legal terms, and signature sections. Fully customizable with our advanced editor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Advanced Offer Editor Component
const AdvancedOfferEditor = ({ 
  isOpen, 
  onClose, 
  candidateData, 
  assessmentData, 
  onSave 
}) => {
  const [offerData, setOfferData] = useState({
    // Candidate Details
    candidateName: '',
    candidateEmail: '',
    candidateAddress: '',
    candidatePhone: '',
    
    // Position Details
    position: '',
    department: '',
    employmentType: 'Full-time',
    reportingManager: '',
    workLocation: 'Office',
    
    // Salary & Benefits
    salary: '',
    currency: 'INR',
    salaryFrequency: 'per annum',
    benefits: '',
    
    // Dates & Terms
    startDate: '',
    endDate: '', // For contract positions
    probationPeriod: '3 months',
    noticePeriod: '30 days',
    workingHours: '9 AM to 6 PM',
    workingDays: 'Monday to Friday',
    
    // Company Details
    companyName: 'Cognibotz',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyWebsite: '',
    
    // HR Details
    hrName: '',
    hrTitle: 'HR Manager',
    hrEmail: '',
    hrPhone: '',
    
    // Additional Terms
    additionalTerms: '',
    specialConditions: '',
    
    // Interview Details
    interviewDate: '',
    interviewFeedback: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [offerContent, setOfferContent] = useState('');
  const [activeTab, setActiveTab] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [salaryBreakdown, setSalaryBreakdown] = useState({
    earnings: [
      { name: 'Basic Salary', amount: 0 },
      { name: 'HRA', amount: 0 },
      { name: 'Conveyance Allowance', amount: 0 },
      { name: 'Medical Allowance', amount: 0 }
    ],
    deductions: [
      { name: 'PF', amount: 0 },
      { name: 'ESI', amount: 0 },
      { name: 'Professional Tax', amount: 0 }
    ]
  });

  const templates = [
    { id: 'professional', name: 'Professional Corporate', description: 'Clean, modern design' },
    { id: 'executive', name: 'Executive Level', description: 'Premium design for senior roles' },
    { id: 'startup', name: 'Modern Startup', description: 'Contemporary tech company style' },
    { id: 'formal', name: 'Formal Traditional', description: 'Traditional business format' }
  ];

  // Auto-populate form with candidate and assessment data
  useEffect(() => {
    if (isOpen && candidateData && assessmentData) {
      setOfferData(prev => ({
        ...prev,
        candidateName: candidateData.name || candidateData.email || '',
        candidateEmail: candidateData.email || '',
        position: assessmentData.jobTitle || '',
        interviewDate: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD for date input
      }));
      loadOfferDraft();
    }
  }, [isOpen, selectedTemplate, candidateData, assessmentData]);

  // Auto-update offer letter when form data changes
  useEffect(() => {
    if (isOpen && Object.keys(offerData).some(key => offerData[key])) {
      const debounceTimer = setTimeout(() => {
        updateOfferContent();
      }, 500); // Debounce to avoid too many API calls
      
      return () => clearTimeout(debounceTimer);
    }
  }, [offerData, selectedTemplate, isOpen]);

  // Validation function
  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      // Candidate Details
      candidateName: 'Candidate Name',
      candidateEmail: 'Candidate Email',
      
      // Position Details
      position: 'Position/Job Title',
      department: 'Department',
      
      // Salary & Benefits
      salary: 'Salary',
      
      // Dates
      startDate: 'Start Date',
      
      // Company Details
      companyName: 'Company Name',
      companyAddress: 'Company Address',
      
      // HR Details
      hrName: 'HR Name',
      hrEmail: 'HR Email'
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!offerData[field] || offerData[field].trim() === '') {
        errors[field] = `${label} is required`;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (offerData.candidateEmail && !emailRegex.test(offerData.candidateEmail)) {
      errors.candidateEmail = 'Please enter a valid email address';
    }
    if (offerData.hrEmail && !emailRegex.test(offerData.hrEmail)) {
      errors.hrEmail = 'Please enter a valid HR email address';
    }

    // Salary validation
    if (offerData.salary && isNaN(parseFloat(offerData.salary))) {
      errors.salary = 'Please enter a valid salary amount';
    }

    // Date validation
    if (offerData.startDate) {
      const startDate = new Date(offerData.startDate);
      const today = new Date();
      if (startDate < today) {
        errors.startDate = 'Start date should be today or in the future';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadOfferDraft = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/api/offers/draft', {
        candidateId: candidateData._id,
        assessmentSessionId: assessmentData._id,
        template: selectedTemplate,
        offerData: offerData // Send current form data
      });
      
      if (response.data.draftHtml) {
        setOfferContent(response.data.draftHtml);
      }
    } catch (error) {
      console.error('Error loading offer draft:', error);
      toast.error('Failed to load offer template');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update offer content with current form data
  const updateOfferContent = async () => {
    if (!candidateData || !assessmentData) return;
    
    try {
      const response = await axiosInstance.post('/api/offers/draft', {
        candidateId: candidateData._id,
        assessmentSessionId: assessmentData._id,
        template: selectedTemplate,
        offerData: offerData // Send current form data for real-time updates
      });
      
      if (response.data.draftHtml) {
        setOfferContent(response.data.draftHtml);
      }
    } catch (error) {
      console.error('Error updating offer content:', error);
      // Don't show error toast for auto-updates to avoid spam
    }
  };

  const handleSave = async () => {
    // Validate form first
    if (!validateForm()) {
      const missingFields = Object.values(validationErrors);
      setShowValidationAlert(true);
      
      // Show alert with missing fields
      const alertMessage = `Please fill in the following required fields:\n\n${missingFields.join('\n')}`;
      
      const userConfirmed = window.confirm(
        `${alertMessage}\n\nDo you want to proceed anyway? (Not recommended)`
      );
      
      if (!userConfirmed) {
        return; // Don't proceed if user cancels
      }
    }

    try {
      setIsLoading(true);
      
      const offerPayload = {
        ...offerData,
        candidateName: offerData.candidateName || candidateData.name || candidateData.email,
        candidateEmail: offerData.candidateEmail || candidateData.email,
        jobTitle: offerData.position || assessmentData.jobTitle,
        offerContent,
        salaryBreakdown,
        template: selectedTemplate
      };

      await onSave(offerPayload);
      toast.success('🎉 Candidate selected successfully!');
      toast.success('📧 Offer letter sent to both candidate and HR!');
      onClose();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast.error('Failed to save offer letter');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offer Letter Preview</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${offerContent}
        </body>
      </html>
    `);
    previewWindow.document.close();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offer Letter</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; }
            @page { margin: 20mm; }
          </style>
        </head>
        <body>
          ${offerContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="full" className="flex flex-col h-[95vh] bg-gradient-to-br from-slate-50 to-blue-50">
        <DialogHeader className="bg-white border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faFileContract} className="text-white text-xl" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">Professional Offer Letter Generator</DialogTitle>
                <p className="text-gray-600 mt-1">Create enterprise-grade offer letters with advanced customization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <FontAwesomeIcon icon={faMagic} className="mr-1" />
                AI-Powered
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </DialogHeader>
        
        <DialogBody className="flex-1 overflow-hidden flex flex-col p-6">
          {/* Professional Navigation Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'form' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FontAwesomeIcon icon={faCog} />
                Smart Form
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'editor' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FontAwesomeIcon icon={faEdit} />
                Rich Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'preview' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FontAwesomeIcon icon={faEye} />
                Live Preview
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handlePreview} 
                variant="outline" 
                size="sm"
                className="bg-white border-gray-300 hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Quick Preview
              </Button>
              <Button 
                onClick={handlePrint} 
                variant="outline" 
                size="sm"
                className="bg-white border-gray-300 hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={faPrint} className="mr-2" />
                Print Test
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Offer Letter Progress</span>
              <span>
                {activeTab === 'form' && '1/3 - Setup'}
                {activeTab === 'editor' && '2/3 - Customize'}
                {activeTab === 'preview' && '3/3 - Review'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: activeTab === 'form' ? '33%' : activeTab === 'editor' ? '66%' : '100%' 
                }}
              ></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'form' && (
              <div className="space-y-6">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={setSelectedTemplate}
                  templates={templates}
                />
                
                <ComprehensiveOfferForm 
                  offerData={offerData}
                  setOfferData={setOfferData}
                  validationErrors={validationErrors}
                />
                
                {/* Keep existing salary breakdown for now */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style={{display: 'none'}}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faFileContract} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Position Details</h3>
                      <p className="text-gray-600 text-sm">Essential information about the role and compensation</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
                        Position Title *
                      </label>
                      <input
                        type="text"
                        value={offerData.position}
                        onChange={(e) => setOfferData({...offerData, position: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FontAwesomeIcon icon={faMagic} className="text-green-500" />
                        Annual Salary *
                      </label>
                      <input
                        type="text"
                        value={offerData.salary}
                        onChange={(e) => setOfferData({...offerData, salary: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="e.g., ₹12,00,000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FontAwesomeIcon icon={faCheck} className="text-purple-500" />
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={offerData.startDate}
                        onChange={(e) => setOfferData({...offerData, startDate: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FontAwesomeIcon icon={faCog} className="text-orange-500" />
                        Department
                      </label>
                      <input
                        type="text"
                        value={offerData.department}
                        onChange={(e) => setOfferData({...offerData, department: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="e.g., Engineering"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-500" />
                        Employment Type
                      </label>
                      <select
                        value={offerData.employmentType}
                        onChange={(e) => setOfferData({...offerData, employmentType: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
                        Work Location
                      </label>
                      <select
                        value={offerData.workLocation}
                        onChange={(e) => setOfferData({...offerData, workLocation: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="Office">Office</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
                        Benefits & Perquisites
                      </label>
                      <textarea
                        value={offerData.benefits}
                        onChange={(e) => setOfferData({...offerData, benefits: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        rows="4"
                        placeholder="Health insurance, provident fund, flexible working hours..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        Additional Terms
                      </label>
                      <textarea
                        value={offerData.additionalTerms}
                        onChange={(e) => setOfferData({...offerData, additionalTerms: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        rows="4"
                        placeholder="Special conditions, probation period, notice period..."
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Salary Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faMagic} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Salary Breakdown</h3>
                      <p className="text-gray-600 text-sm">Detailed monthly compensation structure</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Earnings Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                          <FontAwesomeIcon icon={faArrowRight} className="text-green-600 text-sm" />
                        </div>
                        <h4 className="font-bold text-green-700">Monthly Earnings</h4>
                      </div>
                      
                      {salaryBreakdown.earnings.map((item, index) => (
                        <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newEarnings = [...salaryBreakdown.earnings];
                                newEarnings[index].name = e.target.value;
                                setSalaryBreakdown({...salaryBreakdown, earnings: newEarnings});
                              }}
                              className="flex-1 border-2 border-green-200 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white"
                              placeholder="Component name"
                            />
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-gray-500">₹</span>
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => {
                                  const newEarnings = [...salaryBreakdown.earnings];
                                  newEarnings[index].amount = parseInt(e.target.value) || 0;
                                  setSalaryBreakdown({...salaryBreakdown, earnings: newEarnings});
                                }}
                                className="w-32 border-2 border-green-200 rounded-lg pl-8 pr-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white"
                                placeholder="0"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newEarnings = salaryBreakdown.earnings.filter((_, i) => i !== index);
                                setSalaryBreakdown({...salaryBreakdown, earnings: newEarnings});
                              }}
                              className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center text-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => setSalaryBreakdown({
                          ...salaryBreakdown, 
                          earnings: [...salaryBreakdown.earnings, {name: '', amount: 0}]
                        })}
                        className="w-full py-3 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors font-medium"
                      >
                        + Add Earning Component
                      </button>
                      
                      <div className="bg-green-100 rounded-lg p-4 border-2 border-green-300">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-green-800">Total Earnings:</span>
                          <span className="font-bold text-green-800 text-lg">
                            ₹{salaryBreakdown.earnings.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Deductions Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                          <FontAwesomeIcon icon={faArrowLeft} className="text-red-600 text-sm" />
                        </div>
                        <h4 className="font-bold text-red-700">Monthly Deductions</h4>
                      </div>
                      
                      {salaryBreakdown.deductions.map((item, index) => (
                        <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newDeductions = [...salaryBreakdown.deductions];
                                newDeductions[index].name = e.target.value;
                                setSalaryBreakdown({...salaryBreakdown, deductions: newDeductions});
                              }}
                              className="flex-1 border-2 border-red-200 rounded-lg px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white"
                              placeholder="Component name"
                            />
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-gray-500">₹</span>
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => {
                                  const newDeductions = [...salaryBreakdown.deductions];
                                  newDeductions[index].amount = parseInt(e.target.value) || 0;
                                  setSalaryBreakdown({...salaryBreakdown, deductions: newDeductions});
                                }}
                                className="w-32 border-2 border-red-200 rounded-lg pl-8 pr-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white"
                                placeholder="0"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newDeductions = salaryBreakdown.deductions.filter((_, i) => i !== index);
                                setSalaryBreakdown({...salaryBreakdown, deductions: newDeductions});
                              }}
                              className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center text-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => setSalaryBreakdown({
                          ...salaryBreakdown, 
                          deductions: [...salaryBreakdown.deductions, {name: '', amount: 0}]
                        })}
                        className="w-full py-3 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        + Add Deduction Component
                      </button>
                      
                      <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-red-800">Total Deductions:</span>
                          <span className="font-bold text-red-800 text-lg">
                            ₹{salaryBreakdown.deductions.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Net Salary Summary */}
                  <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="text-center">
                      <h4 className="text-lg font-bold mb-2">Net Monthly Salary</h4>
                      <div className="text-3xl font-bold">
                        ₹{(
                          salaryBreakdown.earnings.reduce((sum, item) => sum + (item.amount || 0), 0) -
                          salaryBreakdown.deductions.reduce((sum, item) => sum + (item.amount || 0), 0)
                        ).toLocaleString('en-IN')}
                      </div>
                      <p className="text-blue-100 mt-2">
                        Annual Take Home: ₹{(
                          (salaryBreakdown.earnings.reduce((sum, item) => sum + (item.amount || 0), 0) -
                          salaryBreakdown.deductions.reduce((sum, item) => sum + (item.amount || 0), 0)) * 12
                        ).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="h-full">
                <RichTextEditor
                  content={offerContent}
                  onChange={setOfferContent}
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <div 
                  className="bg-white shadow-lg mx-auto"
                  style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}
                  dangerouslySetInnerHTML={{ __html: offerContent }}
                />
              </div>
            )}
          </div>
        </DialogBody>
        
        <DialogFooter className="bg-white border-t border-gray-200 p-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {activeTab === 'form' && (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
                    <span>Fill all required fields to proceed</span>
                  </div>
                )}
                {activeTab === 'editor' && (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faEdit} className="text-purple-500" />
                    <span>Customize your offer letter content</span>
                  </div>
                )}
                {activeTab === 'preview' && (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                    <span>Review and send your professional offer</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              
              {activeTab !== 'preview' && (
                <Button 
                  onClick={() => {
                    if (activeTab === 'form') setActiveTab('editor');
                    else if (activeTab === 'editor') setActiveTab('preview');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <span>Continue</span>
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
              )}
              
              {activeTab === 'preview' && (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faRocket} className="mr-2" />
                      Send Professional Offer
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedOfferEditor;
