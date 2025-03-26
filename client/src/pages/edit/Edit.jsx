import React, { useReducer, useState, useEffect } from "react";
import "./Edit.scss";
import { gigReducer } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser";

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

const Edit = () => {
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const { data: gig, isLoading: isLoadingGig } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const [state, dispatch] = useReducer(gigReducer, gig || {});

  useEffect(() => {
    if (gig) {
      dispatch({ type: "SET_GIG", payload: gig });
    }
  }, [gig]);

  useEffect(() => {
    if (!currentUser?.isSeller) {
      navigate("/");
    }
  }, [currentUser]);

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
    const coverInput = document.querySelector('input[type="file"]:not([multiple])');
    if (coverInput) coverInput.value = '';
  };

  const clearGalleryImages = () => {
    setFiles([]);
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
      console.error("Upload error:", err);
      alert("Failed to upload images. Please try again.");
    }
    setUploading(false);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.put(`/gigs/${id}`, gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!state.title || !state.cat || !state.cover || !state.desc || !state.price) {
      alert("Please fill in all required fields");
      return;
    }

    mutation.mutate(state);
  };

  if (isLoadingGig) {
    return <div className="loading">Loading...</div>;
  }

  if (!gig) {
    return <div className="error">Gig not found</div>;
  }

  return (
    <div className="edit">
      <div className="container">
        <h1>Edit Gig</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
              value={state.title || ""}
            />
            <label htmlFor="">Category</label>
            <select name="cat" onChange={handleChange} value={state.cat || ""}>
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
              placeholder="Brief description of your service"
              cols="0"
              rows="16"
              onChange={handleChange}
              value={state.desc || ""}
            ></textarea>
            <button onClick={handleSubmit}>Update Gig</button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
              value={state.shortTitle || ""}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              value={state.shortDesc || ""}
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input 
              type="number" 
              name="deliveryTime" 
              onChange={handleChange}
              value={state.deliveryTime || ""}
            />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
              value={state.revisionNumber || ""}
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
            <input 
              type="number" 
              onChange={handleChange} 
              name="price"
              value={state.price || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit; 