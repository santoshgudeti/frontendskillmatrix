
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMagnifyingGlass, faRotateRight,
  faComment,
  faFileAlt,
  faVideo,
  faChevronDown,
  faChevronUp,
  faStar,
  faDownload,
  faEye,
  faFilter,
  faTimes,
  faSearch,
  faMapMarkerAlt,
  faClock,
  faGraduationCap,
  faLanguage,
  faBriefcase,
  faMoneyBillWave,
  faTools,
  faUserTie,
  faBuilding,
  faRotateLeft,
  faCalendarAlt
  
} from "@fortawesome/free-solid-svg-icons"
import '../Dashboard/UploadDocuments.css';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Spinner, Alert, Dropdown,Tabs, Tab, Badge  } from 'react-bootstrap';
import { io } from "socket.io-client";
import { FaExpand, FaCompress } from "react-icons/fa";
import { faGoogle, faMicrosoft} from '@fortawesome/free-brands-svg-icons';
import { axiosInstance } from "../../axiosUtils";
 
function CandidateTable() {
  const [expandedRow, setExpandedRow] = useState(null)
  const [members, setMembers] = useState([]); // Store fetched members
  const [filteredMembers, setFilteredMembers] = useState([]); // Store filtered results
  const [expandedLists, setExpandedLists] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [allSelected, setAllSelected] = useState({});
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [testResults, setTestResults] = useState([]);
    const [showGenerationModal, setShowGenerationModal] = useState(false);
    
    const [testScores, setTestScores] = useState([]); // Changed from testResults
    const [generationStatus, setGenerationStatus] = useState({
      loading: false,
      error: null,
      success: false,
      message: null
    });
    const [expandedScores, setExpandedScores] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [],
    designation: [],
    degree: [],
    company_names: [],
    jobType: [],
  });
  
  const filterIcons = { 
    skills: faTools,
    designation: faUserTie,
    degree: faGraduationCap,
    company_names: faBuilding,
    jobType: faBriefcase,
  }
  const [showModal, setShowModal] = useState({});
  
  // Add these new state variables
  const [viewMode, setViewMode] = useState('all'); // 'all', 'recent', or 'history'
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [historicalCandidates, setHistoricalCandidates] = useState([]);

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
          setCandidates(candidatesRes.data);
          setTestScores(scoresRes.data); // Updated variable name
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    // Add this new useEffect while keeping all existing ones
useEffect(() => {
  const fetchSegmentedData = async () => {
    try {
      const response = await axiosInstance.get('/api/candidates/segmented');
      setRecentCandidates(response.data.recent);
      setHistoricalCandidates(response.data.history);
    } catch (error) {
      console.error('Error fetching segmented candidates:', error);
      // Fallback to existing behavior if segmented endpoint fails
      setRecentCandidates([]);
      setHistoricalCandidates([]);
    }
  };
  fetchSegmentedData();
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
          // First check user's subscription status
          const userRes = await axiosInstance.get('/user', { withCredentials: true });
          const user = userRes.data.user;

          // Check assessment limits if not admin and has limits
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
          // Step 1: Generate MCQ questions
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
      
          // Step 2: Generate Voice questions
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
      
          // Step 3: Create assessment session with both question sets
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
            testLink: sessionResponse.data.testLink // For debugging
          });
      
          // Refresh candidates list after 2 seconds
          setTimeout(() => {
            setShowGenerationModal(false);
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
            testLink: error.response?.data?.testLink // For debugging
          });
        }
      };
      useEffect(() => {
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
            });

            console.log("Fetched candidates:", uniqueCandidates);
            setMembers(uniqueCandidates);
            setFilteredMembers(uniqueCandidates); // Initially show all members
          } catch (error) {
            console.error("Error fetching candidate data:", error.message);
          } finally {
            setLoading(false);
          }
        };

        fetchCandidates();
      }, []);

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
        const experienceStr = member.matchingResult[0]?.["Resume Data"]?.total_experience || "0 years";
        const experienceYears = parseFloat(experienceStr); // Extract numeric value
  
        const isFresher = selectedFilters.jobType.includes("Fresher") && experienceYears === 0;
        const isExperienced = selectedFilters.jobType.includes("Experienced") && experienceYears > 0;
  
        return isFresher || isExperienced;
      });
    }
    if (selectedFilters.degree.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.degree.some((degree) =>
          member.matchingResult[0]?.["Resume Data"]?.degree
            ?.join(", ")
            .toLowerCase()
            .includes(degree.toLowerCase())
        )
      );
    }
    if (selectedFilters.company_names.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.company_names.some((company_name) =>
          member.matchingResult[0]?.["Resume Data"]?.company_names
            ?.join(", ")
            .toLowerCase()
            .includes(company_name.toLowerCase())
        )
      );
    }
    if (selectedFilters.skills.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.skills.some((skills) =>
          member.matchingResult[0]?.["Resume Data"]?.skills
            ?.join(", ")
            .toLowerCase()
            .includes(skills.toLowerCase())
        )
      );
    }
   
 
    if (selectedFilters.designation.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.designation.some((designation) =>
          member.matchingResult[0]?.["Resume Data"]?.designation
            ?.join(", ")
            .toLowerCase()
            .includes(designation.toLowerCase())
        )
      );
    }


    setFilteredMembers(filtered);
  };
  const sortedFilteredMembers = [...filteredMembers].sort((a, b) => {
    const aMatch = a.matchingResult?.[0]?.["Resume Data"]?.["Matching Percentage"] || 0;
    const bMatch = b.matchingResult?.[0]?.["Resume Data"]?.["Matching Percentage"] || 0;
    return bMatch - aMatch; // Descending order
  });
  const extractUniqueValues = (key) => {
    if (key === "jobType") {
      return ["Fresher", "Experienced"];
    }
    return [
      ...new Set(
        members.flatMap((member) =>
          member.matchingResult[0]?.["Resume Data"]?.[key]?.flat() || []
        )
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
    });
    setAllSelected({});
    setFilteredMembers(members);
  };

  const handleOpenLink = (url) => {
    window.open(url, '_blank'); // Opens the link in a new tab
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

  const sortedCandidates = members
    .map((member) => ({
      ...member,
      matchingPercentage:
      member.matchingResult?.[0]?.["Resume Data"]?.["Matching Percentage"] ||
        0,
    }))
    .sort((a, b) => b.matchingPercentage - a.matchingPercentage);

  const toggleExpand = (index, type) => {
    setExpandedLists((prev) => ({
      ...prev,
      [`${index}-${type}`]: !prev[`${index}-${type}`],
    }));
  };

  const renderListWithExpand = (items, index, type) => {
    const maxItems = 3;
    const isExpanded = expandedLists[`${index}-${type}`];
    const visibleItems = isExpanded ? items : items.slice(0, maxItems);

    return (
      <>
        <ul className="bullet-list">
          {visibleItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        {items.length > maxItems && (
          <span
            className="toggle-link"
            onClick={() => toggleExpand(index, type)}
          >
            {isExpanded ? "Show Less" : "More..."}
          </span>
        )}
      </>
    );
  };



  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id)
  }
  if (loading) return (
    <div className="text-center p-5">
      <Spinner animation="border" />
      <p>Loading candidate data...</p>
    </div>
  );

