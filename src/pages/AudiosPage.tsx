import { useState, useEffect } from 'react';
import useNavbar from '../hooks/useNavbar';
import useFooter from '../hooks/useFooter';
import useTabNavigation from '../hooks/useTabNavigation';

interface Audio {
  _id: string;
  title: string;
  audioUrl: string;
  coverImage?: string;
  duration?: number;
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  category?: string;
  tags?: string[];
  plays?: number;
  createdAt: string;
}

export default function AudiosPage() {
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();

  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<Audio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/audios?limit=20&page=1`);

        if (!response.ok) {
          throw new Error('Failed to fetch audios');
        }

        const data = await response.json();
        setAudios(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedAudio(data.data[0]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching audios:', err);
        setError(err instanceof Error ? err.message : 'Failed to load audios');
        setAudios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
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

      {/* Audio Player Section */}
      {selectedAudio && (
        <section className="bg-gradient-to-r from-purple-900 to-indigo-900 py-12">
          <div className="container mx-auto px-4">
            <div className="flex gap-8 items-center rounded-2xl bg-black/30 backdrop-blur p-8 border border-purple-500/20">
              {/* Cover Image */}
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                {selectedAudio.coverImage ? (
                  <img
                    src={selectedAudio.coverImage}
                    alt={selectedAudio.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="material-icons text-5xl text-white">
                      music_note
                    </span>
                  </div>
                )}
              </div>

              {/* Player */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedAudio.title}
                </h2>
                <p className="text-gray-300 mb-4">
                  By: {selectedAudio.user?.fullName || selectedAudio.user?.username}
                </p>

                <audio
                  src={selectedAudio.audioUrl}
                  controls
                  autoPlay
                  className="w-full h-12 mb-4"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />

                <div className="flex gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    <span className="material-icons">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={() => setSelectedAudio(null)}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all"
                  >
                    <span className="material-icons">close</span>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Audios Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          {selectedAudio ? 'More Audios' : 'All Audios'}
        </h2>

        {loading && (
          <div className="flex justify-center py-12">
            <p className="text-lg text-gray-600">Loading audios...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center py-12">
            <p className="text-lg text-red-600">Error: {error}</p>
          </div>
        )}

        {!loading && audios.length === 0 && !error && (
          <div className="flex justify-center py-12">
            <p className="text-lg text-gray-600">No audios available yet</p>
          </div>
        )}

        {!loading && audios.length > 0 && (
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            {audios
              .filter((a) => selectedAudio && a._id !== selectedAudio._id)
              .map((audio) => (
                <div
                  key={audio._id}
                  onClick={() => setSelectedAudio(audio)}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
                >
                  <div className="relative h-40 w-full bg-gray-300 overflow-hidden">
                    {audio.coverImage ? (
                      <img
                        src={audio.coverImage}
                        alt={audio.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="material-icons text-4xl text-white">
                          music_note
                        </span>
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(audio.duration)}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {audio.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {audio.user?.fullName || audio.user?.username}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {audio.plays || 0} plays
                    </p>
                    <button className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold py-2 rounded-lg hover:shadow-lg transition-all">
                      <span className="material-icons text-sm">play_arrow</span>
                      Play Now
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
