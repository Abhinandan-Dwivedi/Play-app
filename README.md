# PLAY | Next-Gen Video Streaming Platform 

**PLAY** is a high-performance, full-stack video hosting application built with the **MERN stack**. It combines a bold **Neobrutalist UI** with advanced features like AI-driven summaries and a rich subscription ecosystem.

---

## Key Features

### Neobrutalist Design System
* **High Contrast UI**: Uses a signature "Neobrutalist" aesthetic with thick black borders and hard-edged shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).
* **Dynamic Theme Engine**: A custom-built dark/light mode toggle that persists across sessions using `localStorage` and Tailwind CSS class strategies.
* **Responsive Layout**: Optimized for all screen sizes with a fluid sidebar and grid-based video discovery.

### Core Video Functionality
* **Secure Uploads**: Integrated with **Cloudinary** for high-speed media hosting and automated thumbnail generation.
* **Advanced Playback**: Custom video player with view-count logic and integrated watch history tracking.
* **Interactions**: Real-time Likes and Comments (built with MongoDB aggregations for performance).

### Smart Features & Community
* **AI Summarization**: Architecture designed to generate concise summaries for videos (inspired by Hybrid CNN-Transformer research).
* **Creator Tweets**: A dedicated "Community" tab for creators to post text updates and engage with subscribers.
* **Channel Management**: Comprehensive "My Channel" dashboard for video analytics and profile customization.

---

##  Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Lucide Icons, Axios, React Router v6 |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Media Storage** | Cloudinary API |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js, Cookie-parser |

---

### Clone & Install
```bash
git clone https://github.com/Abhinandan-Dwivedi/Play-app.git
cd Play-app
```
[Link Text](https://play-app-frontend-seven.vercel.app/)
