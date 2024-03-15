import React, { useCallback, useEffect, useState } from "react";

import styles from "./App.module.css";

import SearchBar from "../Search Bar/SearchBar.js";
import Tracklist from "../Tracklist/Tracklist.js";
import Playlist from "../Playlist/Playlist.js";

import Spotify from "../../data/Spotify.js";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  // const [tracks, setTracks] = useState([]);
  const [userName, setUserName] = useState("");

  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const authenticated = Spotify.checkAuth();
    if (authenticated) {
      Spotify.getUserName()
        .then((fetchName) => {
          setUserName(fetchName);
          setLogged(authenticated);
        })
        .catch((error) => {
          console.error("Error fetching user name:", error);
        });
    } else {
      console.log("Login Failed");
    }
  }, []);

  const loginHandler = () => {
    Spotify.getAuth();
  };

  //My Search Function
  // const search = useCallback((searchInput) => {
  //   Spotify.searchTracks(searchInput)
  //     .then((tracksArray) => {
  //       setSearchResults(tracksArray);
  //     })
  //     .catch((error) => {
  //       throw new Error("Error searching tracks");
  //     });

  //   // setSearchQuery(event.target.value);
  //   // implicit.search(searchQuery).then(setSearchQuery);
  // }, []);

  const search = (searchInput) => {
    Spotify.searchTracks(searchInput)
      .then((tracksArray) => {
        setSearchResults(tracksArray);
      })
      .catch((error) => {
        console.error("Error searching tracks:", error);
      });
  };

  const addTrack = useCallback(
    (track) => {
      if (
        playlistTracks.some((exisitingtrack) => exisitingtrack.id === track.id)
      ) {
        return;
      }

      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    [playlistTracks]
  );

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) => {
      return prevTracks.filter((currentTrack) => currentTrack.id !== track.id);
    });
  }, []);

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  // const filteredTracks = searchQuery
  //   ? allTracks.filter((track) => {
  //       // console.log("Track Name:", track.name);
  //       // console.log("Artist:", track.artist);
  //       // console.log("Album:", track.album);
  //       // console.log("Search Query:", searchQuery.toLowerCase());

  //       return (
  //         track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         track.album.toLowerCase().includes(searchQuery.toLowerCase())
  //       );
  //     })
  //   : allTracks;

  const savePlaylist = useCallback((playlist) => {
    if (playlistTracks.length === 0) {
      return;
    }
    const urisArray = playlistTracks.map((track) => track.uri);
    Spotify.createPlaylist(playlistName, urisArray)
      .then((response) => {
        if (response) {
          alert("Playlist save successfully!");
          setPlaylistName("");
          setPlaylistTracks([]);
        }
      })
      .catch((error) => {
        console.error("Error saving playlist: ");
      });
  });

  if (!logged) {
    return (
      <div className={styles.App}>
        <main>
          <button className={styles.btn} onClick={loginHandler}>
            Connect Spotify
          </button>
        </main>
      </div>
    );
  } else {
    return (
      <div className={styles.App}>
        <main>
          <div className={styles.Header}>
            <div className={styles.SearchContainer}>
              <h3>Welcome {userName}</h3>
              <SearchBar onSearch={search} />
            </div>
          </div>
          <body>
            <div className={styles.Content}>
              <div className={styles.Tracklist}>
                <h2>All Tracks</h2>
                <Tracklist
                  className={styles.TracklistContainer}
                  tracks={searchResults}
                  onAddTrack={addTrack}
                />
              </div>
              <div className={styles.Playlist}>
                <Playlist
                  playlistName={playlistName}
                  playlistTracks={playlistTracks}
                  onPlaylistNameChange={updatePlaylistName}
                  onRemoveTrack={removeTrack}
                  onSavePlaylist={savePlaylist}
                  // onClick={authRequest}
                />
              </div>
            </div>
          </body>
        </main>
      </div>
    );
  }
}
export default App;

//Archive

////////////////////
// // CHAT GPT CODE

// const clientId = "7272e997d8ea4e26b1f844ebf87053fd";
// const redirectUri = "http://localhost:3000/callback"; // This should match the redirect URI you registered with Spotify

// useEffect(() => {
//   // Step 1: Generate code verifier and code challenge
//   const generateRandomString = (length) => {
//     const possible =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     return Array.from(crypto.getRandomValues(new Uint8Array(length)))
//       .map((x) => possible[x % possible.length])
//       .join("");
//   };

//   const codeVerifier = generateRandomString(64);

//   const sha256 = async (plain) => {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(plain);
//     const hashBuffer = await crypto.subtle.digest("SHA-256", data);
//     return Array.from(new Uint8Array(hashBuffer))
//       .map((b) => String.fromCharCode(b))
//       .join("");
//   };

//   const base64encode = (input) => {
//     return btoa(input)
//       .replace(/=/g, "")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_");
//   };

//   const getCodeChallenge = async () => {
//     const hashed = await sha256(codeVerifier);
//     return base64encode(hashed);
//   };

