import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import DesktopMenu from "../components/DesktopMenu";

export const TaskControl = () => {
  return (
    <section className="flex bg-neutral-900">
      <DesktopMenu />
      <div className="h-full w-full max-lg:pt-16  text-neutral-50">
        <h2 className="opacity-80 bg-gradient-to-b from-black to-[#999999] bg-clip-text text-transparent text-4xl mt-4 text-center font-bold whitespace-nowrap">KANBAN BOARD</h2>

        <Board />
      </div>
    </section>
  );
};

const Board = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('https://fitplus-api.vercel.app/cards');
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }
        const data = await response.json();
        const normalizedCards = (Array.isArray(data) ? data : data.cards || [])
          .map(card => ({
            id: card._id || card.id, // Normalize ID
            title: card.title,
            column: card.column
          }));
        setCards(normalizedCards);
      } catch (error) {
        console.error('Error fetching cards:', error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);


  const updateCardsOrderInBackend = async (card) => {
    console.log("Updated moved card:", card);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/cards/${card.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          _id: card.id,
          title: card.title,
          column: card.column,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating card: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };



  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-white"></div>
      </div>
    )
  }

  

  return (
    
    <div className="flex flex-wrap text-2xl max-sm:text-xl justify-center h-full w-full max-xl:overflow-scroll gap-12 pt-12 sm:pt-28">
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
        updateCardsOrderInBackend={updateCardsOrderInBackend}
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
        updateCardsOrderInBackend={updateCardsOrderInBackend}
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
        updateCardsOrderInBackend={updateCardsOrderInBackend}
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
        updateCardsOrderInBackend={updateCardsOrderInBackend}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};


const Column = ({ title, headingColor, cards, column, setCards, updateCardsOrderInBackend }) => {
  const [active, setActive] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);

  const handleDragStart = (e, card) => {
    e.stopPropagation();
    if (!card.id) {
      console.error('Card is missing ID:', card);
      return;
    }
    setDraggedCard(card);
    e.dataTransfer.setData("application/json", JSON.stringify(card));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    setDraggedCard(null);
    const cardData = e.dataTransfer.getData("application/json");

    if (!cardData) return;

    const card = JSON.parse(cardData);
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== card.id) {
      const updatedCards = [...cards];
      const cardIndex = updatedCards.findIndex((c) => c.id === card.id);

      if (cardIndex === -1) return;

      const [movedCard] = updatedCards.splice(cardIndex, 1);
      movedCard.column = column;


      updateCardsOrderInBackend(movedCard)
        .then(() => {
          if (before === "-1") {
            updatedCards.push(movedCard);
          } else {
            const insertIndex = updatedCards.findIndex((c) => c.id === before);
            if (insertIndex !== -1) {
              updatedCards.splice(insertIndex, 0, movedCard);
            } else {
              updatedCards.push(movedCard);
            }
          }
          setCards(updatedCards);
        })
        .catch(error => console.error('Failed to update card order:', error));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    clearHighlights();
    setActive(false);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const filteredCards = Array.isArray(cards) ? cards.filter((c) => c.column === column) : [];

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"
          }`}
      >
        {filteredCards.map((card) => (
          <div key={card.id}>
            <DropIndicator
              beforeId={card.id}
              column={column}
            />
            <Card
              id={card.id}
              title={card.title}
              column={card.column}
              handleDragStart={handleDragStart}
              isDragging={draggedCard?.id === card.id}
            />
          </div>
        ))}
        <DropIndicator
          beforeId={null}
          column={column}
        />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart, isDragging }) => {
  return (
    <motion.div
      layout
      layoutId={id}
      draggable={true}
      onDragStart={(e) => handleDragStart(e, {
        id: id,
        title: title,
        column: column
      })}
      className={`cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing ${isDragging ? 'opacity-50' : ''
        }`}
    >
      <p className="text-sm text-neutral-100">{title}</p>
    </motion.div>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const cardData = e.dataTransfer.getData("application/json");
    if (!cardData) {
      console.error('No card data received');
      return;
    }

    try {
      const card = JSON.parse(cardData);

      if (!card || !card.id) {
        console.error('Invalid card data:', card);
        return;
      }

      await deleteCardFromBackend(card.id);

      setCards((prevCards) => {
        if (!Array.isArray(prevCards)) return [];
        return prevCards.filter((c) => c.id !== card.id);
      });
    } catch (error) {
      console.error('Failed to delete card:', error);
    } finally {
      setActive(false);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active
        ? "border-red-800 bg-red-800/20 text-red-500"
        : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
        }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({ column, setCards }) => {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim().length || loading) return;

    setLoading(true);

    const newCard = {
      column,
      title: text.trim()
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(newCard),
      });

      const data = await response.json();

      if (data.cards) {
        setCards(data.cards);
        setText("");
        setAdding(false);
      } else if (data.error) {
        console.error('Error adding card:', data.error);
      }
    } catch (error) {
      console.error('Error adding card:', error);
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
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
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
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
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
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5001/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete card');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

export default TaskControl;
