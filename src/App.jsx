import { useState, useCallback } from "react";
import "./App.css";

// ── Card data ─────────────────────────────────────────────────────────────────
const cardSet = {
  title: "The Beatles Quiz",
  cards: [
    {
      question: "Please Please Me",
      year: "1963",
      album: "Please Please Me",
      description: "Written by John & Paul in Paul’s living room in Liverpool",
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
      description: "best selling single in the UK",
    },
    {
      question: "Don't Bother Me",
      year: "1963",
      album: "With the Beatles",
      description: "George Harrison’s first original song",
    },
    {
      question: "I want to Hold Your Hand",
      year: "1963",
      album: "Single",
      description: "The Beatles’ first US #1",
    },
    {
      question: "A Hard Day's Night",
      year: "1964",
      album: "A Hard Day's Night",
      description: "Ringo came up w/ the phrase, Use of many instruments: harmonica, cow bells, tambourine, bongos, etc.",
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
      description: "song uses a 6/8 time signature, similar to a waltz",
    },
    {
      question: "What You're Doing",
      year: "1964",
      album: "Beatles for Sale",
      description: "Inspired by Paul’s rocky relationship with Jane Asher",
    },
    {
      question: "Ticket to Ride",
      year: "1965",
      album: "Help!",
      description: "performance filmed Beatles ski-ing in slopes of Austria",
    },
    {
      question: "I’ve Just Seen a Face",
      year: "1965",
      album: "Help!",
      description: "Primarily written by Paul McCartney and well liked by his Aunt Gin, Country style",
    },
    {
      question: "Yesterday",
      year: "1965",
      album: "Help!",
      description: "One of the most covered Beatle’s song",
    },
    {
      question: "Norwegian Wood (This Bird Has Flown)",
      year: "1965",
      album: "Rubber Soul/This Bird Had Flown",
      description: "Use of the sitar",
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
      description: "Reflects Lennon’s feelings of isolation and not knowing where he was going in life",
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
      description: "John Lennon wrote the lyrics mostly about looking back at his life, remembering places, friends, and people he loved",
    },
  ],
};

// ── Helper: Fisher-Yates shuffle ─────────────────────────────────────────────
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildQueue() {
  return shuffle(cardSet.cards.map((_, i) => i));
}


// ── Component ─────────────────────────────────────────────────────────────────
export default function App() {
  const [queue, setQueue] = useState(() => buildQueue());
  const [queuePos, setQueuePos] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cardIndex = queue[queuePos];
  const card = cardSet.cards[cardIndex];
  const seen = queuePos + 1;
  const total = cardSet.cards.length;

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setQueuePos((prev) => {
      const next = prev + 1;
      if (next >= total) {
        // Reshuffle for a new round, avoiding the same first card
        setQueue(buildQueue());
        return 0;
      }
      return next;
    });
  }, [total]);

  const handleBack = useCallback(() => {
    setIsFlipped(false);
    setQueuePos((prev) => Math.max(0, prev - 1));
  }, []);

  return (
    <>
      {/* Decorative background notes (styled via index.css) */}
      <span className="note n1">♪</span>
      <span className="note n2">♫</span>
      <span className="note n3">♩</span>
      <span className="note n4">♬</span>

      <div className="app">

        {/* ── Header ── */}
        <div className="header">
          <span className="eyebrow">♪ Flashcard Quiz ♪</span>
          <h1>{cardSet.title}</h1>
          <p>{cardSet.description}</p>
          <span className="badge">🎵 {cardSet.cards.length} cards</span>
        </div>

        {/* ── Flashcard ── */}
        <div
          className="card-scene"
          onClick={() => setIsFlipped((f) => !f)}
          title={isFlipped ? "Click to flip back" : "Click to reveal answer"}
        >
          <div className={`card-inner${isFlipped ? " flipped" : ""}`}>

            {/* Front */}
            <div className="card-face card-front">
              <div className="vinyl-deco" />
              <div className="card-content">
                <span className="card-tag">Question</span>
                <span className="card-text">{card.question}</span>
                <span className="card-hint">tap to reveal answer</span>
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

        {/* ── Controls ── */}
        <div className="controls">
          <button className="btn-back" onClick={handleBack} disabled={queuePos === 0}>
            ← Back
          </button>
          <span className="progress">{seen} / {total}</span>
          <button className="btn-next" onClick={handleNext}>
            Next ♪
          </button>
        </div>

      </div>
    </>
  );
}