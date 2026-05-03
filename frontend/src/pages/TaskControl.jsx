import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const TaskControl = () => {
  return (
    <section className="taskcontrol-page relative h-full bg-neutral-900 [.light_&]:bg-white">
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle,_#ffffff30_1px,_transparent_1px)] bg-[size:20px_20px] [.light_&]:bg-[radial-gradient(circle,_#00000020_1px,_transparent_1px)]"></div>
      <div className="relative z-[2] min-h-screen w-full max-lg:pt-16 text-neutral-50 [.light_&]:text-neutral-950">
        <Board />
      </div>
    </section>
  );
};

const Board = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://fitplus-api.vercel.app/cards", {
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data = await response.json();
        const normalizedCards = (Array.isArray(data) ? data : data.cards || [])
          .map((card) => ({
            id: card._id || card.id, // Normalize ID
            title: card.title,
            column: card.column,
          }));
        setCards(normalizedCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const updateCardsOrderInBackend = async (card) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://fitplus-api.vercel.app/cards/${card.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            _id: card.id,
            title: card.title,
            column: card.column,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error updating card: ${response.status} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const card = cards.find((c) => c.id === active.id);
    setActiveCard(card);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Drop a Task over another Task
    if (isActiveTask && isOverTask) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => String(t.id) === String(activeId));
        const overIndex = cards.findIndex((t) => String(t.id) === String(overId));

        if (activeIndex === -1 || overIndex === -1) return cards;

        if (cards[activeIndex].column !== cards[overIndex].column) {
          const newCards = [...cards];
          newCards[activeIndex] = { ...newCards[activeIndex], column: newCards[overIndex].column };
          return arrayMove(newCards, activeIndex, overIndex);
        }

        return arrayMove(cards, activeIndex, overIndex);
      });
    }

    // Drop a Task over an empty column area
    if (isActiveTask && isOverColumn) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => String(t.id) === String(activeId));
        if (activeIndex === -1) return cards;
        const newCards = [...cards];
        newCards[activeIndex] = { ...newCards[activeIndex], column: String(overId) };
        return arrayMove(newCards, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = async (event) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (overId === "trash") {
      // Optimistic update: instantly remove the card from the UI
      setCards((cards) => cards.filter((c) => String(c.id) !== String(activeId)));
      
      try {
        await deleteCardFromBackend(activeId);
      } catch (error) {
        console.error("Failed to delete card:", error);
        // We could theoretically revert the state here if the API call fails
      }
      return;
    }

    const card = cards.find((c) => String(c.id) === String(activeId));
    if (card) {
      updateCardsOrderInBackend(card).catch((err) =>
        console.error("Failed to update card column:", err)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-white"></div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="relative flex flex-wrap text-2xl max-sm:text-xl justify-center h-full w-full gap-12 pt-16 pb-1 sm:pt-40">
        <Column
          title={
            <div className="flex items-center gap-2">
              <span className="inline-block w-[7px] h-[7px] rounded-full bg-red-300"></span>
              <span className="text-sm">BACKLOG</span>
            </div>
          }
          column="backlog"
          headingColor="text-red-300"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title={
            <div className="flex items-center gap-2">
              <span className="inline-block w-[7px] h-[7px] rounded-full bg-yellow-300"></span>
              <span className="text-sm">TODO</span>
            </div>
          }
          column="todo"
          headingColor="text-yellow-300"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title={
            <div className="flex items-center gap-2">
              <span className="inline-block w-[7px] h-[7px] rounded-full bg-blue-300"></span>
              <span className="text-sm">IN PROGRESS</span>
            </div>
          }
          column="doing"
          headingColor="text-blue-300"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title={
            <div className="flex items-center gap-2">
              <span className="inline-block w-[7px] h-[7px] rounded-full bg-emerald-300"></span>
              <span className="text-sm">COMPLETE</span>
            </div>
          }
          column="done"
          headingColor="text-emerald-300"
          cards={cards}
          setCards={setCards}
        />
        <BurnBarrel />
      </div>
      <DragOverlay>
        {activeCard ? <Card title={activeCard.title} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

const Column = ({ title, headingColor, cards, column, setCards }) => {
  const filteredCards = Array.isArray(cards)
    ? cards.filter((c) => c.column === column)
    : [];
  const cardIds = filteredCards.map((c) => c.id);

  const { setNodeRef } = useDroppable({
    id: column,
    data: {
      type: "Column",
    },
  });

  return (
    <div className="w-56 h-fit shrink-0 z-1">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="h-full w-full transition-colors bg-neutral-800/0"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {filteredCards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  ); 
};

const SortableCard = ({ card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Task",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="mb-3 rounded border-2 border-dashed border-violet-500 bg-neutral-800/50 p-3 opacity-50 h-[46px] [.light_&]:border-violet-400 [.light_&]:bg-neutral-100"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`glass-effect-1 touch-none mb-3 cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing [.light_&]:border-neutral-300 [.light_&]:bg-white [.light_&]:shadow-sm`}
    >
      <p className="text-sm text-neutral-100 [.light_&]:text-neutral-900">
        {card.title}
      </p>
    </div>
  );
};

const Card = ({ title }) => {
  return (
    <div
      className={`mb-3 cursor-grabbing rounded border border-violet-500 bg-neutral-800 p-3 shadow-2xl opacity-90 [.light_&]:border-violet-500 [.light_&]:bg-white`}
    >
      <p className="text-sm text-neutral-100 [.light_&]:text-neutral-900">
        {title}
      </p>
    </div>
  );
};

const BurnBarrel = () => {
  const { isOver, setNodeRef } = useDroppable({
    id: "trash",
    data: {
      type: "Trash",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`glass-effect-1 z-10 grid h-56 w-56 mb-6 shrink-0 place-content-center border rounded text-3xl transition-colors ${
        isOver
          ? " border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {isOver ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({ column, setCards }) => {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim().length || loading) return;

    setLoading(true);

    const newCard = {
      column,
      title: text.trim(),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://fitplus-api.vercel.app/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(newCard),
      });

      const data = await response.json();

      if (data.cards) {
        const normalizedCards = data.cards.map((card) => ({
          id: card._id || card.id,
          title: card.title,
          column: card.column,
        }));
        setCards(normalizedCards);
        setText("");
        setAdding(false);
      } else if (data.error) {
        console.error("Error adding card:", data.error);
      }
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0 [.light_&]:bg-white [.light_&]:text-neutral-900 [.light_&]:placeholder-violet-500"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50 [.light_&]:text-neutral-600 [.light_&]:hover:text-neutral-950"
              disabled={loading}
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
              disabled={loading}
            >
              <span>{loading ? "Adding..." : "Add"}</span>
              {!loading && <FiPlus />}
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50 [.light_&]:text-neutral-600 [.light_&]:hover:text-neutral-950"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

const deleteCardFromBackend = async (cardId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://fitplus-api.vercel.app/cards/${cardId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete card");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};

export default TaskControl;
