import styles from "./Tracklist.module.css";
import Track from "../Track/Track.js";

const Tracklist = (props) => {
  //Returning the Tracklist Component
  return (
    <div className={styles.TrackListContainer}>
      {props.tracks.map((track) => {
        return (
          <Track
            className={styles.tracks}
            track={track}
            key={track.id}
            onAddTrack={props.onAddTrack}
            onRemoveTrack={props.onRemoveTrack}
            InPlaylist={props.InPlaylist}
          />
        );
      })}
    </div>
  );
};

export default Tracklist;
