import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import AudioPortal from './pages/audios/AudioPortal';
import AudioPlayer from './pages/audios/AudioPlayer';
import VPortal from './pages/videos/VPortal';
import VPlayer from './pages/videos/VPlayer';
import Blogs from './pages/blogs/Blogs';
import ReadBlog from './pages/blogs/ReadBlog';
import SubmitEntry from './pages/SubmitEntry';
import SignUp from './pages/signup/Signup';
import AudioSubmit from './pages/submit/AudioSubmit';
import VideoSubmit from './pages/submit/VideoSubmit';
import BlogSubmit from './pages/submit/BlogSubmit';
import MySubmissions from './pages/submissions/MySubmissions';
import ProfilePage from './pages/profile/Profile';
import Admin from './pages/Admin';
import Leaderboard from './pages/leaderboard/Leaderboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/videos" element={<VPortal />} />
        <Route path="/videos/:id" element={<VPlayer />} />
        <Route path="/audios" element={<AudioPortal />} />
        <Route path="/audios/:id" element={<AudioPlayer />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<ReadBlog />} />
        <Route path="/submit" element={<SubmitEntry />} />
        <Route path="/submit/video" element={<VideoSubmit />} />
        <Route path="/submit/audio" element={<AudioSubmit />} />
        <Route path="/submit/blog" element={<BlogSubmit />} />
        <Route path="/my-submissions" element={<MySubmissions />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
