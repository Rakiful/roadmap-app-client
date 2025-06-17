import React, { useContext, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
dayjs.extend(relativeTime);
import { FaReply, FaEdit, FaTrashAlt, FaPaperPlane } from "react-icons/fa";
import { SingleReply2 } from "./SingleReply2";
import { AuthContext } from "../../Contexts/AuthContext";
import { Link } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

export const SingleReply = ({
  roadmapId,
  commentId,
  reply,
  handleEditReply,
  handleDeleteReply,
}) => {
  const { user } = useContext(AuthContext);
  const [Replys, setReplys] = useState([]);
  const [totalReplys, setTotalReplys] = useState(0);
  const [showEditReplyFeild, setShowEditReplyFeild] = useState(true);
  const [showReplyFeild, setShowReplyFeild] = useState(false);
  const createdAt = dayjs(reply.createdAt);
  const now = dayjs();
  const createdTime = createdAt.from(now);

  useEffect(() => {
    setReplys(reply.replys);
    setTotalReplys(reply.replys.length);
  }, []);

  const handleEdit = (e, replyId) => {
    handleEditReply(e, replyId);
    setShowEditReplyFeild(true);
  };

  const handleSendReply = (e) => {
    e.preventDefault();

    const id = `${reply.id}${Date.now()}`;
    const userImage = user?.photoURL || "";
    const userName = user?.displayName;
    const userEmail = user?.email;
    const createdAt = new Date();
    const messege = e.target.messege.value;

    const newReply = {
      id,
      userImage,
      userName,
      userEmail,
      createdAt,
      comment: messege,
    };

    axios
      .put(`http://localhost:3000/roadmap/reply2/${roadmapId}`, {
        commentId,
        replyId: reply.id,
        newReply,
      })
      .then((result) => {
        if (result.data.modifiedCount) {
          setReplys([...Replys, newReply]);
          setTotalReplys(totalReplys + 1);
          e.target.reset();
          console.log(newReply);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditReply2 = (e, replyId2) => {
    e.preventDefault();

    const replyId = reply.id;
    const messege = e.target.messege.value;

    axios
      .put(`http://localhost:3000/roadmap/edit-reply2/${roadmapId}`, {
        replyId,
        replyId2,
        commentId,
        comment: messege,
      })
      .then((result) => {
        if (result.data.modifiedCount) {
          const updatedReplys = Replys.map((r) =>
            r.id === replyId2 ? { ...r, comment: messege } : r
          );
          setReplys(updatedReplys);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteReply2 = (replyId2) => {
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
          .put(`http://localhost:3000/roadmap/delete-reply2/${roadmapId}`, {
            commentId,
            replyId: reply.id,
            replyId2,
          })
          .then((result) => {
            if (result.data.modifiedCount) {
              const updatedReplys = Replys.filter((r) => r.id !== replyId2);
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
    <div className="bg-white p-3 ms-5 md:ms-20 border-s-2 ">
      <div className="flex gap-3 w-full">
        <div className="relative">
          <img
            className="w-10 h-10 rounded-full"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt=""
          />
          <img
            className="w-10 h-10 rounded-full absolute top-0"
            src={reply.userImage}
            alt=""
          />
        </div>
        <div className="w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{reply.userName}</h1>
            <p className="text-sm ">{createdTime}</p>
          </div>

          {showEditReplyFeild ? (
            <p className="text-sm mt-2 font-semibold">{reply.comment}</p>
          ) : (
            <form
              onSubmit={(e) => handleEdit(e, reply.id)}
              className="relative"
            >
              <textarea
                placeholder="Write your comment here"
                name="messege"
                type="text"
                defaultValue={reply.comment}
                className="input h-20 p-3 w-[93%] mr-2"
              />{" "}
              <button className="btn bg-blue-500 text-white absolute">
                <FaPaperPlane />
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div>
          {reply.userEmail === user?.email && (
            <>
              <button
                onClick={() => setShowEditReplyFeild(!showEditReplyFeild)}
                className="btn bg-transparent border-0"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDeleteReply(reply.id)}
                className="btn bg-transparent border-0"
              >
                <FaTrashAlt /> Delete
              </button>
            </>
          )}
        </div>
        <div className="hidden md:inline">
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
          {Replys.map((reply2, i) => {
            return (
              <SingleReply2
                key={i}
                reply={reply2}
                handleEditReply2={handleEditReply2}
                handleDeleteReply2={handleDeleteReply2}
              />
            );
          })}
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
                className="input h-20 p-3 w-[93%] mr-2"
              />{" "}
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
