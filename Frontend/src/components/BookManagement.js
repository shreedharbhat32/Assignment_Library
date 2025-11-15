import React, { useState } from 'react';
import { addBook, updateBook, deleteBook, readBook } from '../services/api';

const BookManagement = () => {
  const [activeTab, setActiveTab] = useState('read');
  const [messages, setMessages] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);

  // Read book state
  const [readBookId, setReadBookId] = useState('');
  const [bookContent, setBookContent] = useState('');

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
  };

  // Read book handler
  const handleReadBook = async (e) => {
    e.preventDefault();
    if (!readBookId.trim()) {
      setMessages({ error: 'Please enter a book ID', success: '' });
      return;
    }

    clearMessages();
    setBookContent('');
    setLoading(true);

    try {
      const response = await readBook(readBookId.trim());
      setBookContent(response.message || response.content || 'No content available');
      setMessages({ error: '', success: 'Book found successfully!' });
    } catch (err) {
      setMessages({ error: err.message || 'Book not found', success: '' });
      setBookContent('');
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
          {bookContent && (
            <div style={contentContainerStyle}>
              <h3 style={contentTitleStyle}>Book Content:</h3>
              <div style={contentStyle}>{bookContent}</div>
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

export default BookManagement;

