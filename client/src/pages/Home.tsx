import OnboardingWizard from "@/components/OnboardingWizard";

interface HomeProps {
  onComplete?: () => void;
}

/**
 * Neo-Brutalist Onboarding Flow
 *
 * Design Philosophy: Raw Grid Brutalism
 * - Heavy typography with IBM Plex Mono Bold for titles
 * - Thick 3px borders on all interactive elements
 * - Electric blue (#0066ff) accent color for interactions
 * - Asymmetric two-column layout with visible progress tracking
 * - Instant, snappy transitions (100ms linear)
 * - No rounded corners; sharp, intentional aesthetic
 */
export default function Home({ onComplete }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <OnboardingWizard onComplete={onComplete} />
    </div>
  );
}
