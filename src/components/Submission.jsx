import { useState, useEffect } from 'react';
import {
  Send,
  Save,
  Check,
  Circle,
  AlertCircle,
  FileText,
  Video,
  Github,
  Globe,
  Clock,
  Users,
  CheckCircle2,
  Edit3,
  Upload,
} from 'lucide-react';
import { cn } from '../lib/design-system';
import AppLayout from './AppLayout';
import { EmptyState } from './ui/ErrorState';

// ============================================================================
// SUBMISSION REQUIREMENTS
// ============================================================================

const SUBMISSION_FIELDS = [
  { id: 'projectName', label: 'Project Name', required: true, icon: FileText },
  { id: 'description', label: 'Project Description', required: true, icon: FileText },
  { id: 'demoVideoUrl', label: 'Demo Video URL', required: true, icon: Video },
  { id: 'repoUrl', label: 'Repository URL', required: true, icon: Github },
  { id: 'liveDemoUrl', label: 'Live Demo URL', required: false, icon: Globe },
];

// ============================================================================
// COMPONENT
// ============================================================================

function Submission({ user, teams, onNavigate, onUpdateSubmission, eventPhase }) {
  // Find the user's team (as captain or member)
  const userTeam = teams.find(
    (team) => team.captainId === user?.id || team.members?.some((m) => m.id === user?.id)
  );
  
  const isCaptain = userTeam?.captainId === user?.id;
  
  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    demoVideoUrl: '',
    repoUrl: '',
    liveDemoUrl: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Initialize form with existing submission data
  useEffect(() => {
    if (userTeam?.submission) {
      setFormData({
        projectName: userTeam.submission.projectName || '',
        description: userTeam.submission.description || '',
        demoVideoUrl: userTeam.submission.demoVideoUrl || '',
        repoUrl: userTeam.submission.repoUrl || '',
        liveDemoUrl: userTeam.submission.liveDemoUrl || '',
      });
    }
  }, [userTeam]);

  // Calculate completion status
  const getCompletedFields = () => {
    return SUBMISSION_FIELDS.filter((field) => {
      const value = formData[field.id];
      return value && value.trim() !== '';
    });
  };

  const getRequiredFields = () => SUBMISSION_FIELDS.filter((f) => f.required);
  const completedFields = getCompletedFields();
  const requiredFields = getRequiredFields();
  const completedRequired = completedFields.filter((f) => f.required);
  const canSubmit = completedRequired.length === requiredFields.length;

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save as draft
  const handleSaveDraft = async () => {
    if (!userTeam || !isCaptain) return;
    
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    onUpdateSubmission(userTeam.id, {
      ...formData,
      status: 'draft',
      lastUpdated: new Date().toISOString(),
    });
    
    setSaveMessage('Draft saved!');
    setIsSaving(false);
    
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Submit project
  const handleSubmit = async () => {
    if (!userTeam || !isCaptain || !canSubmit) return;
    
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate submit delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const now = new Date().toISOString();
    onUpdateSubmission(userTeam.id, {
      ...formData,
      status: 'submitted',
      submittedAt: now,
      lastUpdated: now,
    });
    
    setSaveMessage('Project submitted successfully!');
    setIsSaving(false);
  };

  // Get status display info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'submitted':
        return { label: 'Submitted', color: 'rgb(34, 197, 94)', bgColor: 'rgba(34, 197, 94, 0.1)', icon: CheckCircle2 };
      case 'draft':
        return { label: 'Draft', color: 'rgb(245, 158, 11)', bgColor: 'rgba(245, 158, 11, 0.1)', icon: Edit3 };
      default:
        return { label: 'Not Started', color: 'rgb(156, 163, 175)', bgColor: 'rgba(156, 163, 175, 0.1)', icon: Circle };
    }
  };

  const submissionStatus = userTeam?.submission?.status || 'not_started';
  const statusInfo = getStatusInfo(submissionStatus);
  const StatusIcon = statusInfo.icon;

  // ============================================================================
  // RENDER: NO TEAM STATE
  // ============================================================================
  if (!userTeam) {
    return (
      <AppLayout
        user={user}
        teams={teams}
        onNavigate={onNavigate}
        eventPhase={eventPhase}
        activeNav="submission"
      >
        <div className="p-4 sm:p-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-arena-card border border-arena-border rounded-full mb-4">
              <Upload className="w-5 h-5 text-brand" />
              <span className="font-bold text-sm text-text-primary">SUBMIT YOUR PROJECT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-brand mb-3 font-display">
              PROJECT SUBMISSION
            </h1>
            <p className="text-arena-secondary max-w-2xl mx-auto">
              Submit your hackathon project for judging. Complete all required fields and share your creation with the world.
            </p>
          </div>

          <EmptyState
            emoji="👥"
            title="No Team Yet"
            message="You need to join or create an idea before you can submit a project."
            action={() => onNavigate('marketplace')}
            actionText="Find a Team"
          />
        </div>
      </AppLayout>
    );
  }

  // ============================================================================
  // RENDER: TEAM MEMBER (NON-CAPTAIN) VIEW
  // ============================================================================
  if (!isCaptain) {
    return (
      <AppLayout
        user={user}
        teams={teams}
        onNavigate={onNavigate}
        eventPhase={eventPhase}
        activeNav="submission"
      >
        <div className="p-4 sm:p-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-arena-card border border-arena-border rounded-full mb-4">
              <Upload className="w-5 h-5 text-brand" />
              <span className="font-bold text-sm text-text-primary">SUBMIT YOUR PROJECT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-brand mb-3 font-display">
              PROJECT SUBMISSION
            </h1>
            <p className="text-arena-secondary max-w-2xl mx-auto">
              View your team's submission status. Only the team captain can edit the submission.
            </p>
          </div>

          {/* Team Info */}
          <div className="p-4 mb-6 border-l-4 border border-arena-border rounded-xl bg-arena-card">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-text-secondary" />
              <div>
                <div className="font-bold text-text-primary">
                  {userTeam.name}
                </div>
                <div className="text-xs text-arena-secondary">
                  Captain: {userTeam.members.find((m) => m.id === userTeam.captainId)?.name}
                </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-arena-card border border-arena-border rounded-xl p-6 mb-6">
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Submission Status
              </h2>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
                style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
              >
                <StatusIcon className="w-4 h-4" />
                {statusInfo.label}
              </div>
            </div>

            {submissionStatus === 'not_started' ? (
              <p className="text-arena-muted text-center py-8">
                Your team hasn't started the submission yet.
              </p>
            ) : (
              <div className="space-y-4">
                {userTeam.submission?.projectName && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-arena-muted mb-1">
                      Project Name
                    </div>
                    <div className="text-text-primary font-medium">{userTeam.submission.projectName}</div>
                  </div>
                )}
                {userTeam.submission?.description && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-arena-muted mb-1">
                      Description
                    </div>
                    <div className="text-arena-secondary">{userTeam.submission.description}</div>
                  </div>
                )}
                {userTeam.submission?.repoUrl && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-arena-muted mb-1">
                      Repository
                    </div>
                    <a
                      href={userTeam.submission.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ai hover:underline"
                    >
                      {userTeam.submission.repoUrl}
                    </a>
                  </div>
                )}
                {userTeam.submission?.demoVideoUrl && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-arena-muted mb-1">
                      Demo Video
                    </div>
                    <a
                      href={userTeam.submission.demoVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ai hover:underline"
                    >
                      {userTeam.submission.demoVideoUrl}
                    </a>
                  </div>
                )}
                {userTeam.submission?.liveDemoUrl && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-arena-muted mb-1">
                      Live Demo
                    </div>
                    <a
                      href={userTeam.submission.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ai hover:underline"
                    >
                      {userTeam.submission.liveDemoUrl}
                    </a>
                  </div>
                )}
                {userTeam.submission?.lastUpdated && (
                  <div className="pt-4 border-t border-arena-border text-xs text-arena-muted">
                    Last updated: {new Date(userTeam.submission.lastUpdated).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    );
  }

  // ============================================================================
  // RENDER: CAPTAIN VIEW (EDITABLE FORM)
  // ============================================================================
  return (
    <AppLayout
      user={user}
      teams={teams}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="submission"
    >
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-arena-card border border-arena-border rounded-full mb-4">
            <Upload className="w-5 h-5 text-brand" />
            <span className="font-bold text-sm text-text-primary">SUBMIT YOUR PROJECT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand mb-3 font-display">
            PROJECT SUBMISSION
          </h1>
          <p className="text-arena-secondary max-w-2xl mx-auto">
            Submit your hackathon project for judging. Complete all required fields and share your creation with the world.
          </p>
        </div>

        {/* Status Badge + Team Info Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Team Info */}
          <div className="flex-1 p-4 border-l-4 border border-arena-border rounded-xl bg-arena-card">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-text-secondary" />
              <div>
                <div className="font-bold text-text-primary">
                  {userTeam.name}
                </div>
                <div className="text-xs text-arena-secondary">
                  You are the team captain
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
            style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
          >
            <StatusIcon className="w-4 h-4" />
            {statusInfo.label}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Project Name */}
            <div className="bg-arena-card border border-arena-border rounded-xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Project Name <span className="text-human">*</span>
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                placeholder="Enter your project name"
                className="w-full p-3 bg-arena-black border border-arena-border rounded-lg focus:border-brand focus:outline-none text-text-primary placeholder-arena-muted text-base"
              />
            </div>

            {/* Description */}
            <div className="bg-arena-card border border-arena-border rounded-xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Project Description <span className="text-human">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe what your project does, the problem it solves, and how it works..."
                rows={5}
                className="w-full p-3 bg-arena-black border border-arena-border rounded-lg focus:border-brand focus:outline-none text-text-primary placeholder-arena-muted text-base resize-none"
              />
            </div>

            {/* Demo Video URL */}
            <div className="bg-arena-card border border-arena-border rounded-xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Demo Video URL <span className="text-human">*</span>
              </label>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-arena-muted flex-shrink-0" />
                <input
                  type="url"
                  value={formData.demoVideoUrl}
                  onChange={(e) => handleChange('demoVideoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 p-3 bg-arena-black border border-arena-border rounded-lg focus:border-brand focus:outline-none text-text-primary placeholder-arena-muted text-base"
                />
              </div>
              <p className="mt-2 text-xs text-arena-muted">
                Upload to YouTube, Loom, or Vimeo (max 3 minutes)
              </p>
            </div>

            {/* Repository URL */}
            <div className="bg-arena-card border border-arena-border rounded-xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Repository URL <span className="text-human">*</span>
              </label>
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-arena-muted flex-shrink-0" />
                <input
                  type="url"
                  value={formData.repoUrl}
                  onChange={(e) => handleChange('repoUrl', e.target.value)}
                  placeholder="https://github.com/your-team/project"
                  className="flex-1 p-3 bg-arena-black border border-arena-border rounded-lg focus:border-brand focus:outline-none text-text-primary placeholder-arena-muted text-base"
                />
              </div>
            </div>

            {/* Live Demo URL (Optional) */}
            <div className="bg-arena-card border border-arena-border rounded-xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Live Demo URL <span className="text-arena-muted">(optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-arena-muted flex-shrink-0" />
                <input
                  type="url"
                  value={formData.liveDemoUrl}
                  onChange={(e) => handleChange('liveDemoUrl', e.target.value)}
                  placeholder="https://your-project.vercel.app"
                  className="flex-1 p-3 bg-arena-black border border-arena-border rounded-lg focus:border-brand focus:outline-none text-text-primary placeholder-arena-muted text-base"
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Progress & Actions */}
          <div className="space-y-4">
            {/* Progress Checklist */}
            <div className="bg-arena-card border border-arena-border rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wide text-arena-secondary mb-4">
                Submission Progress
              </h3>
              <div className="space-y-3">
                {SUBMISSION_FIELDS.map((field) => {
                  const isComplete = formData[field.id] && formData[field.id].trim() !== '';
                  return (
                    <div key={field.id} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isComplete ? 'bg-success/20' : 'bg-arena-border'
                        }`}
                      >
                        {isComplete ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Circle className="w-4 h-4 text-arena-muted" />
                        )}
                      </div>
                      <span className={`text-sm ${isComplete ? 'text-text-primary' : 'text-arena-muted'}`}>
                        {field.label}
                        {field.required && !isComplete && (
                          <span className="text-human ml-1">*</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-arena-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-arena-secondary">Progress</span>
                  <span className="font-bold text-text-primary">
                    {completedRequired.length}/{requiredFields.length} required
                  </span>
                </div>
                <div className="mt-2 h-2 bg-arena-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-300"
                    style={{ width: `${(completedRequired.length / requiredFields.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-arena-card border border-arena-border rounded-xl p-4 space-y-3">
              {/* Save Message */}
              {saveMessage && (
                <div className="flex items-center gap-2 p-3 bg-success/10 text-success text-sm rounded-lg">
                  <Check className="w-4 h-4" />
                  {saveMessage}
                </div>
              )}

              {/* Save Draft */}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="w-full py-3 flex items-center justify-center gap-2 font-bold text-sm
                           border border-arena-border text-arena-secondary hover:border-brand hover:text-text-primary
                           transition-colors disabled:opacity-50 rounded-lg"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>

              {/* Submit */}
              {submissionStatus === 'submitted' ? (
                <div
                  className="w-full py-3 flex items-center justify-center gap-2 font-bold text-sm
                             text-white rounded-lg bg-success"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  SUBMITTED
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSaving}
                  className={`w-full py-3 flex items-center justify-center gap-2 font-bold text-sm
                             text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg
                             ${canSubmit ? 'bg-arena-elevated border border-arena-border' : 'bg-gray-600'}`}
                >
                  <Send className="w-4 h-4" />
                  Submit Project
                </button>
              )}

              {!canSubmit && submissionStatus !== 'submitted' && (
                <div className="flex items-start gap-2 p-3 bg-human/10 text-human text-xs rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Complete all required fields to submit your project.</span>
                </div>
              )}
            </div>

            {/* Last Updated */}
            {userTeam.submission?.lastUpdated && (
              <div className="text-xs text-arena-muted text-center flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Last saved: {new Date(userTeam.submission.lastUpdated).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Submission;