//   // Step 2: Redirect user to Spotify authorization endpoint
//   const redirectToSpotifyAuth = async () => {
//     const codeChallenge = await getCodeChallenge();
//     const authUrl = new URL("https://accounts.spotify.com/authorize");

//     window.localStorage.setItem("code_verifier", codeVerifier);

//     const params = {
//       response_type: "code",
//       client_id: clientId,
//       redirect_uri: redirectUri,
//       code_challenge_method: "S256",
//       code_challenge: codeChallenge,
//       scope: "user-read-private user-read-email", // Add any scopes you need
//     };
//     Object.keys(params).forEach((key) =>
//       authUrl.searchParams.append(key, params[key])
//     );
//     window.location.href = authUrl.toString();
//   };
//   if (!localStorage.getItem("code_verifier")) {
//     redirectToSpotifyAuth();
//   }
// }, []);

// useEffect(() => {
//   // Step 3: Exchange authorization code for access token
//   const getToken = async (code) => {
//     let codeVerifier = localStorage.getItem("code_verifier");
//     const payload = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         client_id: clientId,
//         grant_type: "authorization_code",
//         code: code,
//         redirect_uri: redirectUri,
//         code_verifier: codeVerifier,
//       }),
//     };
//     const url = "https://accounts.spotify.com/api/token";
//     try {
//       const response = await fetch(url, payload);
//       if (!response.ok) {
//         throw new Error("Failed to retrieve token");
//       }
//       const responseData = await response.json();
//       console.log("Access Token:", responseData.access_token);
//       localStorage.setItem("access_token", responseData.access_token);
//     } catch (error) {
//       console.error("Error fetching token:", error);
//     }
//   };

//   // Retrieve the authorization code from the URL
//   const urlParams = new URLSearchParams(window.location.search);
//   const code = urlParams.get("code");

//   // Exchange the authorization code for an access token
//   if (code) {
//     getToken(code);
//   }
// }, []);

// return <div>Redirecting to Spotify for authentication...</div>;

/////////////////

/////////////////////////////////////////////////////////////////
// const clientId = "7272e997d8ea4e26b1f844ebf87053fd";
// const redirectUri = "http://localhost:3000/callback";

// //Access Token
// const [accessToken, setAccessToken] = useState("");

// const generateRandomString = (length) => {
//   const possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const values = crypto.getRandomValues(new Uint8Array(length));
//   return values.reduce((acc, x) => acc + possible[x % possible.length], "");
// };

// const codeVerifier = generateRandomString(64);

// const sha256 = async (plain) => {
//   const encoder = new TextEncoder();
//   const data = encoder.encode(plain);
//   return window.crypto.subtle.digest("SHA-256", data);
// };

// const base64encode = (input) => {
//   return btoa(String.fromCharCode(...new Uint8Array(input)))
//     .replace(/=/g, "")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_");
// };

// let hashed;
// let codeChallenge;
// (async () => {
//   hashed = await sha256(codeVerifier);
//   codeChallenge = base64encode(hashed);
// })();
// async function requestAuth() {
//   const scope = "user-read-private user-read-email";
//   const authUrl = new URL("https://accounts.spotify.com/authorize");

//   window.localStorage.setItem("code_verifier", codeVerifier);
//   console.log("Auth Code Verifier: " + codeVerifier);

//   const params = {
//     response_type: "code",
//     client_id: clientId,
//     scope,
//     code_challenge_method: "S256",
//     code_challenge: codeChallenge,
//     redirect_uri: redirectUri,
//   };

//   authUrl.search = new URLSearchParams(params).toString();
//   window.location.href = authUrl.toString();
// }

// const urlParams = new URLSearchParams(window.location.search);
// let code = urlParams.get("code");
// // console.log("This is code:" + code);

// const getToken = async (code) => {
//   // stored in the previous step
//   let codeVerifier = localStorage.getItem("code_verifier");
//   console.log("TOKEN Code Verifier: " + codeVerifier);
//   const payload = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       client_id: clientId,
//       grant_type: "authorization_code",
//       code: code,
//       redirect_uri: redirectUri,
//       code_verifier: codeVerifier,
//     }),
//   };

//   // const url = "https://accounts.spotify.com/api/token";
//   try {
//     const response = await fetch(
//       "https://accounts.spotify.com/api/token",
//       payload
//     );
//     if (!response.ok) {
//       throw new Error("Failed to retrieve token");
//     }
//     const responseData = await response.json();
//     setAccessToken(responseData.access_token);
//     console.log("Token: " + accessToken);
//     localStorage.setItem("access_token", responseData.access_token);
//   } catch (error) {
//     console.error("Error fetching token:", error);
//   }
// };
// console.log(accessToken);

/////////////////////////////////////////////////////////////////

// //Authorization Code PKCE
// useEffect(async () => {
//   //Code Verifier
//   const generateRandomString = (length) => {
//     const possible =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     const values = crypto.getRandomValues(new Uint8Array(length));
//     return values.reduce((acc, x) => acc + possible[x % possible.length], "");
//   };

