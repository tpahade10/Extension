import * as pdfjsLib from "pdfjs-dist";
import * as mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedResumeData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  workExperience: Array<{
    jobTitle: string;
    companyName: string;
    location: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    jobDescription: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    currentlyAttending: boolean;
    gpa: string;
  }>;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const textContent = await page.getTextContent();
    text += textContent.items.map((item: any) => item.str).join(" ") + "\n";
  }

  return text;
};

const extractTextFromWord = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const parseText = (text: string): ParsedResumeData => {
  const data: ParsedResumeData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    workExperience: [],
    education: [],
    skills: [],
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
  };

  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    data.email = emailMatch[0];
  }

  // Extract phone number
  const phoneMatch = text.match(/\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/);
  if (phoneMatch) {
    data.phoneNumber = phoneMatch[0].replace(/[^\d+]/g, "");
  }

  // Extract URLs
  const githubMatch = text.match(/(?:github\.com|github)[\/\s:]*\/?(\S+)/i);
  if (githubMatch) {
    data.githubUrl = `https://github.com/${githubMatch[1].replace(/\W/g, "")}`;
  }

  const linkedinMatch = text.match(/(?:linkedin\.com|linkedin)[\/\s:]*\/?in[\/\s:]*(\S+)/i);
  if (linkedinMatch) {
    data.linkedinUrl = `https://linkedin.com/in/${linkedinMatch[1].replace(/\W/g, "")}`;
  }

  // Extract name (usually first non-email line)
  const lines = text.split("\n").filter(line => line.trim());
  if (lines.length > 0) {
    const nameLine = lines[0].trim();
    const nameParts = nameLine.split(/\s+/).filter(word => word.length > 0);

    if (nameParts.length >= 1) {
      data.firstName = nameParts[0];
      if (nameParts.length >= 2) {
        data.lastName = nameParts.slice(1).join(" ");
      }
    }
  }

  // Extract skills (common skill keywords)
  const skillKeywords = [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "C#",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Git",
    "HTML",
    "CSS",
    "REST",
    "GraphQL",
    "Agile",
    "Scrum",
    "Leadership",
    "Communication",
    "Problem Solving",
  ];

  skillKeywords.forEach(skill => {
    if (text.toLowerCase().includes(skill.toLowerCase()) && !data.skills.includes(skill)) {
      data.skills.push(skill);
    }
  });

  // Extract work experience (look for common patterns)
  const workExperiencePattern =
    /(?:position|title|role|worked as|worked at|employed as|job title)[\s:]*([^\n]+)/gi;
  const companies =
    /(?:company|at|worked at|employed at|organization)[\s:]*([^\n]+)/gi;

  const jobMatches = text.matchAll(workExperiencePattern);
  const companyMatches = text.matchAll(companies);

  const jobs = Array.from(jobMatches).map(m => m[1].trim());
  const companyList = Array.from(companyMatches).map(m => m[1].trim());

  jobs.forEach((job, index) => {
    data.workExperience.push({
      jobTitle: job,
      companyName: companyList[index] || "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      jobDescription: "",
    });
  });

  // If no work experience found, add empty one
  if (data.workExperience.length === 0) {
    data.workExperience.push({
      jobTitle: "",
      companyName: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      jobDescription: "",
    });
  }

  // Extract education (look for common patterns)
  const degreePattern = /(?:bachelor|b\.?s|master|m\.?s|phd|associate|diploma)[\s:]*([^\n]+)/gi;
  const degreeMatches = text.matchAll(degreePattern);

  const degrees = Array.from(degreeMatches).map(m => m[1].trim());

  degrees.forEach(degree => {
    data.education.push({
      school: "",
      degree: degree,
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      currentlyAttending: false,
      gpa: "",
    });
  });

  // If no education found, add empty one
  if (data.education.length === 0) {
    data.education.push({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      currentlyAttending: false,
      gpa: "",
    });
  }

  return data;
};

export const parseResume = async (file: File): Promise<ParsedResumeData> => {
  let text = "";

  if (file.type === "application/pdf") {
    text = await extractTextFromPDF(file);
  } else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword"
  ) {
    text = await extractTextFromWord(file);
  } else if (file.type.startsWith("text/")) {
    text = await file.text();
  } else {
    throw new Error("Unsupported file format. Please upload a PDF, Word document, or text file.");
  }

  return parseText(text);
};
