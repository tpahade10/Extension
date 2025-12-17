import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Feedback from "./pages/Feedback";
import ExtensionPopup from "./pages/ExtensionPopup";
import { useState, useEffect } from "react";

interface RouterProps {
  onboardingComplete: boolean;
  onOnboardingComplete: () => void;
}

function Router({ onboardingComplete, onOnboardingComplete }: RouterProps) {
  return (
    <Switch>
      {/* Extension Popup - Always Available */}
      <Route path={"/popup"} component={ExtensionPopup} />

      {/* Onboarding Routes */}
      {!onboardingComplete && (
        <>
          <Route path={"/"}>
            <Home onComplete={onOnboardingComplete} />
          </Route>
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </>
      )}

      {/* Main App Routes */}
      {onboardingComplete && (
        <>
          <Route path={"/analytics"} component={Analytics} />
          <Route path={"/profile"} component={Profile} />
          <Route path={"/settings"} component={Settings} />
          <Route path={"/feedback"} component={Feedback} />
          <Route path={"/"} component={Analytics} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </>
      )}

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    const stored = localStorage.getItem('onboardingComplete');
    return stored ? JSON.parse(stored) : false;
  });

  const [forcePopup, setForcePopup] = useState(false);

  useEffect(() => {
    localStorage.setItem('onboardingComplete', JSON.stringify(onboardingComplete));
  }, [onboardingComplete]);

  useEffect(() => {
    // Detect if running as Chrome extension popup (narrow window)
    // Extension popups are typically 400x600 or similar
    if (window.innerWidth < 500 && window.innerHeight < 800) {
      setForcePopup(true);
      // Redirect to popup route
      window.location.hash = '#/popup';
    }
  }, []);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  };

  return (
    <ErrorBoundary >
      <ThemeProvider
        defaultTheme="light"        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router onboardingComplete={onboardingComplete} onOnboardingComplete={handleOnboardingComplete} />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
