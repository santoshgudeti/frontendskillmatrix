import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faUpload, faEdit, faDownload,
  faCheckCircle, faExclamationTriangle, faSpinner,
  faPaperPlane, faEye, faTrash, faUser, faRocket, faMoneyBillWave, faBriefcase, faGavel, faLock
} from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../axiosUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IndustrialOfferLetterGenerator = () => {
  const [activeStep, setActiveStep] = useState('upload'); // upload, form, preview, download
  const [letterhead, setLetterhead] = useState(null);
  const [offerData, setOfferData] = useState({
    candidateName: '',
    candidateEmail: '',
    candidateAddress: '',
    position: '',
    jobSummary: '',
    department: '',
    startDate: '',
    employmentType: 'Full-time',
    reportingManager: '',
    workLocation: '',
    workingHours: '9:00 AM to 6:00 PM, Monday to Friday',
    salary: '',
    basic: '',
    hra: '',
    allowance: '',
    employerPf: '',
    benefits: '',
    probationPeriod: '3 months',
    noticePeriod: '30 days',
    offerValidUntil: '',
    offerDate: '',
    additionalTerms: '',
    includeNonCompete: false,
    nonCompetePeriod: '12 months',
    includeBond: false,
    bondPeriod: '1 year',
    bondAmount: '₹50,000',
    hrName: '',
    hrTitle: '',
    hrEmail: '',
    hrPhone: '',
    hrContact: '',
    companyName: '',
    companyAddress: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOffer, setGeneratedOffer] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [actionMode, setActionMode] = useState(null); // 'preview' | 'send' | 'download' | null

  // Fetch active letterhead on component mount
  useEffect(() => {
    fetchActiveLetterhead();
  }, []);

  const fetchActiveLetterhead = async () => {
    try {
      const response = await axiosInstance.get('/api/letterhead/active');
      if (response.data.success && response.data.letterhead) {
        setLetterhead(response.data.letterhead);
      }
    } catch (err) {
      console.error('Error fetching letterhead:', err);
      toast.warning('📄 No letterhead found. Please upload one for professional branding.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  const handleLetterheadUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed for letterhead upload.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB limit. Please compress and try again.');
      return;
    }

    const formData = new FormData();
    formData.append('letterhead', file);

    try {
      const uploadToast = toast.loading('Uploading letterhead...');
      const response = await axiosInstance.post('/api/letterhead/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setLetterhead(response.data);
        toast.update(uploadToast, {
          render: 'Letterhead uploaded successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload letterhead. Please try again.');
    }
  };

  // Auto-calculate salary components based on Annual CTC
  const calculateSalaryComponents = (annualCTC) => {
    const ctc = parseFloat(annualCTC) || 0;
    if (ctc <= 0) return;

    const basic = Math.round(ctc * 0.40);
    const hra = Math.round(ctc * 0.20);
    const allowance = Math.round(ctc * 0.30);
    const employerPf = Math.round(basic * 0.12);

    setOfferData(prev => ({
      ...prev,
      basic: basic.toString(),
      hra: hra.toString(),
      allowance: allowance.toString(),
      employerPf: employerPf.toString()
    }));

    toast.info(
      <div>
        <div className="font-bold mb-1">📊 Salary components auto-calculated</div>
        <div className="text-xs space-y-0.5">
          <div>• Basic: ₹{basic.toLocaleString('en-IN')} (40%)</div>
          <div>• HRA: ₹{hra.toLocaleString('en-IN')} (20%)</div>
          <div>• Allowance: ₹{allowance.toLocaleString('en-IN')} (30%)</div>
          <div>• Employer PF: ₹{employerPf.toLocaleString('en-IN')} (12% of Basic)</div>
        </div>
      </div>,
      {
        position: 'bottom-right',
        autoClose: 4000,
        hideProgressBar: false,
        style: {
          borderRadius: '12px'
        }
      }
    );
  };

  const handleInputChange = (field, value) => {
    setOfferData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate salary components when CTC changes
    if (field === 'salary' && value) {
      calculateSalaryComponents(value);
    }
    
    // Clear validation error for this field if it exists
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!offerData.candidateName.trim()) {
      errors.candidateName = 'Candidate name is required';
    }
    
    if (!offerData.candidateEmail.trim()) {
      errors.candidateEmail = 'Candidate email is required';
    } else if (!/\S+@\S+\.\S+/.test(offerData.candidateEmail)) {
      errors.candidateEmail = 'Please enter a valid email address';
    }
    
    if (!offerData.position.trim()) {
      errors.position = 'Position is required';
    }
    
    if (!offerData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!offerData.salary || parseFloat(offerData.salary) <= 0) {
      errors.salary = 'Valid salary (gross CTC) is required and must be greater than 0';
    }
    
    // CTC Components Validation - check if components add up properly
    if (offerData.salary && offerData.basic && offerData.hra && offerData.allowance) {
      const salary = parseFloat(offerData.salary) || 0;
      const basic = parseFloat(offerData.basic) || 0;
      const hra = parseFloat(offerData.hra) || 0;
      const allowance = parseFloat(offerData.allowance) || 0;
      const employerPf = parseFloat(offerData.employerPf) || 0;
      
      // Allow a small tolerance for rounding differences (0.5% of CTC)
      const tolerance = salary * 0.005;
      const componentsSum = basic + hra + allowance + employerPf;
      const difference = Math.abs(componentsSum - salary);
      
      if (difference > tolerance) {
        errors.salary = `CTC components sum (₹${componentsSum.toLocaleString('en-IN')}) doesn't match Annual CTC (₹${salary.toLocaleString('en-IN')}). Please adjust values.`;
      }
    }
    
    // HR Name validation - must have at least first and last name
    if (offerData.hrName && offerData.hrName.trim().split(' ').length < 2) {
      errors.hrName = 'Please enter full name (first and last name)';
    }
    
    // HR Email validation
    if (!offerData.hrEmail) {
      errors.hrEmail = 'HR email is required';
    } else if (!/\S+@\S+\.(com|in|org|net|co\.in)$/i.test(offerData.hrEmail)) {
      errors.hrEmail = 'Please enter a valid email address with proper domain';
    }
    
    // HR Phone validation
    if (offerData.hrPhone && !/^(\+91[\s-]?)?[6-9]\d{9}$/.test(offerData.hrPhone.replace(/[\s-]/g, ''))) {
      errors.hrPhone = 'Please enter a valid phone number';
    }
    
    if (!offerData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    // Offer validity date validation
    if (offerData.offerValidUntil) {
      const validUntil = new Date(offerData.offerValidUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 30);
      
      if (validUntil < today) {
        errors.offerValidUntil = 'Offer validity date must be in the future';
      } else if (validUntil > maxDate) {
        errors.offerValidUntil = 'Offer validity date cannot be more than 30 days from today';
      }
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      // Collect all error messages
      const errorMessages = Object.entries(errors).map(([field, message]) => message);
      
      toast.error(
        <div className="space-y-2">
          <div className="font-bold text-base">⚠️ Validation Errors</div>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            {errorMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>,
        {
          position: 'top-center',
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            minWidth: '400px',
            borderRadius: '12px'
          }
        }
      );
    }
    
    return Object.keys(errors).length === 0;
  };

  const handleGenerateOffer = async () => {
    if (!validateForm()) {
      return;
    }

    if (!letterhead) {
      toast.warning('Letterhead template is required to generate offer letter.', {
        position: 'top-center'
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const generatingToast = toast.loading('Generating offer letter...');
      
      const response = await axiosInstance.post('/api/industrial-offers/generate', {
        offerData: {
          ...offerData,
          candidateId: 'temp_candidate_id',
          assessmentSessionId: 'temp_assessment_id'
        }
      });
      
      if (response.data.success) {
        setGeneratedOffer(response.data.data);
        setActionMode('preview');
        setActiveStep('preview');
        toast.update(generatingToast, {
          render: 'Offer letter generated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate offer letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!generatedOffer) return;
    
    setActionMode('preview');
    
    try {
      const loadingToast = toast.loading('🔍 Generating preview...', {
        position: 'bottom-right'
      });
      
      const response = await axiosInstance.get(`/api/industrial-offers/${generatedOffer.offerLetterId}/download-url`);
      if (response.data.success) {
        setPreviewUrl(response.data.url);
        toast.update(loadingToast, {
          render: '✅ Preview ready!',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
      }
    } catch (err) {
      toast.error('❌ Failed to generate preview. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000
      });
    }
  };

  const handleDownload = async () => {
    if (!generatedOffer) return;
    
    setActionMode('download');
    
    try {
      const downloadingToast = toast.loading('📄 Preparing download...', {
        position: 'bottom-right'
      });
      
      const response = await axiosInstance.get(`/api/industrial-offers/${generatedOffer.offerLetterId}/download-url`);
      if (response.data.success) {
        window.open(response.data.url, '_blank');
        toast.update(downloadingToast, {
          render: '✅ Download started!',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
      }
    } catch (err) {
      toast.error('❌ Failed to generate download link. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000
      });
    }
  };

  const handleSendEmail = async () => {
    if (!generatedOffer) {
      toast.error('No offer letter generated yet.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }
    
    // Validate all required fields before sending
    const errors = {};
    
    if (!offerData.candidateName?.trim()) {
      errors.candidateName = 'Candidate name';
    }
    if (!offerData.candidateEmail?.trim()) {
      errors.candidateEmail = 'Candidate email';
    } else if (!/\S+@\S+\.\S+/.test(offerData.candidateEmail)) {
      errors.candidateEmail = 'Valid candidate email';
    }
    if (!offerData.position?.trim()) {
      errors.position = 'Position';
    }
    if (!offerData.startDate) {
      errors.startDate = 'Start date';
    }
    if (!offerData.salary || parseFloat(offerData.salary) <= 0) {
      errors.salary = 'Valid salary';
    }
    if (!offerData.hrName?.trim()) {
      errors.hrName = 'HR name';
    }
    if (!offerData.hrEmail?.trim()) {
      errors.hrEmail = 'HR email';
    }
    if (!offerData.companyName?.trim()) {
      errors.companyName = 'Company name';
    }
    
    // If there are validation errors, show professional toast notification
    if (Object.keys(errors).length > 0) {
      const missingFieldsList = Object.values(errors).join(', ');
      toast.error(
        <div className="space-y-2">
          <div className="font-bold text-base">❌ Missing Required Fields</div>
          <div className="text-sm">Please fill in the following before sending:</div>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            {Object.values(errors).map((field, idx) => (
              <li key={idx}>{field}</li>
            ))}
          </ul>
        </div>,
        {
          position: 'top-center',
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            minWidth: '400px',
            borderRadius: '12px'
          }
        }
      );
      setValidationErrors(errors);
      setActiveStep('form'); // Take user back to form to fill missing fields
      return;
    }
    
    setActionMode('send');
    
    try {
      const sendingToast = toast.loading('📧 Sending professional offer letter to candidate and HR...', {
        position: 'top-center',
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        style: {
          minWidth: '350px',
          borderRadius: '12px'
        }
      });
      
      // Real API call to send email
      const response = await axiosInstance.post(`/api/industrial-offers/${generatedOffer.offerLetterId}/send-email`);
      
      if (response.data.success) {
        toast.update(sendingToast, {
          render: (
            <div className="space-y-2">
              <div className="font-bold">✅ Offer Letter Sent Successfully!</div>
              <div className="text-sm">Email delivered to {offerData.candidateEmail}</div>
              <div className="text-xs text-gray-600">HR copy sent to {offerData.hrEmail}</div>
            </div>
          ),
          type: 'success',
          isLoading: false,
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            minWidth: '350px',
            borderRadius: '12px'
          }
        });
        setActionMode(null);
      }
      
    } catch (err) {
      toast.error(
        <div className="space-y-1">
          <div className="font-bold">❌ Failed to Send Email</div>
          <div className="text-sm">{err.response?.data?.error || 'Please try again or contact support.'}</div>
        </div>,
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            minWidth: '350px',
            borderRadius: '12px'
          }
        }
      );
      setActionMode(null);
    }
  };

  const resetForm = () => {
    setOfferData({
      candidateName: '',
      candidateEmail: '',
      candidateAddress: '',
      position: '',
      jobSummary: '',
      department: '',
      startDate: '',
      employmentType: 'Full-time',
      reportingManager: '',
      workLocation: '',
      workingHours: '9:00 AM to 6:00 PM, Monday to Friday',
      salary: '',
      basic: '',
      hra: '',
      allowance: '',
      employerPf: '',
      benefits: '',
      probationPeriod: '3 months',
      noticePeriod: '30 days',
      offerValidUntil: '',
      offerDate: '',
      additionalTerms: '',
      includeNonCompete: false,
      nonCompetePeriod: '12 months',
      includeBond: false,
      bondPeriod: '1 year',
      bondAmount: '₹50,000',
      hrName: '',
      hrTitle: '',
      hrEmail: '',
      hrPhone: '',
      hrContact: '',
      companyName: '',
      companyAddress: ''
    });
    setValidationErrors({});
    setGeneratedOffer(null);
    setPreviewUrl(null);
    setDownloadUrl(null);
    setActiveStep('upload');
  };

  // Input field component
  const InputField = ({ label, field, type = 'text', required = false, placeholder = '', value, onChange, validationError }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all ${
          validationError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      />
      {validationError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {validationError}
        </p>
      )}
    </div>
  );

  // Textarea field component
  const TextAreaField = ({ label, field, required = false, placeholder = '', rows = 3, value, onChange, validationError }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none ${
          validationError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      />
      {validationError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {validationError}
        </p>
      )}
    </div>
  );

  // Select field component
  const SelectField = ({ label, field, required = false, options, value, onChange, validationError }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all ${
          validationError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {validationError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {validationError}
        </p>
      )}
    </div>
  );

  // Checkbox field component
  const CheckboxField = ({ label, field, value, onChange, description }) => (
    <div className="space-y-2">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(field, e.target.checked)}
          className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <div>
          <div className="text-sm font-semibold text-gray-700">{label}</div>
          {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
        </div>
      </label>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        style={{
          zIndex: 9999
        }}
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '14px',
          padding: '16px'
        }}
      />
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FontAwesomeIcon icon={faFilePdf} />
            Industrial-Grade Offer Letter Generator
          </h1>
          <p className="text-blue-100 mt-2">
            Professional offer letter generation with letterhead integration
          </p>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            {['upload', 'form', 'preview', 'download'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep === step 
                    ? 'bg-blue-600 text-white' 
                    : index < ['upload', 'form', 'preview', 'download'].indexOf(activeStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < ['upload', 'form', 'preview', 'download'].indexOf(activeStep) ? (
                    <FontAwesomeIcon icon={faCheckCircle} />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="ml-2 hidden md:block">
                  <div className={`text-sm font-medium ${
                    activeStep === step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </div>
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < ['upload', 'form', 'preview', 'download'].indexOf(activeStep) 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Letterhead Upload */}
          {activeStep === 'upload' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Letterhead</h2>
                <p className="text-gray-600">
                  Upload your company letterhead PDF to be used as the background for offer letters
                </p>
              </div>
              
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-blue-500 text-lg mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Important: Letterhead Display</h4>
                  <p className="text-sm text-blue-700">
                    The uploaded PDF letterhead will only be applied during final PDF generation. It will not be visible in the HTML editor or preview interface. The letterhead will be merged with your offer letter content when you generate the final document.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="max-w-2xl mx-auto">
                  {letterhead ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Letterhead Uploaded</h3>
                      <p className="text-gray-600 mb-4">
                        {letterhead.originalName} ({Math.round(letterhead.fileSize / 1024)} KB)
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => setActiveStep('form')}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                          Continue to Offer Form
                        </button>
                        <button
                          onClick={resetForm}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                        >
                          Upload Different Letterhead
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faUpload} className="text-blue-600 text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Letterhead PDF</h3>
                      <p className="text-gray-600 mb-6">
                        Upload your company letterhead (PDF only, max 2MB)
                      </p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleLetterheadUpload}
                          className="hidden"
                        />
                        <div className="px-6 py-4 bg-white border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-colors">
                          <p className="text-blue-600 font-medium">Click to browse or drag & drop</p>
                          <p className="text-gray-500 text-sm mt-1">PDF files only (max 2MB)</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Offer Form */}
          {activeStep === 'form' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Letter Details</h2>
                <p className="text-gray-600">
                  Fill in the candidate and position details for the offer letter
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Candidate Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                    Candidate Information
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Full Name"
                      field="candidateName"
                      required
                      placeholder="Enter candidate's full name"
                      value={offerData.candidateName}
                      onChange={handleInputChange}
                      validationError={validationErrors.candidateName}
                    />
                    
                    <InputField
                      label="Email Address"
                      field="candidateEmail"
                      type="email"
                      required
                      placeholder="candidate@example.com"
                      value={offerData.candidateEmail}
                      onChange={handleInputChange}
                      validationError={validationErrors.candidateEmail}
                    />
                    
                    <TextAreaField
                      label="Address"
                      field="candidateAddress"
                      placeholder="Complete address with city, state, pincode"
                      rows={3}
                      value={offerData.candidateAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Position Details */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faRocket} className="text-green-500" />
                    Position Details
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Job Title/Position"
                      field="position"
                      required
                      placeholder="e.g., Senior Software Engineer"
                      value={offerData.position}
                      onChange={handleInputChange}
                      validationError={validationErrors.position}
                    />
                    
                    <TextAreaField
                      label="Job Role Summary (Optional)"
                      field="jobSummary"
                      placeholder="Brief 1-line summary of key responsibilities, e.g., 'you will be responsible for developing scalable web applications and mentoring junior developers'"
                      rows={2}
                      value={offerData.jobSummary}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Department"
                      field="department"
                      placeholder="e.g., Engineering, Marketing"
                      value={offerData.department}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Start Date"
                      field="startDate"
                      type="date"
                      required
                      value={offerData.startDate}
                      onChange={handleInputChange}
                      validationError={validationErrors.startDate}
                    />
                    
                    <SelectField
                      label="Employment Type"
                      field="employmentType"
                      options={[
                        { value: 'Full-time', label: 'Full-time' },
                        { value: 'Part-time', label: 'Part-time' },
                        { value: 'Contract', label: 'Contract' },
                        { value: 'Intern', label: 'Intern' }
                      ]}
                      value={offerData.employmentType}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Compensation */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-yellow-500" />
                    Compensation
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Annual Salary (CTC)"
                      field="salary"
                      required
                      placeholder="e.g., 800000"
                      value={offerData.salary}
                      onChange={handleInputChange}
                      validationError={validationErrors.salary}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <InputField
                          label="Basic Salary (Auto-calculated)"
                          field="basic"
                          placeholder="Auto-filled based on CTC"
                          value={offerData.basic}
                          onChange={handleInputChange}
                        />
                        <div className="absolute top-2 right-2 text-blue-500">
                          <FontAwesomeIcon icon={faLock} className="text-xs" title="Auto-calculated from CTC" />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <InputField
                          label="HRA (Auto-calculated)"
                          field="hra"
                          placeholder="Auto-filled based on CTC"
                          value={offerData.hra}
                          onChange={handleInputChange}
                        />
                        <div className="absolute top-2 right-2 text-blue-500">
                          <FontAwesomeIcon icon={faLock} className="text-xs" title="Auto-calculated from CTC" />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <InputField
                          label="Special Allowance (Auto-calculated)"
                          field="allowance"
                          placeholder="Auto-filled based on CTC"
                          value={offerData.allowance}
                          onChange={handleInputChange}
                        />
                        <div className="absolute top-2 right-2 text-blue-500">
                          <FontAwesomeIcon icon={faLock} className="text-xs" title="Auto-calculated from CTC" />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <InputField
                          label="Employer PF Contribution (Auto-calculated)"
                          field="employerPf"
                          placeholder="Auto-filled based on Basic"
                          value={offerData.employerPf}
                          onChange={handleInputChange}
                        />
                        <div className="absolute top-2 right-2 text-blue-500">
                          <FontAwesomeIcon icon={faLock} className="text-xs" title="Auto-calculated from Basic" />
                        </div>
                      </div>
                    </div>
                    
                    <TextAreaField
                      label="Benefits & Perquisites"
                      field="benefits"
                      placeholder="List all benefits and perquisites"
                      rows={3}
                      value={offerData.benefits}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBriefcase} className="text-purple-500" />
                    Employment Details
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Reporting Manager"
                      field="reportingManager"
                      placeholder="Manager's name"
                      value={offerData.reportingManager}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Work Location"
                      field="workLocation"
                      placeholder="e.g., Mumbai, Remote"
                      value={offerData.workLocation}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Working Hours"
                      field="workingHours"
                      placeholder="e.g., 9:00 AM to 6:00 PM, Monday to Friday"
                      value={offerData.workingHours}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Probation Period"
                      field="probationPeriod"
                      placeholder="e.g., 3 months"
                      value={offerData.probationPeriod}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Notice Period"
                      field="noticePeriod"
                      placeholder="e.g., 30 days"
                      value={offerData.noticePeriod}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Offer Valid Until"
                      field="offerValidUntil"
                      type="date"
                      value={offerData.offerValidUntil}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Legal Clauses */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faGavel} className="text-red-500" />
                    Legal Clauses (Optional)
                  </h3>
                  
                  <div className="space-y-4">
                    <CheckboxField
                      label="Include Non-Compete Clause"
                      field="includeNonCompete"
                      value={offerData.includeNonCompete}
                      onChange={handleInputChange}
                      description="Restricts employee from joining competitors after leaving"
                    />
                    
                    {offerData.includeNonCompete && (
                      <InputField
                        label="Non-Compete Period"
                        field="nonCompetePeriod"
                        placeholder="e.g., 12 months, 6 months"
                        value={offerData.nonCompetePeriod}
                        onChange={handleInputChange}
                      />
                    )}
                    
                    <CheckboxField
                      label="Include Service Bond"
                      field="includeBond"
                      value={offerData.includeBond}
                      onChange={handleInputChange}
                      description="Requires minimum service commitment with penalty for early exit"
                    />
                    
                    {offerData.includeBond && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Bond Period"
                          field="bondPeriod"
                          placeholder="e.g., 1 year, 2 years"
                          value={offerData.bondPeriod}
                          onChange={handleInputChange}
                        />
                        
                        <InputField
                          label="Bond Amount"
                          field="bondAmount"
                          placeholder="e.g., ₹50,000"
                          value={offerData.bondAmount}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* HR & Company Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                    HR & Company Information
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="HR Name"
                      field="hrName"
                      required
                      placeholder="Full name (e.g., Sai Kumar)"
                      value={offerData.hrName}
                      onChange={handleInputChange}
                      validationError={validationErrors.hrName}
                    />
                    
                    <InputField
                      label="HR Title"
                      field="hrTitle"
                      placeholder="e.g., HR Manager, Head of HR"
                      value={offerData.hrTitle}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="HR Email"
                      field="hrEmail"
                      type="email"
                      required
                      placeholder="hr@company.com"
                      value={offerData.hrEmail}
                      onChange={handleInputChange}
                      validationError={validationErrors.hrEmail}
                    />
                    
                    <InputField
                      label="HR Phone"
                      field="hrPhone"
                      required
                      placeholder="+91 9876543210"
                      value={offerData.hrPhone}
                      onChange={handleInputChange}
                      validationError={validationErrors.hrPhone}
                    />
                    
                    <InputField
                      label="Company Name"
                      field="companyName"
                      required
                      placeholder="Company name"
                      value={offerData.companyName}
                      onChange={handleInputChange}
                      validationError={validationErrors.companyName}
                    />
                    
                    <TextAreaField
                      label="Company Address"
                      field="companyAddress"
                      placeholder="Complete company address"
                      rows={3}
                      value={offerData.companyAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setActiveStep('upload')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Back to Letterhead
                </button>
                
                <button
                  onClick={handleGenerateOffer}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFilePdf} />
                      Generate Offer Letter
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {activeStep === 'preview' && generatedOffer && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Letter Preview</h2>
                <p className="text-gray-600">
                  Review your offer letter before downloading
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="max-w-4xl mx-auto">
                  {previewUrl ? (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <iframe
                        src={previewUrl}
                        className="w-full h-[600px]"
                        title="Offer Letter Preview"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faEye} className="text-blue-600 text-2xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Preview Your Offer Letter</h3>
                      <p className="text-gray-600 mb-6">
                        Click the button below to generate a preview of your offer letter
                      </p>
                      <button
                        onClick={handlePreview}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                      >
                        Generate Preview
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setActiveStep('form')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Back to Form
                </button>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handlePreview}
                    disabled={actionMode === 'preview'}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    {actionMode === 'preview' ? 'Loading Preview...' : 'Refresh Preview'}
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    disabled={actionMode === 'download'}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    {actionMode === 'download' ? 'Downloading...' : 'Download Offer Letter'}
                  </button>
                  
                  <button
                    onClick={handleSendEmail}
                    disabled={actionMode === 'send'}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    {actionMode === 'send' ? 'Sending...' : 'Send to Candidate'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Download */}
          {activeStep === 'download' && generatedOffer && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Letter Generated</h2>
                <p className="text-gray-600">
                  Your offer letter has been successfully generated
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-4xl" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Offer Letter Ready for Download
                  </h3>
                  
                  <p className="text-gray-600 mb-2">
                    <strong>File:</strong> {generatedOffer.filename}
                  </p>
                  <p className="text-gray-600 mb-8">
                    <strong>Size:</strong> {Math.round(generatedOffer.fileSize / 1024)} KB
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleDownload}
                      className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-3 text-lg"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Download Offer Letter
                    </button>
                    
                    <button
                      onClick={() => setActiveStep('preview')}
                      className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-3 text-lg"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View Preview
                    </button>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      Create Another Offer Letter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustrialOfferLetterGenerator;