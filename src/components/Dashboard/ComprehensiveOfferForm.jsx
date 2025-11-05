import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faPhone, faMapMarkerAlt,
  faRocket, faBuilding, faClock, faCalendarAlt,
  faMoneyBillWave, faUserTie, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

// Stable input field component to prevent re-renders
const InputField = React.memo(({ 
  label, 
  field, 
  type = 'text', 
  icon, 
  required = false, 
  placeholder = '', 
  options = null,
  value,
  onChange,
  validationError
}) => (
  <div className="space-y-2 relative">
    <label 
      htmlFor={`input-${field}`}
      className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer"
    >
      <FontAwesomeIcon icon={icon} className="text-blue-500" />
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {options ? (
      <select
        id={`input-${field}`}
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white ${
          validationError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ) : (
      <input
        id={`input-${field}`}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white ${
          validationError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      />
    )}
    {validationError && (
      <p className="text-red-500 text-sm flex items-center gap-1">
        <FontAwesomeIcon icon={faExclamationTriangle} />
        {validationError}
      </p>
    )}
  </div>
));

// Stable textarea field component to prevent re-renders
const TextAreaField = React.memo(({ 
  label, 
  field, 
  icon, 
  required = false, 
  placeholder = '', 
  rows = 3,
  value,
  onChange,
  validationError
}) => (
  <div className="space-y-2 relative">
    <label 
      htmlFor={`textarea-${field}`}
      className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer"
    >
      <FontAwesomeIcon icon={icon} className="text-blue-500" />
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={`textarea-${field}`}
      value={value || ''}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      rows={rows}
      autoComplete="off"
      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none bg-white ${
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
));

const ComprehensiveOfferForm = ({ offerData, setOfferData, validationErrors }) => {
  // Stable function reference to prevent re-rendering
  const handleInputChange = useCallback((field, value) => {
    setOfferData(prev => ({ ...prev, [field]: value }));
  }, [setOfferData]);

  return (
    <div className="space-y-8">
      {/* Candidate Information Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Candidate Information</h3>
            <p className="text-gray-600 text-sm">Personal details of the candidate</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Candidate Full Name"
            field="candidateName"
            icon={faUser}
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
            icon={faEnvelope}
            required
            placeholder="candidate@email.com"
            value={offerData.candidateEmail}
            onChange={handleInputChange}
            validationError={validationErrors.candidateEmail}
          />
          <InputField
            label="Phone Number"
            field="candidatePhone"
            type="tel"
            icon={faPhone}
            placeholder="+91 XXXXXXXXXX"
            value={offerData.candidatePhone}
            onChange={handleInputChange}
            validationError={validationErrors.candidatePhone}
          />
          <TextAreaField
            label="Address"
            field="candidateAddress"
            icon={faMapMarkerAlt}
            placeholder="Complete address with city, state, pincode"
            rows={2}
            value={offerData.candidateAddress}
            onChange={handleInputChange}
            validationError={validationErrors.candidateAddress}
          />
        </div>
      </div>

      {/* Position Details Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faRocket} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Position Details</h3>
            <p className="text-gray-600 text-sm">Job role and employment information</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Job Title/Position"
            field="position"
            icon={faRocket}
            required
            placeholder="e.g., Senior Software Engineer"
            value={offerData.position}
            onChange={handleInputChange}
            validationError={validationErrors.position}
          />
          <InputField
            label="Department"
            field="department"
            icon={faBuilding}
            required
            placeholder="e.g., Engineering, Marketing"
            value={offerData.department}
            onChange={handleInputChange}
            validationError={validationErrors.department}
          />
          <InputField
            label="Employment Type"
            field="employmentType"
            icon={faClock}
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' }
            ]}
            value={offerData.employmentType}
            onChange={handleInputChange}
            validationError={validationErrors.employmentType}
          />
          <InputField
            label="Reporting Manager"
            field="reportingManager"
            icon={faUserTie}
            placeholder="Manager's name and designation"
            value={offerData.reportingManager}
            onChange={handleInputChange}
            validationError={validationErrors.reportingManager}
          />
          <InputField
            label="Work Location"
            field="workLocation"
            icon={faMapMarkerAlt}
            options={[
              { value: 'Office', label: 'Office' },
              { value: 'Remote', label: 'Remote' },
              { value: 'Hybrid', label: 'Hybrid' }
            ]}
            value={offerData.workLocation}
            onChange={handleInputChange}
            validationError={validationErrors.workLocation}
          />
          <InputField
            label="Working Hours"
            field="workingHours"
            icon={faClock}
            placeholder="e.g., 9 AM to 6 PM"
            value={offerData.workingHours}
            onChange={handleInputChange}
            validationError={validationErrors.workingHours}
          />
        </div>
      </div>

      {/* Salary & Benefits Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Salary & Benefits</h3>
            <p className="text-gray-600 text-sm">Compensation and benefits package</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Annual Salary"
            field="salary"
            type="number"
            icon={faMoneyBillWave}
            required
            placeholder="e.g., 800000"
            value={offerData.salary}
            onChange={handleInputChange}
            validationError={validationErrors.salary}
          />
          <InputField
            label="Currency"
            field="currency"
            icon={faMoneyBillWave}
            options={[
              { value: 'INR', label: 'INR (₹)' },
              { value: 'USD', label: 'USD ($)' },
              { value: 'EUR', label: 'EUR (€)' }
            ]}
            value={offerData.currency}
            onChange={handleInputChange}
            validationError={validationErrors.currency}
          />
          <InputField
            label="Salary Frequency"
            field="salaryFrequency"
            icon={faCalendarAlt}
            options={[
              { value: 'per annum', label: 'Per Annum' },
              { value: 'per month', label: 'Per Month' },
              { value: 'per hour', label: 'Per Hour' }
            ]}
            value={offerData.salaryFrequency}
            onChange={handleInputChange}
            validationError={validationErrors.salaryFrequency}
          />
        </div>
        
        <div className="mt-6">
          <TextAreaField
            label="Benefits & Perks"
            field="benefits"
            icon={faRocket}
            placeholder="Health insurance, PF, gratuity, flexible hours, etc."
            rows={3}
            value={offerData.benefits}
            onChange={handleInputChange}
            validationError={validationErrors.benefits}
          />
        </div>
      </div>

      {/* Dates & Terms Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Important Dates & Terms</h3>
            <p className="text-gray-600 text-sm">Employment dates and conditions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Start Date"
            field="startDate"
            type="date"
            icon={faCalendarAlt}
            required
            value={offerData.startDate}
            onChange={handleInputChange}
            validationError={validationErrors.startDate}
          />
          <InputField
            label="End Date (if contract)"
            field="endDate"
            type="date"
            icon={faCalendarAlt}
            value={offerData.endDate}
            onChange={handleInputChange}
            validationError={validationErrors.endDate}
          />
          <InputField
            label="Probation Period"
            field="probationPeriod"
            icon={faClock}
            placeholder="e.g., 3 months"
            value={offerData.probationPeriod}
            onChange={handleInputChange}
            validationError={validationErrors.probationPeriod}
          />
          <InputField
            label="Notice Period"
            field="noticePeriod"
            icon={faClock}
            placeholder="e.g., 30 days"
            value={offerData.noticePeriod}
            onChange={handleInputChange}
            validationError={validationErrors.noticePeriod}
          />
          <InputField
            label="Working Days"
            field="workingDays"
            icon={faCalendarAlt}
            placeholder="e.g., Monday to Friday"
            value={offerData.workingDays}
            onChange={handleInputChange}
            validationError={validationErrors.workingDays}
          />
          <InputField
            label="Interview Date"
            field="interviewDate"
            type="date"
            icon={faCalendarAlt}
            value={offerData.interviewDate}
            onChange={handleInputChange}
            validationError={validationErrors.interviewDate}
          />
        </div>
      </div>

      {/* Company Information Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faBuilding} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Company Information</h3>
            <p className="text-gray-600 text-sm">Organization details and contact information</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Company Name"
            field="companyName"
            icon={faBuilding}
            required
            placeholder="e.g., Cognibotz"
            value={offerData.companyName}
            onChange={handleInputChange}
            validationError={validationErrors.companyName}
          />
          <InputField
            label="Company Website"
            field="companyWebsite"
            type="url"
            icon={faBuilding}
            placeholder="https://company.com"
            value={offerData.companyWebsite}
            onChange={handleInputChange}
            validationError={validationErrors.companyWebsite}
          />
          <InputField
            label="Company Phone"
            field="companyPhone"
            type="tel"
            icon={faPhone}
            placeholder="+91 XXXXXXXXXX"
            value={offerData.companyPhone}
            onChange={handleInputChange}
            validationError={validationErrors.companyPhone}
          />
          <InputField
            label="Company Email"
            field="companyEmail"
            type="email"
            icon={faEnvelope}
            placeholder="contact@company.com"
            value={offerData.companyEmail}
            onChange={handleInputChange}
            validationError={validationErrors.companyEmail}
          />
        </div>
        
        <div className="mt-6">
          <TextAreaField
            label="Company Address"
            field="companyAddress"
            icon={faMapMarkerAlt}
            required
            placeholder="Complete company address with city, state, pincode"
            rows={2}
            value={offerData.companyAddress}
            onChange={handleInputChange}
            validationError={validationErrors.companyAddress}
          />
        </div>
      </div>

      {/* HR Information Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faUserTie} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">HR Contact Information</h3>
            <p className="text-gray-600 text-sm">HR representative details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="HR Name"
            field="hrName"
            icon={faUserTie}
            required
            placeholder="HR representative name"
            value={offerData.hrName}
            onChange={handleInputChange}
            validationError={validationErrors.hrName}
          />
          <InputField
            label="HR Title"
            field="hrTitle"
            icon={faUserTie}
            placeholder="e.g., HR Manager"
            value={offerData.hrTitle}
            onChange={handleInputChange}
            validationError={validationErrors.hrTitle}
          />
          <InputField
            label="HR Email"
            field="hrEmail"
            type="email"
            icon={faEnvelope}
            required
            placeholder="hr@company.com"
            value={offerData.hrEmail}
            onChange={handleInputChange}
            validationError={validationErrors.hrEmail}
          />
          <InputField
            label="HR Phone"
            field="hrPhone"
            type="tel"
            icon={faPhone}
            placeholder="+91 XXXXXXXXXX"
            value={offerData.hrPhone}
            onChange={handleInputChange}
            validationError={validationErrors.hrPhone}
          />
        </div>
      </div>

      {/* Additional Terms Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faRocket} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Additional Terms & Conditions</h3>
            <p className="text-gray-600 text-sm">Special conditions and additional information</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <TextAreaField
            label="Additional Terms"
            field="additionalTerms"
            icon={faRocket}
            placeholder="Any additional terms and conditions..."
            rows={3}
            value={offerData.additionalTerms}
            onChange={handleInputChange}
            validationError={validationErrors.additionalTerms}
          />
          <TextAreaField
            label="Special Conditions"
            field="specialConditions"
            icon={faRocket}
            placeholder="Special conditions or requirements..."
            rows={3}
            value={offerData.specialConditions}
            onChange={handleInputChange}
            validationError={validationErrors.specialConditions}
          />
          <TextAreaField
            label="Interview Feedback"
            field="interviewFeedback"
            icon={faUserTie}
            placeholder="Summary of interview performance..."
            rows={3}
            value={offerData.interviewFeedback}
            onChange={handleInputChange}
            validationError={validationErrors.interviewFeedback}
          />
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveOfferForm;
