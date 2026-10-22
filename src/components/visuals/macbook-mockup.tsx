import type { ReactNode } from "react";

// Source-owned hardware: the dashboard stays live HTML inside the display.
// Decorative keys and chassis never enter the keyboard or accessibility tree.
const keys = [
  [
    "esc",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "◉",
  ],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "−", "=", "delete"],
  ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "′", "return"],
  ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
  ["fn", "control", "option", "⌘", "space", "⌘", "option", "◀", "▼", "▶"],
];

export function MacBookMockup({ children }: { children: ReactNode }) {
  return (
    <div className="macbook-mockup">
      <div className="macbook-lid">
        <span className="macbook-camera" aria-hidden="true" />
        <div className="macbook-screen">{children}</div>
        <div className="macbook-chin" aria-hidden="true">
          MacBook Pro
        </div>
      </div>
      <div className="macbook-deck" aria-hidden="true">
        <div className="macbook-deck-surface">
          <div className="macbook-speaker speaker-left" />
          <div className="macbook-keyboard">
            {keys.map((row, index) => (
              <div className="macbook-key-row" key={index}>
                {row.map((key, keyIndex) => (
                  <span
                    className={`macbook-key ${key === "space" ? "space-key" : key.length > 3 ? "wide-key" : ""}`}
                    key={keyIndex}
                  >
                    {key === "space" ? "" : key}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="macbook-speaker speaker-right" />
          <div className="macbook-trackpad" />
        </div>
        <div className="macbook-front-edge">
          <span />
        </div>
      </div>
      <div className="macbook-pedestal" aria-hidden="true">
        <div className="macbook-pedestal-top" />
        <div className="macbook-pedestal-front" />
      </div>
      <div className="macbook-floor-shadow" aria-hidden="true" />
    </div>
  );
}
