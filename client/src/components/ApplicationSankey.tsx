import React, { useMemo } from "react";
import { ResponsiveSankey } from "@nivo/sankey";

interface Application {
  jobTitle: string;
  company: string;
  status: "Applied" | "Screen" | "Interviewing" | "Offer" | "Rejected";
  date: string;
}

interface ApplicationSankeyProps {
  applications: Application[];
}

const statusColors: Record<string, string> = {
  Applied: "hsl(207, 89%, 60%)",
  Screen: "hsl(38, 92%, 50%)",
  Interviewing: "hsl(280, 85%, 60%)",
  Offer: "hsl(142, 76%, 36%)",
  Rejected: "hsl(0, 84%, 60%)",
  Source: "hsl(258, 90%, 66%)",
};

export default function ApplicationSankey({
  applications,
}: ApplicationSankeyProps) {
  const sanKeyData = useMemo(() => {
    const statusCounts = {
      Applied: 0,
      Screen: 0,
      Interviewing: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach(app => {
      statusCounts[app.status]++;
    });

    const nodes = [
      { id: "Start", nodeColor: statusColors.Source },
      { id: "Applied", nodeColor: statusColors.Applied },
      { id: "Screen", nodeColor: statusColors.Screen },
      { id: "Interviewing", nodeColor: statusColors.Interviewing },
      { id: "Accepted", nodeColor: statusColors.Offer },
      { id: "Rejected", nodeColor: statusColors.Rejected },
      { id: "On Call", nodeColor: statusColors.Offer },
    ];

    const links = [
      { source: "Start", target: "Applied", value: applications.length },
      { source: "Applied", target: "Screen", value: statusCounts.Screen },
      {
        source: "Applied",
        target: "Rejected",
        value: statusCounts.Rejected,
      },
      {
        source: "Screen",
        target: "Interviewing",
        value: statusCounts.Interviewing,
      },
      {
        source: "Interviewing",
        target: "Accepted",
        value: statusCounts.Offer,
      },
      {
        source: "Interviewing",
        target: "Rejected",
        value: Math.max(0, statusCounts.Interviewing - statusCounts.Offer),
      },
      {
        source: "Accepted",
        target: "On Call",
        value: statusCounts.Offer,
      },
    ];

    return { nodes, links };
  }, [applications]);

  return (
    <div className="w-full h-80 bg-card rounded-lg border border-border">
      <ResponsiveSankey
        data={sanKeyData}
        margin={{ top: 20, right: 160, bottom: 20, left: 140 }}
        align="justify"
        colors={node => node.nodeColor || "hsl(258, 90%, 66%)"}
        nodeOpacity={1}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderRadius={3}
        linkOpacity={0.5}
        linkHoverOthersOpacity={0.1}
        linkContract={3}
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor="hsl(var(--foreground))"
        theme={{
          text: {
            fontSize: 11,
            fontFamily: "DM Sans, sans-serif",
          },
          tooltip: {
            container: {
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              fontSize: 12,
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            },
          },
        }}
      />
    </div>
  );
}
