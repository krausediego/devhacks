import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { createKanbanBoard } from "@/services";

import { type CardFormProps, KanbanColumn } from "./kanban-column";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";

export interface KanbanCardProps {
  id: string;
  title: string;
  createBy: string;
  createdAt: Date;
  tags: string[];
  description?: string;
}

export interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  cards: KanbanCardProps[];
}

const initialColumns: KanbanColumnProps[] = [
  {
    id: "todo",
    title: "Not started",
    color: "145, 145, 142",
    cards: [],
  },
  {
    id: "inprogress",
    title: "In Development",
    color: "91, 152, 190",
    cards: [],
  },
  {
    id: "done",
    title: "Done",
    color: "108, 155, 125",
    cards: [],
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useLocalStorage<KanbanColumnProps[]>(
    "kanban-board",
    initialColumns,
  );

  const { mutateAsync: createBoard } = useMutation({
    mutationFn: createKanbanBoard,
  });

  const handleCreateBoard = async () => {
    await createBoard();
  };

  const findContainerOfCard = (cardId: string): string | undefined => {
    for (const column of columns) {
      if (column.id === cardId) return column.id;
      if (column.cards.some((card) => card.id === cardId)) {
        return column.id;
      }
    }
    return undefined;
  };

  const isColumn = (id: string): boolean => {
    return columns.some((column) => column.id === id);
  };

  const moveCardToColumn = (cardId: string, columnId: string) => {
    const sourceColumnId = findContainerOfCard(cardId);
    if (!sourceColumnId || sourceColumnId === columnId) return;

    moveCardToContainer(cardId, sourceColumnId, columnId);
  };

  const moveCardToContainer = React.useCallback(
    (cardId: string, sourceId: string, destinationId: string) => {
      const sourceIndex = columns.findIndex((col) => col.id === sourceId);
      const destinationIndex = columns.findIndex(
        (col) => col.id === destinationId,
      );

      if (sourceIndex === -1 || destinationIndex === -1) return;

      const cardIndex = columns[sourceIndex].cards.findIndex(
        (card) => card.id === cardId,
      );
      if (cardIndex === -1) return;

      const newColumns = columns.map((col) => ({
        ...col,
        cards: [...col.cards],
      }));
      const [movedCard] = newColumns[sourceIndex].cards.splice(cardIndex, 1);
      newColumns[destinationIndex].cards.push(movedCard);

      setColumns(newColumns);
    },
    [columns, setColumns],
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the containers
    const activeContainer = findContainerOfCard(activeId.toString());
    const overContainer = findContainerOfCard(overId.toString());

    // If we're dropping a card over a column directly
    if (isColumn(overId.toString())) {
      if (activeContainer && overId) {
        moveCardToColumn(activeId.toString(), overId.toString());
      }
      return;
    }

    // If no container change, we don't need to do anything
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    // Time to move the card to a new container
    if (activeContainer && overContainer) {
      moveCardToContainer(activeId.toString(), activeContainer, overContainer);
    }
  };

  const findCardIndex = (columnId: string, cardId: string): number => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return -1;
    return column.cards.findIndex((card) => card.id === cardId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    // Find the containers
    const activeContainer = findContainerOfCard(active.id.toString());
    const overContainer = findContainerOfCard(over.id.toString());

    // If we're dropping a card over a column directly
    if (isColumn(over.id.toString())) {
      if (activeContainer && over.id) {
        moveCardToColumn(active.id.toString(), over.id.toString());
      }
      return;
    }

    // If we're in the same container, reorder the items
    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = findCardIndex(activeContainer, active.id.toString());
      const overIndex = findCardIndex(overContainer, over.id.toString());

      if (activeIndex !== -1 && overIndex !== -1) {
        const newColumns = [...columns];
        const columnIndex = newColumns.findIndex(
          (col) => col.id === activeContainer,
        );

        if (columnIndex !== -1) {
          newColumns[columnIndex].cards = arrayMove(
            newColumns[columnIndex].cards,
            activeIndex,
            overIndex,
          );
          setColumns(newColumns);
        }
      }
      return;
    }

    // If containers are different, move the card
    if (activeContainer && overContainer) {
      moveCardToContainer(active.id.toString(), activeContainer, overContainer);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    }),
  );

  const addCard = React.useCallback(
    ({
      columnId,
      title,
      description,
    }: CardFormProps & { columnId: string }) => {
      setColumns((prev) => {
        return prev.map((col) => {
          return col.id === columnId
            ? {
                ...col,
                cards: [
                  ...col.cards,
                  {
                    id: Date.now().toString(),
                    title,
                    createBy: "Diego krause",
                    createdAt: new Date(),
                    tags: ["Design"],
                    description,
                  },
                ],
              }
            : col;
        });
      });
    },
    [setColumns],
  );

  const deleteCardFromColumn = (columnId: string, cardId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
          : col,
      ),
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Button onClick={handleCreateBoard}>Criar</Button>
      <div className="box-border flex flex-1 gap-6 overflow-x-auto p-6 pb-8">
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={verticalListSortingStrategy}
        >
          {columns.map((column) => {
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                addCard={addCard}
                deleteCard={deleteCardFromColumn}
              />
            );
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export { KanbanBoard };
