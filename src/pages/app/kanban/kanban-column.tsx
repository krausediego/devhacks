import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { KanbanColumnProps } from "./kanban-board";
import { KanbanCard } from "./kanban-card";

interface BoardColumnProps {
  column: KanbanColumnProps;
  addCard: (columnId: string, title: string, description?: string) => void;
  deleteCard: (columnId: string, cardId: string) => void;
}

const KanbanColumn = React.memo(
  ({ column, addCard, deleteCard }: BoardColumnProps) => {
    const { setNodeRef } = useDroppable({ id: column.id });
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      addCard(column.id, "kakaka", "akakaka");
      setDialogOpen(false);
    };

    return (
      <div
        ref={setNodeRef}
        className={cn(
          "bg-background/80 flex flex-1 flex-col gap-3 rounded-2xl p-4",
          "border-border/40 border shadow-lg backdrop-blur-sm",
        )}
      >
        <div className="border-border/40 mb-1 flex items-center justify-between border-b pb-2">
          <h2 className="text-foreground truncate text-lg font-semibold tracking-tight">
            {column.title}
            <span className="text-muted-foreground ml-2 text-sm">
              ({column.cards.length})
            </span>
          </h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Add card to ${column.title}`}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task in the {column.title} column.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="mt-2 flex flex-col gap-4">
                <div className="space-y-2">
                  {/* <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Task title..."
                    autoFocus
                    aria-label="Task title"
                  />
                  <Input
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Description (optional)..."
                    aria-label="Task description"
                  /> */}
                </div>
                <DialogFooter>
                  <Button type="submit">Add Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="max-h-[60vh] min-h-[120px] flex-1">
          <SortableContext
            items={column.cards.map((card) => card.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-col gap-3 pr-2">
              {column.cards.map((card) => (
                <KanbanCard key={card.id} card={card} onDelete={() => {}} />
              ))}
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    );
  },
);

export { KanbanColumn };
