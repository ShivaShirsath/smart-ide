import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Tilt from "react-parallax-tilt";
import IcGoogle from "../assets/IcGoogle";
import IcGithub from "../assets/IcGithub";

const SocialSignIn = () => {
  const { signInWith } = UserAuth();
  const [error, setError] = useState("");

  const signIn = async (e) => {
    setError("");
    try {
      await signInWith(e.target.id === "google");
    } catch (e) {
      setError(JSON.stringify(e, undefined, 2));
    }
  };

  return (
    <main>
      {error && <pre>error</pre>}
      <Tilt
        className="tilt"
        perspective={2000}
        glareEnable={true}
        glareMaxOpacity={0.45}
        glareColor="#ffffff"
        glareBorderRadius="2.5dvmin"
      >
        <div className="inner-element">
          <h1>Sign In</h1>
          <section>
            <IcGoogle
              id="google"
              onClick={signIn}
              alt="google"
              style={{
                cursor: 'pointer',
                width: '100%',
                height: '100%',
              }}
            />
            <IcGithub
              id="github"
              onClick={signIn}
              alt="github"
              style={{
                cursor: 'pointer',
                width: '100%',
                height: '100%',
              }}
            />
          </section>
        </div>
      </Tilt>
    </main>
  );
};

export default SocialSignIn;
