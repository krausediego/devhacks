import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import * as React from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { KanbanColumn } from "./kanban-column";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";

export interface KanbanCardProps {
  id: string;
  title: string;
  description?: string;
}

export interface KanbanColumnProps {
  id: string;
  title: string;
  cards: KanbanCardProps[];
}

const initialColumns: KanbanColumnProps[] = [
  {
    id: "todo",
    title: "To Do",
    cards: [],
  },
  {
    id: "inprogress",
    title: "In Progress",
    cards: [],
  },
  {
    id: "done",
    title: "Done",
    cards: [],
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useLocalStorage<KanbanColumnProps[]>(
    "kanban-board",
    initialColumns,
  );
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    console.log("chamou aqui");
  }, [columns, isClient]);

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

      console.log("AQUI", newColumns);
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
    setActiveId(null);

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
    (columnId: string, title: string, description?: string) => {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
                deleteCard={() => {}}
              />
            );
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export { KanbanBoard };