//   const codeVerifier = generateRandomString(64);

//   //Code Challenge
//   const sha256 = async (plain) => {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(plain);
//     return window.crypto.subtle.digest("SHA-256", data);
//   };

//   const base64encode = (input) => {
//     return btoa(String.fromCharCode(...new Uint8Array(input)))
//       .replace(/=/g, "")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_");
//   };

//   const hashed = await sha256(codeVerifier);
//   const codeChallenge = base64encode(hashed);

//   //Request Authorization
//   window.localStorage.setItem("code_verifier", codeVerifier);

//   // Construct the authorization URL with query parameters
//   const authUrl =
//     `https://accounts.spotify.com/authorize?` +
//     `response_type=code&` +
//     `client_id=${clientID}&` +
//     `scope=${encodeURIComponent(scope)}&` +
//     `code_challenge_method=S256&` +
//     `code_challenge=${codeChallenge}&` +
//     `redirect_uri=${encodeURIComponent(redirectUri)}`;

//   //Make a GET request to the authorization URL
//   fetch(authUrl)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       // Redirect to the authorization URL
//       window.location.href = response.url;
//     })
//     .catch((error) => {
//       console.error("Error requesting authorization:", error);
//     });

//   //Response for Authorization
//   const urlParams = new URLSearchParams(window.location.search);
//   let code = urlParams.get("code");

//   //Resquest an access token
//   const getToken = async (code) => {
//     // stored in the previous step
//     let codeVerifier = localStorage.getItem("code_verifier");

//     const payload = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         client_id: clientID,
//         grant_type: "authorization_code",
//         code,
//         redirect_uri: redirectUri,
//         code_verifier: codeVerifier,
//       }),
//     };

//     const body = await fetch(
//       "https://accounts.spotify.com/api/token",
//       payload
//     );
//     const response = await body.json();
//     setAccessToken(response.access_token);
//     localStorage.setItem("access_token", response.access_token);
//   };

//   const userParam = {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer" + accessToken,
//     },
//   };

//   fetch("https://api.spotify.com/v1/me", userParam)
//     .then((response) => response.json())
//     .then((data) => console.log(data));
// }, []);
//Implicit grant authorization code
// const authRequest = async () => {
//   var searchParameters = {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + accessToken,
//     },
//   };

//   let spotifyUser = await fetch(
//     "https://api.spotify.com/v1/me",
//     searchParameters
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       return data;
//     });
//   console.log(spotifyUser);
// };

//YT Tutorial Search Function
// async function search() {
//   console.log("After enter Search for " + searchQuery);

//   //GET request using search to get the Artist ID
//   var searchParameters = {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + accessToken,
//     },
//   };

//   // var spotifyUser = await fetch(
//   //   "https://api.spotify.com/v1/me",
//   //   searchParameters
//   // )
//   //   .then((response) => response.json())
//   //   .then((data) => {
//   //     console.log(data);
//   //   });

//   var artistId = await fetch(
//     "https://api.spotify.com/v1/search?q=" + searchQuery + "&type=artist",
//     searchParameters
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       return data.artists.items[0].id;
//     });

//   // GET request using the Artist ID to grab all the tracks from that artist
//   var returnedTracks = await fetch(
//     "https://api.spotify.com/v1/artists/" +
//       artistId +
//       "/top-tracks" +
//       "?market=US",
//     searchParameters
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       setTracks(data.tracks);
//     });
// }

//IGNORE THIS CHUNK Spotify Functionality begins here to access the token
// useEffect(() => {
//   //API access token
//   var authParameters = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body:
//       "grant_type=client_credentials&client_id=" +
//       clientID +
//       "&client_secret=" +
//       clientSecret,
//   };

//   fetch("https://accounts.spotify.com/api/token", authParameters)
//     .then((result) => result.json())
//     .catch((error) => {
//       console.error("Error:", error);
//     })
//     .then((data) => setAccessToken(data.access_token))
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }, []);

// useEffect(() => {
//   //API Access Token
//   var authParameters = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body:
//       "grant_type=client_credentials&client_id=" +
//       clientID +
//       "&client_secret=" +
//       clientSecret,
//   };

//   fetch("https://accounts.spotify.com/api/token", authParameters).then(
//     (response) =>
//       response.json().then((data) => setAccessToken(data.access_token))
//   );
// }, []);

//Token Access
// useEffect(() => {

//   var authParameter=
//   {
//     method: "GET",
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     client_id: clientID,
//   redirect_uri: redirectUri,
//   scope: "user-read-private user-read-email",
//   url: "https://accounts.spotify.com/authorize?response_type=" +
//   encodeURIComponent(accessToken) +
//   "&client_id=" +
//   encodeURIComponent(clientID) +
//   "&scope=" +
//   encodeURIComponent("user-read-private user-read-email") +
//   "&redirect_uri=" +
//   encodeURIComponent(redirectUri)}
//     fetch("https://accounts.spotify.com/authorize", authParameters).then(
//           (response) =>
//             response.json().then((data) => setAccessToken(data.access_token));

// }, []);
