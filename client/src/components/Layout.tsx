import React from 'react';
import { useLocation } from 'wouter';
import { Bell, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  
  const tabs = ['Analytics', 'Profile', 'Settings', 'Feedback'];
  const tabPaths: Record<string, string> = {
    Analytics: '/analytics',
    Profile: '/profile',
    Settings: '/settings',
    Feedback: '/feedback'
  };

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg text-foreground">SpeedyApply</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setLocation(tabPaths[tab])}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive(tabPaths[tab])
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
