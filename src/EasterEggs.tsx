import { useState } from "react";
import { Triangle, Trophy } from "lucide-react";

export function HeroArtwork() {
  const [clicks, setClicks] = useState(0);
  const prism = clicks >= 5;
  return (
    <div className={`hero-art ${prism ? "prism-unlocked" : ""}`}>
      {prism ? (
        <>
          <svg
            className="prism-art"
            viewBox="0 0 360 280"
            role="img"
            aria-label="A prism splitting white light into a rainbow"
          >
            <path
              d="M0 185 L153 143"
              stroke="#f5f3ff"
              strokeWidth="4"
              fill="none"
            />
            {[
              "#ff697d",
              "#ffad66",
              "#f7de77",
              "#81d99c",
              "#7bb8ff",
              "#c2a0ff",
            ].map((color, i) => (
              <path
                key={color}
                d={`M207 ${143 + i * 3} L360 ${76 + i * 21}`}
                stroke={color}
                strokeWidth="7"
                fill="none"
              />
            ))}
            <path
              d="M180 65 L100 225 H260 Z"
              fill="#ffffff0c"
              stroke="#eee9ff"
              strokeWidth="3"
            />
            <path
              d="M153 143 L207 151"
              stroke="#f5f3ff"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <span className="hero-easter-caption" role="status">
            The Dark Side of Terraform
          </span>
        </>
      ) : (
        <div className="hero-original-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="art-tile tile-one" />
          <div className="art-tile tile-two" />
          <div className="art-tile tile-three" />
          <div className="art-tile tile-four" />
          <div className="art-dot dot-one" />
          <div className="art-dot dot-two" />
        </div>
      )}
      <button
        type="button"
        className="hero-art-control"
        aria-label={
          prism ? "Restore homepage artwork" : "Explore homepage artwork"
        }
        aria-pressed={prism}
        title="There is more here than meets the eye."
        onClick={() => setClicks(prism ? 0 : clicks + 1)}
      >
        <Triangle size={20} />
      </button>
    </div>
  );
}

export function WishYouWereHere({ onBack }: { onBack: () => void }) {
  return (
    <section className="floyd-wish" aria-label="Wish You Were Here">
      <div className="wish-scene" aria-hidden="true">
        <img src="/mascot/resting.png" alt="" className="wish-panther" />
        <svg viewBox="0 0 100 140" className="wish-chair">
          <path
            d="M22 15H78V85H22Z M15 85H85V98H15Z M23 98V130 M77 98V130 M32 29V72 M49 29V72 M66 29V72"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="eyebrow">SECRET TRACK DISCOVERED</span>
      <h2>Wish You Were Here</h2>
      <p>A quiet corner of the question bank, saved for a fellow fan.</p>
      <button type="button" className="button secondary" onClick={onBack}>
        Back to questions
      </button>
    </section>
  );
}

export function ShineScore() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="perfect-score">
      <button
        type="button"
        className={`perfect-score-trigger ${revealed ? "artwork-revealed" : "result-score"}`}
        aria-label={revealed ? "Return to score" : "Explore perfect score"}
        aria-pressed={revealed}
        onClick={() => setRevealed(!revealed)}
      >
        {revealed ? (
          <>
            <img
              src="/easter-eggs/pink-floyd.png"
              alt="Pink Floyd artwork"
              width="306"
              height="366"
            />
            <span>Shine on</span>
            <small>Back to score</small>
          </>
        ) : (
          <>
            <span className="perfect-score-face">
              <Trophy size={38} aria-hidden="true" />
              <span>
                100%<small>Your score</small>
              </span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}

export function BrickMilestone({ count }: { count: number }) {
  if (count < 5) return null;
  return (
    <section
      className="brick-milestone"
      aria-label="Another Brick in the Wall milestone"
    >
      <svg
        viewBox="0 0 150 82"
        role="img"
        aria-label="Five bricks for five completed practice exams"
      >
        {[
          [4, 4],
          [52, 4],
          [100, 4],
          [28, 42],
          [76, 42],
        ].map(([x, y], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="44"
            height="32"
            rx="3"
            fill="currentColor"
            opacity={0.5 + i * 0.1}
          />
        ))}
      </svg>
      <div>
        <span className="eyebrow">FIVE EXAMS · A HIDDEN MILESTONE</span>
        <h2>Another Brick in the Wall</h2>
        <p>Five practice exams. Five bricks in your foundation.</p>
      </div>
    </section>
  );
}
