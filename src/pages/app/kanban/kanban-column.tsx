import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import * as React from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { KanbanColumnProps } from "./kanban-board";
import { KanbanCard } from "./kanban-card";
import { KanbanCardForm } from "./kanban-card-form";

interface BoardColumnProps {
  column: KanbanColumnProps;
  addCard: (props: CardFormProps & { columnId: string }) => void;
  deleteCard: (columnId: string, cardId: string) => void;
}

const schema = z.object({
  title: z.string(),
  description: z.string(),
  // tags: z.array(z.string()),
});

export type CardFormProps = z.infer<typeof schema>;

const KanbanColumn = React.memo(
  ({ column, addCard, deleteCard }: BoardColumnProps) => {
    const form = useForm<CardFormProps>({ resolver: zodResolver(schema) });

    const { setNodeRef } = useDroppable({ id: column.id });
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const backgroundColor = `rgba(${column.color}, 0.05)`;

    const handleAdd: SubmitHandler<CardFormProps> = (values) => {
      addCard({ columnId: column.id, ...values });
      setDialogOpen(false);
    };

    return (
      <div className="flex flex-1 flex-col gap-3">
        <div
          className="flex items-center justify-between rounded-md px-2 py-1"
          style={{ backgroundColor }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-full px-3"
              style={{ backgroundColor: `rgba(${column.color}, 0.2)` }}
            >
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: `rgb(${column.color})` }}
              />
              <h2 className="text-foreground truncate font-semibold tracking-tight">
                {column.title}
              </h2>
            </div>
            <span className="" style={{ color: `rgba(${column.color}, 0.5` }}>
              {column.cards.length}
            </span>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              form.reset();
            }}
          >
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Add card to ${column.title}`}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task in the {column.title} column.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAdd)}
                  className="mt-2 flex flex-col gap-4"
                >
                  <FormProvider {...form}>
                    <KanbanCardForm />
                  </FormProvider>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div
          ref={setNodeRef}
          className={cn("flex flex-1 flex-col gap-3 rounded-md p-1")}
          style={{ backgroundColor }}
        >
          <ScrollArea className="max-h-[60vh] min-h-[120px] flex-1">
            <SortableContext
              items={column.cards.map((card) => card.id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {column.cards.map((card) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    onDelete={() => deleteCard(column.id, card.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </ScrollArea>
        </div>
      </div>
    );
  },
);

export { KanbanColumn };
