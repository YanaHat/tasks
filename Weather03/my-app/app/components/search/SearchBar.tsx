import { useState } from "react";
import classes from "./SearchBar.module.css";

type Props = {
  onSearch: (city: string) => void;
};

export function Search({ onSearch }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!value.trim()) return;
    onSearch(value);
    setValue("");
  };

  return (
    <form name="search" className={classes.search} onSubmit={handleSubmit}>
      <input 
        id="city-search-input" 
        name="city"
        type="search"
        className={classes.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter city"
      />
      <button type="submit" className={classes.button}>Search</button>
    </form>
  );
}