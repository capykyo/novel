"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClearBookshelfProps {
  onClear: () => void;
  onOpenDialog: () => void;
}

export function ClearBookshelf({ onOpenDialog }: ClearBookshelfProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={onOpenDialog} className="w-[350px]">
            清空书柜
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>清空所有书籍，此操作不可恢复</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
