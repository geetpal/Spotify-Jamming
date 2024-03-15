const clientId = "7272e997d8ea4e26b1f844ebf87053fd";
const redirectUri = "https://geetpal.github.io/Spotify-Jamming";

let accessToken;
let userId; // Spotify user id

const Spotify = {
  // Redirect user to Spotify Auth page when search button is clicked
  getAuth() {
    const tokenUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    window.location = tokenUrl;
  },

  // Check the current URL on the page - if there is accesstoken to be extracted, this code will run
  checkAuth() {
    const authenticated = window.location.href.match(/access_token=([^&]*)/);
    if (authenticated) {
      accessToken = authenticated[1];
      return true;
    } else {
      return false;
    }
  },

  getUserName() {
    if (!accessToken) {
      return Promise.reject(new Error("Access token is missing"));
    }
    const nameEndpoint = "https://api.spotify.com/v1/me";
    return fetch(nameEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to fetch user data");
        }
      })
      .then((data) => {
        const userName = data.display_name;
        userId = data.id;
        return userName;
      });
  },

  searchTracks(searchInput) {
    const searchEndpoint = `https://api.spotify.com/v1/search?q=${searchInput}&type=track`;

    return fetch(searchEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const trackResults = data.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          image: track.album.images[0].url,
          uri: track.uri,
        }));
        return trackResults;
      });
  },

  createPlaylist(listName, urisArray) {
    const createListURL = `https://api.spotify.com/v1/users/${userId}/playlists`;
    const playlistData = {
      name: listName,
    };
    return fetch(createListURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playlistData),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error("Failed to create playlist");
        }
      })
      .then((data) => {
        const playlistId = data.id;
        const tracksToAdd = {
          uris: urisArray,
        };

        const addTracksURL = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        return fetch(addTracksURL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tracksToAdd),
        });
      })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          return true;
        } else {
          return false;
        }
      });
  },
};

export default Spotify;

//Archive

// import { useState } from "react";

// const Spotify = async (props) => {
//   const clientId = "7272e997d8ea4e26b1f844ebf87053fd";
//   const redirectUri = "http://localhost:3000";

//   //Access Token
//   const [accessToken, setAccessToken] = useState("");

//   const generateRandomString = (length) => {
//     const possible =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     const values = crypto.getRandomValues(new Uint8Array(length));
//     return values.reduce((acc, x) => acc + possible[x % possible.length], "");
//   };

//   const codeVerifier = generateRandomString(64);

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

//   const getCodeChallenge = async () => {
//     const hashed = await sha256(codeVerifier);
//     return base64encode(hashed);
//   };

//   async function requestAuth() {
//     const codeChallenge = await base64encode(hashed);
//     const scope = "user-read-private user-read-email";
//     const authUrl = new URL("https://accounts.spotify.com/authorize");

//     window.localStorage.setItem("code_verifier", codeVerifier);

//     const params = {
//       response_type: "code",
//       client_id: clientId,
//       scope,
//       code_challenge_method: "S256",
//       code_challenge: codeChallenge,
//       redirect_uri: redirectUri,
//     };

//     authUrl.search = new URLSearchParams(params).toString();
//     window.location.href = authUrl.toString();
//   }

//   requestAuth();

//   const urlParams = new URLSearchParams(window.location.search);
//   let code = urlParams.get("code");

//   const getToken = async (code) => {
//     // stored in the previous step
//     let codeVerifier = localStorage.getItem("code_verifier");

//     const payload = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         client_id: clientId,
//         grant_type: "authorization_code",
//         code,
//         redirect_uri: redirectUri,
//         code_verifier: codeVerifier,
//       }),
//     };
//     const url = "https://accounts.spotify.com/api/token";
//     const body = await fetch(url, payload);
//     const response = await body.json();
//     setAccessToken(response.access_token);

//     localStorage.setItem("access_token", response.access_token);
//   };

//   if (code) {
//     getToken(code);
//   }
//   console.log(accessToken);
// };
// export default Spotify;

// import { useEffect } from "react";

// export const clientID = "7272e997d8ea4e26b1f844ebf87053fd";
// export const clientSecret = "1cc13202795a440ea776b28a8e58c47e";
// export const redirectUri = "http://localhost:3000/";
// // let accessToken;

// export const scope = "user-read-private user-read-email";
// // const authUrl = new URL("https://accounts.spotify.com/authorize");

// const Spotify = (props) => {
//   useEffect(async () => {
//     //Code Verifier
//     const generateRandomString = (length) => {
//       const possible =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//       const values = crypto.getRandomValues(new Uint8Array(length));
//       return values.reduce((acc, x) => acc + possible[x % possible.length], "");
//     };

//     const codeVerifier = generateRandomString(64);

//     //Code Challenge
//     const sha256 = async (plain) => {
//       const encoder = new TextEncoder();
//       const data = encoder.encode(plain);
//       return window.crypto.subtle.digest("SHA-256", data);
//     };

//     const base64encode = (input) => {
//       return btoa(String.fromCharCode(...new Uint8Array(input)))
//         .replace(/=/g, "")
//         .replace(/\+/g, "-")
//         .replace(/\//g, "_");
//     };

//     const hashed = await sha256(codeVerifier);
//     const codeChallenge = base64encode(hashed);

//     //Request Authorization
//     window.localStorage.setItem("code_verifier", codeVerifier);

//     // Construct the authorization URL with query parameters
//     const authUrl =
//       `https://accounts.spotify.com/authorize?` +
//       `response_type=code&` +
//       `client_id=${clientID}&` +
//       `scope=${encodeURIComponent(scope)}&` +
//       `code_challenge_method=S256&` +
//       `code_challenge=${codeChallenge}&` +
//       `redirect_uri=${encodeURIComponent(redirectUri)}`;

//     //Make a GET request to the authorization URL
//     fetch(authUrl)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         // Redirect to the authorization URL
//         window.location.href = response.url;
//       })
//       .catch((error) => {
//         console.error("Error requesting authorization:", error);
//       });

//     //Response for Authorization
//     const urlParams = new URLSearchParams(window.location.search);
//     let code = urlParams.get("code");

//     //Resquest an access token
//     const getToken = async (code) => {
//       // stored in the previous step
//       let codeVerifier = localStorage.getItem("code_verifier");

//       const payload = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           client_id: clientID,
//           grant_type: "authorization_code",
//           code,
//           redirect_uri: redirectUri,
//           code_verifier: codeVerifier,
//         }),
//       };

//       const body = await fetch(
//         "https://accounts.spotify.com/api/token",
//         payload
//       );
//       const response = await body.json();
//       accessToken = response.access_token;
//       localStorage.setItem("access_token", response.access_token);
//     };

//     const userParam = {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer" + accessToken,
//       },
//     };

//     fetch("https://api.spotify.com/v1/me", userParam)
//       .then((response) => response.json())
//       .then((data) => console.log(data));
//   }, []);
// };

// export default Spotify;
