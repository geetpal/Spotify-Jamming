import SearchBar from "../Search Bar/SearchBar";
import TrackList from "../Tracklist/Tracklist";

import styles from "./SearchResults.module.css";

function SearchResults(props) {
  return (
    <div>
      <TrackList tracks={props.result} />
    </div>
  );
}
export default SearchResults;
