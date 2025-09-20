import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from 'react-router-dom';
import './CandidateTable.css';
import { useMediaOperations } from "../../hooks/useMediaOperations";
import {
  faMagnifyingGlass, faRotateRight,
  faComment, faFileAlt, faVideo, faCode,
  faChevronDown, faChevronUp, faStar,
  faDownload, faEye, faGraduationCap,
  faBriefcase, faUserTie, faBuilding,
  faIdBadge, faCalendarAlt, faUsers,
  faSpinner, faCheckCircle, faExclamationTriangle,
  faTimes, faFilter, faSort, faDesktop, faPlayCircle,
  faMicrophone,faChevronLeft,faChevronRight,faFilePdf
} from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { io } from "socket.io-client";
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { axiosInstance } from "../../axiosUtils";

function CandidateTable() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [expandedLists, setExpandedLists] = useState({});
  const [allSelected, setAllSelected] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testScores, setTestScores] = useState([]);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [generationStatus, setGenerationStatus] = useState({
    loading: false,
    error: null,
    success: false,
    message: null
  });
  // Use the shared media operations hook
  const { mediaOperations, viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey } = useMediaOperations();
  // Add pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const initialViewMode = location.state?.view || 'all';
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [historicalCandidates, setHistoricalCandidates] = useState([]);
  const [recommendedCandidates, setRecommendedCandidates] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [],
    designation: [],
    degree: [],
    company_names: [],
    jobType: [],
    job_title: [],
  });

  // Add state for dropdowns
  const [resumeDropdownOpen, setResumeDropdownOpen] = useState({});
  const [interviewDropdownOpen, setInterviewDropdownOpen] = useState({});
  const [scoreDropdownOpen, setScoreDropdownOpen] = useState({});
  const [recordingsDropdownOpen, setRecordingsDropdownOpen] = useState({});
  const [voiceAnswersDropdownOpen, setVoiceAnswersDropdownOpen] = useState({});
  
  // Refs for dropdown containers
  const resumeDropdownRefs = useRef({});
  const interviewDropdownRefs = useRef({});
  const scoreDropdownRefs = useRef({});
  const recordingsDropdownRefs = useRef({});
  const voiceAnswersDropdownRefs = useRef({});

  const filterIcons = {
    jobType: faUserTie,
    skills: faCode,
    designation: faBriefcase,
    degree: faGraduationCap,
    company_names: faBuilding,
    job_title: faIdBadge,
  };

  const [showModal, setShowModal] = useState({});

  useEffect(() => {
    const socket = io("");
    socket.on("apiResponseUpdated", (newResponse) => {
      setCandidates((prevCandidates) => {
        const exists = prevCandidates.some(
          (candidate) =>
            candidate.resumeId === newResponse.resumeId &&
            candidate.jobDescriptionId === newResponse.jobDescriptionId
        );
        if (exists) {
          console.log("Duplicate record detected and ignored:", newResponse);
          return prevCandidates;
        }
        return [newResponse, ...prevCandidates];
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, scoresRes] = await Promise.all([
          axiosInstance.get('/api/candidate-filtering'),
          axiosInstance.get('/api/test-results')
        ]);
        
        // Debug log to see the raw data structure
        console.log('Raw candidates data:', candidatesRes.data);
        console.log('Raw scores data:', scoresRes.data);
        
        const uniqueCandidates = candidatesRes.data.filter((member, index, self) => {
          return (
            index ===
            self.findIndex(
              (c) =>
                c.resumeId === member.resumeId &&
                c.jobDescriptionId === member.jobDescriptionId
            )
          );
        }).map((member) => {
          // Debug log to see individual member structure
          console.log('Individual member:', member);
          if (member.testScore) {
            console.log('Member testScore:', member.testScore);
          }
          
          return {
            ...member,
            matchingResult: member.matchingResult?.[0] ? [{
              "Resume Data": member.matchingResult[0]["Resume Data"],
              Analysis: {
                "Matching Score": member.matchingResult[0].Analysis?.["Matching Score"] || 0,
                "Matched Skills": member.matchingResult[0].Analysis?.["Matched Skills"] || [],
                "Unmatched Skills": member.matchingResult[0].Analysis?.["Unmatched Skills"] || [],
                "Matched Skills Percentage": member.matchingResult[0].Analysis?.["Matched Skills Percentage"] || 0,
                "Unmatched Skills Percentage": member.matchingResult[0].Analysis?.["Unmatched Skills Percentage"] || 0,
                Strengths: member.matchingResult[0].Analysis?.Strengths || [],
                Recommendations: member.matchingResult[0].Analysis?.Recommendations || [],
                "Required Industrial Experience": member.matchingResult[0].Analysis?.["Required Industrial Experience"] || "N/A",
                "Candidate Industrial Experience": member.matchingResult[0].Analysis?.["Candidate Industrial Experience"] || "N/A",
                "Required Domain Experience": member.matchingResult[0].Analysis?.["Required Domain Experience"] || "N/A",
                "Candidate Domain Experience": member.matchingResult[0].Analysis?.["Candidate Domain Experience"] || "N/A",
              }
            }] : []
          }
        });
        setCandidates(uniqueCandidates);
        setMembers(uniqueCandidates);
        setFilteredMembers(uniqueCandidates);
        setTestScores(scoresRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSegmentedData = async () => {
      try {
        const response = await axiosInstance.get('/api/candidates/segmented');
        setRecentCandidates(response.data.recent);
        setHistoricalCandidates(response.data.history);
      } catch (error) {
        console.error('Error fetching segmented candidates:', error);
        setRecentCandidates([]);
        setHistoricalCandidates([]);
      }
    };
    fetchSegmentedData();
  }, []);

  const fetchRecommendationsConsentOnly = async () => {
    try {
      const res = await axiosInstance.get("/api/recommendations/candidates");
      const data = res.data.map((member) => ({
        ...member,
        matchingResult: member.matchingResult?.[0] ? [{
          "Resume Data": member.matchingResult[0]["Resume Data"],
          Analysis: {
            "Matching Score": member.matchingResult[0].Analysis?.["Matching Score"] || 0,
            "Matched Skills": member.matchingResult[0].Analysis?.["Matched Skills"] || [],
            "Unmatched Skills": member.matchingResult[0].Analysis?.["Unmatched Skills"] || [],
            "Matched Skills Percentage": member.matchingResult[0].Analysis?.["Matched Skills Percentage"] || 0,
            "Unmatched Skills Percentage": member.matchingResult[0].Analysis?.["Unmatched Skills Percentage"] || 0,
            Strengths: member.matchingResult[0].Analysis?.Strengths || [],
            Recommendations: member.matchingResult[0].Analysis?.Recommendations || [],
            "Required Industrial Experience": member.matchingResult[0].Analysis?.["Required Industrial Experience"] || "N/A",
            "Candidate Industrial Experience": member.matchingResult[0].Analysis?.["Candidate Industrial Experience"] || "N/A",
            "Required Domain Experience": member.matchingResult[0].Analysis?.["Required Domain Experience"] || "N/A",
            "Candidate Domain Experience": member.matchingResult[0].Analysis?.["Candidate Domain Experience"] || "N/A",
          }
        }] : []
      }));
      setRecommendedCandidates(data);
      setMembers(data);
      setFilteredMembers([]);
    } catch (error) {
      console.error('Failed to fetch recommended candidates:', error.message);
    }
  };

  useEffect(() => {
    if (viewMode === 'recommended') {
      fetchRecommendationsConsentOnly();
    } else {
      setFilteredMembers(
        viewMode === 'recent'
          ? recentCandidates
          : viewMode === 'history'
            ? historicalCandidates
            : candidates
      );
      setSelectedFilters({
        skills: [],
        designation: [],
        degree: [],
        company_names: [],
        jobType: [],
        job_title: [],
      });
      setAllSelected({});
    }
  }, [viewMode, candidates, recentCandidates, historicalCandidates]);

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
      
      Object.keys(scoreDropdownRefs.current).forEach(key => {
        if (scoreDropdownRefs.current[key] && !scoreDropdownRefs.current[key].contains(event.target)) {
          setScoreDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
      
      Object.keys(recordingsDropdownRefs.current).forEach(key => {
        if (recordingsDropdownRefs.current[key] && !recordingsDropdownRefs.current[key].contains(event.target)) {
          setRecordingsDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
      
      Object.keys(voiceAnswersDropdownRefs.current).forEach(key => {
        if (voiceAnswersDropdownRefs.current[key] && !voiceAnswersDropdownRefs.current[key].contains(event.target)) {
          setVoiceAnswersDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sendTestLink = async (candidateEmail, jobTitle, resumeId, jdId) => {
    setShowGenerationModal(true);
    setGenerationStatus({
      loading: true,
      error: null,
      success: false,
      message: 'Checking your assessment limits...'
    });
    try {
      const userRes = await axiosInstance.get('/user', { withCredentials: true });
      const user = userRes.data.user;
      if (!user.isAdmin && user.subscription?.limits?.assessments) {
        const remainingAssessments = user.subscription.limits.assessments - (user.usage?.assessments || 0);
        if (remainingAssessments <= 0) {
          throw new Error(`You've reached your assessment limit (${user.subscription.limits.assessments})`);
        }
      }
      setGenerationStatus(prev => ({
        ...prev,
        message: 'Generating MCQ questions...'
      }));
      const mcqResponse = await axiosInstance.post(
        '/api/generate-questions',
        { resumeId, jobDescriptionId: jdId }
      );
      if (!mcqResponse.data.success) {
        throw new Error(mcqResponse.data.error || 'MCQ question generation failed');
      }
      setGenerationStatus(prev => ({
        ...prev,
        message: 'Generating voice questions...'
      }));
      const voiceResponse = await axiosInstance.post(
        '/api/generate-voice-questions',
        { jobDescriptionId: jdId }
      );
      if (!voiceResponse.data.success) {
        throw new Error(voiceResponse.data.error || 'Voice question generation failed');
      }
      setGenerationStatus(prev => ({
        ...prev,
        message: 'Sending assessment email...'
      }));
      const sessionResponse = await axiosInstance.post(
        '/api/send-test-link',
        {
          candidateEmail,
          jobTitle,
          resumeId,
          jobDescriptionId: jdId,
          questions: mcqResponse.data.questions,
          voiceQuestions: voiceResponse.data.questions
        }
      );
      if (!sessionResponse.data.success) {
        throw new Error(sessionResponse.data.error || 'Email sending failed');
      }
      setGenerationStatus({
        loading: false,
        error: null,
        success: true,
        message: `Assessment sent to ${candidateEmail}`,
        testLink: sessionResponse.data.testLink
      });
      setTimeout(() => {
        setShowGenerationModal(false);
        const fetchCandidates = async () => {
          try {
            const response = await axiosInstance.get("/api/candidate-filtering");
            const data = response.data;
            const uniqueCandidates = data.filter((member, index, self) => {
              return (
                index ===
                self.findIndex(
                  (c) =>
                    c.resumeId === member.resumeId &&
                    c.jobDescriptionId === member.jobDescriptionId
                )
              );
            }).map((member) => ({
              ...member,
              matchingResult: member.matchingResult?.[0] ? [{
                "Resume Data": member.matchingResult[0]["Resume Data"],
                Analysis: {
                  "Matching Score": member.matchingResult[0].Analysis?.["Matching Score"] || 0,
                  "Matched Skills": member.matchingResult[0].Analysis?.["Matched Skills"] || [],
                  "Unmatched Skills": member.matchingResult[0].Analysis?.["Unmatched Skills"] || [],
                  "Matched Skills Percentage": member.matchingResult[0].Analysis?.["Matched Skills Percentage"] || 0,
                  "Unmatched Skills Percentage": member.matchingResult[0].Analysis?.["Unmatched Skills Percentage"] || 0,
                  Strengths: member.matchingResult[0].Analysis?.Strengths || [],
                  Recommendations: member.matchingResult[0].Analysis?.Recommendations || [],
                  "Required Industrial Experience": member.matchingResult[0].Analysis?.["Required Industrial Experience"] || "N/A",
                  "Candidate Industrial Experience": member.matchingResult[0].Analysis?.["Candidate Industrial Experience"] || "N/A",
                  "Required Domain Experience": member.matchingResult[0].Analysis?.["Required Domain Experience"] || "N/A",
                  "Candidate Domain Experience": member.matchingResult[0].Analysis?.["Candidate Domain Experience"] || "N/A",
                }
              }] : []
            }));
            setCandidates(uniqueCandidates);
            setMembers(uniqueCandidates);
            setFilteredMembers(uniqueCandidates);
          } catch (error) {
            console.error("Error fetching candidate data:", error.message);
          }
        };
        fetchCandidates();
      }, 10000);
    } catch (error) {
      console.error('Assessment error:', error);
      let errorMessage = 'Failed to send assessment';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setGenerationStatus({
        loading: false,
        error: errorMessage,
        success: false,
        message: null,
        testLink: error.response?.data?.testLink
      });
    }
  };

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
        const experienceStr = member.matchingResult[0]?.["Resume Data"]?.experience || "0 years";
        const experienceYears = parseFloat(experienceStr);
        const isFresher = selectedFilters.jobType.includes("Fresher") && experienceYears === 0;
        const isExperienced = selectedFilters.jobType.includes("Experienced") && experienceYears > 0;
        return isFresher || isExperienced;
      });
    }
    if (selectedFilters.degree.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.degree.some((degree) =>
          (member.matchingResult[0]?.["Resume Data"]?.degree || [])
            .join(", ")
            .toLowerCase()
            .includes(degree.toLowerCase())
        )
      );
    }
    if (selectedFilters.company_names.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.company_names.some((company_name) =>
          (member.matchingResult[0]?.["Resume Data"]?.company_names || [])
            .join(", ")
            .toLowerCase()
            .includes(company_name.toLowerCase())
        )
      );
    }
    if (selectedFilters.skills.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.skills.some((skill) =>
          (member.matchingResult[0]?.["Resume Data"]?.skills || [])
            .join(", ")
            .toLowerCase()
            .includes(skill.toLowerCase())
        )
      );
    }
    if (selectedFilters.job_title.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.job_title.some((title) =>
          (member.matchingResult[0]?.["Resume Data"]?.["Job Title"] || "")
            .toLowerCase()
            .includes(title.toLowerCase())
        )
      );
    }
    if (selectedFilters.designation.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.designation.some((designation) =>
          (member.matchingResult[0]?.["Resume Data"]?.designation || [])
            .join(", ")
            .toLowerCase()
            .includes(designation.toLowerCase())
        )
      );
    }
    setFilteredMembers(filtered);
  };

  const extractUniqueValues = (key) => {
    if (key === "jobType") {
      return ["Fresher", "Experienced"];
    }
    if (key === "job_title") {
      return [
        ...new Set(
          members.map(
            (m) => m.matchingResult[0]?.["Resume Data"]?.["Job Title"] || ""
          ).filter(Boolean)
        ),
      ];
    }
    return [
      ...new Set(
        members.flatMap((member) =>
          (member.matchingResult[0]?.["Resume Data"]?.[key] || []).flat()
        ).filter(Boolean)
      ),
    ];
  };

  const resetFilters = (filterCategory) => {
    handleFilterChange(filterCategory, []);
    setAllSelected((prev) => ({ ...prev, [filterCategory]: false }));
  };

  const resetAllFilters = () => {
    setSelectedFilters({
      skills: [],
      designation: [],
      degree: [],
      company_names: [],
      jobType: [],
      job_title: [],
    });
    setAllSelected({});
    if (viewMode === 'recommended') {
      setFilteredMembers([]);
    } else {
      setFilteredMembers(members);
    }
  };

  const handleResumeLink = async (resumeId) => {
    try {
      if (!resumeId) {
        console.error('No resume ID provided');
        return { success: false, error: 'No resume selected' };
      }
      const response = await axiosInstance.get(`/api/resumes/${resumeId}`);
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to get resume URL');
      }
      return {
        success: true,
        url: response.data.url,
        filename: response.data.filename
      };
    } catch (error) {
      console.error('Error getting resume URL:', {
        error: error.response?.data || error.message,
        resumeId
      });
      return { 
        success: false,
        error: error.response?.data?.error || 'Failed to access resume',
        details: process.env.NODE_ENV === 'development' 
          ? error.response?.data?.details || error.message 
          : undefined
      };
    }
  };

  const handlejdLink = async (jobDescriptionId) => {
    try {
      if (!jobDescriptionId) return '#';
      const response = await axiosInstance.get(`/api/job-descriptions/${jobDescriptionId}`);
      return response.data?.url || '#';
    } catch (error) {
      console.error('Error getting resume URL:', error);
      return '#';
    }
  };

  const calculateTotalExperience = (experiences) => {
    if (!experiences || !Array.isArray(experiences)) return "0 years";
    return experiences.reduce((total, exp) => {
      const match = exp.duration?.match(/(\d+\.?\d*)\s*(?:years?|yrs?)/i);
      return total + (match ? parseFloat(match[1]) : 0);
    }, 0) + " years";
  };

  const toggleExpand = (index, type) => {
    setExpandedLists((prev) => ({
      ...prev,
      [`${index}-${type}`]: !prev[`${index}-${type}`],
    }));
  };

  const renderListWithExpand = (items, index, type, maxItems = 3) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <span className="text-muted">None</span>;
    }
    const isExpanded = expandedLists[`${index}-${type}`];
    const visibleItems = isExpanded ? items : items.slice(0, maxItems);
    return (
      <div className="list-container" aria-describedby={`${type}-${index}`}>
        <ul className="bullet-list list-unstyled">
          {visibleItems.map((item, i) => (
            <li key={i} className="mb-1">{item}</li>
          ))}
        </ul>
        {items.length > maxItems && (
          <span
            className="toggle-link text-primary cursor-pointer"
            onClick={() => toggleExpand(index, type)}
            role="button"
            aria-label={isExpanded ? `Collapse ${type} list` : `Expand ${type} list`}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </span>
        )}
      </div>
    );
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        className="card-glass p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Loading candidate data...</p>
      </motion.div>
    </div>
  );

  const renderViewToggle = () => (
    <motion.div 
      className="flex justify-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex gap-3 p-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
        <motion.button 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
            viewMode === 'all' 
              ? 'bg-primary-gradient text-white shadow-lg' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setViewMode('all')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FontAwesomeIcon icon={faUsers} />
          All Applicants
        </motion.button>
        <motion.button 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 relative ${
            viewMode === 'recent' 
              ? 'bg-primary-gradient text-white shadow-lg' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setViewMode('recent')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FontAwesomeIcon icon={faStar} />
          Latest Profiles
          {recentCandidates.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {recentCandidates.length}
            </span>
          )}
        </motion.button>
        <motion.button 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 relative ${
            viewMode === 'recommended' 
              ? 'bg-primary-gradient text-white shadow-lg' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            setViewMode('recommended');
            fetchRecommendationsConsentOnly();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FontAwesomeIcon icon={faCheckCircle} />
          Recommended Profiles
          {recommendedCandidates.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {recommendedCandidates.length}
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  const candidatesToDisplay = viewMode === 'recommended'
    ? filteredMembers
    : viewMode === 'recent'
      ? recentCandidates
      : viewMode === 'history'
        ? historicalCandidates
        : filteredMembers;

  const sortedCandidatesToDisplay = [...candidatesToDisplay].sort((a, b) => {
    const aMatch = a.matchingResult?.[0]?.["Resume Data"]?.["Matching Percentage"] || 0;
    const bMatch = b.matchingResult?.[0]?.["Resume Data"]?.["Matching Percentage"] || 0;
    return bMatch - aMatch;
  });

  // Add function to extract file key from path
  // The following functions are now provided by useMediaOperations hook:
  // viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <motion.div 
        className="container-modern"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUsers} className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Talent Workspace</h1>
          <p className="text-gray-600">Manage candidates and assessments efficiently</p>
        </motion.div>

        {renderViewToggle()}
        {/* Filter Section */}
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
          {/* Filter Modals */}
          <AnimatePresence>
            {Object.keys(filterIcons).map((filter) => (
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
                          />
                          <span className="font-semibold text-gray-900">Select All</span>
                        </label>
                        {extractUniqueValues(filter).map((value, index) => (
                          <label key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                              checked={selectedFilters[filter]?.includes(value) || false}
                              onChange={(e) => {
                                const selected = e.target.checked
                                  ? [...(selectedFilters[filter] || []), value]
                                  : selectedFilters[filter].filter((v) => v !== value);
                                handleFilterChange(filter, selected);
                              }}
                            />
                            <span className="text-gray-700">{value}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3">
                      <motion.button
                        className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex-1 flex items-center justify-center"
                        onClick={() => {
                          handleFilterChange(filter, []);
                          if (viewMode === 'recommended') {
                            setFilteredMembers([]);
                          } else {
                            setFilteredMembers(members);
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Reset
                      </motion.button>
                      <motion.button
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex-1 flex items-center justify-center"
                        onClick={() => {
                          applyFilters();
                          toggleModal(filter);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Apply
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Assessment Generation Modal */}
          <AnimatePresence>
            {showGenerationModal && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="card-glass max-w-md w-full p-6 text-center"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                >
                  {generationStatus.loading && (
                    <>
                      <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Preparing Assessment</h3>
                      <p className="text-gray-600">{generationStatus.message || 'Processing...'}</p>
                    </>
                  )}
                  {generationStatus.error && (
                    <>
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
                      <p className="text-gray-600 mb-4">{generationStatus.error}</p>
                      <button 
                        className="btn-secondary"
                        onClick={() => setShowGenerationModal(false)}
                      >
                        Close
                      </button>
                    </>
                  )}
                  {generationStatus.success && (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-600 mb-2">Success!</h3>
                      <p className="text-gray-600 mb-4">{generationStatus.message}</p>
                      <button 
                        className="btn-primary"
                        onClick={() => setShowGenerationModal(false)}
                      >
                        Got it!
                      </button>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candidates Table */}
          <motion.div 
            className="card-glass"
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Match %</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">View PDF</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Interview</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Details</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Test-Link</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">View Recordings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedCandidatesToDisplay.map((result, index) => {
                    const resumeData = result.matchingResult?.[0]?.["Resume Data"] || {};
                    const analysis = result.matchingResult?.[0]?.Analysis || {};
                    const email = resumeData.email || "N/A";
                    const session = result.assessmentSession;
                    const testScore = result.testScore;
                    const isRecent = recentCandidates.some(rc => rc._id === result._id);
                    
                    const getStatusBadge = () => {
                      if (!session) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Sent</span>;
                      switch (session.status) {
                        case 'completed': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
                        case 'in-progress': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
                        default: return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Pending</span>;
                      }
                    };
                    return (
                     <React.Fragment key={result._id || index}>
    <motion.tr 
      className={`${expandedRow === result._id ? "bg-blue-50" : "hover:bg-gray-50"} ${isRecent ? "bg-green-50" : ""} transition-all duration-200`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -1 }}
    >
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="flex items-center gap-2">
          {isRecent && viewMode !== 'recent' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              New
            </span>
          )}
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
            <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">{resumeData.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 md:px-6 md:py-4">
        <div className="truncate max-w-[100px] md:max-w-none">{resumeData?.["Job Title"] || "N/A"}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 md:px-6 md:py-4">
        <div className="truncate max-w-[80px] md:max-w-none">{resumeData.experience || calculateTotalExperience(resumeData.total_experience) || "0 years"}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-[60px]">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${resumeData["Matching Percentage"] || analysis["Matching Score"] || 0}%` }}
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
        <div className="candidate-table-dropdown" ref={el => resumeDropdownRefs.current[result._id] = el}>
          <button 
            className="btn-modern bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200 p-2"
            onClick={(e) => {
              e.stopPropagation();
              setResumeDropdownOpen(prev => ({
                ...prev,
                [result._id]: !prev[result._id]
              }));
            }}
          >
            <FontAwesomeIcon icon={faFileAlt} />
          </button>
          {resumeDropdownOpen[result._id] && (
            <div className="candidate-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await axiosInstance.get(`/api/resumes/${result.resumeId?._id || result.resumeId || result.Id}`);
                    if (response.data?.url) {
                      window.open(response.data.url, '_blank');
                    }
                  } catch (error) {
                    console.error('Error viewing resume:', error);
                    toast.error('Failed to view resume');
                  }
                  setResumeDropdownOpen(prev => ({
                    ...prev,
                    [result._id]: false
                  }));
                }}
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                View Resume
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await axiosInstance.get(`/api/resumes/${result.resumeId?._id || result.resumeId || result.Id}?download=true`);
                    if (response.data?.url) {
                      window.location.href = response.data.url;
                    }
                  } catch (error) {
                    console.error('Download failed:', error);
                    toast.error('Failed to initiate download');
                  }
                  setResumeDropdownOpen(prev => ({
                    ...prev,
                    [result._id]: false
                  }));
                }}
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download Resume
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await axiosInstance.get(`/api/job-descriptions/${result.jobDescriptionId?._id || result.jobDescriptionId}`);
                    if (response.data?.url) {
                      window.open(response.data.url, '_blank');
                    }
                  } catch (error) {
                    console.error('Error viewing JD:', error);
                    toast.error('Failed to view job description');
                  }
                  setResumeDropdownOpen(prev => ({
                    ...prev,
                    [result._id]: false
                  }));
                }}
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                View Job Description
              </button>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="flex flex-col gap-2">
          {/* Proceed to Second Round Button */}
          <motion.button
            className="btn-modern bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-200 flex items-center gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-2"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                // Use the assessment session ID directly instead of looking up scheduled test
                if (result.assessmentSession && result.assessmentSession._id) {
                  // Navigate directly to the assessment session details
                  window.location.href = `/dashboard/assessment-session/${result.assessmentSession._id}`;
                } else {
                  toast.error('No assessment session found for this candidate');
                }
              } catch (error) {
                console.error('Error navigating to assessment session:', error);
                toast.error('Failed to navigate to candidate details');
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FontAwesomeIcon icon={faUserTie} className="text-xs md:text-sm" />
            <span className="text-xs font-medium md:text-sm hidden md:inline">Proceed to Interview</span>
          </motion.button>
          
          {/* Interview Scheduling Dropdown */}
          <div className="candidate-table-dropdown" ref={el => interviewDropdownRefs.current[result._id] = el}>
            <button 
              className="btn-modern bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200 flex items-center gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-2"
              onClick={(e) => {
                e.stopPropagation();
                setInterviewDropdownOpen(prev => ({
                  ...prev,
                  [result._id]: !prev[result._id]
                }));
              }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="text-xs md:text-sm" />
              <span className="text-xs font-medium md:text-sm hidden md:inline">Schedule</span>
            </button>
            {interviewDropdownOpen[result._id] && (
              <div className="candidate-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&add=${encodeURIComponent(resumeData.email || "")}&text=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInterviewDropdownOpen(prev => ({
                      ...prev,
                      [result._id]: false
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                  Google Calendar
                </a>
                <a
                  href={`https://outlook.office.com/calendar/0/deeplink/compose?to=${encodeURIComponent(resumeData.email || "")}&subject=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInterviewDropdownOpen(prev => ({
                      ...prev,
                      [result._id]: false
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faMicrosoft} className="mr-2" />
                  Microsoft Teams
                </a>
                <a
                  href={`https://zoom.us/schedule?email=${encodeURIComponent(resumeData.email || "")}&topic=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInterviewDropdownOpen(prev => ({
                      ...prev,
                      [result._id]: false
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faVideo} className="mr-2" />
                  Zoom
                </a>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <motion.button
          className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 flex items-center gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-2"
          onClick={() => toggleExpandRow(result._id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-xs font-medium md:text-sm">Details</span>
          <FontAwesomeIcon 
            icon={expandedRow === result._id ? faChevronUp : faChevronDown} 
            className="text-xs transition-transform duration-200"
          />
        </motion.button>
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        {getStatusBadge()}
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        {testScore ? (
          <div className="candidate-table-dropdown" ref={el => scoreDropdownRefs.current[result._id] = el}>
            <button 
              className="btn-modern bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-200 px-2 py-2 md:px-3 md:py-2"
              onClick={(e) => {
                e.stopPropagation();
                setScoreDropdownOpen(prev => ({
                  ...prev,
                  [result._id]: !prev[result._id]
                }));
              }}
            >
              <span className="font-semibold text-xs md:text-sm">
                {testScore.combinedScore !== undefined ? `${testScore.combinedScore}%` : 'N/A'}
              </span>
            </button>
            {scoreDropdownOpen[result._id] && (
              <div className="candidate-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="px-4 py-2 text-sm text-gray-700">
                  <div className="font-semibold">Test Scores</div>
                  {(testScore.score !== undefined && testScore.score !== null) ? (
                    <div className="flex justify-between">
                      <span>MCQ:</span>
                      <span>{parseFloat(testScore.score).toFixed(2)}%</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>MCQ:</span>
                      <span>N/A</span>
                    </div>
                  )}
                  {(testScore.audioScore !== undefined && testScore.audioScore !== null) ? (
                    <div className="flex justify-between">
                      <span>Audio:</span>
                      <span>{parseFloat(testScore.audioScore).toFixed(2)}%</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Audio:</span>
                      <span>N/A</span>
                    </div>
                  )}
                  {(testScore.textScore !== undefined && testScore.textScore !== null) ? (
                    <div className="flex justify-between">
                      <span>Text:</span>
                      <span>{parseFloat(testScore.textScore).toFixed(2)}%</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Text:</span>
                      <span>N/A</span>
                    </div>
                  )}
                  {(testScore.videoScore !== undefined && testScore.videoScore !== null) ? (
                    <div className="flex justify-between">
                      <span>Video:</span>
                      <span>{parseFloat(testScore.videoScore).toFixed(2)}%</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Video:</span>
                      <span>N/A</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold mt-1 pt-1 border-t">
                    <span>Total:</span>
                    <span>{testScore.combinedScore !== undefined ? `${parseFloat(testScore.combinedScore).toFixed(2)}%` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-500 text-xs md:text-sm">N/A</span>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        {!session || session.status === 'pending' ? (
          <motion.button
            className="btn-primary px-3 py-2 text-xs font-medium md:px-4 md:py-2 md:text-sm"
            onClick={() => sendTestLink(
              email,
              resumeData["Job Title"],
              result.resumeId?._id,
              result.jobDescriptionId?._id
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="hidden md:inline">Send Assessment</span>
            <span className="md:hidden">Send</span>
          </motion.button>
        ) : (
          <button className="btn-secondary px-3 py-2 text-xs font-medium md:px-4 md:py-2 md:text-sm" disabled>
            <span className="hidden md:inline">Sent</span>
            <span className="md:hidden">✓</span>
          </button>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="flex flex-wrap gap-2">
          {/* Recording Actions - Animated Section */}
          <div className="w-full">
            <motion.button
              className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-200 p-2 flex items-center gap-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full justify-center"
              onClick={() => setRecordingsDropdownOpen(prev => ({
                ...prev,
                [result._id]: !prev[result._id]
              }))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faVideo} className="text-white" />
              <span className="text-xs font-medium">View Recordings</span>
              <FontAwesomeIcon 
                icon={recordingsDropdownOpen[result._id] ? faChevronUp : faChevronDown} 
                className="text-xs transition-transform duration-200"
              />
            </motion.button>
            
            <AnimatePresence>
              {recordingsDropdownOpen[result._id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 recording-section"
                >
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="recording-section-header">
                      <h3>Media Recordings</h3>
                      <p>View or download candidate recordings</p>
                    </div>
                    
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {result.assessmentSession?.recording?.videoPath && (
                        <div className="recording-item-row">
                          <div className="recording-item-info">
                            <div className="recording-item-icon bg-blue-100">
                              <FontAwesomeIcon icon={faVideo} className="text-blue-600" />
                            </div>
                            <div className="recording-item-details">
                              <div className="recording-item-title">Video Recording</div>
                              <div className="recording-item-subtitle">Face Camera</div>
                            </div>
                          </div>
                          <div className="recording-item-actions">
                            <button
                              className="recording-action-btn recording-action-btn-view"
                              onClick={() => viewVideo('video', result.assessmentSession.recording.videoPath)}
                              disabled={mediaOperations.video?.viewing}
                              title="View Video"
                            >
                              {mediaOperations.video?.viewing ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                <FontAwesomeIcon icon={faEye} />
                              )}
                            </button>
                            <button
                              className="recording-action-btn recording-action-btn-download"
                              onClick={() => downloadVideo('video', result.assessmentSession.recording.videoPath)}
                              disabled={mediaOperations.video?.downloading}
                              title="Download Video"
                            >
                              {mediaOperations.video?.downloading ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                <FontAwesomeIcon icon={faDownload} />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {result.assessmentSession?.recording?.screenPath && (
                        <div className="recording-item-row">
                          <div className="recording-item-info">
                            <div className="recording-item-icon bg-purple-100">
                              <FontAwesomeIcon icon={faDesktop} className="text-purple-600" />
                            </div>
                            <div className="recording-item-details">
                              <div className="recording-item-title">Screen Recording</div>
                              <div className="recording-item-subtitle">Screen Share</div>
                            </div>
                          </div>
                          <div className="recording-item-actions">
                            <button
                              className="recording-action-btn recording-action-btn-view"
                              onClick={() => viewVideo('screen', result.assessmentSession.recording.screenPath)}
                              disabled={mediaOperations.screen?.viewing}
                              title="View Screen"
                            >
                              {mediaOperations.screen?.viewing ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                <FontAwesomeIcon icon={faEye} />
                              )}
                            </button>
                            <button
                              className="recording-action-btn recording-action-btn-download"
                              onClick={() => downloadVideo('screen', result.assessmentSession.recording.screenPath)}
                              disabled={mediaOperations.screen?.downloading}
                              title="Download Screen"
                            >
                              {mediaOperations.screen?.downloading ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                <FontAwesomeIcon icon={faDownload} />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {result.assessmentSession?.recording?.audioPath && (
                        <div className="recording-item-row">
                          <div className="recording-item-info">
                            <div className="recording-item-icon bg-green-100">
                              <FontAwesomeIcon icon={faMicrophone} className="text-green-600" />
                            </div>
                            <div className="recording-item-details">
                              <div className="recording-item-title">Audio Recording</div>
                              <div className="recording-item-subtitle">Voice Recording</div>
                            </div>
                          </div>
                          <div className="recording-item-actions">
                            <button
                              className="recording-action-btn recording-action-btn-view"
                              onClick={() => viewAudio(result.assessmentSession.recording.audioPath, 0)}
                              disabled={mediaOperations.audio?.[0]?.viewing}
                              title="View Audio"
                            >
                              {mediaOperations.audio?.[0]?.viewing ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                <FontAwesomeIcon icon={faPlayCircle} />
                              )}
                            </button>
                            <button
                              className="recording-action-btn recording-action-btn-download"
                              onClick={() => downloadAudio(result.assessmentSession.recording.audioPath, 0)}
                              disabled={mediaOperations.audio?.[0]?.downloading}
                              title="Download Audio"
                            >
                              {mediaOperations.audio?.[0]?.downloading ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                <FontAwesomeIcon icon={faDownload} />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {!result.assessmentSession?.recording?.videoPath && 
                       !result.assessmentSession?.recording?.screenPath && 
                       !result.assessmentSession?.recording?.audioPath && (
                        <div className="no-recordings-message">
                          <FontAwesomeIcon icon={faVideo} className="no-recordings-icon" />
                          <p>No video or audio recordings available</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Voice Answers Section */}
                  {result.assessmentSession?.voiceAnswers && result.assessmentSession.voiceAnswers.length > 0 && (
                    <div className="voice-answers-section">
                      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="voice-answers-header">
                          <h3>Voice Answers</h3>
                          <p>{result.assessmentSession.voiceAnswers.length} recorded responses</p>
                        </div>
                        
                        <div className="p-2 max-h-80 overflow-y-auto">
                          {result.assessmentSession.voiceAnswers.map((answer, index) => (
                            answer.audioPath && (
                              <div key={index} className="voice-answer-item">
                                <div className="voice-answer-info">
                                  <div className="voice-answer-title truncate">Q{index + 1}: {answer.question?.substring(0, 40) || 'Audio Answer'}{answer.question && answer.question.length > 40 ? '...' : ''}</div>
                                  <div className="voice-answer-subtitle truncate">Click to play or download</div>
                                </div>
                                <div className="voice-answer-actions">
                                  <button
                                    className="recording-action-btn recording-action-btn-view"
                                    onClick={() => viewAudio(answer.audioPath, index)}
                                    disabled={mediaOperations.audio?.[index]?.viewing}
                                    title={`Play Answer ${index + 1}`}
                                  >
                                    {mediaOperations.audio?.[index]?.viewing ? (
                                      <FontAwesomeIcon icon={faSpinner} spin />
                                    ) : (
                                      <FontAwesomeIcon icon={faPlayCircle} />
                                    )}
                                  </button>
                                  <button
                                    className="recording-action-btn recording-action-btn-download"
                                    onClick={() => downloadAudio(answer.audioPath, index)}
                                    disabled={mediaOperations.audio?.[index]?.downloading}
                                    title={`Download Answer ${index + 1}`}
                                  >
                                    {mediaOperations.audio?.[index]?.downloading ? (
                                      <FontAwesomeIcon icon={faSpinner} spin />
                                    ) : (
                                      <FontAwesomeIcon icon={faDownload} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Show a placeholder if no recordings at all */}
          {(!result.assessmentSession?.recording || 
            (!result.assessmentSession?.recording?.videoPath && 
             !result.assessmentSession?.recording?.screenPath && 
             !result.assessmentSession?.recording?.audioPath)) && 
           (!result.assessmentSession?.voiceAnswers || result.assessmentSession.voiceAnswers.length === 0) && (
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <FontAwesomeIcon icon={faVideo} />
              <span>No recordings</span>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
    <AnimatePresence>
      {expandedRow === result._id && (
        <motion.tr
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <td colSpan="12" className="px-0 py-0">
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {/* Contact Information - Compact Design */}
                <div className="bg-white p-3 rounded-md border border-gray-200">
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
                <div className="bg-white p-3 rounded-md border border-gray-200">
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
                        {renderListWithExpand(resumeData.certifications || [], index, "certifications")}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Skills - Compact Design */}
                <div className="bg-white p-3 rounded-md border border-gray-200">
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
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <h6 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                    Previous Companies
                  </h6>
                  <div className="text-xs compact-list">
                    {renderListWithExpand(resumeData.company_names || [], index, "company_names")}
                  </div>
                </div>
              </div>
              
              {/* View Recordings section moved to main table column */}
              
              {/* Voice Answers section moved to main table column */}
              
              {/* Experience Section - Compact Design */}
              <div className="mt-2 bg-white p-3 rounded-md border border-gray-200">
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
              
              {/* Analysis Section - Compact Design */}
              <div className="mt-2 bg-white p-3 rounded-md border border-gray-200">
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
                          {renderListWithExpand(analysis["Matched Skills"] || [], index, "matchedSkills")}
                        </div>
                      </div>
                      <div>
                        <span className="skill-analysis-title text-xs">Unmatched Skills:</span>
                        <div className="ml-0 compact-list text-xs">
                          {renderListWithExpand(analysis["Unmatched Skills"] || [], index, "unmatchedSkills")}
                        </div>
                      </div>
                      <div>
                        <span className="skill-analysis-title text-xs">Strengths:</span>
                        <div className="ml-0 compact-list text-xs">
                          {renderListWithExpand(analysis.Strengths || [], index, "strengths")}
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
                        {renderListWithExpand(analysis.Recommendations || [], index, "recommendations")}
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
            </motion.div>
          </td>
        </motion.tr>
      )}
    </AnimatePresence>
  </React.Fragment>
                  );
                })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Section - Moved outside table structure */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-center border-t border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                  <span className="text-sm font-medium">Previous</span>
                </button>
                <span className="text-gray-700 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  <span className="text-sm font-medium">Next</span>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
  
  );
}

export default CandidateTable;