import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { BarChart3, User, Settings, Zap } from 'lucide-react';

export default function ExtensionPopup() {
  const [, setLocation] = useLocation();
  const [autofillEnabled, setAutofillEnabled] = useState(true);
  const [todayApplications, setTodayApplications] = useState(1);
  const [goalApplications] = useState(10);

  useEffect(() => {
    // Load data from localStorage
    const profileData = localStorage.getItem('profileData');
    const todayApps = localStorage.getItem('todayApplications') || '1';
    setTodayApplications(parseInt(todayApps));
  }, []);

  const progressPercentage = (todayApplications / goalApplications) * 100;

  const openFullApp = (path: string) => {
    // Opens the full app in a new tab/window
    chrome.tabs.create({ url: `chrome-extension://${chrome.runtime.id}${path}` });
    window.close();
  };

  const handleAutofillToggle = () => {
    setAutofillEnabled(!autofillEnabled);
    localStorage.setItem('autofillEnabled', JSON.stringify(!autofillEnabled));
  };

  return (
    <div className="w-96 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen text-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-lg">SpeedyApply</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Circular Progress */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Gray background ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(226, 232, 240, 0.2)"
                strokeWidth="8"
              />
              {/* Blue progress ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgb(99, 102, 241)"
                strokeWidth="8"
                strokeDasharray={`${(progressPercentage / 100) * 283} 283`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-blue-400">{todayApplications}</div>
              <div className="text-sm text-slate-300 mt-2">Application Today</div>
              <div className="text-xs text-slate-400 mt-3">Goal: {goalApplications}</div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1 text-slate-300">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Quick Access</span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => openFullApp('/analytics')}
                className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
                title="Analytics"
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => openFullApp('/profile')}
                className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
                title="Profile"
              >
                <User className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => openFullApp('/settings')}
                className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
                title="Settings"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Autofill Toggle */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={autofillEnabled}
                onChange={handleAutofillToggle}
                className="w-5 h-5 rounded bg-slate-600 border border-slate-500 cursor-pointer accent-blue-500"
              />
              <span className="text-sm font-medium text-white">Autofill Enabled</span>
            </label>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>Keep applying and reaching your goals!</p>
          <p>Current streak: 5 days 🔥</p>
        </div>
      </div>
    </div>
  );
}
