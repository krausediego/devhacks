import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { KanbanCardProps } from "./kanban-board";

interface Props {
  card: KanbanCardProps;
  onDelete?: () => void;
}

const KanbanCard = React.memo(({ card, onDelete }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
    boxShadow: isDragging ? "0 4px 16px 0 rgba(0,0,0,0.10)" : undefined,
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        "bg-background group flex flex-col gap-1 rounded-lg border p-3 transition-colors duration-150",
        isDragging
          ? "border-accent shadow-lg"
          : "border-border hover:border-border/80",
      )}
    >
      <div className="mb-1 flex items-center gap-2">
        <span
          className="text-foreground flex-1 truncate text-base font-medium"
          title={card.title}
        >
          {card.title}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 opacity-60 transition-opacity group-hover:opacity-100"
          {...listeners}
          aria-label="Drag handle"
        >
          <GripVertical className="text-muted-foreground h-4 w-4" />
        </Button>
      </div>
      {card.description && (
        <div
          className="text-muted-foreground mt-1 line-clamp-2 text-sm"
          title={card.description}
        >
          {card.description}
        </div>
      )}
    </div>
  );
});

export { KanbanCard };
