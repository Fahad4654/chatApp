import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

const SearchUser = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // State to hold all available users

  // Function to search users based on the search term
  const searchUsers = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    const usersRef = collection(firestore, "users");
    const q = query(
      usersRef,
      where("email", ">=", searchTerm),
      where("email", "<=", searchTerm + "\uf8ff")
    );

    try {
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Function to fetch all users when component mounts
  const fetchAllUsers = async () => {
    const usersRef = collection(firestore, "users");
    try {
      const querySnapshot = await getDocs(usersRef);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setAllUsers(users); // Set all available users
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  // Use effect to fetch all users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="search-container">
      <form onSubmit={searchUsers}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Show search results if search has been done */}
      {searchResults.length > 0 ? (
        <div className="search-results">
          {searchResults.map((user) => (
            <div key={user.uid} onClick={() => onSelectUser(user)}>
              <div className="slusers">
                {user.displayName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="all-users">
          <h3>All Users</h3>
          {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <div key={user.uid} onClick={() => onSelectUser(user)}>
                <div className="slusers">{user.displayName}</div>
              </div>
            ))
          ) : (
            <div>No users found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
