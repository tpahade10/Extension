import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Layout from "@/components/Layout";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (feedback.trim()) {
      setSubmitted(true);
      setFeedback("");
      setRating(5);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Send Feedback
          </h1>
          <p className="text-muted-foreground">
            Help us improve SpeedyApply by sharing your thoughts and suggestions
          </p>
        </div>

        {submitted && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-400 px-4 py-3 rounded-lg mb-6">
            Thank you for your feedback! We appreciate your input.
          </div>
        )}

        {/* Feedback Form */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Rate Your Experience
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    star <= rating
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Feedback Message
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report issues..."
              className="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={8}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {feedback.length} characters
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="w-4 h-4" />
              Send Feedback
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                question: "How often do you update the platform?",
                answer:
                  "We regularly release updates and new features based on user feedback. Check our blog for the latest updates.",
              },
              {
                question: "How can I report a bug?",
                answer:
                  "Please use the feedback form above to report any bugs you encounter. Include as much detail as possible to help us fix it faster.",
              },
              {
                question: "Can I request a feature?",
                answer:
                  "Absolutely! We love hearing feature requests. Please submit them through the feedback form.",
              },
              {
                question: "How long does it take to get a response?",
                answer:
                  "We aim to review all feedback within 48 hours. Critical issues are prioritized and addressed faster.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
