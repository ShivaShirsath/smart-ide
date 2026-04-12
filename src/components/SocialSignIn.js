import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Tilt from "react-parallax-tilt";
import IcGoogle from "../assets/IcGoogle";
import IcGithub from "../assets/IcGithub";
import toast from "react-hot-toast";

const SocialSignIn = () => {
  const { signInWith } = UserAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async (provider) => {
    if (isSigningIn) return;

    setIsSigningIn(true);
    const toastId = toast.loading(`Connecting to ${provider}...`);

    try {
      await signInWith(provider === "google");
      toast.success(`Signed in with ${provider}!`, { id: toastId });
    } catch (e) {
      console.error("Auth Error Details:", e);

      // Map common Firebase errors to user-friendly messages
      let message = "Sign-in failed";
      if (e.code === "auth/unauthorized-domain") {
        message = "Unauthorized Domain. Please add vercel.app to Firebase Settings!";
      } else if (e.code === "auth/popup-closed-by-user") {
        message = "Sign-in window closed.";
      } else if (e.code === "auth/operation-not-allowed") {
        message = "Google/GitHub login is not enabled in Firebase context.";
      } else if (e.code) {
        message = e.code.split("/")[1].replace(/-/g, " ");
      }

      toast.error(message, { id: toastId, duration: 5000 });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main>
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
          <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '25px', marginTop: '10px' }}>
            {isSigningIn ? "Securely connecting..." : "Select your account to get started"}
          </p>
          <section style={{ display: "flex", flexDirection: 'row', gap: '1rem', width: '100%' }}>
            <button
              onClick={() => handleSignIn("google")}
              disabled={isSigningIn}
              style={{
                cursor: isSigningIn ? 'default' : 'pointer',
                width: '50%'
              }}
              className="login-btn-circle"
              title="Sign in with Google"
            >
              <IcGoogle style={{ width: '100%', height: '100%' }} />
            </button>
            <button
              onClick={() => handleSignIn("github")}
              disabled={isSigningIn}
              style={{
                cursor: isSigningIn ? 'default' : 'pointer',
                width: '50%'
              }}
              className="login-btn-circle"
              title="Sign in with GitHub"
            >
              <IcGithub style={{ width: '100%', height: '100%' }} />
            </button>
          </section>
          {isSigningIn && (
            <div style={{ marginTop: '20px', fontSize: '0.75rem', color: 'gold' }}>
              Pop-up will appear soon...
            </div>
          )}
        </div>
      </Tilt>
    </main >
  );
};

export default SocialSignIn;
