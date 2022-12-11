import React, { useState } from "react";
import { useUserContext } from "../context/userContext";

const Auth = () => {

  const { signInWithGoogle, signInWithGithub } = useUserContext();

  return (
    <div>
      <button onClick={signInWithGoogle}>Google</button>
      <button onClick={signInWithGithub}>GitHub</button>
    </div>
  );
};

export default Auth;