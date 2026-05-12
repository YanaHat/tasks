"use client";

import classes from "./History.module.css";

type Props = {
  cities: string[]; 
  onSelect: (city: string) => void;
};

export function History({ cities, onSelect }: Props) {
  if (cities.length === 0) return null;

  return (
    <div id={classes.historyContainer}>
      <span className={classes.history}>RECENT:</span>

      {cities.map((city) => (
        <button
          key={city}
          className={classes.item}
          onClick={() => onSelect(city)}
        >
          <span className="material-symbols-outlined text-xs">history</span>
          {city}
        </button>
      ))}
    </div>
  );
}