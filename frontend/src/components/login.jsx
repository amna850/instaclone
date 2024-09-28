import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import insta from "../assets/insta.png";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const Login = () => {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const dispatch=useDispatch();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    console.log(inputs);

    try {
        setLoading(true);
        const res = await axios.post('http://localhost:5000/api/users/login', inputs);
        localStorage.setItem('token', res.data.token); // Store the token
        if (res.status === 200) {
            
            const userData = res.data.user;
            const { username, profilePicture } = userData; // Destructure 

            // Dispatch user data to Redux store
            dispatch(setUser({ username, profilePicture }));
            
            setInputs({});
            navigate('/homepage');
        }
    } catch (error) {
        toast.error(error.response ? error.response.data : "Login failed!");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex items-center space-x-8">
        
        <div className="flex-shrink-0">
          <img 
            src={insta}
            alt="Instagram Logo"
            className="w-34 h-33"
          />
        </div>

        <div className="bg-gray-50 p-8 rounded-lg shadow-lg w-96 border border-gray-300">
          <form onSubmit={loginHandler} className="space-y-9">
            <div className="text-center">
              <img
                className="w-32 mb-2 filter grayscale"
                src="https://www.pngkey.com/png/detail/2-27715_instagram-png-logo-instagram-word-logo-png.png"
                alt="Instagram Logo"
              />
            </div>

             <div>
              <input
                type="email"
                name="email"
                value={inputs.email || ""}
                placeholder="Email"
                onChange={handleChange}
                className="w-full p-4 mt-2 border rounded-lg text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            


            <div>
              <input
                type="password"
                name="password"
                value={inputs.password || ""}
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-4 mt-2 border rounded-lg text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg text-lg hover:bg-blue-600 transition-colors duration-300" disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          {/* Sign Up Box */}
          <div className="bg-white p-4 mt-6 rounded-lg shadow-lg border border-gray-300 text-center">
            <p className="text-gray-700">Don't have an account?</p>
            <p>
              <Link to="/signup" className="text-blue-500 font-bold hover:underline mt-2">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ToastContainer placed here */}
      <ToastContainer />
    </div>
  );
}

export default Login;
