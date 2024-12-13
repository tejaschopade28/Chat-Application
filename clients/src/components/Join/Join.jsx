import { useState } from "react";
import React from 'react';
import { Link } from 'react-router-dom';


import './Join.css';

const Join = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState("");

  const handleSignIn = (e) => {
    if (!name || !room) {
      e.preventDefault();
      setError("Name and room are required.");
    } else if (name.toLowerCase() === 'admin') {
      e.preventDefault();
      setError("You cannot use 'admin' as a username.");
    } else {

      setError(""); // Clear previous errors
    }
  };

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input 
            placeholder="Name"
            className="joinInput" 
            type="text" 
            value={name}
            onChange={(event) => setName(event.target.value)} 
          />
        </div>
        <div>
          <input 
            placeholder="Room" 
            className="joinInput mt-20" 
            type="text" 
            value={room}
            onChange={(event) => setRoom(event.target.value)} 
          />
        </div>
        {error && <p className="error">{error}</p>}
        <Link 
          to={`/chat?name=${name}&room=${room}`}
          onClick={(e) => handleSignIn(e)}
        >
          <button className="button mt-20" type="submit">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
