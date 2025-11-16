import React, { useState } from 'react';
import { readBook } from '../services/api';

const BookReader = () => {
  const [bookId, setBookId] = useState('');
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookId.trim()) {
      setError('Please enter a book ID');
      return;
    }

    setError('');
    setBook(null);
    setLoading(true);

    try {
      const response = await readBook(bookId.trim());
      console.log('BookReader - Response:', response);
      
      // Backend returns { isBook: { title, author, section, edition, content, bookId, ... } }
      if (response && response.isBook) {
        setBook(response.isBook);
      } else if (response && (response.title || response.bookId)) {
        // Fallback: if response is the book object directly
        setBook(response);
      } else {
        console.error('BookReader - Invalid response format:', response);
        setError('Invalid response format: ' + JSON.stringify(response));
      }
    } catch (err) {
      setError(err.message || 'Book not found or error occurred');
      setBook(null);
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

      {book && (
        <div style={bookCardStyle}>
          <div style={bookHeaderStyle}>
            <h2 style={bookTitleStyle}>{book.title}</h2>
            <div style={bookMetaStyle}>
              <div style={metaRowStyle}>
                <span style={metaLabelStyle}>Book ID:</span>
                <span style={metaValueStyle}>{book.bookId}</span>
              </div>
              <div style={metaRowStyle}>
                <span style={metaLabelStyle}>Author:</span>
                <span style={metaValueStyle}>{book.author}</span>
              </div>
              <div style={metaRowStyle}>
                <span style={metaLabelStyle}>Section:</span>
                <span style={metaValueStyle}>{book.section || 'General'}</span>
              </div>
              {book.edition && (
                <div style={metaRowStyle}>
                  <span style={metaLabelStyle}>Edition:</span>
                  <span style={metaValueStyle}>{book.edition}</span>
                </div>
              )}
            </div>
          </div>
          <div style={contentSectionStyle}>
            <h3 style={contentTitleStyle}>Content:</h3>
            <div style={contentStyle}>{book.content || 'No content available'}</div>
          </div>
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

const bookCardStyle = {
  marginTop: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflow: 'hidden',
};

const bookHeaderStyle = {
  padding: '1.5rem',
  backgroundColor: '#f8f9fa',
  borderBottom: '2px solid #e0e0e0',
};

const bookTitleStyle = {
  margin: '0 0 1rem 0',
  fontSize: '1.75rem',
  fontWeight: '600',
  color: '#333',
};

const bookMetaStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
};

const metaRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const metaLabelStyle = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const metaValueStyle = {
  fontSize: '1rem',
  color: '#333',
  fontWeight: '500',
};

const contentSectionStyle = {
  padding: '1.5rem',
};

const contentTitleStyle = {
  margin: '0 0 1rem 0',
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#333',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid #e0e0e0',
};

const contentStyle = {
  lineHeight: '1.8',
  whiteSpace: 'pre-wrap',
  color: '#444',
  fontSize: '1rem',
  maxHeight: '600px',
  overflowY: 'auto',
  padding: '1rem',
  backgroundColor: '#fafafa',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
};

export default BookReader;

