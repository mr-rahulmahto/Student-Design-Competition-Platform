import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  UserCheck, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Globe,
  Award,
  ExternalLink,
  Edit2, 
  Check, 
  Camera, 
  Upload, 
  X 
} from 'lucide-react';

export const StudentProfile = () => {
  const { user, updateUserProfile, submissions, navigateTo } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);
  const [degree, setDegree] = useState(user.degree);
  const [institution, setInstitution] = useState(user.institution);
  const [location, setLocation] = useState(user.location || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user.portfolioUrl);
  const [organizerName, setOrganizerName] = useState(user.organizerName || '');
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState(user.skills || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user.name || '');
    setAvatar(user.avatar || '');
    setBio(user.bio || '');
    setDegree(user.degree || '');
    setInstitution(user.institution || '');
    setLocation(user.location || '');
    setPortfolioUrl(user.portfolioUrl || '');
    setOrganizerName(user.organizerName || '');
    setSkills(user.skills || []);
  }, [user]);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  ];

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setAvatar(localUrl);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const saved = await updateUserProfile({
      name,
      avatar,
      bio,
      degree,
      institution,
      location,
      portfolioUrl,
      organizerName,
      skills
    });
    setIsSaving(false);
    if (saved) {
      setIsEditing(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Profile Header Banner */}
      <div className="surface-card p-6 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Avatar with Edit Badge Trigger */}
            <div className="relative group cursor-pointer" onClick={() => setIsEditing(true)}>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-50 border border-slate-200 shadow-sm transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                <Camera className="w-5 h-5 text-white" />
                <span>Change</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {user.role === 'admin' ? 'Jury Admin' : 'Student Creator'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 flex items-center gap-2 font-medium font-sans">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>{user.degree}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 pt-1 font-medium font-sans">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.institution}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.location || 'India'}</span>
                </span>
                {user.organizerName && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                    <span>{user.organizerName}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all flex items-center space-x-2 shadow-2xs"
            >
              <Edit2 className="w-4 h-4 text-indigo-600" />
              <span>{isEditing ? 'Close Profile Editor' : 'Edit Profile & Photo'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Editable Form Modal / Registration Editor */}
      {isEditing && (
        <div className="surface-card p-6 sm:p-8 space-y-6 border-indigo-200 bg-indigo-50/30">
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <span>{user.role === 'admin' ? 'Edit Admin Profile' : 'Edit Student Profile & Registration'}</span>
          </h3>

          {/* Section: Profile Image Upload */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-heading">
              Profile Avatar / Student Photo
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={avatar}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-600/30 border border-slate-200 shadow-2xs"
              />

              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-3">
                  <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer transition-all flex items-center space-x-2 shadow-2xs">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-500">or enter image URL below</span>
                </div>

                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full app-input px-3.5 py-2 rounded-xl text-xs"
                />

                {/* Preset Avatars Selection */}
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-xs text-slate-500 font-medium">Presets:</span>
                  {presetAvatars.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Preset ${idx + 1}`}
                      onClick={() => setAvatar(url)}
                      className={`w-7 h-7 rounded-lg object-cover cursor-pointer border hover:scale-110 transition-transform ${
                        avatar === url ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-slate-200 opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full app-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Degree Program</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full app-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institution / School</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full app-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City / Location</label>
              <input
                type="text"
                placeholder="e.g. Ahmedabad, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full app-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organizer / Chapter / Club Name</label>
              <input
                type="text"
                placeholder="e.g. Unified Mentor Student Chapter / Design Club"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full app-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Portfolio Website URL</label>
              <input
                type="url"
                placeholder="https://yourportfolio.design"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full app-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio Summary</label>
              <textarea
                rows={3}
                placeholder="Write a brief intro about your design philosophy and interests..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full app-input px-3.5 py-2 rounded-xl text-xs font-sans"
              ></textarea>
            </div>
          </div>

          {/* Manage Skills */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700">Design Skills & Tools</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Design Systems, Figma)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="app-input px-3.5 py-2 rounded-xl text-xs flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold flex items-center gap-1.5">
                  <span>{s}</span>
                  <X onClick={() => removeSkill(s)} className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600 cursor-pointer" />
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-700 font-bold text-xs border border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Bio & Skills, Right Portfolio Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Bio Box */}
          <div className="surface-card p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
              About Me
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {user.bio || 'Passionate student designer creating user-centered solutions for real-world impact.'}
            </p>
          </div>

          {/* Design Skills */}
          <div className="surface-card p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {(user.skills || []).map(skill => (
                <span 
                  key={skill}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Social / Portfolio Links */}
          <div className="surface-card p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
              Portfolio & Profiles
            </h3>
            <div className="space-y-2 text-xs">
              <a 
                href={user.portfolioUrl || 'https://rahulmahto.design'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-indigo-700 font-bold flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>{user.portfolioUrl || 'https://rahulmahto.design'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Submitted Portfolio Showcase */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="surface-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Submitted Project Showcase</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {submissions.length} Projects
              </span>
            </div>

            {submissions.length === 0 ? (
              <p className="text-xs text-slate-500 font-sans">No project submissions uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                {submissions.map(sub => (
                  <div key={sub.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        {sub.competitionTitle}
                      </span>
                      <StatusBadge status={sub.status} type="submission" />
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-heading">
                      {sub.projectTitle}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-sans">
                      {sub.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/80">
                      <span>Submitted on {new Date(sub.submittedAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => navigateTo('my-submissions', null, sub.id)}
                        className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
