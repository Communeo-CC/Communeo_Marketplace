import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    userrole: "BusinessOwner",
    desc: "",
    channelId: "",
    isCreator: false,
    phone: "",
    isSeller: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleUserRoleChange = (e) => {
    const newRole = e.target.value;
    setUser((prev) => ({
      ...prev,
      userrole: newRole,
      isCreator: newRole === "Influencer",
      channelId: newRole === "Influencer" ? prev.channelId : ""
    }));
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");

      const userData = { ...user };
      
      if (file) {
        const url = await upload(file);
        userData.img = url;
      }

      await newRequest.post("/auth/register", userData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          {error && <div className="error-message">{error}</div>}
          
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input 
            id="password"
            name="password" 
            type="password"
            placeholder="password" 
            onChange={handleChange}
            required 
          />

          <label htmlFor="profile">Profile Picture</label>
          <input 
            id="profile"
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
          />

          <label htmlFor="userrole">User Role</label>
          <select
            id="userrole"
            name="userrole"
            onChange={handleUserRoleChange}
            value={user.userrole}
          >
            <option value="BusinessOwner">Business Owner</option>
            <option value="Influencer">Influencer</option>
            <option value="Freelancer">Freelancer</option>
          </select>
          
          {user.userrole === "Influencer" && (
            <div className="creator-section">
              <label htmlFor="channelId">YouTube Channel ID</label>
              <input
                id="channelId"
                name="channelId"
                type="text"
                placeholder="Enter your Channel ID (e.g., UC...)"
                onChange={handleChange}
                value={user.channelId}
                required
              />
              <p className="help-text">
                You can find your channel ID in your YouTube channel's URL after "/channel/" or in your channel's advanced settings.
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>

        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="seller">Activate the seller account</label>
            <label className="switch">
              <input 
                id="seller"
                type="checkbox" 
                onChange={handleSeller}
                checked={user.isSeller}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
            value={user.phone}
          />

          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            name="desc"
            placeholder="A short description of yourself"
            cols="30"
            rows="10"
            onChange={handleChange}
            value={user.desc}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;
