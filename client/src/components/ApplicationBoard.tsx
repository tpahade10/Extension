import React, { useState } from "react";

interface Application {
  jobTitle: string;
  company: string;
  status: "Applied" | "Screen" | "Interviewing" | "Offer" | "Rejected";
  date: string;
}

interface ApplicationBoardProps {
  applications: Application[];
  searchQuery: string;
  onApplicationMove?: (application: Application, newStatus: string) => void;
}

const boardStatuses = [
  "Applied",
  "Screen",
  "Interviewing",
  "Offer",
  "Rejected",
] as const;

const statusColors: Record<string, string> = {
  Applied:
    "border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700",
  Screen:
    "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700",
  Interviewing:
    "border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700",
  Offer: "border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700",
  Rejected: "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700",
};

const statusBadgeColors: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-400",
  Screen:
    "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-400",
  Interviewing:
    "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-400",
  Offer:
    "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400",
};

export default function ApplicationBoard({
  applications,
  searchQuery,
}: ApplicationBoardProps) {
  const [cards, setCards] = useState<Application[]>(applications);
  const [draggedCard, setDraggedCard] = useState<Application | null>(null);

  const filteredCards = cards.filter(
    card =>
      card.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCardsByStatus = (status: string) => {
    return filteredCards.filter(card => card.status === status);
  };

  const handleDragStart = (e: React.DragEvent, card: Application) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedCard) {
      const updatedCards = cards.map(card =>
        card === draggedCard ? { ...card, status: newStatus as any } : card
      );
      setCards(updatedCards);
      setDraggedCard(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {boardStatuses.map(status => (
        <div
          key={status}
          className="flex-shrink-0 w-80 bg-background border border-border rounded-lg p-4"
        >
          {/* Column Header */}
          <div className="mb-4">
            <h3 className="font-semibold text-foreground mb-2">{status}</h3>
            <div className="text-xs text-muted-foreground">
              {getCardsByStatus(status).length} item
              {getCardsByStatus(status).length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, status)}
            className="min-h-96 bg-card border-2 border-dashed border-border rounded-md p-3 space-y-3 transition-colors"
          >
            {getCardsByStatus(status).map((card, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={e => handleDragStart(e, card)}
                onDragEnd={handleDragEnd}
                className={`p-3 bg-card border rounded-md cursor-move transition-all ${
                  draggedCard === card
                    ? "opacity-50 border-primary"
                    : `border-border hover:border-primary/50 ${statusColors[card.status]}`
                }`}
              >
                <p className="text-sm font-medium text-foreground mb-2 line-clamp-2">
                  {card.jobTitle}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {new URL(card.company).hostname}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded inline-block ${statusBadgeColors[card.status]}`}
                  >
                    {card.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {card.date}
                  </span>
                </div>
              </div>
            ))}

            {getCardsByStatus(status).length === 0 && (
              <div className="flex items-center justify-center min-h-96 text-muted-foreground text-sm">
                Drop items here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
