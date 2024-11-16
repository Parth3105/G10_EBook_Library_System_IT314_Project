import React, { useState } from "react";
import "./AuthorBookUpload.css";

const AuthorBookUpload = () => {
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
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleCoAuthorChange = (index, field, value) => {
    const updatedCoAuthors = [...formData.coAuthors];
    updatedCoAuthors[index][field] = value;
    setFormData({ ...formData, coAuthors: updatedCoAuthors });
  };

  const addCoAuthor = () => {
    setFormData({
      ...formData,
      coAuthors: [...formData.coAuthors, { name: "", email: "" }],
    });
  };

  const removeCoAuthor = (index) => {
    const updatedCoAuthors = formData.coAuthors.filter((_, i) => i !== index);
    setFormData({ ...formData, coAuthors: updatedCoAuthors });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="upload-page">
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
