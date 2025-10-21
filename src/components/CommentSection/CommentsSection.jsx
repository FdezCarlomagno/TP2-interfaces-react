"use client"

import { useState } from "react"
import commentsData from "./comments-data.json"
import "./CommentSection.css"

export default function CommentsSection() {
  const [likedComments, setLikedComments] = useState({})
  const [dislikedComments, setDislikedComments] = useState({})

  const handleLike = (id) => {
    setLikedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
    if (dislikedComments[id]) {
      setDislikedComments((prev) => ({
        ...prev,
        [id]: false,
      }))
    }
  }

  const handleDislike = (id) => {
    setDislikedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
    if (likedComments[id]) {
      setLikedComments((prev) => ({
        ...prev,
        [id]: false,
      }))
    }
  }

  const getLikeCount = (originalLikes, id) => {
    let count = originalLikes
    if (likedComments[id]) count += 1
    if (dislikedComments[id]) count -= 1
    return count
  }

  return (
    <div className="comments-container">
      <div className="comment-input-wrapper">
        <div
          className="avatar"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        ></div>
        <input type="text" placeholder="Añade un comentario..." className="comment-input" />
      </div>

      <div className="comments-scrollable">
        {commentsData.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="avatar" style={{ background: comment.avatar }}></div>
            <div className="comment-content">
              <div className="comment-header">
                <span className="username">@{comment.username}</span>
                <span className="time-ago">· {comment.timeAgo}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
              <div className="comment-actions">
                <button
                  className={`action-btn ${likedComments[comment.id] ? "active" : ""}`}
                  onClick={() => handleLike(comment.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H16.4262C17.907 22 19.1662 20.9197 19.3914 19.4562L20.4683 12.4562C20.7479 10.6389 19.3418 9 17.5032 9H14C13.4477 9 13 8.55228 13 8V4.46584C13 3.10399 11.896 2 10.5342 2C10.2093 2 9.91498 2.1913 9.78306 2.48812L7 9H4C2.89543 9 2 9.89543 2 11V13Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill={likedComments[comment.id] ? "currentColor" : "none"}
                    />
                  </svg>
                  <span>{getLikeCount(comment.likes, comment.id)}</span>
                </button>
                <button
                  className={`action-btn ${dislikedComments[comment.id] ? "active" : ""}`}
                  onClick={() => handleDislike(comment.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H7.57377C6.09297 2 4.83379 3.08027 4.60862 4.54377L3.53172 11.5438C3.25207 13.3611 4.65823 15 6.49685 15H10C10.5523 15 11 15.4477 11 16V19.5342C11 20.896 12.104 22 13.4658 22C13.7907 22 14.085 21.8087 14.2169 21.5119L17 15H20C21.1046 15 22 14.1046 22 13V11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill={dislikedComments[comment.id] ? "currentColor" : "none"}
                    />
                  </svg>
                </button>
                <button className="reply-btn">Responder</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
