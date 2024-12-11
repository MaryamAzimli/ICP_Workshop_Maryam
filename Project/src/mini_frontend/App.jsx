import React, { useState } from "react";
import { libraryManagementBackend } from "./actor"; // Import the generated actor
import { FaUserPlus, FaBook, FaArrowRight, FaSearch, FaInfoCircle, FaUndo } from "react-icons/fa";

function App() {

  const [userName, setUserName] = useState("");
  const [bookDetails, setBookDetails] = useState({
    
    title: "",
    author: "",
    publication_year: "",
    genre: "",
    book_tags: "",
  });
  const [returnUserId, setReturnUserId] = useState("");
const [returnBookId, setReturnBookId] = useState("");

  const [borrowUserId, setBorrowUserId] = useState("");
  const [borrowBookId, setBorrowBookId] = useState("");
  const [getUserId, setGetUserId] = useState("");
  const [getBookId, setGetBookId] = useState("");
  const [output, setOutput] = useState("");

  const createUser = async () => {
    try {
      const id = await libraryManagementBackend.createUser(userName);
      setOutput(
        <div style={outputCardStyle}>
          <h3>
            <FaUserPlus style={iconStyle} /> User Created
          </h3>
          <p><strong>Name:</strong> {userName}</p>
          <p><strong>User ID:</strong> {id}</p>
        </div>
      );
    } catch (error) {
      console.error("Error creating user:", error);
      setOutput(
        <div style={outputCardStyle}>
          <p style={{ color: "red" }}>An error occurred while creating the user.</p>
        </div>
      );
    }
  };
  

  const toArray = (string) => {
    return string
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean); // Remove empty values
  };

  const addBook = async () => {
    try {
      const book = {
        title: bookDetails.title.trim(),
        author: bookDetails.author.trim(),
        publication_year: parseInt(bookDetails.publication_year, 10),
        genre: toArray(bookDetails.genre), // Pass array of genres
        avibility: bookDetails.avibility || false, // Checkbox value
        book_tags: toArray(bookDetails.book_tags), // Pass array of tags
      };
  
      const id = await libraryManagementBackend.addNewBook(book);
      setOutput(
        <div style={outputCardStyle}>
          <h3>
            <FaBook style={iconStyle} /> Book Added
          </h3>
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Publication Year:</strong> {book.publication_year}</p>
          <p><strong>Genre:</strong> {book.genre.length > 0 ? book.genre.join(", ") : "None"}</p>
          <p><strong>Availability:</strong> {book.avibility ? "Available" : "Not Available"}</p>
          <p><strong>Tags:</strong> {book.book_tags.length > 0 ? book.book_tags.join(", ") : "None"}</p>
          <p><strong>Book ID:</strong> {id}</p>
        </div>
      );
    } catch (error) {
      if (error.message.includes("exceeded the limit")) {
        setOutput(
          <div style={outputCardStyle}>
            <p style={{ color: "red" }}>Failed to add book: Maximum limit of 5 books reached.</p>
          </div>
        );
      } else {
        console.error("Error adding book:", error);
        setOutput(
          <div style={outputCardStyle}>
            <p style={{ color: "red" }}>Failed to add book. Check the inputs.</p>
          </div>
        );
      }
    }
  };
  

  const borrowBook = async () => {
    try {
      const success = await libraryManagementBackend.borrowBook(parseInt(borrowUserId), parseInt(borrowBookId));
      if (success) {
        setOutput("Book borrowed successfully!");
      } else {
        setOutput("Failed to borrow the book: User may already have 5 borrowed books or the book is unavailable.");
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      setOutput("An error occurred while borrowing the book.");
    }
  };

  const returnBook = async () => {
    try {
      const success = await libraryManagementBackend.returnBook(parseInt(returnUserId), parseInt(returnBookId));
      if (success) {
        setOutput("Book returned successfully!");
      } else {
        setOutput("Failed to return the book: Book is not borrowed by the user.");
      }
    } catch (error) {
      console.error("Error returning book:", error);
      setOutput("An error occurred while returning the book.");
    }
  };
  const getUser = async () => {
    try {
      const users = await libraryManagementBackend.getUser(parseInt(getUserId, 10)); // Fetch data
      console.log("Fetched user data:", users); // Log response
  
      if (Array.isArray(users) && users.length > 0) {
        const user = users[0]; // Extract the first user object
        setOutput(
          <div style={outputCardStyle}>
            <h3>
              <FaUserPlus style={iconStyle} /> User Details
            </h3>
            <p><strong>Name:</strong> {user.name || "N/A"}</p>
            <p><strong>Number of Books Borrowed:</strong> {user.num_of_boooks_borrowed || 0}</p>
            <p>
              <strong>Borrowed Books IDs:</strong>{" "}
              {user.borrowed_books_ids && user.borrowed_books_ids.length > 0
                ? user.borrowed_books_ids.map((id) => id.toString()).join(", ")
                : "None"}
            </p>
          </div>
        );
      } else {
        setOutput(
          <div style={outputCardStyle}>
            <p style={{ color: "red" }}>User not found.</p>
          </div>
        );
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setOutput(
        <div style={outputCardStyle}>
          <p style={{ color: "red" }}>An error occurred while fetching user details.</p>
        </div>
      );
    }
  };
  
  const getBook = async () => {
    try {
      const books = await libraryManagementBackend.getBook(parseInt(getBookId, 10));
      console.log("Fetched book data:", books); // Log response
  
      if (Array.isArray(books) && books.length > 0) {
        const book = books[0]; // Extract the first book object
        setOutput(
          <div style={outputCardStyle}>
            <h3>
              <FaBook style={iconStyle} /> Book Details
            </h3>
            <p><strong>Title:</strong> {book.title || "N/A"}</p>
            <p><strong>Author:</strong> {book.author || "N/A"}</p>
            <p><strong>Publication Year:</strong> {book.publication_year || "N/A"}</p>
            <p><strong>Genre:</strong> {book.genre && book.genre.length > 0 ? book.genre.join(", ") : "None"}</p>
            <p><strong>Availability:</strong> {book.avibility ? "Available" : "Not Available"}</p>
            <p><strong>Tags:</strong> {book.book_tags && book.book_tags.length > 0 ? book.book_tags.join(", ") : "None"}</p>
          </div>
        );
      } else {
        setOutput(
          <div style={outputCardStyle}>
            <p style={{ color: "red" }}>Book not found.</p>
          </div>
        );
      }
    } catch (error) {
      console.error("Error fetching book:", error);
      setOutput(
        <div style={outputCardStyle}>
          <p style={{ color: "red" }}>An error occurred while fetching book details.</p>
        </div>
      );
    }
  };
  
  
  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>
          <FaBook style={{ marginRight: "10px" }} />
          Library Management System
        </h1>
      </header>
      <main style={mainStyle}>
        <section style={sectionStyle}>
          <h2>
            <FaUserPlus style={iconStyle} />
            Create User
          </h2>
          <input
            type="text"
            placeholder="Enter user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={createUser}>
            Create User
          </button>
        </section>
        <section style={sectionStyle}>
          <h2>
            <FaBook style={iconStyle} />
            Add Book
          </h2>
          <input
            type="text"
            placeholder="Book Title"
            value={bookDetails.title}
            onChange={(e) => setBookDetails({ ...bookDetails, title: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Book Author"
            value={bookDetails.author}
            onChange={(e) => setBookDetails({ ...bookDetails, author: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Publication Year"
            value={bookDetails.publication_year}
            onChange={(e) => setBookDetails({ ...bookDetails, publication_year: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Genres (comma-separated)"
            value={bookDetails.genre}
            onChange={(e) => setBookDetails({ ...bookDetails, genre: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={bookDetails.book_tags}
            onChange={(e) => setBookDetails({ ...bookDetails, book_tags: e.target.value })}
            style={inputStyle}
          />
          <label style={labelStyle}>
            Available:
            <input
              type="checkbox"
              checked={bookDetails.avibility}
              onChange={(e) => setBookDetails({ ...bookDetails, avibility: e.target.checked })}
              style={{ marginLeft: "10px" }}
            />
          </label>
          <button style={buttonStyle} onClick={addBook}>
            Add Book
          </button>
        </section>
        <section style={sectionStyle}>
          <h2>
            <FaArrowRight style={iconStyle} />
            Borrow Book
          </h2>
          <input
            type="number"
            placeholder="User ID"
            value={borrowUserId}
            onChange={(e) => setBorrowUserId(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Book ID"
            value={borrowBookId}
            onChange={(e) => setBorrowBookId(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={borrowBook}>
            Borrow Book
          </button>
        </section>
        <section style={sectionStyle}>
          <h2>
            <FaUndo style={iconStyle} />
            Return Book
          </h2>
          <input
            type="number"
            placeholder="User ID"
            value={returnUserId}
            onChange={(e) => setReturnUserId(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Book ID"
            value={returnBookId}
            onChange={(e) => setReturnBookId(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={returnBook}>
            Return Book
          </button>
        </section>
        <section style={sectionStyle}>
          <h2>
            <FaSearch style={iconStyle} />
            Get User Details
          </h2>
          <input
            type="number"
            placeholder="User ID"
            value={getUserId}
            onChange={(e) => setGetUserId(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={getUser}>
            Get User
          </button>
        </section>
        <section style={sectionStyle}>
          <h2>
            <FaInfoCircle style={iconStyle} />
            Get Book Details
          </h2>
          <input
            type="number"
            placeholder="Book ID"
            value={getBookId}
            onChange={(e) => setGetBookId(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={getBook}>
            Get Book
          </button>
        </section>
        <section style={outputStyle}>
          <h3>Output</h3>
          {typeof output === "string" ? (
            <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", color: "red" }}>{output}</p>
          ) : (
            output
          )}
        </section>
      </main>
    </div>
  );
}

const containerStyle = {
  fontFamily: "'Roboto', sans-serif",
  backgroundColor: "#f8f5f1",
  minHeight: "100vh",
  padding: "30px",
  color: "#333",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "30px",
};

const mainStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  background: "#ffffff",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
};

const sectionStyle = {
  marginBottom: "20px",
};

const inputStyle = {
  padding: "10px",
  margin: "10px 0",
  width: "100%",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#1e88e5",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  width: "100%",
};

const labelStyle = {
  margin: "10px 0",
  display: "block",
  fontSize: "1em",
};

const iconStyle = {
  marginRight: "10px",
  color: "#1e88e5",
};

const outputStyle = {
  marginTop: "20px",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  backgroundColor: "#f9f9f9",
};
const outputCardStyle = {
  margin: "20px 0",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  lineHeight: "1.6",
};
export default App;
