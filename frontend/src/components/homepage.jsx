import Sidenav from "./sidenav";  
import Timeline from "./timeline";  
import Suggestions from "./suggestions";  

const Homepage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
     
      {/* Main Content (Timeline) */}
      <div className="flex-1 p-6">
        <Timeline />
      </div>

      {/* Suggestions (Right Side) */}
      <div className="w-1/4 p-6 bg-white border-l">
        <Suggestions />
      </div>
    </div>
  );
};

export default Homepage;
