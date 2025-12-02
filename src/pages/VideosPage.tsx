import useNavbar from '../hooks/useNavbar';
import useFooter from '../hooks/useFooter';
import useTabNavigation from '../hooks/useTabNavigation';

export default function VideosPage() {
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();

  return (
    <div className="min-h-screen w-full bg-slate-50 text-gray-900">
      <Navbar />
      <TabNavigation />

      {/* Video Player Section */}
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gray-900">
        <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-50"></div>

          {/* Video Content */}
          <div className="relative z-10 flex h-full items-center justify-center">
            {/* Play Button */}
            <button className="flex size-24 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70">
              <span className="material-icons text-4xl text-white">play_arrow</span>
            </button>
          </div>

          {/* Video Title */}
          <div className="absolute left-6 top-6 z-20 text-white">
            <h2 className="text-3xl font-bold">Quantum Computing Explained</h2>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-12 left-6 right-6 z-20">
            <div className="mb-2 flex gap-4 text-xs text-white">
              <span>0:37</span>
              <span>2:23</span>
            </div>
            <div className="h-1 w-full rounded-full bg-gray-600">
              <div className="h-full w-1/3 rounded-full bg-white"></div>
            </div>
          </div>

          {/* Close Button */}
          <button className="absolute -right-5 -top-5 z-20 flex size-10 items-center justify-center rounded-full bg-white shadow-lg hover:scale-110">
            <span className="material-icons text-gray-900">close</span>
          </button>
        </div>
      </section>

      {/* Related Videos */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">More Videos</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: "Introduction to AI", desc: "Basics of AI" },
            { title: "Data Science 101", desc: "Getting started with data" },
            { title: "Web Development", desc: "Frontend fundamentals" },
          ].map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="h-40 w-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
                <button className="mt-4 flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600">
                  Watch Now
                  <span className="material-icons ml-1 text-sm">play_arrow</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
