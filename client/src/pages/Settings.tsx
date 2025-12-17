import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Bell, Shield, Eye } from "lucide-react";
import Layout from "@/components/Layout";

interface SettingsData {
  emailNotifications: boolean;
  applicationReminders: boolean;
  weeklyDigest: boolean;
  twoFactorAuth: boolean;
  dataPrivacy: string;
  theme: string;
  language: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    emailNotifications: true,
    applicationReminders: true,
    weeklyDigest: false,
    twoFactorAuth: false,
    dataPrivacy: "private",
    theme: "light",
    language: "english",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (key: keyof SettingsData) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    setIsSaved(false);
  };

  const handleChange = (key: keyof SettingsData, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        {isSaved && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-400 px-4 py-3 rounded-lg">
            Settings saved successfully!
          </div>
        )}

        {/* Notification Settings */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="text-foreground font-medium">
                  Email Notifications
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive email updates about your applications
                </p>
              </div>
              <button
                onClick={() => handleToggle("emailNotifications")}
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.emailNotifications ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.emailNotifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="text-foreground font-medium">
                  Application Reminders
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Get reminders to follow up on pending applications
                </p>
              </div>
              <button
                onClick={() => handleToggle("applicationReminders")}
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.applicationReminders ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.applicationReminders
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="text-foreground font-medium">Weekly Digest</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive a weekly summary of your application activity
                </p>
              </div>
              <button
                onClick={() => handleToggle("weeklyDigest")}
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.weeklyDigest ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.weeklyDigest ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Security Settings */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Privacy & Security
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="text-foreground font-medium">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => handleToggle("twoFactorAuth")}
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.twoFactorAuth ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.twoFactorAuth ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Data Privacy
              </label>
              <select
                value={settings.dataPrivacy}
                onChange={e => handleChange("dataPrivacy", e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="private">
                  Private - Only you can see your data
                </option>
                <option value="friends">
                  Friends Only - Share with connections
                </option>
                <option value="public">
                  Public - Anyone can see your profile
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Appearance
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={e => handleChange("theme", e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Language
              </label>
              <select
                value={settings.language}
                onChange={e => handleChange("language", e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-red-200 dark:border-red-900/50 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-6">
            Danger Zone
          </h2>

          <div className="space-y-3">
            <Button variant="destructive" className="w-full">
              Reset All Data
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
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
