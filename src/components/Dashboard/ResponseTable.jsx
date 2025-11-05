import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ResponseTable.css';
import {
  faMagnifyingGlass, faRotateRight, faFileAlt, faVideo,
  faChevronDown, faChevronUp, faStar, faDownload, faEye,
  faTools, faUserTie, faGraduationCap, faBuilding, faBriefcase,
  faIdBadge, faCalendarAlt, faFilePdf, faTimes, faSpinner, faPlayCircle,
  faHandshake, faDesktop, faMicrophone, faMobile, faEnvelope, faShieldAlt,
  faCheckCircle, faExclamationTriangle, faChartLine, faLightbulb,
  faUserClock, faClipboardList, faChartBar, faCircle,faCheck 
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";

// Import custom UI components
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";

import { axiosInstance } from "../../axiosUtils";
import { useMediaOperations } from "../../hooks/useMediaOperations";
import TopNotificationModal from "./TopNotificationModal";
import { debouncedToast } from "../../utils/toastUtils";


function ResponseTable({ data, duplicateCount }) {
  const [showTopModal, setShowTopModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [expandedLists, setExpandedLists] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [], designation: [], degree: [], company_names: [], jobType: [], job_title: [],
  });
  const [showModal, setShowModal] = useState({});
  const [allSelected, setAllSelected] = useState({});
  
  // 🔥 NEW: Bulk selection state for candidate resumes
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const [isAllCandidatesSelected, setIsAllCandidatesSelected] = useState(false);
  const [bulkDownloadInProgress, setBulkDownloadInProgress] = useState(false);

  // Use the shared media operations hook
  const { mediaOperations, viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey } = useMediaOperations();
  
  // Add state for dropdowns
  const [openResumeDropdown, setOpenResumeDropdown] = useState(null);
  const [openInterviewDropdown, setOpenInterviewDropdown] = useState(null);
  
  // Refs for dropdown containers
  const resumeDropdownRefs = useRef({});
  const interviewDropdownRefs = useRef({});

  const location = useLocation();
  const fromUpload = location.state?.fromUpload || false;
  const navigate = useNavigate();

  const filterIcons = {
    skills: faTools,
    designation: faUserTie,
    degree: faGraduationCap,
    company_names: faBuilding,
    jobType: faBriefcase,
    job_title: faIdBadge,
  };

  // Handle duplicate count notification and success modal
  useEffect(() => {
    if (duplicateCount > 0) {
      setModalMessage(
        `We detected ${duplicateCount} duplicate profile${duplicateCount > 1 ? "s" : ""}. Check the Candidate History section.`
      );
      setShowTopModal(true);
    }
    setShowSuccessModal(fromUpload);
  }, [duplicateCount, fromUpload]);

  // Process and sort data
  useEffect(() => {
    let inputData = [];
    if (data) {
      // Handle segmented data (recent/history), POST Response, array, or single response
      if (data.recent || data.history) {
        inputData = [...(data.recent || []), ...(data.history || [])];
      } else if (data["POST Response"]) {
        inputData = data["POST Response"];
      } else if (Array.isArray(data)) {
        inputData = data;
      } else {
        inputData = [data];
      }
    }

    const sortedData = inputData
      .map((result) => {
        const matchingResult = result["Resume Data"] || result.matchingResult?.[0]?.["Resume Data"] || result;
        const analysis = result.matchingResult?.[0]?.Analysis || result.Analysis || {};
        const matchingPercentage = result["Matching Percentage"] || result.matchingResult?.[0]?.["Matching Percentage"] || analysis["Matching Score"] || 0;
        // Debug logging - uncomment to see data structure
        // console.log('Processing result:', { result, matchingResult, analysis });
        
        // More robust extraction of new fields from various possible locations
        const experienceThresholdCompliance = 
          analysis["Experience Threshold Compliance"] || 
          result["Experience Threshold Compliance"] || 
          result.matchingResult?.[0]?.["Experience Threshold Compliance"] ||
          "N/A";
          
        const recentExperienceRelevance = 
          analysis["Recent Experience Relevance"] || 
          result["Recent Experience Relevance"] || 
          result.matchingResult?.[0]?.["Recent Experience Relevance"] ||
          "N/A";
          
        const analysisSummary = 
          result["Analysis Summary"] || 
          analysis["Analysis Summary"] || 
          analysis["analysisSummary"] || 
          result.analysisSummary ||
          result.matchingResult?.[0]?.["Analysis Summary"] ||
          "N/A";
        
        return { 
          ...result, 
          matchingResult, 
          matchingPercentage,
          Analysis: {
            "Matching Score": analysis["Matching Score"] || 0,
            "Matched Skills": analysis["Matched Skills"] || [],
            "Unmatched Skills": analysis["Unmatched Skills"] || [],
            "Matched Skills Percentage": analysis["Matched Skills Percentage"] || 0,
            "Unmatched Skills Percentage": analysis["Unmatched Skills Percentage"] || 0,
            "Strengths": analysis.Strengths || [],
            "Recommendations": analysis.Recommendations || [],
            "Required Industrial Experience": analysis["Required Industrial Experience"] || "N/A",
            "Candidate Industrial Experience": analysis["Candidate Industrial Experience"] || "N/A",
            "Required Domain Experience": analysis["Required Domain Experience"] || "N/A",
            "Candidate Domain Experience": analysis["Candidate Domain Experience"] || "N/A",
            // New fields - comprehensive extraction to handle different API response formats
            "Experience Threshold Compliance": experienceThresholdCompliance,
            "Recent Experience Relevance": recentExperienceRelevance,
            "Analysis Summary": analysisSummary
          }
        };
      })
      .sort((a, b) => b.matchingPercentage - a.matchingPercentage);
    setMembers(sortedData);
    setFilteredMembers(sortedData);
  }, [data]);

  const toggleModal = (filter) => {
    setShowModal((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleFilterChange = (filterCategory, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterCategory]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = members;

    if (selectedFilters.jobType.length) {
      filtered = filtered.filter((member) => {
        const experienceYears = parseFloat(member.matchingResult?.experience || member.matchingResult?.total_experience || 0);
        const isFresher = selectedFilters.jobType.includes("Fresher") && experienceYears === 0;
        const isExperienced = selectedFilters.jobType.includes("Experienced") && experienceYears > 0;
        return isFresher || isExperienced;
      });
    }

    if (selectedFilters.skills.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.skills.every((skill) =>
          member.matchingResult?.skills?.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
        )
      );
    }

    if (selectedFilters.degree.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.degree.every((degree) =>
          (Array.isArray(member.matchingResult?.degree)
            ? member.matchingResult?.degree
            : [member.matchingResult?.degree]
          )?.map((d) => d?.toLowerCase()).includes(degree.toLowerCase())
        )
      );
    }

    if (selectedFilters.company_names.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.company_names.every((company) =>
          member.matchingResult?.company_names?.map((c) => c.toLowerCase()).includes(company.toLowerCase())
        )
      );
    }

    if (selectedFilters.designation.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.designation.every((designation) =>
          (Array.isArray(member.matchingResult?.designation)
            ? member.matchingResult?.designation
            : [member.matchingResult?.designation]
          )?.map((d) => d?.toLowerCase()).includes(designation.toLowerCase())
        )
      );
    }

    if (selectedFilters.job_title.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.job_title.some((jobTitle) =>
          member.matchingResult?.["Job Title"]?.toLowerCase().includes(jobTitle.toLowerCase())
        )
      );
    }

    setFilteredMembers(filtered);
  };

  const extractUniqueValues = (key) => {
    if (key === "jobType") return ["Fresher", "Experienced"];
    if (key === "job_title") {
      return [...new Set(members.map((member) => member.matchingResult?.["Job Title"]).filter(Boolean))];
    }
    return [...new Set(members.flatMap((member) => 
      Array.isArray(member.matchingResult?.[key]) 
        ? member.matchingResult?.[key] 
        : [member.matchingResult?.[key]]
    ).filter(Boolean))];
  };

  const resetFilters = (filterCategory) => {
    handleFilterChange(filterCategory, []);
    setAllSelected((prev) => ({ ...prev, [filterCategory]: false }));
  };

  const resetAllFilters = () => {
    setSelectedFilters({
      skills: [], designation: [], degree: [], company_names: [], jobType: [], job_title: [],
    });
    setAllSelected({});
    setFilteredMembers(members);
    // Clear bulk selection when filters change
    setSelectedCandidates(new Set());
    setIsAllCandidatesSelected(false);
  };

  const toggleExpand = (index, type) => {
    setExpandedLists((prev) => ({
      ...prev,
      [`${index}-${type}`]: !prev[`${index}-${type}`],
    }));
  };

  const renderListWithExpand = useMemo(() => (items, index, type, maxItems = 3) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <span className="text-gray-500 text-xs">None</span>;
    }
    const isExpanded = expandedLists[`${index}-${type}`];
    const visibleItems = isExpanded ? items : items.slice(0, maxItems);

    return (
      <div className="list-container-custom" aria-describedby={`${type}-${index}`}>
        <ul className="list-none pl-0 space-y-1">
          {visibleItems.map((item, i) => (
            <li key={i} className="text-xs flex items-start gap-1">
              <span className="text-gray-400 mt-1">•</span>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
        {items.length > maxItems && (
          <span
            className="text-blue-600 cursor-pointer hover:text-blue-800 text-xs inline-block mt-1"
            onClick={() => toggleExpand(index, type)}
            role="button"
            aria-label={isExpanded ? `Collapse ${type} list` : `Expand ${type} list`}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </span>
        )}
      </div>
    );
  }, [expandedLists]);

  const handleResumeLink = async (resumeId) => {
    try {
      if (!resumeId) throw new Error("No resume ID");
      const response = await axiosInstance.get(`/api/resumes/${resumeId}`);
      return response.data?.url || "#";
    } catch (error) {
      console.error("Error getting resume URL:", error);
      toast.error("Failed to fetch resume URL");
      return "#";
    }
  };

  const handleReportLink = async (assessmentSessionId) => {
    try {
      if (!assessmentSessionId) throw new Error("No assessment session ID");
      const response = await axiosInstance.get(`/api/reports/${assessmentSessionId}`);
      return response.data?.url || "#";
    } catch (error) {
      console.error("Error getting report URL:", error);
      toast.error("Failed to fetch report URL");
      return "#";
    }
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // 🔥 NEW: Bulk selection handlers
  const handleCandidateSelection = (candidateIndex, isSelected) => {
    const newSelected = new Set(selectedCandidates);
    if (isSelected) {
      newSelected.add(candidateIndex);
    } else {
      newSelected.delete(candidateIndex);
    }
    setSelectedCandidates(newSelected);
    
    // Update "Select All" state
    setIsAllCandidatesSelected(newSelected.size === filteredMembers.length && filteredMembers.length > 0);
  };

  const handleSelectAllCandidates = (isSelected) => {
    if (isSelected) {
      const allIndices = new Set(filteredMembers.map((_, index) => index));
      setSelectedCandidates(allIndices);
      setIsAllCandidatesSelected(true);
    } else {
      setSelectedCandidates(new Set());
      setIsAllCandidatesSelected(false);
    }
  };

  const clearAllSelections = () => {
    setSelectedCandidates(new Set());
    setIsAllCandidatesSelected(false);
  };

  // 🔥 NEW: Bulk download functionality
  const handleBulkResumeDownload = async () => {
    if (selectedCandidates.size === 0) {
      debouncedToast.warning('⚠️ Please select candidates to download resumes', 'bulk-download-warning');
      return;
    }

    setBulkDownloadInProgress(true);
    const loadingToast = debouncedToast.loading(`📦 Preparing to download ${selectedCandidates.size} resumes...`);
    
    try {
      console.log('🔥 [BULK DOWNLOAD] Starting bulk resume download:', {
        selectedCount: selectedCandidates.size,
        timestamp: new Date().toISOString()
      });

      const selectedCandidateData = Array.from(selectedCandidates).map(index => {
        const candidate = filteredMembers[index];
        return {
          index,
          name: candidate.matchingResult?.name || candidate.name || `Candidate_${index + 1}`,
          email: candidate.matchingResult?.email || candidate.email,
          resumeId: candidate.resumeId?._id || candidate.resumeId || candidate.Id || candidate._id,
          matchingPercentage: candidate.matchingPercentage || 0
        };
      });

      console.log('📊 [BULK DOWNLOAD] Selected candidates:', selectedCandidateData);

      // Collect resume IDs for bulk download
      const resumeIds = selectedCandidateData
        .map(candidate => candidate.resumeId)
        .filter(Boolean);

      if (resumeIds.length === 0) {
        throw new Error('No valid resume IDs found for selected candidates');
      }

      console.log('📋 [BULK DOWNLOAD] Resume IDs to download:', resumeIds);

      // Call backend bulk download endpoint
      const response = await axiosInstance.post('/api/resumes/bulk-download', {
        resumeIds: resumeIds,
        candidates: selectedCandidateData
      });

      debouncedToast.dismiss(loadingToast);

      if (response.data.success) {
        const { downloadUrl, summary } = response.data;
        
        // Start the bulk download
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = `bulk_resumes_${new Date().toISOString().split('T')[0]}.zip`;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        debouncedToast.success(
          `📥 Downloaded ${summary.successful}/${summary.total} resumes successfully!`,
          'bulk-download-success'
        );

        console.log('✅ [BULK DOWNLOAD] Bulk download completed:', summary);
        
        // Clear selections after successful download
        clearAllSelections();
      } else {
        throw new Error(response.data.error || 'Bulk download failed');
      }
    } catch (error) {
      debouncedToast.dismiss(loadingToast);
      console.error('❌ [BULK DOWNLOAD] Error:', error);
      
      let errorMessage = 'Failed to download resumes';
      if (error.message.includes('No valid resume IDs')) {
        errorMessage = 'No valid resumes found for selected candidates';
      } else if (error.response?.status === 404) {
        errorMessage = 'Some resumes are no longer available';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied to download resumes';
      }
      
      debouncedToast.error(`❌ ${errorMessage}`, 'bulk-download-error');
    } finally {
      setBulkDownloadInProgress(false);
    }
  };

  // Update filtered members effect to clear selections
  useEffect(() => {
    setSelectedCandidates(new Set());
    setIsAllCandidatesSelected(false);
  }, [filteredMembers]);

  // STATE REFACTOR: Only one resume and one interview dropdown open at a time
  // Ensure dropdowns are triggered/cancelled ONLY on click or outside click, never hover/leave
  useEffect(() => {
    const handleClickOutside = (event) => {
      const inResume = openResumeDropdown &&
        resumeDropdownRefs.current[openResumeDropdown] &&
        resumeDropdownRefs.current[openResumeDropdown].contains(event.target);
      const inInterview = openInterviewDropdown &&
        interviewDropdownRefs.current[openInterviewDropdown] &&
        interviewDropdownRefs.current[openInterviewDropdown].contains(event.target);
      if (!inResume) setOpenResumeDropdown(null);
      if (!inInterview) setOpenInterviewDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openResumeDropdown, openInterviewDropdown]);

  // Add this function to render media actions if available
  const renderMediaActions = (assessmentSession, index) => {
    if (!assessmentSession || !assessmentSession.recordings) return null;
    
    const { recordings } = assessmentSession;
    const hasVideo = recordings.videoPath;
    const hasScreen = recordings.screenPath;
    const hasAudio = assessmentSession.voiceAnswers && assessmentSession.voiceAnswers.length > 0;
    
    if (!hasVideo && !hasScreen && !hasAudio) return null;
    
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <h6 className="text-md font-semibold text-gray-900">
            Media Recordings
          </h6>
          <span className="badge badge-info text-xs px-2 py-0.5">
            Media Files
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
          {hasVideo && (
            <div className="recording-card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-md">
              <div className="p-2">
                <div className="recording-card-header">
                  <div className="recording-card-icon bg-blue-100 w-7 h-7 rounded-md">
                    <FontAwesomeIcon icon={faVideo} className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <h3 className="recording-card-title text-sm">Video</h3>
                    <p className="recording-card-subtitle text-xs">Face Camera</p>
                  </div>
                </div>
                <div className="recording-card-actions gap-1">
                  <button
                    className="recording-btn bg-blue-500 hover:bg-blue-600 text-white text-xs py-1"
                    onClick={() => viewVideo('video', recordings.videoPath)}
                    disabled={mediaOperations.video?.viewing}
                  >
                    {mediaOperations.video?.viewing ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin size="xs" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faEye} size="xs" />
                        View
                      </>
                    )}
                  </button>
                  <button
                    className="recording-btn bg-green-500 hover:bg-green-600 text-white text-xs py-1"
                    onClick={() => downloadVideo('video', recordings.videoPath)}
                    disabled={mediaOperations.video?.downloading}
                  >
                    {mediaOperations.video?.downloading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin size="xs" />
                        ...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faDownload} size="xs" />
                        DL
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        
          {hasScreen && (
            <div className="recording-card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-md">
              <div className="p-2">
                <div className="recording-card-header">
                  <div className="recording-card-icon bg-purple-100 w-7 h-7 rounded-md">
                    <FontAwesomeIcon icon={faDesktop} className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <h3 className="recording-card-title text-sm">Screen</h3>
                    <p className="recording-card-subtitle text-xs">Screen Share</p>
                  </div>
                </div>
                <div className="recording-card-actions gap-1">
                  <button
                    className="recording-btn bg-blue-500 hover:bg-blue-600 text-white text-xs py-1"
                    onClick={() => viewVideo('screen', recordings.screenPath)}
                    disabled={mediaOperations.screen?.viewing}
                  >
                    {mediaOperations.screen?.viewing ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin size="xs" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faEye} size="xs" />
                        View
                      </>
                    )}
                  </button>
                  <button
                    className="recording-btn bg-green-500 hover:bg-green-600 text-white text-xs py-1"
                    onClick={() => downloadVideo('screen', recordings.screenPath)}
                    disabled={mediaOperations.screen?.downloading}
                  >
                    {mediaOperations.screen?.downloading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin size="xs" />
                        ...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faDownload} size="xs" />
                        DL
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        
          {hasAudio && assessmentSession.voiceAnswers.map((answer, audioIndex) => (
            answer.audioPath && (
              <div key={audioIndex} className="recording-card bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-md">
                <div className="p-2">
                  <div className="recording-card-header">
                    <div className="recording-card-icon bg-green-100 w-7 h-7 rounded-md">
                      <FontAwesomeIcon icon={faMicrophone} className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <h3 className="recording-card-title text-sm">Audio</h3>
                      <p className="recording-card-subtitle text-xs">Voice Recording</p>
                    </div>
                  </div>
                  <div className="recording-card-actions gap-1">
                    <button
                      className="recording-btn bg-blue-500 hover:bg-blue-600 text-white text-xs py-1"
                      onClick={() => viewAudio(answer.audioPath, `${index}-${audioIndex}`)}
                      disabled={mediaOperations.audio[`${index}-${audioIndex}`]?.viewing}
                    >
                      {mediaOperations.audio[`${index}-${audioIndex}`]?.viewing ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin size="xs" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faEye} size="xs" />
                          View
                        </>
                      )}
                    </button>
                    <button
                      className="recording-btn bg-green-500 hover:bg-green-600 text-white text-xs py-1"
                      onClick={() => downloadAudio(answer.audioPath, `${index}-${audioIndex}`)}
                      disabled={mediaOperations.audio[`${index}-${audioIndex}`]?.downloading}
                    >
                      {mediaOperations.audio[`${index}-${audioIndex}`]?.downloading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin size="xs" />
                          ...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faDownload} size="xs" />
                          DL
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    // Updated container to match CandidateTable styling
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <motion.div 
        className="container-modern"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Updated filter section to match CandidateTable */}
        <motion.div 
          className="card-glass mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-3 items-center justify-center p-6">
            {Object.keys(filterIcons).map((filter) => (
              <motion.button
                key={filter}
                className="btn-modern bg-white/80 hover:bg-white text-gray-700 border-gray-200 flex items-center gap-2 px-4 py-2"
                onClick={() => toggleModal(filter)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <FontAwesomeIcon icon={filterIcons[filter]} className="text-primary-600" />
                <span className="font-medium">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
              </motion.button>
            ))}
            <motion.button
              className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2 px-4 py-2"
              onClick={resetAllFilters}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faRotateRight} /> 
              <span className="font-medium">Reset All</span>
            </motion.button>
            <motion.button
              className="btn-primary flex items-center gap-2 px-6 py-2"
              onClick={applyFilters}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <span className="font-medium">Search</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Updated filter modals */}
        <AnimatePresence>
          {Object.keys(filterIcons).map((filter) => 
            showModal[filter] && (
              <motion.div
                key={filter}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => toggleModal(filter)}
              >
                <motion.div
                  className="card-glass max-w-md w-full p-6"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-gradient rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={filterIcons[filter]} className="text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </h3>
                    </div>
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                      onClick={() => toggleModal(filter)}
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="max-h-64 overflow-y-auto custom-scrollbar mb-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                          checked={allSelected[filter] || false}
                          onChange={(e) => {
                            const isSelected = e.target.checked;
                            const allValues = extractUniqueValues(filter);
                            setAllSelected((prev) => ({ ...prev, [filter]: isSelected }));
                            handleFilterChange(filter, isSelected ? allValues : []);
                          }}
                          id={`select-all-${filter}`}
                          aria-label={`Select all ${filter} options`}
                        />
                        <span className="font-semibold text-gray-900">Select All</span>
                      </label>
                      
                      <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                        {extractUniqueValues(filter).map((value, idx) => (
                          <label key={idx} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              checked={selectedFilters[filter]?.includes(value) || false}
                              onChange={(e) => {
                                const selected = e.target.checked
                                  ? [...(selectedFilters[filter] || []), value]
                                  : selectedFilters[filter].filter((v) => v !== value);
                                handleFilterChange(filter, selected);
                              }}
                              id={`${filter}-${idx}`}
                              aria-label={`Select ${value} for ${filter}`}
                            />
                            <span className="text-gray-700">{value}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end gap-3 border-t pt-4">
                    <button
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => resetFilters(filter)}
                    >
                      Clear
                    </button>
                    <button
                      className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => {
                        applyFilters();
                        toggleModal(filter);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSuccessModal(false)}
              />
              
              {/* Modal */}
              <motion.div
                className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <FontAwesomeIcon icon={faStar} className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-900 text-center">Upload Successful 🎉</h2>
                  <p className="mb-4 text-gray-700">
                    Your candidates were processed successfully.
                    <strong> Go to the "Candidates" section</strong> to assign assessments or take further action.
                  </p>
                  <div className="mb-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faMagnifyingGlass} className="mt-1 text-primary-600" />
                      <span>
                        You can also explore <strong>Recommended Profiles</strong> — AI-curated candidates that best match your job description.
                      </span>
                    </p>
                    <button
                      className="mt-2 ml-6 text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                      onClick={() => {
                        setShowSuccessModal(false);
                        navigate("/dashboard/candidates", { state: { view: "recommended" } });
                      }}
                      aria-label="Go to Recommended Profiles"
                    >
                      Go to Recommended Profiles
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                  <button
                    className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowSuccessModal(false)}
                    aria-label="Close success modal"
                  >
                    Got it
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Top Notification Modal */}
        {showTopModal && (
          <TopNotificationModal
            message={modalMessage}
            onClose={() => setShowTopModal(false)}
            onViewHistory={() => navigate("/dashboard/candidate-history")}
          />
        )}

        {/* Updated table container */}
        <motion.div 
          className="card-glass overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* 🔥 NEW: Bulk Action Panel */}
          <AnimatePresence>
            {selectedCandidates.size > 0 && (
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 border-b"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {selectedCandidates.size} candidate{selectedCandidates.size !== 1 ? 's' : ''} selected
                      </span>
                      <div className="w-px h-4 bg-white/30"></div>
                      <span className="text-xs opacity-90">
                        Ready for bulk download
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={handleBulkResumeDownload}
                      disabled={bulkDownloadInProgress}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {bulkDownloadInProgress ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                          Download {selectedCandidates.size} Resume{selectedCandidates.size !== 1 ? 's' : ''}
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      onClick={clearAllSelections}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title="Clear all selections"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                      Clear
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full min-w-max">
              <thead className="bg-primary-gradient sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm w-12">
                    {/* 🔥 NEW: Select All checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 bg-white"
                        checked={isAllCandidatesSelected}
                        onChange={(e) => handleSelectAllCandidates(e.target.checked)}
                        title="Select all candidates"
                        aria-label="Select all candidates for bulk download"
                      />
                      {selectedCandidates.size > 0 && (
                        <motion.div
                          className="flex items-center gap-2 ml-2"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <span className="text-xs font-medium text-white bg-white/20 px-2 py-1 rounded">
                            {selectedCandidates.size}
                          </span>
                          <button
                            onClick={handleBulkResumeDownload}
                            disabled={bulkDownloadInProgress}
                            className="text-white hover:text-yellow-200 transition-colors duration-200 disabled:opacity-50"
                            title={`Download ${selectedCandidates.size} resumes`}
                            aria-label={`Download ${selectedCandidates.size} selected resumes`}
                          >
                            {bulkDownloadInProgress ? (
                              <FontAwesomeIcon icon={faSpinner} spin className="h-4 w-4" />
                            ) : (
                              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={clearAllSelections}
                            className="text-white hover:text-red-200 transition-colors duration-200"
                            title="Clear all selections"
                            aria-label="Clear all selections"
                          >
                            <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Candidate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Match</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((result, index) => {
                  const resumeData = result.matchingResult || result;
                  const analysis = result.Analysis || {};
                  // Debug logging - uncomment to see what's happening
                  // console.log('Rendering result:', { 
                  //   index, 
                  //   resultId: result._id, 
                  //   hasAnalysis: !!result.Analysis, 
                  //   analysisKeys: Object.keys(result.Analysis || {}), 
                  //   analysisSummary: analysis["Analysis Summary"] 
                  // });
                  const testScore = result.testScore || {};
                  const assessmentSession = result.assessmentSession || {};
                  const dropdownKey = result._id || result.resumeId || result.Id || index;
                  return (
                    <React.Fragment key={index}>
                      <motion.tr 
                        className={`hover:bg-gray-50 transition-all duration-200 ${
                          expandedRow === index ? "bg-blue-50" : ""
                        } ${
                          selectedCandidates.has(index) ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm" : ""
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -1 }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
                          {/* 🔥 NEW: Individual selection checkbox */}
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                              checked={selectedCandidates.has(index)}
                              onChange={(e) => handleCandidateSelection(index, e.target.checked)}
                              title={`Select ${resumeData.name || 'candidate'} for bulk download`}
                              aria-label={`Select ${resumeData.name || 'candidate'} for bulk download`}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {(resumeData.name || "N")[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 truncate max-w-[120px] md:max-w-none">{resumeData.name || "N/A"}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">{resumeData.email || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 md:px-6 md:py-4">
                          <div className="truncate max-w-[100px] md:max-w-none">{resumeData["Job Title"] || "N/A"}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 md:px-6 md:py-4">
                          <div className="truncate max-w-[80px] md:max-w-none">{resumeData.experience || resumeData.total_experience || "0"} years</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-[60px]">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${resumeData["Matching Percentage"] || analysis["Matching Score"] || 0}%` }}
                                  role="progressbar"
                                  aria-valuenow={resumeData["Matching Percentage"] || analysis["Matching Score"] || 0}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 min-w-[3rem]">
                              {resumeData["Matching Percentage"] || analysis["Matching Score"] || 0}%
                            </span>
                          </div>
                          {result.candidateConsent?.allowedToShare && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                              Shared
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
                          <div className="flex space-x-2">
                            {/* Resume Dropdown Column */}
                            <div className="candidate-table-dropdown" ref={el => resumeDropdownRefs.current[dropdownKey] = el}>
                              <button
                                type="button"
                                className="btn-modern bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200 p-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  console.log('Dropdown trigger for candidate:', { dropdownKey, result });
                                  setOpenResumeDropdown(prev => prev === dropdownKey ? null : dropdownKey);
                                }}>
                                <FontAwesomeIcon icon={faFileAlt} />
                              </button>
                              {openResumeDropdown === dropdownKey && (
                                <div className="candidate-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={async e => {
                                      e.stopPropagation();
                                      const url = await handleResumeLink(result.resumeId?._id || result.resumeId || result.Id);
                                      console.log('Resume URL for dropdown:', url, result);
                                      if (url && url !== "#") window.open(url, '_blank');
                                      setOpenResumeDropdown(null);
                                    }}>
                                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                                    View Resume
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={async e => {
                                      e.stopPropagation();
                                      try {
                                        const response = await axiosInstance.get(`/api/resumes/${result.resumeId?._id || result.resumeId || result.Id}?download=true`);
                                        if (response.data?.url) window.location.href = response.data.url;
                                      } catch (err) { toast.error('Failed to download resume'); }
                                      setOpenResumeDropdown(null);
                                    }}>
                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                    Download Resume
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={async e => {
                                      e.stopPropagation();
                                      try {
                                        const response = await axiosInstance.get(`/api/job-descriptions/${result.jobDescriptionId?._id || result.jobDescriptionId || result.Id}`);
                                        if (response.data?.url) {
                                          console.log('JD URL:', response.data.url, result);
                                          window.open(response.data.url, '_blank');
                                        }
                                      } catch (err) { toast.error('Failed to view job description'); }
                                      setOpenResumeDropdown(null);
                                    }}>
                                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                                    View Job Description
                                  </button>
                                </div>
                              )}
                            </div>
                            {/* Interview Dropdown Column */}
                            <div className="candidate-table-dropdown" ref={el => interviewDropdownRefs.current[dropdownKey] = el}>
                              <button
                                type="button"
                                className="btn-modern bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200 flex items-center gap-1 px-2 py-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  setOpenInterviewDropdown(prev => prev === dropdownKey ? null : dropdownKey);
                                }}>
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs md:text-sm" />
                                <span className="text-xs font-medium md:text-sm hidden md:inline">Schedule</span>
                              </button>
                              {openInterviewDropdown === dropdownKey && (
                                <div className="candidate-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <a
                                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&add=${encodeURIComponent(resumeData.email || "")}&text=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={e => { e.stopPropagation(); setOpenInterviewDropdown(null); }}
                                  >
                                    <FontAwesomeIcon icon={faGoogle} className="mr-2" />Google Calendar
                                  </a>
                                  <a
                                    href={`https://outlook.office.com/calendar/0/deeplink/compose?to=${encodeURIComponent(resumeData.email || "")}&subject=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={e => { e.stopPropagation(); setOpenInterviewDropdown(null); }}
                                  >
                                    <FontAwesomeIcon icon={faMicrosoft} className="mr-2" />Microsoft Teams
                                  </a>
                                  <a
                                    href={`https://zoom.us/schedule?email=${encodeURIComponent(resumeData.email || "")}&topic=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={e => { e.stopPropagation(); setOpenInterviewDropdown(null); }}
                                  >
                                    <FontAwesomeIcon icon={faVideo} className="mr-2" />Zoom
                                  </a>
                                </div>
                              )}
                            </div>
                            {/* Proceed to Interview Button - Only show if assessment is completed */}
                            {assessmentSession._id && assessmentSession.status === 'completed' && (
                              <motion.button
                                className="btn-modern bg-green-100 hover:bg-green-200 text-green-800 border-green-200 flex items-center gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-2"
                                onClick={() => {
                                  // Use the assessment session ID as both candidate and session ID for now
                                  // This will be updated once we have proper candidate IDs
                                  console.log('Navigating to interview with:', {
                                    candidateId: assessmentSession._id,
                                    assessmentSessionId: assessmentSession._id,
                                    resumeData: resumeData,
                                    result: result
                                  });
                                  navigate(`/dashboard/candidate-details/${assessmentSession._id}/${assessmentSession._id}`);
                                }}
                                title="Proceed to Interview"
                                aria-label="Proceed to Interview"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <FontAwesomeIcon icon={faHandshake} className="h-4 w-4" />
                                <span className="text-xs font-medium md:text-sm hidden md:inline">Interview</span>
                              </motion.button>
                            )}
                            
                            <motion.button
                              className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 flex items-center gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-2"
                              onClick={() => toggleExpandRow(index)}
                              title="Toggle Details"
                              aria-label={expandedRow === index ? "Collapse details" : "Expand details"}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="text-xs font-medium md:text-sm">Details</span>
                              <FontAwesomeIcon icon={expandedRow === index ? faChevronUp : faChevronDown} className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                     {expandedRow === index && (
  <motion.tr
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3 }}
  >
    <td colSpan="7" className="px-0 py-0">
      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {/* Contact Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faUserTie} />
                Contact Information
              </h3>
            </div>
            <div className="p-3">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faMobile} className="text-blue-600 text-xs" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile</p>
                    <p className="text-xs font-medium text-gray-900 mt-1">{resumeData.mobile_number || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-xs" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-xs font-medium text-gray-900 mt-1 break-all">{resumeData.email || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 text-xs" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Consent Status</p>
                    <div className="mt-1">
                      {result.candidateConsent?.allowedToShare ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                          Shared
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                          Not Shared
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Professional Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faBriefcase} />
                Professional Details
              </h3>
            </div>
            <div className="p-3">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Designation</p>
                  <p className="text-xs font-medium text-gray-900 mt-1">
                    {(Array.isArray(resumeData.designation) 
                      ? resumeData.designation.join(", ") 
                      : resumeData.designation) || "N/A"}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Degree</p>
                  <p className="text-xs font-medium text-gray-900 mt-1">
                    {(Array.isArray(resumeData.degree) 
                      ? resumeData.degree.join(", ") 
                      : resumeData.degree) || "N/A"}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Certifications</p>
                  <div className="mt-1">
                    {resumeData.certifications?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {resumeData.certifications.map((cert, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {cert}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No certifications listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Skills Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-3 py-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faTools} />
                Skills
              </h3>
            </div>
            <div className="p-3">
              <div className="flex flex-wrap gap-1">
                {resumeData.skills?.length ? (
                  resumeData.skills.map((skill, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No skills listed</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Previous Companies Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 px-3 py-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} />
                Previous Companies
              </h3>
            </div>
            <div className="p-3">
              {resumeData.company_names?.length ? (
                <div className="flex flex-wrap gap-1">
                  {resumeData.company_names.map((company, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border border-green-200">
                      {company}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No previous companies listed</p>
              )}
            </div>
          </div>
          
          {/* Experience Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} />
                Work Experience
              </h3>
            </div>
            <div className="p-3">
              {resumeData.total_experience?.length ? (
                <div className="space-y-3">
                  {resumeData.total_experience.map((exp, i) => (
                    <div key={i} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-900">{exp.role || "N/A"}</h4>
                          <p className="text-xs text-gray-600 mt-1">{exp.company || "N/A"}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {exp.duration || "N/A"}
                        </span>
                      </div>
                      
                      {exp.responsibilities?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Responsibilities</p>
                          <ul className="mt-1 space-y-1">
                            {exp.responsibilities.slice(0, 3).map((resp, j) => (
                              <li key={j} className="flex items-start">
                                <FontAwesomeIcon icon={faCircle} className="text-gray-400 text-xs mt-1 mr-1 flex-shrink-0" />
                                <span className="text-xs text-gray-700">{resp}</span>
                              </li>
                            ))}
                            {exp.responsibilities.length > 3 && (
                              <li 
                                className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-800"
                                onClick={() => toggleExpand(`${i}-${index}`, 'responsibilities')}
                              >
                                {expandedLists[`${i}-${index}-responsibilities`] 
                                  ? "Show Less" 
                                  : `+ ${exp.responsibilities.length - 3} more responsibilities`}
                              </li>
                            )}
                          </ul>
                          {expandedLists[`${i}-${index}-responsibilities`] && (
                            <ul className="mt-1 space-y-1">
                              {exp.responsibilities.slice(3).map((resp, j) => (
                                <li key={`${j}-expanded`} className="flex items-start">
                                  <FontAwesomeIcon icon={faCircle} className="text-gray-400 text-xs mt-1 mr-1 flex-shrink-0" />
                                  <span className="text-xs text-gray-700">{resp}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No work experience listed</p>
              )}
            </div>
          </div>
          
          {/* Analysis Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-3 py-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} />
                Analysis
              </h3>
            </div>
            <div className="p-3">
              <div className="space-y-4">
                {/* Matching Score */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Matching Score</p>
                    <span className="text-xs font-bold text-gray-900">{analysis["Matching Score"] || "N/A"}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-rose-600 h-1.5 rounded-full" 
                      style={{ width: `${analysis["Matching Score"] || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Skills Breakdown */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Skills Breakdown</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded-md p-2 border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-green-800">Matched</span>
                        <span className="text-xs font-bold text-green-900">{analysis["Matched Skills Percentage"] || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-green-500 h-1 rounded-full" 
                          style={{ width: `${analysis["Matched Skills Percentage"] || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-rose-50 rounded-md p-2 border border-rose-200">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-rose-800">Unmatched</span>
                        <span className="text-xs font-bold text-rose-900">{analysis["Unmatched Skills Percentage"] || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-rose-500 h-1 rounded-full" 
                          style={{ width: `${analysis["Unmatched Skills Percentage"] || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Matched Skills */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Matched Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {analysis["Matched Skills"]?.length ? (
                      analysis["Matched Skills"].map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No matched skills</p>
                    )}
                  </div>
                </div>
                
                {/* Unmatched Skills */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Unmatched Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {analysis["Unmatched Skills"]?.length ? (
                      analysis["Unmatched Skills"].map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No unmatched skills</p>
                    )}
                  </div>
                </div>
                
                {/* Strengths */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Strengths</p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.Strengths?.length ? (
                      analysis.Strengths.map((strength, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {strength}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No strengths identified</p>
                    )}
                  </div>
                </div>
                
                {/* Recommendations */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Recommendations</p>
                  <div className="space-y-1">
                    {analysis.Recommendations?.length ? (
                      analysis.Recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start p-2 bg-blue-50 rounded-md border border-blue-200">
                          <FontAwesomeIcon icon={faLightbulb} className="text-blue-500 text-xs mt-0.5 mr-1 flex-shrink-0" />
                          <span className="text-xs text-gray-700">{rec}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No recommendations available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Experience Metrics Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faUserClock} />
                Experience Metrics
              </h3>
            </div>
            <div className="p-3">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Required Industrial Experience</p>
                    <p className="text-xs font-medium text-gray-900 mt-1">{analysis["Required Industrial Experience"] || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500">Candidate's Experience</p>
                    <p className="text-xs font-medium text-gray-900 mt-1">{analysis["Candidate Industrial Experience"] || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Required Domain Experience</p>
                    <p className="text-xs font-medium text-gray-900 mt-1">{analysis["Required Domain Experience"] || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500">Candidate's Experience</p>
                    <p className="text-xs font-medium text-gray-900 mt-1">{analysis["Candidate Domain Experience"] || "N/A"}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Compliance Status</p>
                  <div>
                    {analysis["Experience Threshold Compliance"] ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        analysis["Experience Threshold Compliance"].includes("meet") 
                          ? "bg-green-100 text-green-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        <FontAwesomeIcon 
                          icon={analysis["Experience Threshold Compliance"].includes("meet") ? faCheck : faExclamationTriangle} 
                          className="mr-1" 
                        />
                        {analysis["Experience Threshold Compliance"]}
                      </span>
                    ) : (
                      <p className="text-xs text-gray-500">N/A</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Recent Experience Relevance</p>
                  <div>
                    {analysis["Recent Experience Relevance"] ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                        {analysis["Recent Experience Relevance"]}
                      </span>
                    ) : (
                      <p className="text-xs text-gray-500">N/A</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Analysis Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-3 py-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faClipboardList} />
                Analysis Summary
              </h3>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-700">
                {analysis["Analysis Summary"] || "No analysis summary available"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </td>
  </motion.tr>
)}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* 🔥 NEW: Floating Action Button for Bulk Download */}
        <AnimatePresence>
          {selectedCandidates.size > 0 && (
            <motion.div
              className="fixed bottom-6 right-6 z-50"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[280px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-gradient rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faDownload} className="text-white text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Bulk Download Ready
                      </h4>
                      <p className="text-xs text-gray-500">
                        {selectedCandidates.size} candidates selected
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={clearAllSelections}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="space-y-2">
                  <motion.button
                    onClick={handleBulkResumeDownload}
                    disabled={bulkDownloadInProgress}
                    className="w-full bg-blue-gradient text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {bulkDownloadInProgress ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" />
                        Creating ZIP...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                        Download ZIP File
                      </>
                    )}
                  </motion.button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Download will include candidate names and matching scores
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <ToastContainer position="top-center" />
      </motion.div>
    </div>
  );
}

export default ResponseTable;