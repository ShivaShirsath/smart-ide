import React from "react";
import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="client">
      <Avatar
        name={username}
        githubHandle={username}
        size="7.5vmin"
        round="1.5vmin"
      />
      <span>{username}</span>
    </div>
  );
};

export default Client;
