import React, { useCallback } from "react";
import styles from "./Playlist.module.css";
import Track from "../Track/Track.js";
import Tracklist from "../Tracklist/Tracklist.js";

const Playlist = (props) => {
  const handlePlaylistNameChange = useCallback(
    (event) => {
      props.onPlaylistNameChange(event.target.value);
    },
    [props.onPlaylistNameChange]
  );

  return (
    <div className={styles.PlaylistContainer}>
      <h2>Your Playlists</h2>
      <input
        className={styles.playlistNameInput}
        onChange={handlePlaylistNameChange}
        // defaultValue={"Set your Playlist Name"}
        placeholder="Playlist Name"
      />
      <Tracklist
        tracks={props.playlistTracks}
        InPlaylist={true}
        onRemoveTrack={props.onRemoveTrack}
      />

      <button className={styles.btn} onClick={props.onSavePlaylist}>
        Save Playlist
      </button>
    </div>
  );
};
export default Playlist;
