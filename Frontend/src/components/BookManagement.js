import React, { useState } from 'react';
import { addBook, updateBook, deleteBook, readBook } from '../services/api';

const BookManagement = () => {
  const [activeTab, setActiveTab] = useState('read');
  const [messages, setMessages] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);

  // Read book state
  const [readBookId, setReadBookId] = useState('');
  const [book, setBook] = useState(null);

  // Add book state
  const [addFormData, setAddFormData] = useState({
    title: '',
    bookId: '',
    section: '',
    author: '',
    content: '',
    edition: '',
  });

  // Update book state
  const [updateFormData, setUpdateFormData] = useState({
    bookId: '',
    updation: '',
  });

  // Delete book state
  const [deleteFormData, setDeleteFormData] = useState({
    title: '',
    bookId: '',
  });

  const clearMessages = () => {
    setMessages({ error: '', success: '' });
    setBook(null);
  };

  // Read book handler
  const handleReadBook = async (e) => {
    e.preventDefault();
    if (!readBookId.trim()) {
      setMessages({ error: 'Please enter a book ID', success: '' });
      return;
    }

    clearMessages();
    setBook(null);
    setLoading(true);

    try {
      const response = await readBook(readBookId.trim());
      console.log('BookManagement - Response:', response);
      
      // Backend returns { isBook: { title, author, section, edition, content, bookId, ... } }
      if (response && response.isBook) {
        setBook(response.isBook);
        setMessages({ error: '', success: 'Book found successfully!' });
      } else if (response && (response.title || response.bookId)) {
        // Fallback: if response is the book object directly
        setBook(response);
        setMessages({ error: '', success: 'Book found successfully!' });
      } else {
        console.error('BookManagement - Invalid response format:', response);
        setMessages({ error: 'Invalid response format: ' + JSON.stringify(response), success: '' });
        setBook(null);
      }
    } catch (err) {
      setMessages({ error: err.message || 'Book not found', success: '' });
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  // Add book handler
  const handleAddBook = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await addBook({
        ...addFormData,
        edition: parseInt(addFormData.edition) || 0,
      });
      setMessages({ error: '', success: 'Book added successfully!' });
      setAddFormData({
        title: '',
        bookId: '',
        section: '',
        author: '',
        content: '',
        edition: '',
      });
    } catch (err) {
      setMessages({ error: err.message || 'Failed to add book', success: '' });
    } finally {
      setLoading(false);
    }
  };

  // Update book handler
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!updateFormData.bookId.trim()) {
      setMessages({ error: 'Please enter a book ID', success: '' });
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      await updateBook(updateFormData.bookId.trim(), updateFormData.updation);
      setMessages({ error: '', success: 'Book updated successfully!' });
      setUpdateFormData({ bookId: '', updation: '' });
    } catch (err) {
      setMessages({ error: err.message || 'Failed to update book', success: '' });
    } finally {
      setLoading(false);
    }
  };

  // Delete book handler
  const handleDeleteBook = async (e) => {
    e.preventDefault();
    if (!deleteFormData.bookId.trim()) {
      setMessages({ error: 'Please enter a book ID', success: '' });
      return;
    }

    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      await deleteBook(deleteFormData.title, deleteFormData.bookId.trim());
      setMessages({ error: '', success: 'Book deleted successfully!' });
      setDeleteFormData({ title: '', bookId: '' });
    } catch (err) {
      setMessages({ error: err.message || 'Failed to delete book', success: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Book Management</h2>

      <div style={tabContainerStyle}>
        <button
          onClick={() => { setActiveTab('read'); clearMessages(); }}
          style={activeTab === 'read' ? activeTabStyle : tabStyle}
        >
          Read Book
        </button>
        <button
          onClick={() => { setActiveTab('add'); clearMessages(); }}
          style={activeTab === 'add' ? activeTabStyle : tabStyle}
        >
          Add Book
        </button>
        <button
          onClick={() => { setActiveTab('update'); clearMessages(); }}
          style={activeTab === 'update' ? activeTabStyle : tabStyle}
        >
          Update Book
        </button>
        <button
          onClick={() => { setActiveTab('delete'); clearMessages(); }}
          style={activeTab === 'delete' ? activeTabStyle : tabStyle}
        >
          Delete Book
        </button>
      </div>

      {messages.error && <div style={errorStyle}>{messages.error}</div>}
      {messages.success && <div style={successStyle}>{messages.success}</div>}

      {/* Read Book Tab */}
      {activeTab === 'read' && (
        <div style={tabContentStyle}>
          <form onSubmit={handleReadBook} style={formStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Book ID:</label>
              <div style={searchContainerStyle}>
                <input
                  type="text"
                  value={readBookId}
                  onChange={(e) => setReadBookId(e.target.value)}
                  placeholder="Enter book ID"
                  style={inputStyle}
                />
                <button type="submit" disabled={loading} style={buttonStyle}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>
          {book && (
            <div style={bookCardStyle}>
              <div style={bookHeaderStyle}>
                <h3 style={bookTitleStyle}>{book.title}</h3>
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
                <h4 style={contentTitleStyle}>Content:</h4>
                <div style={contentStyle}>{book.content || 'No content available'}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Book Tab */}
      {activeTab === 'add' && (
        <div style={tabContentStyle}>
          <form onSubmit={handleAddBook} style={formStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Title:</label>
              <input
                type="text"
                value={addFormData.title}
                onChange={(e) => setAddFormData({ ...addFormData, title: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Book ID:</label>
              <input
                type="text"
                value={addFormData.bookId}
                onChange={(e) => setAddFormData({ ...addFormData, bookId: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Section:</label>
              <input
                type="text"
                value={addFormData.section}
                onChange={(e) => setAddFormData({ ...addFormData, section: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Author:</label>
              <input
                type="text"
                value={addFormData.author}
                onChange={(e) => setAddFormData({ ...addFormData, author: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Content:</label>
              <textarea
                value={addFormData.content}
                onChange={(e) => setAddFormData({ ...addFormData, content: e.target.value })}
                required
                rows="5"
                style={textareaStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Edition:</label>
              <input
                type="number"
                value={addFormData.edition}
                onChange={(e) => setAddFormData({ ...addFormData, edition: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </form>
        </div>
      )}

      {/* Update Book Tab */}
      {activeTab === 'update' && (
        <div style={tabContentStyle}>
          <form onSubmit={handleUpdateBook} style={formStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Book ID:</label>
              <input
                type="text"
                value={updateFormData.bookId}
                onChange={(e) => setUpdateFormData({ ...updateFormData, bookId: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Content to Add:</label>
              <textarea
                value={updateFormData.updation}
                onChange={(e) => setUpdateFormData({ ...updateFormData, updation: e.target.value })}
                required
                rows="5"
                placeholder="Enter additional content to append to the book"
                style={textareaStyle}
              />
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Updating...' : 'Update Book'}
            </button>
          </form>
        </div>
      )}

      {/* Delete Book Tab */}
      {activeTab === 'delete' && (
        <div style={tabContentStyle}>
          <form onSubmit={handleDeleteBook} style={formStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Title:</label>
              <input
                type="text"
                value={deleteFormData.title}
                onChange={(e) => setDeleteFormData({ ...deleteFormData, title: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Book ID:</label>
              <input
                type="text"
                value={deleteFormData.bookId}
                onChange={(e) => setDeleteFormData({ ...deleteFormData, bookId: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={loading} style={deleteButtonStyle}>
              {loading ? 'Deleting...' : 'Delete Book'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '2rem',
};

const titleStyle = {
  marginBottom: '1.5rem',
};

const tabContainerStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '2rem',
  borderBottom: '2px solid #ddd',
};

const tabStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '2px solid transparent',
  cursor: 'pointer',
  fontSize: '1rem',
  color: '#666',
};

const activeTabStyle = {
  ...tabStyle,
  borderBottom: '2px solid #007bff',
  color: '#007bff',
  fontWeight: 'bold',
};

const tabContentStyle = {
  marginTop: '2rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inputGroupStyle = {
  marginBottom: '1rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit',
};

const searchContainerStyle = {
  display: 'flex',
  gap: '0.5rem',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '0.5rem',
};

const deleteButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
};

const errorStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '0.75rem',
  borderRadius: '4px',
  marginBottom: '1rem',
};

const successStyle = {
  backgroundColor: '#d4edda',
  color: '#155724',
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
  fontSize: '1.5rem',
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
  fontSize: '1.1rem',
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
  maxHeight: '500px',
  overflowY: 'auto',
  padding: '1rem',
  backgroundColor: '#fafafa',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
};

export default BookManagement;

