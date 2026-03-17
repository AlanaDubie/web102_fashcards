import { useState, useCallback } from "react";
import "./App.css";

// ── Card data ─────────────────────────────────────────────────────────────────
const ALL_CARDS = [
  {
    question: "Please Please Me",
    year: "1963",
    album: "Please Please Me",
    description: "Written by John & Paul in Paul's living room in Liverpool",
  },
  {
    question: "I Saw Her Standing There",
    year: "1963",
    album: "Please Please Me",
    description: "Inspired by Roy Orbison",
  },
  {
    question: "She Loves You",
    year: "1963",
    album: "Single",
    description: "Best selling single in the UK",
  },
  {
    question: "Don't Bother Me",
    year: "1963",
    album: "With the Beatles",
    description: "George Harrison's first original song",
  },
  {
    question: "I Want to Hold Your Hand",
    year: "1963",
    album: "Single",
    description: "The Beatles' first US #1",
  },
  {
    question: "A Hard Day's Night",
    year: "1964",
    album: "A Hard Day's Night",
    description: "Ringo came up with the phrase. Uses many instruments: harmonica, cow bells, tambourine, bongos, etc.",
  },
  {
    question: "Anytime At All",
    year: "1964",
    album: "A Hard Day's Night",
    description: "Paul wrote the middle eight but didn't have time to write lyrics for this section",
  },
  {
    question: "No Reply",
    year: "1964",
    album: "Beatles for Sale",
    description: "Written for Tom Quickly, darker tone",
  },
  {
    question: "Baby's In Black",
    year: "1964",
    album: "Beatles for Sale",
    description: "Song uses a 6/8 time signature, similar to a waltz",
  },
  {
    question: "What You're Doing",
    year: "1964",
    album: "Beatles for Sale",
    description: "Inspired by Paul's rocky relationship with Jane Asher",
  },
  {
    question: "Ticket to Ride",
    year: "1965",
    album: "Help!",
    description: "Performance filmed with the Beatles skiing on the slopes of Austria",
  },
  {
    question: "I've Just Seen a Face",
    year: "1965",
    album: "Help!",
    description: "Primarily written by Paul McCartney and well liked by his Aunt Gin. Country style.",
  },
  {
    question: "Yesterday",
    year: "1965",
    album: "Help!",
    description: "One of the most covered Beatles songs of all time",
  },
  {
    question: "Norwegian Wood (This Bird Has Flown)",
    year: "1965",
    album: "Rubber Soul",
    description: "One of the first Western pop songs to feature a sitar",
  },
  {
    question: "Think for Yourself",
    year: "1965",
    album: "Rubber Soul",
    description: "A breakup song with a downbeat tune written by George Harrison",
  },
  {
    question: "Nowhere Man",
    year: "1965",
    album: "Rubber Soul",
    description: "Reflects Lennon's feelings of isolation and not knowing where he was going in life",
  },
  {
    question: "Day Tripper",
    year: "1965",
    album: "Single",
    description: "About drug use",
  },
  {
    question: "In My Life",
    year: "1965",
    album: "Rubber Soul",
    description: "John Lennon wrote about looking back at his life, remembering places, friends, and people he loved",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fuzzy match: strips punctuation + case, checks if either string contains the other
function checkAnswer(guess, answer) {
  const clean = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  const g = clean(guess);
  const a = clean(answer);
  if (!g) return false;
  return a.includes(g) || g.includes(a);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function App() {
  // Mastered card indices (from ALL_CARDS)
  const [masteredIds, setMasteredIds] = useState(new Set());

  // Active pool = cards not yet mastered
  const getActiveIndices = (mastered) =>
    ALL_CARDS.map((_, i) => i).filter((i) => !mastered.has(i));

  // Queue of indices into ALL_CARDS, in order by default
  const [queue, setQueue] = useState(() => getActiveIndices(new Set()));
  const [isShuffled, setIsShuffled] = useState(false);
  const [queuePos, setQueuePos] = useState(0);

  // Card state
  const [isFlipped, setIsFlipped] = useState(false);
  const [userGuess, setUserGuess] = useState("");
  const [guessStatus, setGuessStatus] = useState(null); // null | "correct" | "incorrect"

  // Streak
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Derived
  const safePos = Math.min(queuePos, queue.length - 1);
  const cardIndex = queue[safePos];
  const card = ALL_CARDS[cardIndex];
  const total = queue.length;

  // ── Reset card state when navigating ──────────────────────────────────────
  function resetCard() {
    setIsFlipped(false);
    setUserGuess("");
    setGuessStatus(null);
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (safePos >= total - 1) return;
    resetCard();
    setQueuePos(safePos + 1);
  }, [safePos, total]);

  const handleBack = useCallback(() => {
    if (safePos <= 0) return;
    resetCard();
    setQueuePos(safePos - 1);
  }, [safePos]);

  // ── Shuffle ───────────────────────────────────────────────────────────────
  const handleShuffle = useCallback(() => {
    const active = getActiveIndices(masteredIds);
    if (!isShuffled) {
      setQueue(shuffle(active));
      setIsShuffled(true);
    } else {
      setQueue(active);
      setIsShuffled(false);
    }
    resetCard();
    setQueuePos(0);
  }, [isShuffled, masteredIds]);

  // ── Submit guess ──────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!userGuess.trim()) return;
    // Check against question (song title), year, or album — any field counts
    const isCorrect =
      checkAnswer(userGuess, card.question) ||
      checkAnswer(userGuess, card.year) ||
      checkAnswer(userGuess, card.album);

    if (isCorrect) {
      setGuessStatus("correct");
      setIsFlipped(true);
      setStreak((s) => {
        const next = s + 1;
        setLongestStreak((l) => Math.max(l, next));
        return next;
      });
    } else {
      setGuessStatus("incorrect");
      setStreak(0);
    }
  }, [userGuess, card]);

  // ── Master a card ─────────────────────────────────────────────────────────
  const handleMaster = useCallback(() => {
    const newMastered = new Set(masteredIds);
    newMastered.add(cardIndex);
    setMasteredIds(newMastered);

    const active = getActiveIndices(newMastered);
    const newQueue = isShuffled ? shuffle(active) : active;
    setQueue(newQueue);

    const nextPos = Math.min(safePos, newQueue.length - 1);
    setQueuePos(Math.max(0, nextPos));
    resetCard();
  }, [cardIndex, masteredIds, isShuffled, safePos]);

  // ── Keyboard: submit on Enter ─────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (total === 0) {
    return (
      <>
        <span className="note n1">♪</span>
        <span className="note n2">♫</span>
        <span className="note n3">♩</span>
        <span className="note n4">♬</span>
        <div className="app">
          <div className="header">
            <span className="eyebrow">♪ Flashcard Quiz ♪</span>
            <h1>The Beatles Quiz</h1>
          </div>
          <div className="all-mastered">
            <span>🎉</span>
            <p>You've mastered all {ALL_CARDS.length} cards!</p>
            <button
              className="btn-reset"
              onClick={() => {
                setMasteredIds(new Set());
                setQueue(ALL_CARDS.map((_, i) => i));
                setIsShuffled(false);
                setQueuePos(0);
                resetCard();
              }}
            >
              Start Over
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <span className="note n1">♪</span>
      <span className="note n2">♫</span>
      <span className="note n3">♩</span>
      <span className="note n4">♬</span>

      <div className="app">

        {/* ── Header ── */}
        <div className="header">
          <span className="eyebrow">♪ Flashcard Quiz ♪</span>
          <h1>The Beatles Quiz</h1>
          <p>Can you name the year, album, and story behind each song?</p>
          <div className="header-meta">
            <span className="badge">🎵 {total} cards</span>
            {masteredIds.size > 0 && (
              <span className="badge badge-mastered">✓ {masteredIds.size} mastered</span>
            )}
          </div>

          {/* Streak */}
          <div className="streak-row">
            <span className="streak-item">
              🔥 Streak: <strong>{streak}</strong>
            </span>
            <span className="streak-divider">·</span>
            <span className="streak-item">
              🏆 Best: <strong>{longestStreak}</strong>
            </span>
          </div>
        </div>

        {/* ── Flashcard ── */}
        <div
          className={`card-scene ${guessStatus === "correct" ? "card-correct" : ""} ${guessStatus === "incorrect" ? "card-incorrect" : ""}`}
          onClick={() => setIsFlipped((f) => !f)}
          title={isFlipped ? "Click to flip back" : "Click to reveal answer"}
        >
          <div className={`card-inner${isFlipped ? " flipped" : ""}`}>

            {/* Front */}
            <div className="card-face card-front">
              <div className="vinyl-deco" />
              <div className="card-content">
                <span className="card-tag">Song Title</span>
                <span className="card-text">{card.question}</span>
                <span className="card-hint">tap to reveal · or submit a guess below</span>
              </div>
            </div>

            {/* Back */}
            <div className="card-face card-back">
              <div className="vinyl-deco" />
              <div className="card-content">
                <div className="card-meta-row">
                  <span className="card-meta-item">
                    <span className="card-tag">Year</span>
                    <span className="card-meta-value">{card.year}</span>
                  </span>
                  <span className="card-meta-divider">·</span>
                  <span className="card-meta-item">
                    <span className="card-tag">Album</span>
                    <span className="card-meta-value">{card.album}</span>
                  </span>
                </div>
                <p className="card-description">{card.description}</p>
                <span className="card-hint">tap to flip back</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Guess input ── */}
        <div className="guess-area">
          <div className={`guess-input-row ${guessStatus ? `guess-${guessStatus}` : ""}`}>
            <input
              className="guess-input"
              type="text"
              placeholder="Type the year, album, or a fun fact…"
              value={userGuess}
              onChange={(e) => {
                setUserGuess(e.target.value);
                setGuessStatus(null);
              }}
              onKeyDown={handleKeyDown}
            />
            <button className="btn-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          {guessStatus && (
            <p className={`guess-feedback guess-feedback-${guessStatus}`}>
              {guessStatus === "correct" ? "✓ Correct! Nice work 🎶" : "✗ Not quite — keep trying!"}
            </p>
          )}
        </div>

        {/* ── Controls ── */}
        <div className="controls">
          <button
            className="btn-back"
            onClick={handleBack}
            disabled={safePos === 0}
          >
            ← Back
          </button>

          <span className="progress">{safePos + 1} / {total}</span>

          <button
            className="btn-next"
            onClick={handleNext}
            disabled={safePos === total - 1}
          >
            Next ♪
          </button>
        </div>

        {/* ── Secondary actions ── */}
        <div className="secondary-controls">
          <button
            className={`btn-shuffle ${isShuffled ? "btn-shuffle-active" : ""}`}
            onClick={handleShuffle}
          >
            {isShuffled ? "⇄ Shuffled" : "⇄ Shuffle"}
          </button>
          <button className="btn-master" onClick={handleMaster}>
            ✓ Mark as Mastered
          </button>
        </div>

      </div>
    </>
  );
}