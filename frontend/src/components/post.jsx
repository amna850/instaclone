import React, { useState } from 'react';
import { Avatar, Dialog, DialogActions, DialogContent, DialogContentText, Button } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Commentbox from './commentbox'; 

const Post = () => {
  const [open, setOpen] = useState(false);
  const [Copen, setCOpen] = useState(false);
  const [text, setText] = useState("");

  // Open dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Open Commentbox
  const handleCOpen = () => {
    setCOpen(true);
  };

  // Close Commentbox
  const handleCClose = () => {
    setCOpen(false);
  };

  const changeEventHandler = (e) => {
    setText(e.target.value);  
  };

  // Comment handler 
  const commentHandler = () => {
    if (text.trim()) {
      console.log("Comment:", text); // Comment posting logic
      setText(""); // Clear input after posting
    }
  };

  return (
    <>
      <div className='my-8 w-full max-w-sm mx-auto'>
        <div className='flex items-center justify-between'>
          {/* Avatar and Username */}
          <div className='flex items-center gap-2'>
            <Avatar>a</Avatar>
            <div className='flex flex-col'>
              <h1 className='font-bold'>username</h1>
            </div>
          </div>

          {/* More Options Icon (Trigger Dialog) */}
          <MoreHorizIcon onClick={handleClickOpen} style={{ cursor: 'pointer' }} />
        </div>

        {/* Post Image */}
        <div className='my-4'>
          <img src="https://plus.unsplash.com/premium_photo-1725873536636-9f8133411637?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Post Image" className='w-full' />
        </div>

        {/* Post Footer (Icons) */}
        <div className='flex justify-between items-center'>
          <div className='flex gap-3'>
            <FavoriteBorderIcon className="cursor-pointer hover:text-gray-600" />
            <ChatBubbleOutlineIcon className="cursor-pointer hover:text-gray-600" onClick={handleCOpen} />
            <TelegramIcon className="cursor-pointer hover:text-gray-600" />
          </div>
          <BookmarkBorderIcon className="cursor-pointer hover:text-gray-600" />
        </div>
        <span className='font-medium block mb-2'>100k likes</span>
        <p>
          <span className='font-medium mr-2'>username</span>
          caption
        </p>
        <span className='cursor-pointer text-sm text-gray-400' onClick={handleCOpen}>View all comments</span>
      </div>

      {/* Comment input field */}
      <div className='flex items-center justify-between mt-2'>
        <input
          type="text"
          placeholder='Add a comment...'
          value={text}
          onChange={changeEventHandler}
          className='outline-none text-sm w-full bg-transparent placeholder-gray-400 focus:ring-0 focus:outline-none'
        />
        {text && (
          <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer ml-2'>
            Post
          </span>
        )}
      </div>

      {/* Commentbox Component */}
      <Commentbox open={Copen} setOpen={handleCClose} />

      {/* Dialog for Unfollow */}
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>Do you want to unfollow this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleClose} color="secondary">Unfollow</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Post;
