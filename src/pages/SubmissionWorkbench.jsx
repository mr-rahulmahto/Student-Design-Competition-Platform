import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Link as LinkIcon, 
  CheckCircle2, 
  Trash2, 
  Sparkles
} from 'lucide-react';

export const SubmissionWorkbench = () => {
  const { 
    competitions, 
    selectedCompetitionId, 
    navigateTo, 
    createSubmission,
    updateSubmission,
    submissions,
    selectedSubmissionId
  } = useApp();

  const competition = competitions.find(c => c.id === selectedCompetitionId) || competitions[0];
  
  // Check if editing an existing submission
  const editingSubmission = submissions.find(s => s.id === selectedSubmissionId);

  // Form State
  const [projectTitle, setProjectTitle] = useState(editingSubmission ? editingSubmission.projectTitle : '');
  const [tagline, setTagline] = useState(editingSubmission ? editingSubmission.tagline : '');
  const [category] = useState(editingSubmission ? editingSubmission.category : competition.category);
  const [summary, setSummary] = useState(editingSubmission ? editingSubmission.summary : '');
  const [figmaUrl, setFigmaUrl] = useState(editingSubmission && editingSubmission.links ? (editingSubmission.links[0]?.url || '') : '');
  const [githubUrl, setGithubUrl] = useState(editingSubmission && editingSubmission.links ? (editingSubmission.links[1]?.url || '') : '');
  
  // Uploaded Files State
  const [files, setFiles] = useState(editingSubmission ? editingSubmission.files : [
    {
      id: 'f-sample-1',
      name: 'Project_Design_Overview.pdf',
      size: '3.4 MB',
      type: 'pdf',
      url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1000&q=80'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState('');

  // File Upload Simulator
  const handleSimulatedFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (!uploadedFiles.length) return;

    uploadedFiles.forEach((file, index) => {
      const isImg = file.type.includes('image');
      const mockFileObj = {
        id: 'f-' + Date.now() + '-' + index,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: isImg ? 'image' : 'pdf',
        url: isImg 
          ? URL.createObjectURL(file) 
          : 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1000&q=80'
      };
      setFiles(prev => [...prev, mockFileObj]);
    });
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const isValidUrl = (url) => {
    if (!url.trim()) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (status = 'Submitted') => {
    if (!projectTitle.trim() || !summary.trim()) {
      alert('Please fill in the Project Title and Executive Summary.');
      return;
    }

    if (status === 'Submitted' && files.length === 0 && !figmaUrl.trim() && !githubUrl.trim()) {
      alert('Please attach at least one design file or provide a prototype/repository link before final submission.');
      return;
    }

    if (!isValidUrl(figmaUrl) || !isValidUrl(githubUrl)) {
      alert('Please enter valid URLs for prototype and repository links.');
      return;
    }

    setIsSubmitting(true);

    const submissionPayload = {
      competitionId: competition.id,
      projectTitle,
      tagline,
      category,
      summary,
      status,
      files,
      links: [
        { label: 'Figma / Interactive Link', url: figmaUrl || 'https://figma.com/@project-demo' },
        { label: 'Source Repository / Video', url: githubUrl || 'https://youtube.com/@demo-video' }
      ]
    };

    const saved = editingSubmission
      ? await updateSubmission(editingSubmission.id, submissionPayload)
      : await createSubmission(submissionPayload);

    setIsSubmitting(false);

    if (saved) {
      setGeneratedRefId('SUB-2026-' + Math.floor(1000 + Math.random() * 9000));
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Header & Navigation */}
      <button
        onClick={() => navigateTo('detail', competition.id)}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Competition Brief</span>
      </button>

      <div className="surface-card p-6 sm:p-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md inline-block">
          Official Entry Workbench
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          {editingSubmission ? 'Edit Submission:' : 'Submit Project to:'} {competition.title}
        </h1>
        <p className="text-xs text-slate-600 font-sans">
          Organized by <strong>{competition.organizer}</strong> • Category: <span className="text-indigo-700 font-bold">{competition.category}</span>
        </p>
      </div>

      {/* Main Submission Form */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* Section 1: Project Metadata */}
        <div className="surface-card p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>1. Project Overview & Problem Statement</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. EcoTrack - Smart Campus Food Waste Management"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full app-input px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Project Tagline (One-line Summary)
              </label>
              <input
                type="text"
                placeholder="e.g. Helping urban households reduce food wastage through smart expiry alerts"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full app-input px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Executive Case Study & Design Rationale <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500">{summary.length} characters</span>
              </div>
              <textarea
                rows={5}
                placeholder="Describe your design process, user research findings, pain points identified, and how your design solves the core challenge..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full app-input px-4 py-3 rounded-xl text-sm font-sans"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 2: Drag & Drop File Upload Simulator */}
        <div className="surface-card p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" />
            <span>2. Design Artifacts & Pitch Deck</span>
          </h3>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-2xl p-8 text-center bg-indigo-50/40 hover:bg-indigo-50/70 transition-all relative cursor-pointer group">
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleSimulatedFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-2.5 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center mx-auto shadow-xs border border-indigo-100 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Click or Drag & Drop Design Artifacts</p>
                <p className="text-xs text-slate-500 mt-0.5">Supports PDF presentation decks, PNG, JPG renders (Max 25MB per file)</p>
              </div>
            </div>
          </div>

          {/* Render Uploaded File Cards */}
          {files.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Attached Files ({files.length}):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map(f => (
                  <div key={f.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between space-x-3">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {f.type === 'image' ? (
                        <img src={f.url} alt={f.name} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="overflow-hidden text-xs">
                        <span className="font-bold text-slate-900 truncate block">{f.name}</span>
                        <span className="text-[10px] text-slate-500 block">{f.size}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      aria-label="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: External Prototype Links */}
        <div className="surface-card p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            <span>3. Interactive Prototype & Repository Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Figma / Adobe XD Prototype URL
              </label>
              <input
                type="url"
                placeholder="https://figma.com/@your-prototype"
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                className="w-full app-input px-4 py-2.5 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                GitHub Repository / Video Walkthrough URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/user/project"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full app-input px-4 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('Submitted')}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span>Saving Entry...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Final Project Entry</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 font-heading">
                Entry Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Your design project <strong>"{projectTitle}"</strong> has been logged for <strong>{competition.title}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Reference Code:</span>
                <span className="font-mono text-indigo-700 font-bold">{generatedRefId || 'SUB-2026-8812'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Initial Status:</span>
                <span className="text-emerald-700 font-bold">Submitted</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => navigateTo('my-submissions')}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                Track My Submissions
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
