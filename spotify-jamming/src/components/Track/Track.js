import React, { useCallback } from "react";
import styles from "./Track.module.css";

const Track = (props) => {
  // Functions associated with Track component
  const onAddTrack = useCallback(
    (event) => {
      //On button click we are sending back the track to be added
      props.onAddTrack(props.track);
    },
    [props.onAddTrack, props.track]
  );

  const onRemoveTrack = useCallback(
    (event) => {
      //On button click we are sending back the track to be removed
      props.onRemoveTrack(props.track);
    },
    [props.onRemoveTrack, props.track]
  );

  const ActionButton = () => {
    //Checking if the track is in playlist and rendering the - button
    if (props.InPlaylist) {
      return (
        <button className={styles.actionBtn} onClick={onRemoveTrack}>
          -
        </button>
      );
    }

    //If the track is not in playlist then we render the + button
    return (
      <button className={styles.actionBtn} onClick={onAddTrack}>
        +
      </button>
    );
  };

  //Returning the Track Component
  return (
    //Track Container
    <div className={styles.trackContainer}>
      {/* Here are the Track Details */}
      <div className={styles.trackDetails}>
        <h3>{props.track.name}</h3>
        <p>
          {props.track.artist} | {props.track.album}
        </p>
      </div>
      {/* Here is the Track add or remove button */}
      {ActionButton()}
    </div>
  );
};
export default Track;
