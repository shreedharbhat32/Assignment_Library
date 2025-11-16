import React, { useState, useEffect } from 'react';
import { readBook, getAllBooks } from '../services/api';

const BookReader = () => {
  const [bookId, setBookId] = useState('');
  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // Fetch all books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const response = await getAllBooks();
      if (response && response.books) {
        setBooks(response.books);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      // Don't show error to user, just log it
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleBookClick = async (selectedBookId) => {
    setBookId(selectedBookId);
    setError('');
    setBook(null);
    setLoading(true);

    try {
      const response = await readBook(selectedBookId);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookId.trim()) {
      setError('Please enter a book ID');
      return;
    }

    await handleBookClick(bookId.trim());
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Read Book</h2>
      
      {/* Books List Section */}
      <div style={booksListSectionStyle}>
        <h3 style={sectionTitleStyle}>Available Books</h3>
        {loadingBooks ? (
          <div style={loadingStyle}>Loading books...</div>
        ) : books.length > 0 ? (
          <div style={booksListStyle}>
            {books.map((bookItem) => (
              <div
                key={bookItem._id || bookItem.bookId}
                style={{
                  ...bookListItemCardStyle,
                  ...(book && book.bookId === bookItem.bookId ? selectedBookCardStyle : {}),
                  cursor: 'pointer',
                }}
                onClick={() => handleBookClick(bookItem.bookId)}
              >
                <div style={bookListItemHeaderStyle}>
                  <h4 style={bookListItemTitleStyle}>{bookItem.title}</h4>
                  <span style={bookIdBadgeStyle}>ID: {bookItem.bookId}</span>
                </div>
                <div style={bookListItemMetaStyle}>
                  <div style={bookListItemMetaRowStyle}>
                    <span style={bookListItemMetaLabelStyle}>Author:</span>
                    <span style={bookListItemMetaValueStyle}>{bookItem.author}</span>
                  </div>
                  <div style={bookListItemMetaRowStyle}>
                    <span style={bookListItemMetaLabelStyle}>Section:</span>
                    <span style={bookListItemMetaValueStyle}>{bookItem.section || 'General'}</span>
                  </div>
                  {bookItem.edition && (
                    <div style={bookListItemMetaRowStyle}>
                      <span style={bookListItemMetaLabelStyle}>Edition:</span>
                      <span style={bookListItemMetaValueStyle}>{bookItem.edition}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyStateStyle}>No books available. Please add books to get started.</div>
        )}
      </div>

      {/* Search Section */}
      <div style={searchSectionStyle}>
        <h3 style={sectionTitleStyle}>Search by Book ID</h3>
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
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {/* Selected Book Display */}
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

const booksListSectionStyle = {
  marginBottom: '3rem',
};

const searchSectionStyle = {
  marginBottom: '2rem',
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '1rem',
  color: '#333',
};

const booksListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '1rem',
};

const bookListItemCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  padding: '1.5rem',
  transition: 'all 0.2s ease',
  minHeight: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const bookListItemHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem',
  gap: '1rem',
};

const bookListItemTitleStyle = {
  margin: 0,
  fontSize: '1.3rem',
  fontWeight: '600',
  color: '#333',
  flex: 1,
};

const bookIdBadgeStyle = {
  fontSize: '0.85rem',
  padding: '0.4rem 0.75rem',
  backgroundColor: '#e9ecef',
  borderRadius: '4px',
  color: '#666',
  fontWeight: '500',
  whiteSpace: 'nowrap',
};

const bookListItemMetaStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const bookListItemMetaRowStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '1rem',
  gap: '0.5rem',
};

const bookListItemMetaLabelStyle = {
  color: '#666',
  fontWeight: '600',
  minWidth: '80px',
};

const bookListItemMetaValueStyle = {
  color: '#333',
  fontWeight: '400',
};

const selectedBookCardStyle = {
  border: '2px solid #007bff',
  boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)',
};

const loadingStyle = {
  padding: '2rem',
  textAlign: 'center',
  color: '#666',
};

const emptyStateStyle = {
  padding: '2rem',
  textAlign: 'center',
  color: '#666',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
};

export default BookReader;

