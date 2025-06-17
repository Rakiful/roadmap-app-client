import React, { useContext, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaThumbsUp, FaComment, FaPaperPlane } from "react-icons/fa";
import { useState } from "react";
import { SingleComment } from "../SingleComment/SingleComment";
import { AuthContext } from "../../Contexts/AuthContext";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";

dayjs.extend(relativeTime);

export const SingleRoadmap = ({ roadmap }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [showCommentFeild, setShowCommentFeild] = useState(false);
  const [liked, setLiked] = useState(false);
  const [totalLike, setTotalLike] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const createdAt = dayjs(roadmap.createdAt);
  const now = dayjs();
  const createdTime = createdAt.from(now);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTotalLike(roadmap.upvotes);
    setComments(roadmap.comments);
    setTotalComments(roadmap.comments.length);
    if (roadmap?.upvotesBy.includes(user?.email)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [roadmap,user]);

  const handleLike = () => {
    if (!user) {
      navigate("/sign-in");
      Swal.fire({
        icon: "warning",
        title: "Please login first",
        showConfirmButton: true,
      });
      return;
    }
    axios
      .put(`http://localhost:3000/roadmap/like/${roadmap._id}`, {
        userEmail: user.email,
      })
      .then((result) => {
        if (result.data.modifiedCount) {
          setLiked(true);
          setTotalLike(totalLike + 1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDislike = () => {
    axios
      .put(`http://localhost:3000/roadmap/disLike/${roadmap._id}`, {
        userEmail: user.email,
      })
      .then((result) => {
        if (result.data.modifiedCount) {
          setLiked(false);
          setTotalLike(totalLike - 1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSendComment = (e) => {
    e.preventDefault();

    const id = `${roadmap._id}${Date.now()}`;
    const userImage = user.photoURL || "";
    const userName = user.displayName;
    const userEmail = user.email;
    const createdAt = new Date();
    const comment = e.target.comment.value;
    const replys = [];

    const newComment = {
      id,
      userImage,
      userName,
      userEmail,
      createdAt,
      comment,
      replys,
    };

    axios
      .put(`http://localhost:3000/roadmap/comment/${roadmap._id}`, newComment)
      .then((result) => {
        if (result.data.modifiedCount) {
          setComments([...comments, newComment]);
          setTotalComments(totalComments + 1);
          e.target.reset();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditComment = (e, commentId) => {
    e.preventDefault();

    const id = commentId;
    const comment = e.target.comment.value;

    axios
      .put(`http://localhost:3000/roadmap/edit-comment/${roadmap._id}`, {
        id,
        comment,
      })
      .then((result) => {
        if (result.data.modifiedCount) {
          const updatedComments = comments.map((c) =>
            c.id === commentId ? { ...c, comment } : c
          );
          setComments(updatedComments);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to delete this comment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:3000/roadmap/delete-comment/${roadmap._id}`, {
            id: commentId,
          })
          .then((result) => {
            if (result.data.modifiedCount) {
              const updatedComments = comments.filter(
                (c) => c.id !== commentId
              );
              setComments(updatedComments);
              setTotalComments(updatedComments.length);
              Swal.fire({
                title: "Deleted!",
                text: "Your Comment has been deleted.",
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <div className="card bg-red-50 lg:w-2/3 mx-0 md:mx-auto my-5 shadow-sm">
      <figure className="mx-5 my-5">
        <img src={roadmap.image} alt="images" />
      </figure>
      <div className="card-body">
        <div className="md:flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold">{roadmap.title}</h2>
          <h2 className="md:card-title">{createdTime}</h2>
        </div>
        <div>
          <p className="badge bg-blue-300 mr-2">{roadmap.category}</p>
          <p className="badge bg-green-300">{roadmap.status}</p>
        </div>
        <p className="md:text-xl text-gray-900 mb-5">{roadmap.description}</p>
        <div className="md:flex gap-5 items-center justify-between">
          <div className="inline-block w-1/2 md:w-2/6">
            {liked ? (
              <p className="flex items-center gap-2">
                <FaThumbsUp />
                You and {totalLike} People's Liked
              </p>
            ) : (
              <p className="flex items-center gap-2">
                <FaThumbsUp />
                {totalLike} People's Liked
              </p>
            )}
          </div>
          <div className="inline-block ml-5 md:ml-0">
            <p className="flex items-center gap-2">
              <FaComment /> {totalComments} Comments
            </p>
          </div>
          <div className="flex justify-between gap-5">
            {liked ? (
              <button
                onClick={handleDislike}
                className="btn bg-transparent hover:bg-red-100 border-0 text-xl flex items-center gap-2"
              >
                <FaThumbsUp className="text-red-500" /> Liked
              </button>
            ) : (
              <button
                onClick={handleLike}
                className="btn bg-transparent hover:bg-red-100 border-0 text-xl flex items-center gap-2"
              >
                <FaThumbsUp /> Like
              </button>
            )}

            <button
              onClick={() => setShowCommentFeild(!showCommentFeild)}
              className="btn bg-transparent hover:bg-red-100 border-0 text-xl flex items-center gap-2"
            >
              <FaComment /> Comment
            </button>
          </div>
        </div>

        {showCommentFeild && (
          <div className="">
            {comments.map((comment, i) => (
              <SingleComment
                key={i}
                comment={comment}
                roadmapId={roadmap._id}
                handleDeleteComment={handleDeleteComment}
                handleEditComment={handleEditComment}
              />
            ))}
          </div>
        )}

        {showCommentFeild && (
          <>
            {!user ? (
              <p className="text-center text-xl">
                Signed In user only comment!{" "}
                <Link className="link font-bold text-blue-600" to={"/sign-in"}>
                  Sign In
                </Link>{" "}
              </p>
            ) : (
              <form onSubmit={handleSendComment} className="relative">
                <textarea
                  required
                  name="comment"
                  placeholder="Write your comment here"
                  type="text"
                  className="input h-20 p-3 w-[80%] md:w-[93%] mr-2"
                />{" "}
                <button className="btn bg-blue-500 text-white absolute">
                  <FaPaperPlane />
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
