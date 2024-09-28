import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import CreatePost from './createpost';

const Sidenav = () => {
  const navigate = useNavigate();
  const { username, profilePicture } = useSelector((state) => state.users);
  const [open, setOpen] = useState(false);
  
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Display user's profile picture or initials
  const avatarSrc = profilePicture || null;
  const usernameInitial = username ? username.charAt(0).toUpperCase() : "";

  return (
    <div className="flex flex-col justify-between h-screen bg-gray-900 text-white p-6 fixed top-0 left-0 w-64 border-r-6 border-gray-700"
      inert={open ? "true" : undefined} // Correctly set inert attribute
    >
      <img
        className="w-32 mb-8"
        src="https://www.pngkey.com/png/full/828-8286178_mackeys-work-needs-no-elaborate-presentation-or-distracting.png"
        alt="Instagram Logo"
      />
      <div className="flex flex-col space-y-4">
        <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <HomeIcon />
          <span>Home</span>
        </button>
        <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <SearchIcon />
          <span>Search</span>
        </button>
        <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <ExploreIcon />
          <span>Explore</span>
        </button>
        <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <SlideshowIcon />
          <span>Reels</span>
        </button>
        <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <ChatIcon />
          <span>Messages</span>
        </button>
        <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <FavoriteBorderIcon />
          <span>Notifications</span>
        </button>
        <button 
          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700"
          onClick={() => setOpen(true)} // Open the dialog when clicked
        >
          <AddCircleOutlineIcon />
          <span>Create</span>
        </button>
        
        <button onClick={logout} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <Avatar src={avatarSrc} alt={username}>
            {!avatarSrc && usernameInitial}
          </Avatar>
          <div className="flex flex-col items-start ml-2">
            <button className="text-sm text-gray-300 hover:text-white">Logout</button>
          </div>
        </button>
      </div>
      <div className="mt-8">
        <button className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <MenuIcon />
          <span>More</span>
        </button>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default Sidenav;
