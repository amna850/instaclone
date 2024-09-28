import { useState } from "react";
import { Avatar, Dialog, DialogContent, Button, TextField } from "@mui/material";

const Commentbox = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const sendMessageHandler = () => {
    console.log("Message sent:", text);
    setText("");
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogContent className="p-0 flex flex-col">
        <div className='flex'>
          {/* Left Side: Post Image */}
          <div className='w-1/2'>
            <img
              src="https://plus.unsplash.com/premium_photo-1725873536636-9f8133411637?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="post_img"
              className='w-full h-full object-cover'
            />
          </div>

          {/* Right Side: Username, Comments, Input */}
          <div className='w-1/2 flex flex-col justify-between'>
            {/* Username */}
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Avatar>a</Avatar>
                <div>
                  <span className='font-semibold text-sm'>username</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              <p>No comments available</p>
            </div>

            {/* Comment Input Section */}
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <TextField
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="contained"
                  color="primary"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Commentbox;
