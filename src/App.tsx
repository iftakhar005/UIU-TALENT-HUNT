import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import VideosPage from './pages/VideosPage';
import AudioPortal from './pages/audios/AudioPortal';
import AudioPlayer from './pages/audios/AudioPlayer';
import VPortal from './pages/videos/VPortal';
import Blogs from './pages/blogs/Blogs';
import ReadBlog from './pages/blogs/ReadBlog';
import SubmitEntry from './pages/SubmitEntry';
import SignUp from './pages/signup/Signup';
import AudioSubmit from './pages/submit/AudioSubmit';
import ProfilePage from './pages/profile/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/videos" element={<VPortal />} />
        <Route path="/videos/:id" element={<VideosPage />} />
        <Route path="/audios" element={<AudioPortal />} />
        <Route path="/audios/:id" element={<AudioPlayer />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<ReadBlog />} />
        <Route path="/submit" element={<SubmitEntry />} />
        <Route path="/submit/:type" element={<SubmitEntry />} />
        <Route path="/submit/audio" element={<AudioSubmit />} />
      </Routes>
    </Router>
  );
}

export default App;
