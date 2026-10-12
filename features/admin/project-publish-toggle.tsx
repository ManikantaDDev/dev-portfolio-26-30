"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProjectPublishedAction } from "@/actions/projects";
import { Button } from "@/components/ui/button";

export function ProjectPublishToggle({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setProjectPublishedAction(id, !isPublished);
          router.refresh();
        })
      }
    >
      {isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}
