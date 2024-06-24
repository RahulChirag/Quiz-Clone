import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  console.log(user);

  const signUp = async (email, password, role, setError, setResult) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role,
        UserName: "",
        GamesHosted: [],
      });

      console.log(`${email} is registered as ${role}`);
      setResult(true);
    } catch (error) {
      setError(error);
    }
  };

  const login = async (email, password, setError, setResult) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log(`${email} is logged in`);
      setResult(true);
      setUser(user);
    } catch (error) {
      setError(error);
      console.log(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      setUser(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserName = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const name = userDoc.data().UserName;
      return name;
    } catch (error) {
      console.log(error.message);
    }
  };

  const setName = async (UserName) => {
    try {
      await setDoc(doc(db, "users", user.uid), { UserName }, { merge: true });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getRole = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.data().role;
      return role;
    } catch (error) {
      console.log(error.message);
    }
  };

  const setGameLive = async (otp, name, isStarterContent, gameType) => {
    try {
      await setDoc(doc(db, "LiveGames", otp), {
        GameName: name,
        Teacher: user.uid,
        IsStarterContent: isStarterContent,
        IsGameLive: true,
        IsGameStarted: false,
        Lobby: [], // An array to keep track of players who joined the game
        Leaderboard: [], // An array to store leaderboard data
        StartTime: null, // Timestamp to store the start time of the game
        EndTime: null, // Timestamp to store the end time of the game
        GameType: gameType,
      });
      await setDoc(
        doc(db, "users", user.uid),
        { GamesHosted: arrayUnion(otp) },
        { merge: true }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const stopLive = async (otp) => {
    try {
      await setDoc(
        doc(db, "LiveGames", otp),
        { IsGameLive: false },
        { merge: true }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const startGame = async (otp) => {
    try {
      await setDoc(
        doc(db, "LiveGames", otp),
        {
          IsGameStarted: true,
          StartTime: Date.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const stopGame = async (otp) => {
    try {
      await setDoc(
        doc(db, "LiveGames", otp),
        {
          IsGameStarted: false,
          EndTime: Date.now(),
        },
        { merge: true } // Merge the new data with existing document fields
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLobbyData = (otp, setLobbyData) => {
    try {
      const hostDocRef = doc(db, "LiveGames", otp);
      const unsubscribe = onSnapshot(hostDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("Lobby Data:", data.Lobby);
          setLobbyData(data.Lobby);
        } else {
          console.error("Lobby document not found");
        }
      });

      // Return unsubscribe function to clean up the listener
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching lobby data:", error);
    }
  };

  const getGameData = (otp, setGameData, setError) => {
    try {
      const gameDocRef = doc(db, "LiveGames", otp);
      const unsubscribe = onSnapshot(gameDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setGameData(data);
          setError(""); // Clear any previous errors
        } else {
          setError("Game is not live yet");
        }
      });

      // Return unsubscribe function to clean up the listener
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching game data:", error);
      setError(error.message);
    }
  };

  const joinGame = async (otp, username) => {
    try {
      const lobbyDoc = await getDoc(doc(db, "LiveGames", otp));
      if (lobbyDoc.exists()) {
        const lobbyData = lobbyDoc.data().Lobby;

        if (lobbyData && lobbyData.includes(username)) {
          console.log(
            "Username already exists. Please choose a different username."
          );
          return { success: false, message: "Username already exists." };
        }
      }

      await setDoc(
        doc(db, "LiveGames", otp),
        {
          Lobby: arrayUnion(username),
        },
        { merge: true }
      );

      console.log("User successfully joined the game.");
      return { success: true };
    } catch (error) {
      console.log(error.message);
      return { success: false, message: error.message };
    }
  };

  const setScore = async (username, score, otp) => {
    try {
      const gameDocRef = doc(db, "LiveGames", otp);
      const gameDoc = await getDoc(gameDocRef);

      if (gameDoc.exists()) {
        const data = gameDoc.data();
        const leaderboard = data.Leaderboard || [];

        // Find if the user already exists in the leaderboard
        const userIndex = leaderboard.findIndex(
          (entry) => entry.username === username
        );

        if (userIndex !== -1) {
          // User exists, update their score
          leaderboard[userIndex].score = score;
        } else {
          // User does not exist, add them to the leaderboard
          leaderboard.push({ username, score });
        }

        // Update the leaderboard in Firestore
        await setDoc(gameDocRef, { Leaderboard: leaderboard }, { merge: true });

        console.log("Score updated successfully.");
      } else {
        console.log("Game document does not exist.");
      }
    } catch (error) {
      console.log("Error setting score:", error.message);
    }
  };

  const leaderboard = async (otp) => {
    try {
      const leaderboardDoc = await getDoc(doc(db, "LiveGames", otp));
      if (leaderboardDoc.exists()) {
        const leaderboardData = leaderboardDoc.data().Leaderboard;
        return leaderboardData;
      } else {
        console.log("Leaderboard document not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      return null;
    }
  };

  const liveLeaderboard = (otp, setLeaderboardData) => {
    try {
      const hostDocRef = doc(db, "LiveGames", otp);
      const unsubscribe = onSnapshot(hostDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setLeaderboardData(data.Leaderboard);
        } else {
          console.error("Lobby document not found");
        }
      });

      // Return unsubscribe function to clean up the listener
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching lobby data:", error);
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        signUp,
        login,
        user,
        logout,
        getUserName,
        setName,
        getRole,
        setGameLive,
        getLobbyData,
        stopLive,
        startGame,
        stopGame,
        joinGame,
        getGameData,
        setScore,
        leaderboard,
        liveLeaderboard,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
