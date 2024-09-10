import React, { useEffect, useState, useCallback } from 'react';
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { Image, Row, Button } from 'react-bootstrap';
import Comments from '../components/Comments';
import AmenitiesKey from '../components/AmenitiesKey';
import { useCurrentUser } from '../components/CurrentUserContext';
import CreateComment from '../components/CreateComment';
import { useParams, useNavigate } from 'react-router-dom';
import showAlert from '../components/Sweetalert';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const WifiLocationsPage = () => {
  const { id } = useParams();
  const [wifiLocation, setWifiLocation] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('access_token');

  // Check if the current user is the creator of the wifi location or is an admin
  const canEditOrDelete = currentUser && (currentUser.username === wifiLocation?.added_by || currentUser.is_admin);

  // Function to fetch comments for the WiFi location
  const fetchComments = useCallback(async () => {
    try {
      const response = await axiosReq.get(`/comments/?wifi_location=${id}`);
      setComments(response.data);
    } catch (err) {
      showAlert('error', 'Failed to fetch comments', 'error');
      setComments([]);
      setError(err);
    }
  }, [id]);

  useEffect(() => {
    // Function to fetch WiFi location data
    const fetchWifiLocation = async () => {
      try {
        const response = await axiosReq.get(`/wifi_locations/${id}/`);
        setWifiLocation(response.data);
      } catch (err) {
        showAlert('error', 'Failed to fetch WiFi location data', 'error');
        setError(err);
      }
    };

    if (id) {
      fetchWifiLocation();
      fetchComments();
    }
  }, [id, fetchComments]);

  // Function to handle adding a new comment
  const handleCommentAdded = () => {
    fetchComments();
    setCommentToEdit(null);
  };

  // Function to handle adding WiFi location to favorites
  const handleAddToFavorites = async () => {
    if (!currentUser) {
      showAlert('error', 'You must be logged in to add to favorites', 'error');
      return;
    }

    try {
      const response = await axiosRes.post(`/favourites/`, {
        wifi_location_id: id,
        notes: '',
        folder_name: '',
        visit_status: 'Planned'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.status === 201) {
        showAlert('success', 'Location added to favorites successfully!', 'success');
      }
    } catch (err) {
      showAlert('error', 'Failed to add location to favorites', 'error');
      setError(err);
    }
  };

  // Function to handle comment deletion
  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
      showAlert('error', 'You must be logged in to delete a comment', 'error');
      return;
    }

    try {
      const response = await axiosRes.delete(`/comments/${commentId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.status === 204) {
        showAlert('success', 'Successfully deleted', 'success');
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (err) {
      showAlert('error', 'There was an error deleting the comment, please try again', 'error');
      setError(err);
    }
  };

  // Function to confirm and delete comment
  const deleteComment = (commentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this comment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteComment(commentId);
      }
    });
  };

  // Function to handle updating a comment
  const handleUpdateComment = (comment) => {
    if (currentUser?.username === comment.user) {
      setCommentToEdit(comment);
    } else {
      showAlert('error', "You don't have permission to edit this comment", 'error');
    }
  };

  // Function to handle updating the WiFi location
  const handleUpdateLocation = () => {
    navigate(`/wifi_locations/edit/${id}`);
  };

  // Function to handle deleting the WiFi location
  const handleDeleteLocation = async () => {
    if (!isAuthenticated) {
      showAlert('error', 'You must be logged in to delete a location', 'error');
      return;
    }

    try {
      const response = await axiosRes.delete(`/wifi_locations/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.status === 204) {
        showAlert('success', 'Successfully deleted WiFi location', 'success');
        navigate("/");
      }
    } catch (err) {
      showAlert('error', 'There was an error deleting the WiFi location, please try again', 'error');
      setError(err);
    }
  };

  // Function to handle canceling the comment edit
  const handleCancelEdit = () => {
    setCommentToEdit(null);
  };

  // Render loading state or error state if necessary
  if (error && !wifiLocation) {
    showAlert('error', error, 'error');
    return null;
  }

  if (!wifiLocation) {
    return <Loader />;
  }

  return (
    <>
      <Row>
        <h1 className='pageTitle mt-4'>{wifiLocation.name}</h1>
        <div className='wifipage-links'>
          <p>{wifiLocation.star_rating || 'No rating available'}</p>
          <div className='wifi-links'>
            {currentUser && (
              <>
                <div className="btn-back m-top-1">
                  <Button onClick={handleAddToFavorites} className="btn" variant="">
                    Add to Favorites
                  </Button>
                </div>

                {canEditOrDelete && (
                  <>
                    <div className="btn-back m-top-1 ms-2">
                      <Button onClick={handleUpdateLocation} className="btn" variant="">
                        Edit Location
                      </Button>
                    </div>

                    <div className="btn-back m-top-1 ms-2">
                      <Button onClick={handleDeleteLocation} className="btn" variant="">
                        Delete Location
                      </Button>
                    </div>
                  </>
                )}

              </>
            )}
          </div>
        </div>
        <div className='wifi-mobile'>
          <div className='wifipage-img'>
            {wifiLocation.image && (
              <Image
                src={wifiLocation.image}
                alt={`Image of ${wifiLocation.name}`}
                fluid
              />
            )}
            <p className='amenities'>{wifiLocation.amenities}</p>
          </div>
          <div className='wifipage-text'>
            <p className='pb-5'>{wifiLocation.description}</p>
            <div className='wifi-comments'>
              {comments.length > 0 ? (
                <Comments
                  comments={comments}
                  onDelete={deleteComment}
                  onUpdate={handleUpdateComment}
                  currentUser={currentUser}
                />
              ) : (
                <p>No comments available.</p>
              )}
            </div>
          </div>
        </div>
      </Row>
      <Row className='justify-content-end'>
        <div className='comments-position'>
          {currentUser && (
            <CreateComment
              username={currentUser}
              onCommentAdded={handleCommentAdded}
              commentToEdit={commentToEdit}
              onCancelEdit={handleCancelEdit}
            />
          )}
        </div>
        <AmenitiesKey />
      </Row>

    </>
  );
};

export default WifiLocationsPage;
