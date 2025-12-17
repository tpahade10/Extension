import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload, Plus, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  resumeFileName: string;
  resumeUploadDate: string;
  workAuthorization: string;
  visaSponsorshipRequired: boolean;
  disabilityStatus: string;
  veteranStatus: string;
  age: string;
  gender: string;
  ethnicity: string;
  skills: string[];
}

export default function Profile() {
  const [formData, setFormData] = useState<ProfileData>({
    firstName: 'Tarun',
    lastName: 'Pahade',
    email: 'tarunpahade@gmail.com',
    phone: '+1 (555) 123-4567',
    addressLine1: '601 Maple Ave, Flirbert Road',
    addressLine2: '',
    city: 'Armonk',
    state: 'Maharashtra',
    postalCode: '41001',
    country: 'United States',
    linkedinUrl: 'https://www.linkedin.com/in/tarun-pahade',
    githubUrl: 'https://github.com/tarunpahade',
    portfolioUrl: 'https://tarunpahade.dev',
    resumeFileName: 'My Resume (1).pdf',
    resumeUploadDate: 'Dec 16, 2025, 06:26 PM',
    workAuthorization: 'Yes',
    visaSponsorshipRequired: false,
    disabilityStatus: 'No',
    veteranStatus: 'No',
    age: '20',
    gender: 'Male',
    ethnicity: 'Asian',
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL'],
  });

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    {
      id: '1',
      company: 'Acme Corp',
      position: 'Software Engineer',
      startDate: 'Jun 2024',
      endDate: 'Aug 2024',
      currentlyWorking: false,
      description: 'Responsible for collecting, cleaning, data maintaining ETL pipelines Developing AI on google cloud model',
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      school: 'Nath School of Business & Technology',
      degree: 'Bachelor',
      fieldOfStudy: 'Computer Science',
      startDate: 'Mar 2024',
      endDate: 'May 2026',
      gpa: '8.40',
    },
  ]);

  const [newSkill, setNewSkill] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setIsSaved(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    };
    setWorkExperience([...workExperience, newWork]);
  };

  const removeWorkExperience = (id: string) => {
    setWorkExperience(workExperience.filter(w => w.id !== id));
  };

  const updateWorkExperience = (id: string, updates: Partial<WorkExperience>) => {
    setWorkExperience(workExperience.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setEducation(education.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleSave = () => {
    setIsSaved(true);
    localStorage.setItem('profileData', JSON.stringify({ formData, workExperience, education }));
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleImportProfile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            setFormData(data.formData);
            setWorkExperience(data.workExperience);
            setEducation(data.education);
          } catch (error) {
            alert('Failed to import profile');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportProfile = () => {
    const data = { formData, workExperience, education };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile-${Date.now()}.json`;
    a.click();
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportProfile} className="gap-2">
              <Upload className="w-4 h-4" />
              Import Profile
            </Button>
            <Button onClick={handleExportProfile} className="gap-2">
              <Download className="w-4 h-4" />
              Export Profile
            </Button>
          </div>
        </div>

        {isSaved && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-400 px-4 py-3 rounded-lg">
            Profile saved successfully!
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span>👤</span> Personal Information
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Legal Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Languages</label>
                  <select className="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>English, Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span>📞</span> Contact Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Work History */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span>💼</span> Work History
                </h2>
                <Button size="sm" onClick={addWorkExperience} className="gap-1">
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>

              <div className="space-y-6">
                {workExperience.map((work) => (
                  <div key={work.id} className="pb-6 border-b border-border last:border-b-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <input
                            type="text"
                            placeholder="Company"
                            value={work.company}
                            onChange={(e) => updateWorkExperience(work.id, { company: e.target.value })}
                            className="px-3 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Position"
                            value={work.position}
                            onChange={(e) => updateWorkExperience(work.id, { position: e.target.value })}
                            className="px-3 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        </div>
                        <textarea
                          placeholder="Description"
                          value={work.description}
                          onChange={(e) => updateWorkExperience(work.id, { description: e.target.value })}
                          className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                          rows={2}
                        />
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <input
                            type="text"
                            placeholder="Start Date"
                            value={work.startDate}
                            onChange={(e) => updateWorkExperience(work.id, { startDate: e.target.value })}
                            className="px-3 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            value={work.endDate}
                            onChange={(e) => updateWorkExperience(work.id, { endDate: e.target.value })}
                            className="px-3 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                          <label className="flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-md text-sm">
                            <input
                              type="checkbox"
                              checked={work.currentlyWorking}
                              onChange={(e) => updateWorkExperience(work.id, { currentlyWorking: e.target.checked })}
                              className="rounded"
                            />
                            <span className="text-foreground">Currently Working</span>
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={() => removeWorkExperience(work.id)}
                        className="ml-4 p-2 text-destructive hover:bg-destructive/10 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education History */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span>🎓</span> Education History
                </h2>
                <Button size="sm" onClick={addEducation} className="gap-1">
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>

              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="pb-6 border-b border-border last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground mb-2">
                          {edu.school} • {edu.degree} • {edu.fieldOfStudy}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {edu.startDate} – {edu.endDate} • GPA: {edu.gpa}
                        </div>
                      </div>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="ml-4 p-2 text-destructive hover:bg-destructive/10 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Resume Section */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span>📄</span> Resume
              </h2>

              <div className="mb-4">
                <p className="text-sm text-foreground font-medium">{formData.resumeFileName}</p>
                <p className="text-xs text-muted-foreground">Uploaded on: {formData.resumeUploadDate}</p>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Resume
                </Button>
                <Button className="w-full justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span>📋</span> Employment Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Authorized to work in your country:</label>
                  <select
                    name="workAuthorization"
                    value={formData.workAuthorization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option>Yes</option>
                    <option>No</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-md border border-input">
                  <input
                    type="checkbox"
                    name="visaSponsorshipRequired"
                    checked={formData.visaSponsorshipRequired}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <label className="text-sm text-foreground font-medium">Visa sponsorship required for employment</label>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Disability:</label>
                  <select
                    name="disabilityStatus"
                    value={formData.disabilityStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option>No</option>
                    <option>Yes</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Veteran:</label>
                  <select
                    name="veteranStatus"
                    value={formData.veteranStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option>No</option>
                    <option>Yes</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Gender:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Ethnicity:</label>
                  <select
                    name="ethnicity"
                    value={formData.ethnicity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option>Asian</option>
                    <option>Black or African American</option>
                    <option>Hispanic or Latino</option>
                    <option>Native American or Alaska Native</option>
                    <option>Native Hawaiian or Pacific Islander</option>
                    <option>White</option>
                    <option>Two or more races</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Websites & Skills */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span>🔗</span> Websites & Skills
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">LinkedIn:</p>
                  <p className="text-sm text-foreground">{formData.linkedinUrl}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">GitHub:</p>
                  <p className="text-sm text-foreground">{formData.githubUrl}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Personal Portfolio:</p>
                  <p className="text-sm text-foreground">{formData.portfolioUrl}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Skills</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-3 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <Button size="sm" onClick={addSkill} className="gap-1">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-6 border-t border-border">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save All Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
}
