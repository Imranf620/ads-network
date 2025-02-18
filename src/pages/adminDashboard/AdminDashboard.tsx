import  { useState } from 'react';
import Domains from '../domains/Domains';
import Users from '../../components/users/Users';
import Stats from '../../components/stats/Stats';

const AdminDashboard = () => {
  const [toShow, setToShow] = useState("domains");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center space-x-6 mb-8">
        <button
          onClick={() => setToShow("domains")}
          className={`px-4 py-2 rounded-md text-lg font-semibold transition-all duration-300 
            ${toShow === "domains" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-100"}`}
        >
          Domains
        </button>
        <button
          onClick={() => setToShow("users")}
          className={`px-4 py-2 rounded-md text-lg font-semibold transition-all duration-300 
            ${toShow === "users" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-100"}`}
        >
          Users
        </button>
        <button
          onClick={() => setToShow("stats")}
          className={`px-4 py-2 rounded-md text-lg font-semibold transition-all duration-300 
            ${toShow === "stats"? "bg-blue-600 text-white" : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-100"}`}
        >Stats</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {toShow === "domains" ? (
          <Domains />
        ) : toShow==="users"? (
          <Users />
        )
        : (
          <Stats/>
        )
      }
      </div>
    </div>
  );
};

export default AdminDashboard;
