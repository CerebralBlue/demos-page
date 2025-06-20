import React, { useState } from 'react';
import Icon from '@/components/Icon';
import axios from 'axios';

interface VideoOutlineProps {
  onFileUpload?: (file: File) => void;
  onCreateWithLLM?: (prompt: string) => void;
  nextStep: () => void;
}

const VideoOutline: React.FC<VideoOutlineProps> = ({ onFileUpload, onCreateWithLLM, nextStep }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'create'>('upload');
  const [prompt, setPrompt] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setUploadError(null);
    setUploadSuccess(null);

    // Validate file type
    const validTypes = ['.doc', '.docx', '.odf', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(fileExtension)) {
      setUploadError(`Invalid file type. Please upload ${validTypes.join(', ')} files only.`);
      return;
    }

    // Call parent handler if provided
    if (onFileUpload) {
      onFileUpload(file);
    }

    // Process the file
    await ingestFile(file);
  };

  const ingestFile = async (file: File) => {
    setIsIngesting(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const urlUpload = `${baseUrl}/neuralseek/upload-file`;
    const urlMaistro = `${baseUrl}/neuralseek/maistro`;
    const urlName = "prod-admed-demo";

    if (!baseUrl) {
      setUploadError('API configuration error. Please contact support.');
      setIsIngesting(false);
      return;
    }

    try {
      // Step 1: Upload the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("url_name", urlName);

      const uploadResponse = await axios.post(urlUpload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const uploadedFileName = uploadResponse.data.fn;

      if (!uploadedFileName) {
        throw new Error('File upload failed. No filename returned from server.');
      }

      // Step 2: Process the uploaded file
      const maistroCallBody = {
        url_name: urlName,
        agent: "ingest_outline_document",
        params: [
          { name: "name", value: uploadedFileName },
          { name: "type", value: "Outline" }],
        options: { returnVariables: false, returnVariablesExpanded: false }
      };

      await axios.post(urlMaistro, maistroCallBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Success
      setUploadSuccess(`File "${file.name}" uploaded and processed successfully.`);

      // Move to the next step 
      nextStep();

    } catch (error) {
      // Handle errors
      console.error('File upload error:', error);
      setUploadError(
        error instanceof Error
          ? `Upload failed: ${error.message}`
          : 'Upload failed. Please try again.'
      );
    } finally {
      setIsIngesting(false);
    }
  };

  const handleCreateSubmit = () => {
    if (prompt.trim() && onCreateWithLLM) {
      onCreateWithLLM(prompt.trim());
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold dark:text-gray-200">Upload or Create Video Outline</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Upload a document (.doc, .odf) or create your video outline using AI
      </p>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upload'
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          onClick={() => setActiveTab('upload')}
        >
          <div className="flex items-center space-x-2">
            <Icon name="document-arrow-up" className="w-4 h-4" />
            <span>Upload Document</span>
          </div>
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'create'
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          onClick={() => setActiveTab('create')}
        >
          <div className="flex items-center space-x-2">
            <Icon name="sparkles" className="w-4 h-4" />
            <span>Create with AI</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer 
                  ${isIngesting ? 'opacity-70 pointer-events-none' : ''} 
                  ${uploadError ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
                    uploadSuccess ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800' :
                      'border-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600'}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isIngesting ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-sm text-blue-500 dark:text-blue-400">Processing your file...</p>
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <Icon name="check-circle" className="w-12 h-12 mb-4 text-green-500 dark:text-green-400" />
                      <p className="mb-2 text-sm text-green-600 dark:text-green-400">{uploadSuccess}</p>
                      <p className="text-xs text-green-500 dark:text-green-400">Click to upload another file</p>
                    </>
                  ) : (
                    <>
                      <Icon name="document-arrow-up" className="w-12 h-12 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">DOC, DOCX, ODF, or TXT files</p>
                    </>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".doc,.docx,.odf,.txt"
                  onChange={handleFileUpload}
                  disabled={isIngesting}
                />
              </label>
            </div>

            {/* Error message */}
            {uploadError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                <div className="flex items-start space-x-2">
                  <Icon name="exclamation-circle" className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <Icon name="info" className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    AI-Powered Outline Creation
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Describe your video topic, target audience, and key points. Our AI will create a structured outline for you.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Video Outline Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a video outline for a 10-minute tutorial about React hooks for beginners. Include introduction, useState, useEffect, custom hooks, and conclusion with practical examples."
                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Be specific about your topic, duration, target audience, and key points you want to cover.
              </p>
            </div>

            <button
              onClick={handleCreateSubmit}
              disabled={!prompt.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="sparkles" className="w-4 h-4" />
              <span>Generate Outline</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoOutline;