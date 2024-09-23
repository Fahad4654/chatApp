// src/components/SearchUser.js
import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';

const SearchUser = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchUsers = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('displayName', '>=', searchTerm), where('displayName', '<=', searchTerm + '\uf8ff'));

    try {
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

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
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((user) => (
            <div key={user.uid} onClick={() => onSelectUser(user)}>
              {user.displayName} ({user.email})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
