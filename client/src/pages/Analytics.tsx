import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Unstable_SankeyChart as SankeyChart } from "@mui/x-charts-pro/SankeyChart";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { Download, Plus, List, Layers } from "lucide-react";
import Layout from "@/components/Layout";
import ApplicationBoard from "@/components/ApplicationBoard";

const chartData = [
  { date: "Dec 17", applications: 3 },
  { date: "Dec 18", applications: 4 },
  { date: "Dec 19", applications: 6 },
  { date: "Dec 20", applications: 5 },
  { date: "Dec 21", applications: 7 },
  { date: "Dec 22", applications: 4 },
  { date: "Dec 23", applications: 8 },
  { date: "Dec 24", applications: 6 },
  { date: "Dec 25", applications: 5 },
  { date: "Dec 26", applications: 7 },
  { date: "Dec 27", applications: 5 },
  { date: "Dec 28", applications: 9 },
  { date: "Dec 29", applications: 6 },
  { date: "Dec 30", applications: 7 },
  { date: "Dec 31", applications: 8 },
];

const applicationRecords = [
  {
    jobTitle: "Software Engineer Intern, KYC (Summer 2025) at Chime",
    company: "https://www.chime.com/",
    status: "Applied",
    date: "January 14, 2025",
  },
  {
    jobTitle: "Software Engineer - 2025 Intern (USB) - Citadel Securities",
    company: "https://www.citadelsecurities.com",
    status: "Applied",
    date: "January 14, 2025",
  },
  {
    jobTitle: "Job Application for Security Engineer at Figma",
    company: "https://www.figma.com/careers/",
    status: "Applied",
    date: "January 14, 2025",
  },
  {
    jobTitle: "IT Data Engineer Intern (USA), Remote | Pinterest Careers",
    company: "https://www.pinterestcareers.com",
    status: "Applied",
    date: "January 13, 2025",
  },
  {
    jobTitle: "Undergrad Software Engineering Intern [Dec 2025/Sept...",
    company: "http://www.twitch.tv/jobs",
    status: "Rejected",
    date: "January 13, 2025",
  },
  {
    jobTitle: "Frontend Engineer Intern at Google",
    company: "https://www.google.com/careers/",
    status: "Screen",
    date: "January 12, 2025",
  },
  {
    jobTitle: "Backend Engineer at Microsoft",
    company: "https://careers.microsoft.com/",
    status: "Interviewing",
    date: "January 11, 2025",
  },
  {
    jobTitle: "Product Manager Intern at Amazon",
    company: "https://www.amazon.jobs/",
    status: "Interviewing",
    date: "January 10, 2025",
  },
  {
    jobTitle: "Data Scientist at Meta",
    company: "https://www.metacareers.com/",
    status: "Offer",
    date: "January 9, 2025",
  },
  {
    jobTitle: "Full Stack Developer at Netflix",
    company: "https://jobs.netflix.com/",
    status: "Rejected",
    date: "January 8, 2025",
  },
  {
    jobTitle: "DevOps Engineer at Apple",
    company: "https://www.apple.com/careers/",
    status: "Applied",
    date: "January 7, 2025",
  },
  {
    jobTitle: "Machine Learning Engineer at OpenAI",
    company: "https://openai.com/careers/",
    status: "Screen",
    date: "January 6, 2025",
  },
];

const statuses = [
  "All",
  "Applied",
  "Rejected",
  "Interviewing",
  "Offer",
  "Screen",
];

const sankeyDataset = {
  nodes: [
    { id: "Applied", label: "Applied", color: "#3b82f6" },
    { id: "Screen", label: "Screen", color: "#eab308" },
    { id: "Interviewing", label: "Interviewing", color: "#a855f7" },
    { id: "Offer", label: "Offer", color: "#22c55e" },
    { id: "Rejected", label: "Rejected", color: "#ef4444" },
    { id: "NoAnswer", label: "No Answer", color: "#6b7280" },
  ],
  links: [
    { source: "Applied", target: "Screen", value: 69 },
    { source: "Applied", target: "Interviewing", value: 26 },
    { source: "Applied", target: "Offer", value: 8 },
    { source: "Applied", target: "Rejected", value: 72 },
    { source: "Applied", target: "NoAnswer", value: 145 },
    { source: "Screen", target: "Interviewing", value: 32 },
    { source: "Screen", target: "Rejected", value: 37 },
    { source: "Interviewing", target: "Offer", value: 15 },
    { source: "Interviewing", target: "Rejected", value: 43 },
  ],
};