// Add this component near the top of your return statement
const renderViewToggle = () => (
  <div className="view-toggle mb-1 mt-1 d-flex justify-content-center">
    <Button 
      variant={viewMode === 'all' ? 'primary' : 'outline-primary'}
      onClick={() => setViewMode('all')}
      className="me-2 text-black"
        style={{ backgroundColor: 'rgb(63 51 196 / 31%)' }}
    >
      All Candidates
    </Button>
    <Button 
      variant={viewMode === 'recent' ? 'primary' : 'outline-primary'}
      onClick={() => setViewMode('recent')}
      className="me-2 text-black"
       style={{ backgroundColor: 'rgb(63 51 196 / 31%)' }}
    >
      Recent Uploads
      {recentCandidates.length > 0 && (
        <Badge bg="danger" className="ms-2" >
          
          {recentCandidates.length}
        </Badge>
      )}
    </Button>
   
  </div>
);

const candidatesToDisplay = viewMode === 'recent' 
  ? recentCandidates 
  : viewMode === 'history'
    ? historicalCandidates
    : filteredMembers;

    // Sort the candidates based on the current view
  const sortedCandidatesToDisplay = [...candidatesToDisplay].sort((a, b) => {
    const aMatch = a.matchingResult?.[0]?.["Resume Data"]?.["Matching Percentage"] || 0;
    const bMatch = b.matchingResult?.[0]?.["Resume Data"]?.["Matching Percentage"] || 0;
    return bMatch - aMatch; // Descending order
  });


  return (
    <div className="card border-0 responsedisplay  shadow-sm">
      {renderViewToggle()}
<div
  className="filter-buttons-container p-3 border-bottom d-flex justify-content-center"
  style={{ backgroundColor: 'rgb(63 51 196 / 31%)' }}
>
      <div className="d-flex flex-wrap gap-2 align-items-center">
        {Object.keys(filterIcons).map((filter) => (
          <Button
            key={filter}
            variant="outline-dark"
            className="d-flex align-items-center gap-2 filter-btn bg-white"
            onClick={() => toggleModal(filter)}
          >
            <FontAwesomeIcon icon={filterIcons[filter]} className="text-black" />
            <span className="text-black">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
          </Button>
        ))}
  
          <Button
         variant="outline-dark"
            className="d-flex align-items-center gap-2 filter-btn bg-white"
          onClick={resetAllFilters}
        >
          <FontAwesomeIcon icon={faRotateRight} /> 
          <span className="text-black">Reset All</span>
        </Button>
  
        <Button
            variant="outline-none"
            className="d-flex align-items-center gap-2 filter-btn bg-white"
          onClick={applyFilters}
        >
       <FontAwesomeIcon icon={faMagnifyingGlass} />
       <FontAwesomeIcon icon={faRotateRight} /> 
          <span className="text-black">Search</span>
          
        </Button>
        
        {Object.keys(filterIcons).map((filter) => (
          <Modal
            key={filter}
            show={showModal[filter] || false}
            onHide={() => toggleModal(filter)}
            centered
            className="filter-modal"
            style={{ background: "rgba(255, 255, 255, 0.68)" }}
          >

      <div style={{  backgroundColor: 'rgb(215 211 255 / 82%)', borderRadius: '8px' }}>
            <Modal.Header closeButton>
              <Modal.Title className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={filterIcons[filter]} className="text-primary" />
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="filter-options">
                <Form>
                  <Form.Check
                    type="checkbox"
                    label="Select All"
                    checked={allSelected[filter] || false}
                    onChange={(e) => {
                      const isSelected = e.target.checked;
                      const allValues = extractUniqueValues(filter);
                      setAllSelected((prev) => ({ ...prev, [filter]: isSelected }));
                      handleFilterChange(filter, isSelected ? allValues : []);
                    }}
                  />
                  {extractUniqueValues(filter).map((value, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={value}
                      checked={selectedFilters[filter]?.includes(value) || false}
                      onChange={(e) => {
                        const selected = e.target.checked
                          ? [...(selectedFilters[filter] || []), value]
                          : selectedFilters[filter].filter((v) => v !== value);
                        handleFilterChange(filter, selected);
                      }}
                    />
                  ))}
                </Form>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
              <Button variant="secondary" onClick={() => handleFilterChange(filter, [])}>
                Reset
              </Button>
              <Button variant="primary" onClick={applyFilters}>
                Apply
              </Button>
            </Modal.Footer>
            </div>
          </Modal>
        ))}
      </div>
    </div>

<div className="container-fluid mt-4 px-0">


        
        {/* Generation Status Modal */}
        <Modal show={showGenerationModal} onHide={() => setShowGenerationModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Preparing Assessment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {generationStatus.loading && (
              <div className="text-center">
                <Spinner animation="border" />
                <p>{generationStatus.message || 'Processing...'}</p>
              </div>
            )}
            {generationStatus.error && (
              <Alert variant="danger">
                <Alert.Heading>Error</Alert.Heading>
                <p>{generationStatus.error}</p>
              </Alert>
            )}
            {generationStatus.success && (
              <Alert variant="success">
                <Alert.Heading>Success!</Alert.Heading>
                <p>{generationStatus.message}</p>
              </Alert>
            )}
          </Modal.Body>
        </Modal>
      <div className="table-responsive">
       <table className="table table-striped table-hover">
          <thead className="table candidate-table-header">
             <tr>
              <th>Rank</th>
              <th>Candidate</th>
              <th>Job Title</th>
              <th>Experience</th>
              <th>Match %</th>
              <th>View pdf</th>
              <th>Interview Schedular</th>
               <th>Details</th>
              <th>Status</th>
              <th>Score</th>
              <th>Send Test-Link</th>
            </tr>
          </thead>
          <tbody>
      {sortedCandidatesToDisplay.map((result, index) => {
              const resumeData = result.matchingResult?.[0]?.["Resume Data"] || {};
              const email = resumeData.email || "N/A";
              const session = result.assessmentSession;
              const testScore = result.testScore; // Updated variable name  
           const isRecent = recentCandidates.some(rc => 
              rc._id === result._id
            );
              const getStatusBadge = () => {
                if (!session) return <span className="badge bg-secondary">Not Sent</span>;
                switch (session.status) {
                  case 'completed': return <span className="badge bg-success">Completed</span>;
                  case 'in-progress': return <span className="badge bg-warning">In Progress</span>;
                  default: return <span className="badge bg-info">Pending</span>;
                }
              };
           return(
                <React.Fragment key={result._id || index}>
                   <tr className={`${expandedRow === result._id ? "expanded-row" : ""} ${isRecent ? "recent-candidate" : ""}`}>
                    <td>
                      {isRecent && viewMode !== 'recent' && (
                        <Badge bg="success" className="me-2">
                          New
                        </Badge>
                      )}
                <span className="badge bg-white text-dark">{index + 1}</span>

                  </td>
                  <td >
                    <div className="d-flex align-items-center">
                      
                      <div>
                        <h6 className="mb-0">{resumeData.name || "N/A"}</h6>
                        <small className="text-muted">{resumeData.email}</small>
                      </div>
                    </div>
                  </td>
                  <td >{resumeData?.["Job Title"] || "N/A"}</td>
                  <td >{resumeData.total_experience || "0"}</td>
                  <td >
                    <div className="d-flex align-items-center">
                      <div className="progress flex-grow-1" style={{ height: "8px" }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${resumeData["Matching Percentage"] || "0"}%` }}
                          aria-valuenow={resumeData["Matching Percentage"] || "0"}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <span className="ms-2 fw-bold">{resumeData["Matching Percentage"] || "0"}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                    <Dropdown>
                          <Dropdown.Toggle
                        
                            size="sm"
                            id={`resume-dropdown-${result._id}`}
                            className="custom-dropdown"
                              style={{ backgroundColor: 'rgb(63 51 196 / 31%)' }}

                            
                          >
                            <FontAwesomeIcon icon={faFileAlt} className="me-1" />
                            
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="custom-dropdown-menu"
                            style={{ backgroundColor: 'rgb(215 211 255 / 82%)' }}
                          >
                      
                              <Dropdown.Item 
                            as="a" 
                            href="#" 
                            onClick={async (e) => {
                              e.preventDefault();
                              const { success, url, error } = await handleResumeLink(result.resumeId?._id);
                              if (success && url) {
                                window.open(url, '_blank');
                              } else {
                                toast.error(error || 'Failed to open resume');
                              }
                            }}
                            className="custom-dropdown-item"
                          >
                            <FontAwesomeIcon icon={faEye} className="me-2 text-dark" />
                            View Resume
                          </Dropdown.Item>
                              <Dropdown.Item 
                                as="a" 
                                href="#" 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  try {
                                    const response = await axiosInstance.get(
                                      `/api/resumes/${result.resumeId?._id}?download=true`
                                    );
                                    if (response.data?.url) {
                                      window.location.href = response.data.url; // This triggers the download
                                    }
                                  } catch (error) {
                                    console.error('Download failed:', error);
                                    toast.error('Failed to initiate download');
                                  }
                                }}
                                className="custom-dropdown-item"
                              >
                                <FontAwesomeIcon icon={faDownload} className="me-2 text-dark" />
                                Download Resume
                              </Dropdown.Item>
                              <Dropdown.Item 
                                as="a" 
                                href="#" 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  const url = await handlejdLink(result.jobDescriptionId?._id);
                                  if (url && url !== '#') {
                                    window.open(url, '_blank');
                                  }
                                }}
                                className="custom-dropdown-item"
                              >
                                <FontAwesomeIcon icon={faEye} className="me-2 text-dark" />
                                View JD
                              </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        </div>
                     </td>
                      <td>
                              <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-none"
                            size="sm"
                            className="custom-dropdown text-white border-0"
                            style={{ backgroundColor: '#56629cb8' }}
                            
                          >
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                            Interview
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                           style={{ backgroundColor: 'rgb(215 211 255 / 82%)' }}
                          >
                            
                            <Dropdown.Item
                              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&add=${encodeURIComponent(resumeData.email || "")}&text=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon icon={faGoogle} className="me-2" />
                              Google Calendar
                            </Dropdown.Item>
                            <Dropdown.Item
                              href={`https://outlook.office.com/calendar/0/deeplink/compose?to=${encodeURIComponent(resumeData.email || "")}&subject=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon icon={faMicrosoft} className="me-2" />
                              Microsoft Teams
                            </Dropdown.Item>
                            <Dropdown.Item
                              href={`https://zoom.us/schedule?email=${encodeURIComponent(resumeData.email || "")}&topic=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon icon={faVideo} className="me-2" />
                              Zoom
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                   </td>

                   <td>                  
                        <button
                        className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 text-white"
                        onClick={() => toggleExpandRow(result._id)}
                        title="Toggle Details"
                          style={{ backgroundColor: 'rgb(63 51 196 / 31%)' }}
                        
                      >
                        Details
                        <FontAwesomeIcon icon={expandedRow === result._id ? faChevronUp : faChevronDown} />
                      </button>
             
                  </td>
                    
                   <td>{getStatusBadge()}</td>
                                      <td>
                              {testScore ? (
                                <Dropdown 
                                  onClick={(e) => e.stopPropagation()}
                                  className="score-dropdown"
                                  
                                >
                                  <Dropdown.Toggle 
                                    variant="outline-primary" 
                                    id={`score-dropdown-${result._id}`}
                                    className="d-flex align-items-center justify-content-between"
                                    
                                      style={{ backgroundColor: 'rgb(250 250 255 / 70%);' }}
                                  >
                                    <span className="fw-bold">
                                      {testScore.combinedScore !== undefined ? `${testScore.combinedScore}%` : 'N/A'}
                                    </span>
                                  </Dropdown.Toggle>
                                  
                                  <Dropdown.Menu
                                  
                                    style={{ backgroundColor: 'rgb(215 211 255 / 95%)' }}>
                                    <Dropdown.Header>Score Breakdown</Dropdown.Header>
                                    <Dropdown.ItemText className="d-flex justify-content-between">
                                      <span>MCQ Score:</span>
                                      <span className="fw-bold">{testScore.score || 0}%</span>
                                    </Dropdown.ItemText>
                                    <Dropdown.ItemText className="d-flex justify-content-between">
                                      <span>Audio Score:</span>
                                      <span className="fw-bold">{testScore.audioScore ? Math.round(testScore.audioScore) : 0}%</span>
                                    </Dropdown.ItemText>
                                    <Dropdown.ItemText className="d-flex justify-content-between">
                                      <span>Text Score:</span>
                                      <span className="fw-bold">{testScore.textScore ? Math.round(testScore.textScore) : 0}%</span>
                                    </Dropdown.ItemText>
                                    <Dropdown.ItemText className="d-flex justify-content-between">
                                      <span>Video Score:</span>
                                      <span className="fw-bold">{testScore.videoScore || 0}%</span>
                                    </Dropdown.ItemText>
                                    <Dropdown.Divider />
                                    <Dropdown.ItemText className="d-flex justify-content-between">
                                      <span className="fw-bold">Combined:</span>
                                      <span className="fw-bold text-primary">
                                        {testScore.combinedScore !== undefined ? `${testScore.combinedScore}%` : 'Calculating...'}
                                      </span>
                                    </Dropdown.ItemText>
                                  </Dropdown.Menu>
                                </Dropdown>
                              ) : (
                                'N/A'
                              )}
                            </td>
                            
                                      <td>
                                        {!session || session.status === 'pending' ? (
                                          <button
                                            className="btn btn-sm btn-primary"
                                               style={{ backgroundColor: '#56629cb8' }}
                                            onClick={() => sendTestLink(
                                              email,
                                              resumeData["Job Title"],
                                              result.resumeId?._id,
                                              result.jobDescriptionId?._id
                                            )}
                                          >
                                            Send Assessment 
                                          </button>
                                        ) : (
                                          <button className="btn btn-sm btn-outline-secondary" disabled>
                                            Sent
                                          </button>
                                        )}
                                      </td>
                                         
                            
                        </tr>
                        {expandedRow === result._id && (
                          <tr className="expanded-content"
                          >
                            <td colSpan="12"
                              style={{ backgroundColor: 'rgb(213 211 254 / 68%)' }}
                            >
                              <div
                        className="p-4 rounded shadow-sm text-white"
                        style={{ backgroundColor: 'rgb(213 211 254 / 68%)' }}
                      >
                                        <div className="row">
                          <div className="col-md-6"
                          
                          >
                            <h6 className="mb-3 text-black text-decoration-underline"><strong>Contact Information</strong></h6>
                            <p className="text-black ">
                              <strong>Mobile : </strong> {resumeData.mobile_number || "N/A"}
                            </p>
                          
                              <p className="text-black ">
                          <strong>Email: </strong>
                          {resumeData.email ? (
                            <span className="badge bg-black">{resumeData.email}</span>
                          ) : (
                            "N/A"
                          )}
                                </p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="mb-3 text-black text-decoration-underline"><strong>Professional Details</strong></h6>
                              <p className="text-black ">
                              <strong>Designation : </strong> {resumeData.designation}
                            </p>
                              <p className="text-black ">
                              <strong>Degree : </strong> {resumeData.degree?.join(", ") || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-6">
                            <h6 className="mb-3 text-black"> <strong>Skills : </strong></h6>
                            <div className="d-flex flex-wrap gap-2">
                              {resumeData.skills?.map((skill, index) => (
                                  <span key={index} className="badge bg-black">
                                    {skill}
                                  </span>
                                )) || (
                                  <span className="text-black">No skills available</span>
                                )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <h6 className="mb-3 text-black"><strong>Previous Companies : </strong></h6>
                            <ul className="list-unstyled">
                              {resumeData.company_names?.map((company, index) => (
                                <li key={index} className="mb-1">
                                  <FontAwesomeIcon icon={faStar} className="text-warning me-2" />
                                  {company}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    
                    
                  </tr>
                   
                )}
              </React.Fragment>
              );
          })}
          
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default CandidateTable

