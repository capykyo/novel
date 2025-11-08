"use client";

import { Button } from "@/components/ui/button";

interface ClearBookshelfProps {
  onClear: () => void;
  onOpenDialog: () => void;
}

export function ClearBookshelf({ onOpenDialog }: ClearBookshelfProps) {
  return (
    <Button variant="outline" onClick={onOpenDialog} className="w-[350px]">
      清空书柜
    </Button>
  );
}