export default function Analytics() {
  const theme = useTheme();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  const filteredRecords = applicationRecords.filter(record => {
    const statusMatch =
      selectedStatus === "All" || record.status === selectedStatus;
    const searchMatch =
      record.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.company.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusCount = (status: string) => {
    if (status === "All") {
      return applicationRecords.length;
    }
    return applicationRecords.filter(r => r.status === status).length;
  };

  const boardStatuses = [
    "Applied",
    "Screen",
    "Interviewing",
    "Offer",
    "Rejected",
  ];

  const getRecordsByStatus = (status: string) => {
    return applicationRecords.filter(record => record.status === status);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Export Applications
          </Button>
        </div>

        {/* Stats Cards and Chart */}
        <div className="grid grid-cols-4 gap-6">
          {/* Left Column - Stats Cards */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Today's Applications
              </p>
              <p className="text-3xl font-bold text-foreground">1</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Monthly Applications
              </p>
              <p className="text-3xl font-bold text-foreground">99</p>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-foreground">286</p>
            </div>
          </div>

          {/* Right Column - Chart */}
          <div className="col-span-3 bg-card border border-border rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Application Trends
              </h2>
              {viewMode === "list" ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--foreground)" />
                    <YAxis stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: `1px solid var(--border)`,
                        borderRadius: "0.5rem",
                      }}
                      labelStyle={{ color: "var(--foreground)" }}
                    />
                    <Bar
                      dataKey="applications"
                      fill="var(--primary)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ width: "100%", height: 400 }}>
                  <SankeyChart
                    series={[
                      {
                        data: sankeyDataset,
                        nodeWidth: 15,
                        nodePadding: 20,
                        layout: "horizontal",
                        labelStyle: {
                          fill: theme.palette.text.primary,
                          fontSize: 12,
                          fontWeight: 500,
                        },
                      },
                    ]}
                    margin={{ top: 10, bottom: 10, left: 10, right: 150 }}
                    slotProps={{
                      legend: { hidden: true },
                    }}
                  />
                </Box>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by Job or Company"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-background rounded-lg p-1 border border-border">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("board")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "board"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                  title="Board View"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 bg-primary rounded-lg px-3 py-2 text-primary-foreground text-sm">
                <span>All</span>
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 mb-6 pb-4 border-b border-border flex-wrap">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground/70 hover:text-foreground"
                }`}
              >
                {status === "All" ? "All Applications" : status}
                <span className="text-xs ml-2">({getStatusCount(status)})</span>
              </button>
            ))}
          </div>

          {/* List View */}
          {viewMode === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground bg-primary text-primary-foreground">
                      Job Link
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground bg-primary text-primary-foreground">
                      Company Link
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground bg-primary text-primary-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground bg-primary text-primary-foreground">
                      Date Applied
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border hover:bg-accent transition-colors"
                      >
                        <td className="py-3 px-4 text-foreground">
                          {record.jobTitle}
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={record.company}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {new URL(record.company).hostname}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                              record.status === "Applied"
                                ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-400"
                                : record.status === "Rejected"
                                  ? "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400"
                                  : record.status === "Interviewing"
                                    ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-400"
                                    : record.status === "Offer"
                                      ? "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400"
                                      : record.status === "Screen"
                                        ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        : "bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {record.date}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 px-4 text-center text-muted-foreground"
                      >
                        No applications found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Board View */}
          {viewMode === "board" && (
            <ApplicationBoard
              applications={applicationRecords}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
