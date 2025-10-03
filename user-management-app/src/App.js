import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserList from "./pages/UserList";
import UserDetails from "./pages/UserDetails";
import AddUser from "./pages/AddUser";
import UpdateUser from "./pages/UpdateUser";

function App() {
  const [users, setUsers] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      const parsed = JSON.parse(savedUsers);

      setUsers(parsed);
    }

    const timer = setTimeout(() => {
      setFirstLoad(false);
    }, 1900);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("Saving users:", users);
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  if (firstLoad) {
    console.log("Showing preloader");
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black">
        <img
          src="/linkplus-preloader.gif"
          alt="Loading..."
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route
            path="/"
            element={<UserList users={users} setUsers={setUsers} />}
          />
          <Route path="/user/:id" element={<UserDetails users={users} />} />
          <Route
            path="/add"
            element={<AddUser users={users} setUsers={setUsers} />}
          />
          <Route
            path="/edit/:id"
            element={<UpdateUser users={users} setUsers={setUsers} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
