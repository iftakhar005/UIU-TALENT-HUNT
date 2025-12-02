const audioItems = [
  {
    title: "Acoustic Cover of 'Wonderwall'",
    description: "A soulful rendition of the classic Oasis song, perfect for a relaxing evening.",
    author: "by Jane Doe",
    likes: "1.2k",
    comments: "345",
    shares: "15.2k",
  },
  {
    title: "The Future of AI in Art",
    description: "Exploring how artificial intelligence is changing the creative landscape.",
    author: "by John Smith",
    likes: "980",
    comments: "102",
    shares: "15.2k",
  },
  {
    title: "Short Film: 'The Last Leaf'",
    description: "A touching story about hope and perseverance in the face of adversity.",
    author: "by Emily White",
    likes: "2.5k",
    comments: "871",
    shares: "15.2k",
  },
  {
    title: "My Journey Through Spoken Word",
    description: "A personal blog about finding my voice through the art of spoken word.",
    author: "by Michael Brown",
    likes: "765",
    comments: "98",
    shares: "15.2k",
  },
  {
    title: "Digital Painting: 'City at Dawn'",
    description: "Capturing the first light of day over a bustling metropolis in this piece.",
    author: "by Sarah Green",
    likes: "1.8k",
    comments: "412",
    shares: "15.2k",
  },
  {
    title: "Podcast Episode: Creative Minds",
    description: "Join us for a discussion with leading artists and innovators in the industry.",
    author: "by David Black",
    likes: "630",
    comments: "45",
    shares: "15.2k",
  },
];

import useNavbar from '../hooks/useNavbar';
import useFooter from '../hooks/useFooter';
import useTabNavigation from '../hooks/useTabNavigation';

export default function AudiosPage() {
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();

  return (
    <div className="min-h-screen w-full bg-slate-50 text-gray-900">
      <Navbar />
      <TabNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {audioItems.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow hover:shadow-xl"
            >
              {/* Image */}
              <div className="h-56 w-full overflow-hidden bg-black">
                <div className="h-full w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-60"></div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mb-3 text-sm text-blue-700">
                  {item.description}
                </p>
                <p className="mb-4 text-sm text-gray-600">
                  {item.author}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-gray-700 px-3 py-2 text-sm text-white">
                    <span className="material-icons text-sm">favorite</span>
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-gray-700 px-3 py-2 text-sm text-white">
                    <span className="material-icons text-sm">comment</span>
                    <span>{item.comments}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-gray-700 px-3 py-2 text-sm text-white">
                    <span className="material-icons text-sm">share</span>
                    <span>{item.shares}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
