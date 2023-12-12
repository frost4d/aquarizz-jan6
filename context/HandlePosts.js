import React, { useState } from "react";
import { UserAuth } from "./AuthContext";

export const HandlePosts = () => {
  const { user } = UserAuth();
  const uid = user.uid();
  const [userID, setUserID] = useState("");

   const createPost = (data) => {
    setUserID(uid);

  };
};
