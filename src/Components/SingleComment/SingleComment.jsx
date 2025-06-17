import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaReply, FaEdit, FaTrashAlt, FaPaperPlane } from "react-icons/fa";
import { SingleReply } from "../SingleReply/SingleReply";
import { AuthContext } from "../../Contexts/AuthContext";
import { Link } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

dayjs.extend(relativeTime);

export const SingleComment = ({
  roadmapId,
  comment,
  handleDeleteComment,
  handleEditComment,
}) => {
  const { user } = useContext(AuthContext);
  const [Replys, setReplys] = useState([]);
  const [totalReplys, setTotalReplys] = useState(0);
  const [showEditCommentFeild, setShowEditCommentFeild] = useState(false);
  const [showReplyFeild, setShowReplyFeild] = useState(false);
  const createdAt = dayjs(comment.createdAt);
  const now = dayjs();
  const createdTime = createdAt.from(now);

  useEffect(() => {
    setReplys(comment.replys);
    setTotalReplys(comment.replys.length);
  }, []);

  const handleEdit = (e, commentId) => {
    handleEditComment(e, commentId);
    setShowEditCommentFeild(false);
  };

  const handleSendReply = (e) => {
    e.preventDefault();

    const id = `${comment.id}${Date.now()}`;
    const userImage = user?.photoURL || "";
    const userName = user?.displayName;
    const userEmail = user?.email;
    const createdAt = new Date();
    const messege = e.target.messege.value;
    const replys = [];

    const newReply = {
      id,
      userImage,
      userName,
      userEmail,
      createdAt,
      comment: messege,
      replys,
    };

    axios
      .put(`http://localhost:3000/roadmap/reply/${roadmapId}`, {
        commentId: comment.id,
        newReply,
      })
      .then((result) => {
        if (result.data.modifiedCount) {
          setReplys([...Replys, newReply]);
          setTotalReplys(totalReplys + 1);
          e.target.reset();
        }
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(newReply);
  };

  const handleEditReply = (e, replyId) => {
    e.preventDefault();

    const commentId = comment.id;
    const messege = e.target.messege.value;

    axios
      .put(`http://localhost:3000/roadmap/edit-reply/${roadmapId}`, {
        replyId,
        commentId,
        comment: messege,
      })
      .then((result) => {
        if (result.data.modifiedCount) {
          const updatedReplys = Replys.map((r) =>
            r.id === replyId ? { ...r, comment: messege } : r
          );
          setReplys(updatedReplys);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteReply = (replyId) => {
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
        console.log(replyId);
        axios
          .put(`http://localhost:3000/roadmap/delete-reply/${roadmapId}`, {
            commentId: comment.id,
            replyId,
          })
          .then((result) => {
            if (result.data.modifiedCount) {
              const updatedReplys = Replys.filter((r) => r.id !== replyId);
              setReplys(updatedReplys);
              setTotalReplys(updatedReplys.length);
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
    <div className="bg-white p-3 my-3 rounded-xl w-full">
      <div className="flex gap-3 w-full">
        <div className="relative">
          <img
            className="w-10 h-10 rounded-full"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt=""
          />
          <img
            className="w-10 h-10 rounded-full absolute top-0"
            src={comment.userImage}
            alt=""
          />
        </div>
        <div className="w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{comment.userName}</h1>
            <p className="text-sm ">{createdTime}</p>
          </div>

          {showEditCommentFeild ? (
            <form
              onSubmit={(e) => handleEdit(e, comment.id)}
              className="relative"
            >
              <textarea
                required
                name="comment"
                defaultValue={comment.comment}
                className="input h-40 md:h-20 p-3 w-[77%] md:w-[93%] mr-2"
              />
              <button className="btn bg-blue-500 text-white absolute right-1 top-1">
                <FaPaperPlane />
              </button>
            </form>
          ) : (
            <p className="text-sm mt-2 font-semibold">{comment.comment}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div>
          {comment.userEmail === user?.email && (
            <>
              <button
                onClick={() => setShowEditCommentFeild(!showEditCommentFeild)}
                className="btn bg-transparent border-0"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="btn bg-transparent border-0"
              >
                <FaTrashAlt /> Delete
              </button>
            </>
          )}
        </div>
        <div className="hidden md:inline text-center">
          <p>{totalReplys} Replys</p>
        </div>
        <div>
          <div className=" md:hidden text-center">
            <p>{totalReplys} Replys</p>
          </div>
          <button
            onClick={() => setShowReplyFeild(!showReplyFeild)}
            className="btn bg-transparent border-0"
          >
            <FaReply /> Repley
          </button>
        </div>
      </div>

      {showReplyFeild && (
        <div>
          {Replys.map((reply, i) => (
            <SingleReply
              key={i}
              reply={reply}
              roadmapId={roadmapId}
              commentId={comment.id}
              handleEditReply={handleEditReply}
              handleDeleteReply={handleDeleteReply}
            />
          ))}
        </div>
      )}

      {showReplyFeild && (
        <>
          {!user ? (
            <p className="text-center text-sm">
              Signed In user only reply!{" "}
              <Link className="link font-bold text-blue-600" to={"/sign-in"}>
                Sign In
              </Link>{" "}
            </p>
          ) : (
            <form onSubmit={handleSendReply} className="relative">
              <textarea
                required
                name="messege"
                placeholder="Write your Reply here"
                type="text"
                className="input h-20 p-3 w-[80%] md:w-[93%] mr-2"
              />
              <button className="btn bg-blue-500 text-white absolute">
                <FaPaperPlane />
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};
