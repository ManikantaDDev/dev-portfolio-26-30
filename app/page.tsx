// app/page.tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Phase 3: Core Layouts Complete</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Tailwind CSS and Shadcn UI are successfully configured. 
        The button below is a reusable, production-ready component.
      </p>
      
      {/* Testing the Shadcn Button component */}
      <Button size="lg">
        Click Me (Test Button)
      </Button>
    </main>
  );
}