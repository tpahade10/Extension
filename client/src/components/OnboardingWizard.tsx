import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Upload } from "lucide-react";
import { parseResume } from "@/lib/resumeParser";

interface FormData {
  // Step 1: Resume Upload
  resumeFile: File | null;
  resumeBase64: string;

  // Step 2: Personal Profile
  firstName: string;
  lastName: string;
  preferredName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Step 3: Contact Information
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  phoneDeviceType: string;

  // Step 4: Work Experience
  workExperience: Array<{
    jobTitle: string;
    companyName: string;
    location: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    jobDescription: string;
  }>;

  // Step 5: Education & Languages
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    currentlyAttending: boolean;
    gpa: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
    fluent: boolean;
  }>;

  // Step 6: Skills
  skills: string[];

  // Step 7: Websites & Eligibility
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  sponsorshipRequired: boolean;
  disabilityStatus: string;
  veteranStatus: string;
  age: string;
  gender: string;
  ethnicity: string;
}

interface OnboardingWizardProps {
  onComplete?: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    resumeFile: null,
    resumeBase64: "",
    firstName: "",
    lastName: "",
    preferredName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    email: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    phoneDeviceType: "",
    workExperience: [
      {
        jobTitle: "",
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        jobDescription: "",
      },
    ],
    education: [
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        currentlyAttending: false,
        gpa: "",
      },
    ],
    languages: [{ language: "", proficiency: "Basic", fluent: false }],
    skills: [],
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    workAuthorization: "",
    sponsorshipRequired: false,
    disabilityStatus: "",
    veteranStatus: "",
    age: "",
    gender: "",
    ethnicity: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parseError, setParseError] = useState("");

  const steps = [
    { title: "RESUME UPLOAD", number: 1 },
    { title: "PERSONAL PROFILE", number: 2 },
    { title: "CONTACT INFORMATION", number: 3 },
    { title: "WORK EXPERIENCE", number: 4 },
    { title: "EDUCATION & LANGUAGES", number: 5 },
    { title: "SKILLS", number: 6 },
    { title: "WEBSITES & ELIGIBILITY", number: 7 },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError("");
    setIsParsingResume(true);

    try {
      setFormData(prev => ({
        ...prev,
        resumeFile: file,
      }));

      // Convert to Base64
      const reader = new FileReader();
      reader.onload = event => {
        const base64String = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          resumeBase64: base64String,
        }));
      };
      reader.readAsDataURL(file);

      // Parse resume
      const parsedData = await parseResume(file);

      // Auto-fill form data
      setFormData(prev => ({
        ...prev,
        firstName: parsedData.firstName || prev.firstName,
        lastName: parsedData.lastName || prev.lastName,
        email: parsedData.email || prev.email,
        phoneNumber: parsedData.phoneNumber || prev.phoneNumber,
        addressLine1: parsedData.address || prev.addressLine1,
        city: parsedData.city || prev.city,
        state: parsedData.state || prev.state,
        postalCode: parsedData.postalCode || prev.postalCode,
        country: parsedData.country || prev.country,
        workExperience:
          parsedData.workExperience.length > 0
            ? parsedData.workExperience
            : prev.workExperience,
        education:
          parsedData.education.length > 0
            ? parsedData.education
            : prev.education,
        skills: parsedData.skills.length > 0 ? parsedData.skills : prev.skills,
        githubUrl: parsedData.githubUrl || prev.githubUrl,
        linkedinUrl: parsedData.linkedinUrl || prev.linkedinUrl,
        portfolioUrl: parsedData.portfolioUrl || prev.portfolioUrl,
      }));
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Failed to parse resume"
      );
    } finally {
      setIsParsingResume(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    localStorage.setItem("onboardingData", JSON.stringify(formData));
    alert("Profile setup complete! Your data has been saved.");

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Left Column: Form */}
      <div className="flex-1 px-12 py-16 max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-sm font-mono font-bold text-[#1a1a1a] tracking-widest">
              STEP {currentStep + 1} OF {steps.length}
            </div>
            <div
              className="flex-1 h-1 bg-[#1a1a1a] transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <h1 className="text-4xl font-mono font-bold text-[#1a1a1a] tracking-wide mb-2">
            {steps[currentStep].title}
          </h1>
          <div className="w-16 h-1 bg-[#0066ff]"></div>
        </div>

        {/* Step 1: Resume Upload */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <p className="text-base text-[#1a1a1a] mb-8">
              Start by uploading your resume. We'll automatically parse it to extract your
              contact information, work experience, education, and skills. Then you can
              review and edit everything on the following steps.
            </p>

            <div>
              <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                UPLOAD RESUME (PDF / WORD / TEXT)
              </label>
              <div className="border-3 border-[#1a1a1a] p-6 text-center cursor-pointer hover:bg-[#f0f0f0] transition-colors">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={isParsingResume}
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="w-8 h-8 text-[#1a1a1a]" />
                  <span className="text-sm font-mono font-bold text-[#1a1a1a] tracking-wide">
                    {isParsingResume
                      ? "PARSING RESUME..."
                      : formData.resumeFile
                        ? formData.resumeFile.name
                        : "CLICK TO UPLOAD RESUME"}
                  </span>
                </label>
              </div>
              {parseError && (
                <div className="mt-4 p-4 border-2 border-[#cc0000] bg-[#ffeeee]">
                  <p className="text-sm font-mono text-[#cc0000]">{parseError}</p>
                </div>
              )}
              {formData.resumeFile && !parseError && (
                <div className="mt-4 p-4 border-2 border-[#00aa00] bg-[#eeffee]">
                  <p className="text-sm font-mono text-[#00aa00]">
                    ✓ Resume parsed successfully! Your information has been extracted
                    and will autofill the following steps.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Personal Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <p className="text-base text-[#1a1a1a] mb-8">
              Review and edit your personal information extracted from your resume.
              Make any corrections or add missing details.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  FIRST NAME
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  LAST NAME
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                PREFERRED NAME (OPTIONAL)
              </label>
              <input
                type="text"
                name="preferredName"
                value={formData.preferredName}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Johnny"
              />
            </div>

            <div>
              <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                ADDRESS LINE 1
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="w-full"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                ADDRESS LINE 2 (OPTIONAL)
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Apt 4B"
              />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  CITY
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  STATE/REGION
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  POSTAL CODE
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="10001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                COUNTRY
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full"
                placeholder="United States"
              />
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <p className="text-base text-[#1a1a1a] mb-8">
              How can people reach you? Share your primary email address and
              phone number (including country code). This will be used to
              contact you for confirmations, alerts, and important updates.
            </p>

            <div>
              <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  COUNTRY CODE
                </label>
                <input
                  type="text"
                  name="phoneCountryCode"
                  value={formData.phoneCountryCode}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="+1"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="555-123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                DEVICE TYPE (OPTIONAL)
              </label>
              <select
                name="phoneDeviceType"
                value={formData.phoneDeviceType}
                onChange={handleInputChange}
                className="w-full"
              >
                <option value="">Select device type</option>
                <option value="iPhone">iPhone</option>
                <option value="Android">Android</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Work Experience */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <p className="text-base text-[#1a1a1a] mb-8">
              Work history matters! Review and update your past jobs. You can
              add or remove roles as needed.
            </p>

            {formData.workExperience.map((job, index) => (
              <div
                key={index}
                className="border-3 border-[#1a1a1a] p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                      JOB TITLE
                    </label>
                    <input
                      type="text"
                      value={job.jobTitle}
                      onChange={e => {
                        const newExp = [...formData.workExperience];
                        newExp[index].jobTitle = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          workExperience: newExp,
                        }));
                      }}
                      className="w-full"
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                      COMPANY NAME
                    </label>
                    <input
                      type="text"
                      value={job.companyName}
                      onChange={e => {
                        const newExp = [...formData.workExperience];
                        newExp[index].companyName = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          workExperience: newExp,
                        }));
                      }}
                      className="w-full"
                      placeholder="Tech Corp"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={job.location}
                    onChange={e => {
                      const newExp = [...formData.workExperience];
                      newExp[index].location = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        workExperience: newExp,
                      }));
                    }}
                    className="w-full"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                      START DATE
                    </label>
                    <input
                      type="date"
                      value={job.startDate}
                      onChange={e => {
                        const newExp = [...formData.workExperience];
                        newExp[index].startDate = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          workExperience: newExp,
                        }));
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                      END DATE
                    </label>
                    <input
                      type="date"
                      value={job.endDate}
                      onChange={e => {
                        const newExp = [...formData.workExperience];
                        newExp[index].endDate = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          workExperience: newExp,
                        }));
                      }}
                      className="w-full"
                      disabled={job.currentlyWorking}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={job.currentlyWorking}
                    onChange={e => {
                      const newExp = [...formData.workExperience];
                      newExp[index].currentlyWorking = e.target.checked;
                      setFormData(prev => ({
                        ...prev,
                        workExperience: newExp,
                      }));
                    }}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-mono font-bold text-[#1a1a1a] tracking-wide">
                    CURRENTLY WORKING HERE
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                    JOB DESCRIPTION
                  </label>
                  <textarea
                    value={job.jobDescription}
                    onChange={e => {
                      const newExp = [...formData.workExperience];
                      newExp[index].jobDescription = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        workExperience: newExp,
                      }));
                    }}
                    className="w-full h-24"
                    placeholder="Describe your responsibilities, achievements, and tools used..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Education & Languages */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <p className="text-base text-[#1a1a1a] mb-8">
              Let's capture your education and languages. This helps tailor
              suggestions and recommendations in your field.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-mono font-bold text-[#1a1a1a] tracking-wide">
                EDUCATION
              </h3>
              {formData.education.map((edu, index) => (
                <div
                  key={index}
                  className="border-3 border-[#1a1a1a] p-6 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                        SCHOOL/UNIVERSITY
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].school = e.target.value;
                          setFormData(prev => ({ ...prev, education: newEdu }));
                        }}
                        className="w-full"
                        placeholder="Harvard University"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                        DEGREE
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].degree = e.target.value;
                          setFormData(prev => ({ ...prev, education: newEdu }));
                        }}
                        className="w-full"
                        placeholder="Bachelor of Science"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                      FIELD OF STUDY
                    </label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={e => {
                        const newEdu = [...formData.education];
                        newEdu[index].fieldOfStudy = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEdu }));
                      }}
                      className="w-full"
                      placeholder="Computer Science"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                        START DATE
                      </label>
                      <input
                        type="date"
                        value={edu.startDate}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].startDate = e.target.value;
                          setFormData(prev => ({ ...prev, education: newEdu }));
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                        END DATE
                      </label>
                      <input
                        type="date"
                        value={edu.endDate}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[index].endDate = e.target.value;
                          setFormData(prev => ({ ...prev, education: newEdu }));
                        }}
                        className="w-full"
                        disabled={edu.currentlyAttending}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edu.currentlyAttending}
                      onChange={e => {
                        const newEdu = [...formData.education];
                        newEdu[index].currentlyAttending = e.target.checked;
                        setFormData(prev => ({ ...prev, education: newEdu }));
                      }}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-mono font-bold text-[#1a1a1a] tracking-wide">
                      CURRENTLY ATTENDING
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                      GPA (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={e => {
                        const newEdu = [...formData.education];
                        newEdu[index].gpa = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEdu }));
                      }}
                      className="w-full"
                      placeholder="3.8"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-mono font-bold text-[#1a1a1a] tracking-wide">
                LANGUAGES
              </h3>
              {formData.languages.map((lang, index) => (
                <div
                  key={index}
                  className="border-3 border-[#1a1a1a] p-6 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                        LANGUAGE
                      </label>
                      <input
                        type="text"
                        value={lang.language}
                        onChange={e => {
                          const newLangs = [...formData.languages];
                          newLangs[index].language = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            languages: newLangs,
                          }));
                        }}
                        className="w-full"
                        placeholder="English"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-2 tracking-wide">
                        PROFICIENCY
                      </label>
                      <select
                        value={lang.proficiency}
                        onChange={e => {
                          const newLangs = [...formData.languages];
                          newLangs[index].proficiency = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            languages: newLangs,
                          }));
                        }}
                        className="w-full"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lang.fluent}
                      onChange={e => {
                        const newLangs = [...formData.languages];
                        newLangs[index].fluent = e.target.checked;
                        setFormData(prev => ({ ...prev, languages: newLangs }));
                      }}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-mono font-bold text-[#1a1a1a] tracking-wide">
                      FLUENT
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Skills */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <p className="text-base text-[#1a1a1a] mb-8">
              Review and manage your skills. Skills extracted from your resume
              are already listed below. Add or remove any as needed.
            </p>

            <div>
              <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                ADD MORE SKILLS
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      addSkill();
                    }
                  }}
                  className="flex-1"
                  placeholder="e.g., React, Python, Project Management"
                />
                <button type="button" onClick={addSkill} className="px-6">
                  ADD
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="border-3 border-[#1a1a1a] px-4 py-2 flex items-center gap-3"
                  >
                    <span className="text-sm font-mono font-bold text-[#1a1a1a]">
                      {skill}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-[#cc0000] font-bold hover:text-[#990000]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Websites & Eligibility */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <p className="text-base text-[#1a1a1a] mb-8">
              Almost there! Add your online links — GitHub, LinkedIn, Portfolio
              — and some optional eligibility details.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  GITHUB URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  LINKEDIN URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  PORTFOLIO / WEBSITE URL
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  WORK AUTHORIZATION
                </label>
                <input
                  type="text"
                  name="workAuthorization"
                  value={formData.workAuthorization}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="e.g., US Work Authorization"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="sponsorshipRequired"
                  checked={formData.sponsorshipRequired}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <span className="text-sm font-mono font-bold text-[#1a1a1a] tracking-wide">
                  SPONSORSHIP REQUIRED
                </span>
              </label>

              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  DISABILITY STATUS (OPTIONAL)
                </label>
                <input
                  type="text"
                  name="disabilityStatus"
                  value={formData.disabilityStatus}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Yes / No / Prefer not to say"
                />
              </div>

              <div>
                <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                  VETERAN STATUS (OPTIONAL)
                </label>
                <input
                  type="text"
                  name="veteranStatus"
                  value={formData.veteranStatus}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Yes / No / Prefer not to say"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                    AGE
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                    GENDER
                  </label>
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Prefer not to say"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono font-bold text-[#1a1a1a] mb-3 tracking-wide">
                    ETHNICITY
                  </label>
                  <input
                    type="text"
                    name="ethnicity"
                    value={formData.ethnicity}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Prefer not to say"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-12 pt-8 border-t-3 border-[#1a1a1a]">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            BACK
          </button>

          {currentStep === steps.length - 1 ? (
            <button onClick={handleSubmit} className="ml-auto">
              SUBMIT
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="ml-auto flex items-center gap-2"
            >
              NEXT
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Progress Panel */}
      <div className="hidden lg:flex w-80 bg-white border-l-3 border-[#1a1a1a] p-8 flex-col">
        <h2 className="text-xl font-mono font-bold text-[#1a1a1a] mb-8 tracking-wide">
          PROGRESS
        </h2>
        <div className="space-y-4 flex-1">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-4 border-3 cursor-pointer transition-colors ${
                index === currentStep
                  ? "bg-[#0066ff] text-white border-[#0066ff]"
                  : index < currentStep
                    ? "bg-[#f0f0f0] border-[#1a1a1a]"
                    : "border-[#1a1a1a]"
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="text-xs font-mono font-bold tracking-widest">
                STEP {step.number}
              </div>
              <div className="text-sm font-mono font-bold mt-1">
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
