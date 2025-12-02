import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';
import styles from '../../styles/ReadBlog.module.css';

interface BlogContent {
  id: number;
  title: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  content: string;
  comments: Array<{
    id: number;
    author: string;
    timeAgo: string;
    text: string;
    avatar: string;
  }>;
}

// Mock blog data - replace with API call
const blogData: { [key: number]: BlogContent } = {
  1: {
    id: 1,
    title: 'Unlocking Your Potential: A Guide to Nailing Your Next Competition',
    category: 'Competition Tips',
    author: 'Arpita',
    publishDate: 'Nov 25, 2025',
    readTime: '5 min read',
    image: 'https://via.placeholder.com/800x400',
    content: `Welcome to the UIU Talent Hunt blog! Whether you're a seasoned competitor or a newcomer eager to make your mark, this space is for you. Today, we're diving deep into the strategies and mindsets that can elevate your performance and help you stand out from the crowd.

Competition isn't just about winning; it's about growth, learning, and pushing your own boundaries. Let's explore how you can turn your potential into a podium finish. With the right preparation, anything is possible. We will cover everything from initial brainstorming to final presentation polish.

Phase 1: The Ideation Sprint
Every great project begins with a powerful idea. Don't just settle for your first thought. Dedicate time to brainstorming. Use techniques like mind mapping or the "5 Whys" to dig deeper into the problem you're trying to solve. The most innovative solutions often come from looking at a problem from a completely different angle. Collaborate with your team, challenge each other's assumptions, and aim for an idea that is both ambitious and achievable within the competition's timeframe.

"The best way to have a good idea is to have a lot of ideas." - Linus Pauling

Phase 2: Execution and Iteration
Once you have a solid concept, it's time to build. This phase is a marathon, not a sprint. Break down your project into smaller, manageable tasks. Use tools like Trello or Asana to track progress and assign responsibilities. The key here is to build, test, and iterate. Get feedback early and often, whether it's from mentors, peers, or potential users. Be prepared to pivot. Sometimes, the path to success requires changing your direction based on new insights. This adaptability is what separates good teams from great ones.

Phase 3: The Final Polish
The last 10% of the work is what makes the first 90% shine. Focus on user experience, design details, and the clarity of your presentation. Practice your pitch until it's second nature. Tell a compelling story that not only explains what you built but why it matters. Your passion and confidence will be just as important as the technical aspects of your project. Remember, the judges are investing in you as much as they are in your idea.`,
    comments: [
      {
        id: 1,
        author: 'Sakib',
        timeAgo: '2 days ago',
        text: 'This is exactly what I needed to read! The section on iteration is pure gold. Thanks for the amazing advice!',
        avatar: 'https://via.placeholder.com/40x40',
      },
      {
        id: 2,
        author: 'Nabila',
        timeAgo: '1 day ago',
        text: 'Great article. The reminder to focus on the "why" during the final pitch is so important. Often gets overlooked in the rush to finish.',
        avatar: 'https://via.placeholder.com/40x40',
      },
    ],
  },
};

const ReadBlog = () => {
  const { id } = useParams<{ id: string }>();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();

  const blog = blogData[parseInt(id || '1')] || blogData[1];
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (newComment.trim()) {
      console.log('Posting comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className={styles.readBlog}>
      <Navbar />
      <TabNavigation />

      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <span className={styles.category}>{blog.category}</span>
            <h1 className={styles.title}>{blog.title}</h1>
            <p className={styles.meta}>
              By {blog.author} • Published on {blog.publishDate} • {blog.readTime}
            </p>
          </div>

          {/* Featured Image */}
          <img src={blog.image} alt={blog.title} className={styles.featuredImage} />

          {/* Article Content */}
          <div className={styles.article}>
            {blog.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Author Box */}
          <div className={styles.authorBox}>
            <img
              src="https://via.placeholder.com/56x56"
              alt={blog.author}
              className={styles.authorAvatar}
            />
            <div className={styles.authorInfo}>
              <p className={styles.authorLabel}>WRITTEN BY</p>
              <h3 className={styles.authorName}>{blog.author}</h3>
              <p className={styles.authorBio}>Lead strategist at UIU and a passionate advocate for student innovation.</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Comments Section */}
          <div className={styles.commentsSection}>
            <h2 className={styles.commentsTitle}>Comments ({blog.comments.length})</h2>

            {/* Comment Form */}
            <div className={styles.commentForm}>
              <img
                src="https://via.placeholder.com/40x40"
                alt="Your avatar"
                className={styles.userAvatar}
              />
              <div className={styles.formContent}>
                <textarea
                  className={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className={styles.submitButton}
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            {blog.comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <img src={comment.avatar} alt={comment.author} className={styles.commentAvatar} />
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <strong className={styles.commentAuthor}>{comment.author}</strong>
                    <span className={styles.commentTime}>{comment.timeAgo}</span>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReadBlog;
