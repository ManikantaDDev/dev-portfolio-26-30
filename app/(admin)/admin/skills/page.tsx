import SkillsManager from "@/features/admin/skills-manager";
import { getCurrentProfile } from "@/lib/supabase/profile";

export default async function AdminSkillsPage() {
  const current = await getCurrentProfile();

  if (!current) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Manage the skills shown on your portfolio. Mark a skill as featured to highlight it on
          your homepage.
        </p>
      </div>

      <SkillsManager skills={current.skills} />
    </div>
  );
}