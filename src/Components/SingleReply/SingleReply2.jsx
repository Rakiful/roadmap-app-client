import React, { useContext } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
dayjs.extend(relativeTime);
import { FaEdit, FaTrashAlt, FaPaperPlane } from "react-icons/fa";
import { AuthContext } from "../../Contexts/AuthContext";

export const SingleReply2 = ({
  reply,
  handleEditReply2,
  handleDeleteReply2,
}) => {
  const { user } = useContext(AuthContext);
  const [showEditReplyFeild, setShowEditReplyFeild] = useState(true);
  const createdAt = dayjs(reply.createdAt);
  const now = dayjs();
  const createdTime = createdAt.from(now);

  const handleEdit = (e, replyId2) => {
    handleEditReply2(e, replyId2);
    setShowEditReplyFeild(true);
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
            <h1 className="text-xl font-bold">{reply?.userName}</h1>
            <p className="text-sm ">{createdTime}</p>
          </div>

          {showEditReplyFeild ? (
            <p className="text-sm mt-2 font-semibold">{reply?.comment}</p>
          ) : (
            <form
              onSubmit={(e) => handleEdit(e, reply.id)}
              className="relative"
            >
              <textarea
                placeholder="Write your comment here"
                type="text"
                name="messege"
                defaultValue={reply?.comment}
                className="input h-40 md:h-20 p-3 w-[80%] md:w-[93%] mr-2"
              />{" "}
              <button className="btn bg-blue-500 text-white absolute">
                <FaPaperPlane />
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-3">
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
                onClick={() => handleDeleteReply2(reply.id)}
                className="btn bg-transparent border-0"
              >
                <FaTrashAlt /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
