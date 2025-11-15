import React, { useState } from 'react';
import { readBook } from '../services/api';

const BookReader = () => {
  const [bookId, setBookId] = useState('');
  const [bookContent, setBookContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookId.trim()) {
      setError('Please enter a book ID');
      return;
    }

    setError('');
    setBookContent('');
    setLoading(true);

    try {
      const response = await readBook(bookId.trim());
      setBookContent(response.message || response.content || 'No content available');
    } catch (err) {
      setError(err.message || 'Book not found or error occurred');
      setBookContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Read Book</h2>
      <form onSubmit={handleSearch} style={formStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Book ID:</label>
          <div style={searchContainerStyle}>
            <input
              type="text"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="Enter book ID"
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error && <div style={errorStyle}>{error}</div>}

      {bookContent && (
        <div style={contentContainerStyle}>
          <h3 style={contentTitleStyle}>Book Content:</h3>
          <div style={contentStyle}>{bookContent}</div>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '2rem',
};

const titleStyle = {
  marginBottom: '1.5rem',
};

const formStyle = {
  marginBottom: '2rem',
};

const inputGroupStyle = {
  marginBottom: '1rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
};

const searchContainerStyle = {
  display: 'flex',
  gap: '0.5rem',
};

const inputStyle = {
  flex: 1,
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
};

const errorStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '0.75rem',
  borderRadius: '4px',
  marginBottom: '1rem',
};

const contentContainerStyle = {
  marginTop: '2rem',
  padding: '1.5rem',
  backgroundColor: '#f9f9f9',
  borderRadius: '4px',
  border: '1px solid #ddd',
};

const contentTitleStyle = {
  marginTop: 0,
  marginBottom: '1rem',
};

const contentStyle = {
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
};

export default BookReader;

