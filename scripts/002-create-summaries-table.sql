-- Script to create the video_summaries table
CREATE TABLE IF NOT EXISTS video_summaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  video_url VARCHAR(512) NOT NULL,
  video_title VARCHAR(512),
  thumbnail_url VARCHAR(512),
  key_points TEXT,
  summary TEXT,
  conclusions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
