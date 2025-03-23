import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const categories = [
  { value: "social-media", label: "Social Media Marketing" },
  { value: "seo-analytics", label: "SEO & Analytics" },
  { value: "content", label: "Content Marketing" },
  { value: "email", label: "Email Marketing" },
  { value: "ppc", label: "PPC & Paid Advertising" },
  { value: "influencer", label: "Influencer Marketing" },
  { value: "strategy", label: "Marketing Strategy" },
  { value: "branding", label: "Brand Marketing" }
];

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const clearCoverImage = () => {
    setSingleFile(undefined);
    // Reset the file input
    const coverInput = document.querySelector('input[type="file"]:not([multiple])');
    if (coverInput) coverInput.value = '';
  };

  const clearGalleryImages = () => {
    setFiles([]);
    // Reset the file input
    const galleryInput = document.querySelector('input[type="file"][multiple]');
    if (galleryInput) galleryInput.value = '';
  };

  const handleUpload = async (type) => {
    setUploading(true);
    try {
      if (type === 'cover' && singleFile) {
        const cover = await upload(singleFile);
        dispatch({ type: "ADD_IMAGES", payload: { cover, images: state.images } });
        clearCoverImage();
      } else if (type === 'gallery' && files.length > 0) {
        const images = await Promise.all(
          [...files].map(async (file) => {
            const url = await upload(file);
            return url;
          })
        );
        dispatch({ type: "ADD_IMAGES", payload: { cover: state.cover, images } });
        clearGalleryImages();
      }
    } catch (err) {
      console.log(err);
    }
    setUploading(false);
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" onChange={handleChange}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <label htmlFor="">Cover Image</label>
            <div className="imageInput">
              <input
                type="file"
                onChange={(e) => setSingleFile(e.target.files[0])}
              />
              <button onClick={() => handleUpload('cover')} disabled={!singleFile || uploading}>
                {uploading ? "uploading" : "Upload"}
              </button>
              <button 
                onClick={clearCoverImage} 
                disabled={!singleFile || uploading}
                className="clearBtn"
              >
                Clear
              </button>
            </div>
            <label htmlFor="">Upload Images</label>
            <div className="imageInput">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
              <button onClick={() => handleUpload('gallery')} disabled={!files.length || uploading}>
                {uploading ? "uploading" : "Upload"}
              </button>
              <button 
                onClick={clearGalleryImages} 
                disabled={!files.length || uploading}
                className="clearBtn"
              >
                Clear
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief description of your service"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
