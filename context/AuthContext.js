import {
  createContext,
  useContext,
  useEffect,
  useState,
  serverTimestamp,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { db } from "../firebase";
import { firebase_auth } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

const UserContext = createContext();
const auth = firebase_auth;
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState("");

  const createUser = (name, email, password) => {
    const create = createUserWithEmailAndPassword(auth, email, password);

    return create;
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser)
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const createPost = (postData) => {
    const collectionRef = collection(db, "posts");
    return addDoc(collectionRef, { ...postData });
  };
  
  const createComment = (postData) => {
    const collectionRef = collection(db, "comments");
    return addDoc(collectionRef, { ...postData });
  };

  const deletePost = (postData) => {
    const collectionRef = collection(db, "comments");
    return deleteDoc(collectionRef, { ...postData });
  };

  return (
    <UserContext.Provider
      value={{
        createUser,
        user,
        logout,
        signIn,
        createPost,
        createComment,
        deletePost
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
