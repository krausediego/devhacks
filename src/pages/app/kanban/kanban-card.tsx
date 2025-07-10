import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { KanbanCardProps } from "./kanban-board";

interface Props {
  card: KanbanCardProps;
  onDelete: () => void;
}

const KanbanCard = React.memo(({ card, onDelete }: Props) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

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

  const handleConfirmDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={cn(
          "bg-background group flex flex-col gap-4 rounded-md border p-3 transition-colors duration-150",
          isDragging
            ? "border-accent shadow-lg"
            : "border-border hover:border-border/80",
        )}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="text-foreground flex-1 truncate text-base font-medium">
            {card.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src="https://avatars.githubusercontent.com/u/95981229?v=4" />
            <AvatarFallback>DK</AvatarFallback>
          </Avatar>
          <span className="text-foreground text-sm font-medium">
            {card.createBy}
          </span>
        </div>
        {card?.tags?.map((tag) => {
          return (
            <div>
              <span className="bg-muted-foreground/10 rounded-md p-1.5 text-sm font-medium">
                {tag}
              </span>
            </div>
          );
        })}
        <span className="flex text-sm">
          {format(card.createdAt, "d 'de' MMMM 'de' yyyy", { locale: enUS })}

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setIsDeleteDialogOpen(true)}
            aria-label="Delete task"
            className="ml-auto h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </span>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogTrigger asChild>
            <div className="mt-2 flex justify-end"></div>
          </AlertDialogTrigger>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

export { KanbanCard };
