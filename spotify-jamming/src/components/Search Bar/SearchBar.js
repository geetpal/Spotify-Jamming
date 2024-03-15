import React, { useState } from "react";
import styles from "./SearchBar.module.css";

import { ReactComponent as SearchIcon } from "./search-icon.svg"; // Import SVG icon

function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    console.log(searchQuery);
  };
  const search = () => {
    props.onSearch(searchQuery);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        type="text"
        onChange={handleSearch}
        placeholder="Search by song or artist..."
      />
      <SearchIcon className={styles.searchIcon} /> {/* Render the SVG icon */}
      <button className={styles.btn} type="search" onClick={search}>
        {" "}
        Search Song{" "}
      </button>
    </div>
  );
}
export default SearchBar;
