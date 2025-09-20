import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ResponseTable.css';
import {
  faMagnifyingGlass, faRotateRight, faFileAlt, faVideo,
  faChevronDown, faChevronUp, faStar, faDownload, faEye,
  faTools, faUserTie, faGraduationCap, faBuilding, faBriefcase,
  faIdBadge, faCalendarAlt, faFilePdf, faTimes, faSpinner, faPlayCircle
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

  // Use the shared media operations hook
  const { mediaOperations, viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey } = useMediaOperations();
  
  // Add state for dropdowns
  const [resumeDropdownOpen, setResumeDropdownOpen] = useState({});
  const [interviewDropdownOpen, setInterviewDropdownOpen] = useState({});
  
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

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(resumeDropdownRefs.current).forEach(key => {
        if (resumeDropdownRefs.current[key] && !resumeDropdownRefs.current[key].contains(event.target)) {
          setResumeDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
      
      Object.keys(interviewDropdownRefs.current).forEach(key => {
        if (interviewDropdownRefs.current[key] && !interviewDropdownRefs.current[key].contains(event.target)) {
          setInterviewDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full min-w-max">
              <thead className="bg-primary-gradient sticky top-0">
                <tr>
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
                  const testScore = result.testScore || {};
                  const assessmentSession = result.assessmentSession || {};
                  return (
                    <React.Fragment key={index}>
                      <motion.tr 
                        className={`hover:bg-gray-50 transition-all duration-200 ${expandedRow === index ? "bg-blue-50" : ""}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -1 }}
                      >
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
                            <div className="relative" ref={el => resumeDropdownRefs.current[result._id || result.Id] = el}>
                              <button
                                id={`resume-dropdown-${result._id || result.Id}`}
                                className="btn-modern bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-200 p-2"
                                aria-label="Resume actions"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setResumeDropdownOpen(prev => ({
                                    ...prev,
                                    [result._id || result.Id]: !prev[result._id || result.Id]
                                  }));
                                }}
                              >
                                <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4" />
                              </button>
                              {resumeDropdownOpen[result._id || result.Id] && (
                                <div className="response-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                  <button
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const url = await handleResumeLink(result.resumeId?._id || result.resumeId || result.Id);
                                      if (url && url !== "#") {
                                        window.open(url, "_blank");
                                      }
                                      setResumeDropdownOpen(prev => ({
                                        ...prev,
                                        [result._id || result.Id]: false
                                      }));
                                    }}
                                    aria-label="View resume"
                                  >
                                    <FontAwesomeIcon icon={faEye} className="mr-2 h-4 w-4 text-indigo-600" />
                                    View Resume
                                  </button>
                                  <button
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      try {
                                        const response = await axiosInstance.get(
                                          `/api/resumes/${result.resumeId?._id || result.resumeId || result.Id}?download=true`
                                        );
                                        if (response.data?.url) {
                                          window.location.href = response.data.url;
                                        }
                                      } catch (error) {
                                        console.error("Download failed:", error);
                                        toast.error("Failed to initiate download");
                                      }
                                      setResumeDropdownOpen(prev => ({
                                        ...prev,
                                        [result._id || result.Id]: false
                                      }));
                                    }}
                                    aria-label="Download resume"
                                  >
                                    <FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4 text-green-600" />
                                    Download Resume
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="relative" ref={el => interviewDropdownRefs.current[result._id || result.Id] = el}>
                              <button
                                className="btn-modern bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200 flex items-center gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-2"
                                aria-label="Interview scheduling options"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInterviewDropdownOpen(prev => ({
                                    ...prev,
                                    [result._id || result.Id]: !prev[result._id || result.Id]
                                  }));
                                }}
                              >
                                <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-xs md:text-sm" />
                                <span className="text-xs font-medium md:text-sm hidden md:inline">Interview</span>
                              </button>
                              {interviewDropdownOpen[result._id || result.Id] && (
                                <div className="response-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                  <a
                                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&add=${encodeURIComponent(
                                      resumeData.email || ""
                                    )}&text=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setInterviewDropdownOpen(prev => ({
                                        ...prev,
                                        [result._id || result.Id]: false
                                      }));
                                    }}
                                    aria-label="Schedule with Google Calendar"
                                  >
                                    <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4 text-red-500" />
                                    Google Calendar
                                  </a>
                                  <a
                                    href={`https://outlook.office.com/calendar/0/deeplink/compose?to=${encodeURIComponent(
                                      resumeData.email || ""
                                    )}&subject=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setInterviewDropdownOpen(prev => ({
                                        ...prev,
                                        [result._id || result.Id]: false
                                      }));
                                    }}
                                    aria-label="Schedule with Microsoft Teams"
                                  >
                                    <FontAwesomeIcon icon={faMicrosoft} className="mr-2 h-4 w-4 text-blue-500" />
                                    Microsoft Teams
                                  </a>
                                  <a
                                    href={`https://zoom.us/schedule?email=${encodeURIComponent(
                                      resumeData.email || ""
                                    )}&topic=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setInterviewDropdownOpen(prev => ({
                                        ...prev,
                                        [result._id || result.Id]: false
                                      }));
                                    }}
                                    aria-label="Schedule with Zoom"
                                  >
                                    <FontAwesomeIcon icon={faVideo} className="mr-2 h-4 w-4 text-blue-400" />
                                    Zoom
                                  </a>
                                </div>
                              )}
                            </div>
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
    <td colSpan="6" className="px-0 py-0">
      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-100"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {/* Contact Information - Compact Design */}
          <div className="bg-white p-2 rounded-md border border-gray-200">
            <h6 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
              Contact Information
            </h6>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 text-xs min-w-[80px]">Mobile:</span>
                <span className="text-gray-900 text-xs">{resumeData.mobile_number || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 text-xs min-w-[80px]">Email:</span>
                {resumeData.email ? (
                  <span className="badge badge-primary text-xs px-2 py-0.5">
                    {resumeData.email}
                  </span>
                ) : (
                  <span className="text-gray-500 text-xs">N/A</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 text-xs min-w-[80px]">Consent:</span>
                {result.candidateConsent?.allowedToShare ? (
                  <span className="badge badge-success text-xs px-2 py-0.5">
                    Shared
                  </span>
                ) : (
                  <span className="badge badge-warning text-xs px-2 py-0.5">
                    Not Shared
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Professional Details - Compact Design */}
          <div className="bg-white p-2 rounded-md border border-gray-200">
            <h6 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
              Professional Details
            </h6>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 text-xs min-w-[80px]">Designation:</span>
                <span className="text-gray-900 text-xs">
                  {(Array.isArray(resumeData.designation) 
                    ? resumeData.designation.join(", ") 
                    : resumeData.designation) || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 text-xs min-w-[80px]">Degree:</span>
                <span className="text-gray-900 text-xs">
                  {(Array.isArray(resumeData.degree) 
                    ? resumeData.degree.join(", ") 
                    : resumeData.degree) || "N/A"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-medium text-gray-700 text-xs">Certifications:</span>
                <div className="ml-0 text-xs">
                  {renderListWithExpand(resumeData.certifications || [], index, "certifications", 2)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Skills - Compact Design */}
          <div className="bg-white p-2 rounded-md border border-gray-200">
            <h6 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
              Skills
            </h6>
            <div className="flex flex-wrap gap-1">
              {resumeData.skills?.length ? (
                resumeData.skills.map((skill, i) => (
                  <span key={i} className="badge badge-info text-xs px-2 py-0.5">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-xs">No skills available</span>
              )}
            </div>
          </div>
          
          {/* Previous Companies - Compact Design */}
          <div className="bg-white p-2 rounded-md border border-gray-200">
            <h6 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
              Previous Companies
            </h6>
            <div className="text-xs compact-list">
              {renderListWithExpand(resumeData.company_names || [], index, "company_names", 3)}
            </div>
          </div>
          
          {/* Experience - Compact Design */}
          <div className="mt-2 bg-white p-2 rounded-md border border-gray-200">
            <h6 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
              Experience
            </h6>
            <div className="space-y-2">
            {resumeData.total_experience?.length ? (
  resumeData.total_experience.map((exp, i) => (
    <div key={i} className="experience-card p-2 rounded border border-gray-200">
      <div className="experience-grid gap-2">
        <div>
          <div className="experience-detail">
            <span className="experience-label text-xs">Role:</span>
            <span className="experience-value text-xs">{exp.role || "N/A"}</span>
          </div>
          <div className="experience-detail">
            <span className="experience-label text-xs">Company:</span>
            <span className="experience-value text-xs">{exp.company || "N/A"}</span>
          </div>
          <div className="experience-detail">
            <span className="experience-label text-xs">Duration:</span>
            <span className="experience-value text-xs">{exp.duration || "N/A"}</span>
          </div>
        </div>
        <div>
          <div className="space-y-1">
            <span className="experience-label text-xs">Responsibilities:</span>
            <div className="ml-0 compact-list text-xs">
              {renderListWithExpand(exp.responsibilities || [], index, `responsibilities-${i}`, 2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  ))
) : (
  <span className="text-gray-500 text-xs">No experience available</span>
)}
            </div>
          </div>
          
          {/* Analysis - Compact Design */}
          <div className="mt-2 bg-white p-2 rounded-md border border-gray-200">
            <h6 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
              Analysis
            </h6>
            <div className="analysis-grid gap-1.5">
              {/* Skills Analysis */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <div>
                    <span className="skill-analysis-title text-xs">Matched Skills:</span>
                    <div className="ml-0 compact-list text-xs">
                      {renderListWithExpand(analysis["Matched Skills"] || [], index, "matchedSkills", 3)}
                    </div>
                  </div>
                  <div>
                    <span className="skill-analysis-title text-xs">Unmatched Skills:</span>
                    <div className="ml-0 compact-list text-xs">
                      {renderListWithExpand(analysis["Unmatched Skills"] || [], index, "unmatchedSkills", 3)}
                    </div>
                  </div>
                  <div>
                    <span className="skill-analysis-title text-xs">Strengths:</span>
                    <div className="ml-0 compact-list text-xs">
                      {renderListWithExpand(analysis.Strengths || [], index, "strengths", 3)}
                    </div>
                  </div>
                </div>
              </div>
            
              {/* Scores and Metrics */}
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-2 rounded border border-gray-200">
                  <div className="space-y-1">
                    <div className="analysis-metric">
                      <span className="analysis-label text-xs">Matching Score:</span>
                      <span className="analysis-value text-xs">{analysis["Matching Score"] || "N/A"}</span>
                    </div>
                    <div className="analysis-metric">
                      <span className="analysis-label text-xs">Matched Skills %:</span>
                      <span className="analysis-value analysis-score-positive text-xs">{analysis["Matched Skills Percentage"] || 0}%</span>
                    </div>
                    <div className="analysis-metric">
                      <span className="analysis-label text-xs">Unmatched Skills %:</span>
                      <span className="analysis-value analysis-score-negative text-xs">{analysis["Unmatched Skills Percentage"] || 0}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="skill-analysis-title text-xs">Recommendations:</span>
                  <div className="ml-0 compact-list text-xs">
                    {renderListWithExpand(analysis.Recommendations || [], index, "recommendations", 3)}
                  </div>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="analysis-metric">
                    <span className="analysis-label text-xs">Required Industrial Experience:</span>
                    <span className="analysis-value text-xs">{analysis["Required Industrial Experience"] || "N/A"}</span>
                  </div>
                  <div className="analysis-metric">
                    <span className="analysis-label text-xs">Candidate Industrial Experience:</span>
                    <span className="analysis-value text-xs">{analysis["Candidate Industrial Experience"] || "N/A"}</span>
                  </div>
                  <div className="analysis-metric">
                    <span className="analysis-label text-xs">Required Domain Experience:</span>
                    <span className="analysis-value text-xs">{analysis["Required Domain Experience"] || "N/A"}</span>
                  </div>
                  <div className="analysis-metric">
                    <span className="analysis-label text-xs">Candidate Domain Experience:</span>
                    <span className="analysis-value text-xs">{analysis["Candidate Domain Experience"] || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Assessment Results - Compact Design */}
          {assessmentSession._id && (
            <div className="mt-2 bg-white p-2 rounded-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h6 className="text-md font-semibold text-gray-900">
                  Assessment Results
                </h6>
                <span className="badge badge-info text-xs px-2 py-0.5">
                  Scores
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-xs">MCQ Score:</span>
                    <span className="text-gray-900 text-xs">{testScore.score ? `${testScore.score.toFixed(2)}/100` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-xs">Audio Score:</span>
                    <span className="text-gray-900 text-xs">{testScore.audioScore ? `${testScore.audioScore.toFixed(2)}/100` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-xs">Text Score:</span>
                    <span className="text-gray-900 text-xs">{testScore.textScore ? `${testScore.textScore.toFixed(2)}/100` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-xs">Video Score:</span>
                    <span className="text-gray-900 text-xs">{testScore.videoScore ? `${testScore.videoScore.toFixed(2)}/100` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-1 pt-1 border-t">
                    <span className="text-gray-700 text-xs">Combined Score:</span>
                    <span className="text-gray-900 text-xs">{testScore.combinedScore ? `${testScore.combinedScore.toFixed(2)}/100` : "N/A"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {assessmentSession.reportStatus === "completed" && (
                    <button
                      className="recording-btn bg-blue-500 hover:bg-blue-600 text-white text-xs py-1"
                      onClick={async () => {
                        const url = await handleReportLink(assessmentSession._id);
                        if (url && url !== "#") {
                          window.open(url, "_blank");
                        }
                      }}
                      aria-label="View assessment report"
                    >
                      <FontAwesomeIcon icon={faFilePdf} size="xs" className="mr-1" />
                      View Report
                    </button>
                  )}
                  {/* Add media actions */}
                  {renderMediaActions(assessmentSession, index)}
                </div>
              </div>
            </div>
          )}
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
        <ToastContainer position="top-center" />
      </motion.div>
    </div>
  );
}

export default ResponseTable;