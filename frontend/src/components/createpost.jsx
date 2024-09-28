import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, Avatar, Button, TextareaAutosize } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const CreatePost = ({ open, setOpen, user }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const imageRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Function to get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User is not authenticated. Please log in.");
      throw new Error("User is not authenticated");
    }
    return token;
  };

  const createPostHandler = async () => {
    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);

    try {
      setLoading(true);

      // Get the token from localStorage
      const token = getToken();

      // Send POST request to create the post
      const res = await axios.post('http://localhost:5000/api/post/addpost', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        }
      });

      if (res.status === 200) {
        toast.success("Post created successfully!");
        setOpen(false);
        // Reset form state
        setCaption('');
        setImage(null);
        setFile(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized errors (e.g., token invalid/expired)
        toast.error("You are not authorized. Please log in again.");
        localStorage.removeItem("token"); // Remove token from localStorage if invalid/expired
        // Optionally redirect the user to the login page:
        // window.location.href = '/login'; // Uncomment this line if you want to redirect
      } else {
        // General error handler
        toast.error(error.response?.data?.message || "Failed to create post. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const fileChangeHandler = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogContent className="p-4">
        <div className="text-center font-semibold mb-4">Create New Post</div>

        <div className="flex gap-3 items-center mb-4">
          <Avatar src={user?.profilePicture} alt="User Image" />
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>

        {/* Textarea for caption */}
        <TextareaAutosize
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border w-full p-2 rounded-md mb-4"
          placeholder="Write a caption..."
        />

        {/* Image preview */}
        {image && (
          <div className="w-full h-64 flex items-center justify-center mb-4">
            <img
              src={image}
              alt="Preview"
              className="object-contain h-full w-full rounded-md"
            />
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />

        {/* Button to trigger file input */}
        <Button
          onClick={() => imageRef.current.click()}
          className="w-full bg-[#0095F6] hover:bg-[#258bcf]"
          variant="contained"
        >
          Select from Computer
        </Button>

        {/* Button to Post */}
        {image && (
          loading ? (
            <Button disabled className="w-full bg-gray-400">
              Please wait...
            </Button>
          ) : (
            <Button onClick={createPostHandler} className="w-full">Post</Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
