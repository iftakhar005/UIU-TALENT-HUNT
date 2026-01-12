import { useState, useEffect } from 'react';
import useNavbar from '../hooks/useNavbar';
import useFooter from '../hooks/useFooter';
import useTabNavigation from '../hooks/useTabNavigation';

interface Video {
  _id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  category?: string;
  tags?: string[];
  views?: number;
  createdAt: string;
}

export default function VideosPage() {
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/videos?limit=20&page=1`);

        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        setVideos(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedVideo(data.data[0]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-gray-900">
      <Navbar />
      <TabNavigation />

      {/* Video Player Section */}
      {selectedVideo && (
        <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gray-900">
          <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl">
            {/* Video Element */}
            <video
              src={selectedVideo.videoUrl}
              controls
              autoPlay
              className="h-full w-full bg-black"
              poster={selectedVideo.thumbnailUrl}
            />

            {/* Video Title */}
            <div className="absolute left-6 top-6 z-20 text-white drop-shadow-lg">
              <h2 className="text-3xl font-bold">{selectedVideo.title}</h2>
              <p className="text-sm text-gray-300">
                By: {selectedVideo.user?.fullName || selectedVideo.user?.username}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -right-5 -top-5 z-20 flex size-10 items-center justify-center rounded-full bg-white shadow-lg hover:scale-110"
            >
              <span className="material-icons text-gray-900">close</span>
            </button>
          </div>
        </section>
      )}

      {/* Videos Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          {selectedVideo ? 'More Videos' : 'All Videos'}
        </h2>

        {loading && (
          <div className="flex justify-center py-12">
            <p className="text-lg text-gray-600">Loading videos...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center py-12">
            <p className="text-lg text-red-600">Error: {error}</p>
          </div>
        )}

        {!loading && videos.length === 0 && !error && (
          <div className="flex justify-center py-12">
            <p className="text-lg text-gray-600">No videos available yet</p>
          </div>
        )}

        {!loading && videos.length > 0 && (
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            {videos
              .filter((v) => selectedVideo && v._id !== selectedVideo._id)
              .map((video) => (
                <div
                  key={video._id}
                  onClick={() => setSelectedVideo(video)}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
                >
                  <div className="relative h-40 w-full bg-gray-300 overflow-hidden">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="material-icons text-4xl text-white">
                          videocam
                        </span>
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {video.user?.fullName || video.user?.username}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {video.views || 0} views
                    </p>
                    <button className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold py-2 rounded-lg hover:shadow-lg transition-all">
                      <span className="material-icons text-sm">play_arrow</span>
                      Watch Now
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
