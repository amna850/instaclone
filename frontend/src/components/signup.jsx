import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import insta from "../assets/insta.png";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use navigate hook

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(inputs);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/users/register', inputs, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.status === 201) {
        toast.success("Registration successful!");
        setInputs({
          username: "",
          email: "",
          password: ""
        });
        navigate('/homepage'); // Redirect to homepage
      }
    } catch (error) {
      toast.error(error.response ? error.response.data : "Registration failed!");
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

        <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-300">
          <form onSubmit={signupHandler} className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-4">Sign Up</h2>
            
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
                type="text"
                name="username"
                value={inputs.username || ""}
                placeholder="Username"
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
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="bg-white p-4 mt-6 rounded-lg shadow-lg border border-gray-300 text-center">
              <p className="text-gray-700">Already have an account?</p>
              <p>
                <Link to="/login" className="text-blue-500 font-bold hover:underline mt-2">
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ToastContainer placed here */}
      <ToastContainer />
    </div>
  );
}

export default Signup;
