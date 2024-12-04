import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthorBookUpload.css";

const BACKEND_URL = "https://flipthepage.onrender.com";
// const BACKEND_URL = "http://localhost:5000";


const AuthorBookUpload = () => {
  const storedUsername = localStorage.getItem("USERNAME");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    coAuthors: [{ name: "", email: "" }],
    genre: "",
    description: "",
    language: "",
    pages: "",
    amount: "",
    coverImage: null,
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCoAuthorChange = (index, field, value) => {
    const updatedCoAuthors = [...formData.coAuthors];
    updatedCoAuthors[index] = {
      ...updatedCoAuthors[index],
      [field]: value
    };
    setFormData(prevState => ({
      ...prevState,
      coAuthors: updatedCoAuthors
    }));
  };

  const removeCoAuthor = (index) => {
    if (formData.coAuthors.length > 1) {
      const updatedCoAuthors = formData.coAuthors.filter((_, i) => i !== index);
      setFormData(prevState => ({
        ...prevState,
        coAuthors: updatedCoAuthors
      }));
    } else {
      toast.warning("At least one co-author field must remain");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.author || !formData.genre ||
      !formData.language || !formData.amount ||
      !formData.coverImage || !formData.file) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Uploading book...");

    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("genre", formData.genre);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("language", formData.language);
      formDataToSend.append("pages", formData.pages);
      formDataToSend.append("amount", formData.amount);

      // Add files
      formDataToSend.append("coverImage", formData.coverImage);
      formDataToSend.append("bookFile", formData.file);

      // Add co-authors as JSON string
      formDataToSend.append("coAuthors", JSON.stringify(formData.coAuthors));

      const response = await axios.post(
        `${BACKEND_URL}/upload`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.data.code === 401) {
        toast.success("Book uploaded successfully!");
        // Reset form
        setFormData({
          title: "",
          subtitle: "",
          author: "",
          coAuthors: [{ name: "", email: "" }],
          genre: "",
          description: "",
          language: "",
          pages: "",
          amount: "",
          coverImage: null,
          file: null,
        });
      } else {
        toast.error(response.data.msg);
      }

      axios.post(`${BACKEND_URL}/addAuthorUpload`, {
        username: storedUsername,
        bookId: response.data.book._id
      });

    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      console.error("Error uploading book:", error);
      toast.error(error.response?.data?.msg || "Error uploading book. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    // Validate cover image
    if (name === "coverImage") {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }
    }

    // Validate PDF file
    if (name === "file") {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        e.target.value = "";
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error("PDF size should be less than 50MB");
        e.target.value = "";
        return;
      }
    }

    setFormData({ ...formData, [name]: file });
  };

  const addCoAuthor = () => {
    if (formData.coAuthors.length >= 5) {
      toast.warning("Maximum 5 co-authors allowed");
      return;
    }
    setFormData({
      ...formData,
      coAuthors: [...formData.coAuthors, { name: "", email: "" }],
    });
  };

  return (
    <div className="upload-page">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <form className="upload-form" onSubmit={handleSubmit}>
        <h2>Upload Your Book</h2>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Subtitle:
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </label>
        <label>
          Author:
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </label>
        <label>Co-Authors:</label>
        {formData.coAuthors.map((coAuthor, index) => (
          <div key={index} className="co-author">
            <input
              type="text"
              placeholder="Name"
              value={coAuthor.name}
              onChange={(e) => handleCoAuthorChange(index, "name", e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={coAuthor.email}
              onChange={(e) =>
                handleCoAuthorChange(index, "email", e.target.value)
              }
            />
            {formData.coAuthors.length > 1 && (
              <button
                type="button"
                onClick={() => removeCoAuthor(index)}
                className="remove-button"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addCoAuthor} className="add-button">
          Add Co-Author
        </button>
        <label>
          Genre:
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Language:
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Pages:
          <input
            type="number"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
            min="1"
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
        <label>
          Cover Image:
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>
        <label>
          eBook File:
          <input
            type="file"
            name="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AuthorBookUpload;