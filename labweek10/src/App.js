import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
    agree: false,
  });

  const [submittedData, setSubmittedData] = useState(null);

  const provinces = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  return (
    <div className="form-container">
      <h1>Data Entry Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="field half">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="field half">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="1234 Main St"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="address2">Address 2</label>
          <input
            type="text"
            id="address2"
            name="address2"
            placeholder="Apartment, studio, or floor"
            value={formData.address2}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <div className="field third">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="field third">
            <label htmlFor="province">Province</label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
            >
              <option value="">Choose...</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="field third">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
          />
          <label htmlFor="agree">Agree Terms &amp; Condition?</label>
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      {submittedData && (
        <div className="output">
          <div className="output-row">
            <span className="output-label">Email:</span>
            <span>{submittedData.email}</span>
          </div>
          <div className="output-row">
            <span className="output-label">Full Name:</span>
            <span>{submittedData.name}</span>
          </div>
          <div className="output-row">
            <span className="output-label">Address:</span>
            <span>
              {submittedData.address} {submittedData.address2}
            </span>
          </div>
          <div className="output-row">
            <span className="output-label">City:</span>
            <span>{submittedData.city}</span>
          </div>
          <div className="output-row">
            <span className="output-label">Province:</span>
            <span>{submittedData.province}</span>
          </div>
          <div className="output-row">
            <span className="output-label">Postal Code:</span>
            <span>{submittedData.postalCode}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
