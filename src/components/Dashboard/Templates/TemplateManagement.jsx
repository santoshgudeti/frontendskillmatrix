import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSave,
  faTimes,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../axiosUtils';
import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';

const TemplateManagement = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/document-collection/templates');
      setTemplates(response.data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setFormData({
      name: '',
      subject: '',
      content: ''
    });
    setSelectedTemplate(null);
    setIsEditing(true);
  };

  const handleEditTemplate = (template) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content
    });
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/api/document-collection/templates/${templateId}`);
      toast.success('Template deleted successfully!');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.subject || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      if (selectedTemplate) {
        // Update existing template
        await axiosInstance.put(`/api/document-collection/templates/${selectedTemplate._id}`, formData);
        toast.success('Template updated successfully!');
      } else {
        // Create new template
        await axiosInstance.post('/api/document-collection/templates', formData);
        toast.success('Template created successfully!');
      }
      
      setIsEditing(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const handlePreviewTemplate = (template) => {
    setPreviewContent(template.content);
    setShowPreview(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faFileAlt} spin size="3x" className="text-blue-600 mb-4" />
          <p className="text-gray-600">Loading templates...</p>
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
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Email Template Management
                </h1>
                <p className="text-gray-600">Create, edit, and manage your email templates</p>
              </div>
            </div>
            <Button
              onClick={handleCreateTemplate}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <FontAwesomeIcon icon={faPlus} />
              Create Template
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {isEditing ? (
          // Edit/Create Template Form
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTemplate ? 'Edit Template' : 'Create New Template'}
              </h2>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                >
                  <FontAwesomeIcon icon={faSave} />
                  Save Template
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Enter HTML template content. You can use placeholders like {{candidateName}}, {{companyName}}, {{documentList}}, etc."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Available placeholders: {'{{candidateName}}'}, {'{{companyName}}'}, {'{{documentList}}'}, {'{{customMessage}}'}, {'{{uploadLink}}'}, {'{{hrEmail}}'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-500">Template preview will appear here</p>' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Template List
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templates.map((template) => (
                    <tr key={template._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              <FontAwesomeIcon icon={faFileAlt} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                            {template.isDefault && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{template.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => handlePreviewTemplate(template)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                            <span className="hidden md:inline">Edit</span>
                          </Button>
                          {!template.isDefault && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteTemplate(template._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              <span className="hidden md:inline">Delete</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {templates.length === 0 && (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faFileAlt} className="text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No templates found</h3>
                <p className="text-gray-500 mb-4">Create your first template to get started</p>
                <Button
                  onClick={handleCreateTemplate}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mx-auto"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Create Template
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Template Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div 
                className="prose max-w-none border border-gray-200 rounded-lg p-6 bg-white"
                dangerouslySetInnerHTML={{ __html: previewContent }} 
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TemplateManagement;