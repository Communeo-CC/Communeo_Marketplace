import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [gigToDelete, setGigToDelete] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs", currentUser?._id],
    queryFn: async () => {
      try {
        if (!currentUser?._id) {
          throw new Error("User not authenticated");
        }
        const response = await newRequest.get(`/gigs?userId=${currentUser._id}`);
        return response.data;
      } catch (err) {
        console.error("Error fetching gigs:", err);
        throw err;
      }
    },
    enabled: !!currentUser?._id,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await newRequest.delete(`/gigs/${id}`);
        return response.data;
      } catch (err) {
        console.error("Error deleting gig:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      setShowDeleteConfirm(false);
      setGigToDelete(null);
    },
  });

  const handleDelete = (gig) => {
    setGigToDelete(gig);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(gigToDelete._id);
    } catch (err) {
      alert("Failed to delete gig. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setGigToDelete(null);
  };

  const handleEdit = (gigId) => {
    navigate(`/edit/${gigId}`);
  };

  if (!currentUser) {
    return (
      <div className="myGigs">
        <div className="container">
          <div className="error">
            Please log in to view your gigs.
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser.isSeller) {
    return (
      <div className="myGigs">
        <div className="container">
          <div className="error">
            You need to be a seller to view and manage gigs.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="myGigs">
      {isLoading ? (
        <div className="loading">Loading your gigs...</div>
      ) : error ? (
        <div className="error">
          Something went wrong! Error: {error.message}
        </div>
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Gigs</h1>
            <Link to="/add">
              <button className="add-button">Add New Gig</button>
            </Link>
          </div>
          
          {!data || data.length === 0 ? (
            <div className="no-gigs">
              <p>You haven't created any gigs yet.</p>
              <Link to="/add">
                <button className="add-button">Create Your First Gig</button>
              </Link>
            </div>
          ) : (
            <div className="gigs-grid">
              {data.map((gig) => (
                <div key={gig._id} className="gig-card">
                  <div className="gig-image">
                    <img src={gig.cover} alt={gig.title} />
                  </div>
                  <div className="gig-info">
                    <h3>{gig.title}</h3>
                    <p className="gig-category">{gig.cat}</p>
                    <div className="gig-stats">
                      <span className="price">${gig.price}</span>
                      <span className="sales">{gig.sales || 0} sales</span>
                    </div>
                    <div className="gig-status">
                      <span className={`status ${gig.status || 'active'}`}>
                        {gig.status || 'Active'}
                      </span>
                    </div>
                    <div className="gig-actions">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(gig._id)}
                      >
                        Edit Gig
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(gig)}
                      >
                        Delete Gig
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-dialog">
            <h2>Delete Gig</h2>
            <p>Are you sure you want to delete "{gigToDelete?.title}"?</p>
            <p className="warning">This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="cancel-button" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-delete-button" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGigs;
