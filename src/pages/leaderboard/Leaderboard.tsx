import { type FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import styles from '../../styles/Leaderboard.module.css';

interface LeaderboardEntry {
    _id: string;
    title: string;
    netScore: number;
    upvotes: number;
    downvotes: number;
    views: number;
    type: 'video' | 'audio' | 'blog';
    user: {
        _id: string;
        fullName: string;
        username: string;
        avatar: string;
        department?: string;
        currentTrimester?: string;
    };
}

interface LeaderboardData {
    videos: LeaderboardEntry[];
    audios: LeaderboardEntry[];
    blogs: LeaderboardEntry[];
}

const Leaderboard: FunctionComponent = () => {
    const Navbar = useNavbar();
    const { Footer } = useFooter();
    const navigate = useNavigate();
    const [data, setData] = useState<LeaderboardData>({ videos: [], audios: [], blogs: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'blog'>('video');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'https://uiu-talent-hunt-backend.onrender.com/api';
                console.log('🔗 Fetching leaderboard from:', `${apiUrl}/leaderboard`);
                const response = await fetch(`${apiUrl}/leaderboard`);

                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }

                const result = await response.json();
                console.log('📊 Leaderboard data:', result);
                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.error || 'Failed to load data');
                }
            } catch (err) {
                console.error('Leaderboard error:', err);
                setError('Failed to load leaderboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const handleContentClick = (entry: LeaderboardEntry) => {
        if (entry.type === 'video') {
            navigate(`/videos/${entry._id}`);
        } else if (entry.type === 'audio') {
            navigate(`/audios/${entry._id}`);
        } else if (entry.type === 'blog') {
            navigate(`/blogs/${entry._id}`);
        }
    };

    // Get current tab data
    const currentData = activeTab === 'video' ? data.videos : activeTab === 'audio' ? data.audios : data.blogs;

    // Top 3 for Podium
    const topThree = currentData.slice(0, 3);

    return (
        <div className={styles.leaderboard}>
            {Navbar}
            <div className={styles.main}>
                <b className={styles.heading1}>Talent Leaderboard</b>
                <div className={styles.discoverTheTop}>Discover the top content across Video, Audio, and Blog portals.</div>

                {/* Tabs */}
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === 'video' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('video')}
                    >
                        Video
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'audio' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('audio')}
                    >
                        Audio
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'blog' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('blog')}
                    >
                        Blog
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading rankings...</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{error}</div>
                ) : (
                    <>
                        {/* Podium Section - Top 3 */}
                        {topThree.length > 0 && (
                            <div className={styles.podiumContainer}>
                                {/* Second Place */}
                                {topThree[1] && (
                                    <div className={`${styles.podiumCard} ${styles.secondPlace}`} onClick={() => handleContentClick(topThree[1])}>
                                        <div className={styles.rankBadge}>#2</div>
                                        <div
                                            className={styles.cardAvatar}
                                            style={{ background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }}
                                        >
                                            {(topThree[1].user?.fullName || topThree[1].user?.username || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.cardName}>{topThree[1].user?.fullName || 'Unknown User'}</div>
                                        <div className={styles.cardHandle}>@{topThree[1].user?.username || 'unknown'}</div>
                                        <div className={styles.cardInfo}>
                                            📚 {topThree[1].user?.department || 'N/A'} • {topThree[1].user?.currentTrimester ? `${topThree[1].user.currentTrimester} Trimester` : 'N/A'}
                                        </div>
                                        <div className={styles.cardTitle}>{topThree[1].title}</div>
                                        <div className={styles.cardStats}>
                                            👍 {topThree[1].upvotes} • 👎 {topThree[1].downvotes} • 👁 {topThree[1].views}
                                        </div>
                                        <div className={styles.cardScore}>Net Score: {topThree[1].netScore}</div>
                                    </div>
                                )}

                                {/* First Place */}
                                {topThree[0] && (
                                    <div className={`${styles.podiumCard} ${styles.firstPlace}`} onClick={() => handleContentClick(topThree[0])}>
                                        <div className={styles.rankBadge} style={{ background: '#f59e0b', color: 'black' }}>#1 Overall</div>
                                        <div
                                            className={styles.cardAvatar}
                                            style={{ background: 'linear-gradient(135deg, #fcd34d, #f59e0b)' }}
                                        >
                                            {(topThree[0].user?.fullName || topThree[0].user?.username || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.cardName}>{topThree[0].user?.fullName || 'Unknown User'}</div>
                                        <div className={styles.cardHandle}>@{topThree[0].user?.username || 'unknown'}</div>
                                        <div className={styles.cardInfo}>
                                            📚 {topThree[0].user?.department || 'N/A'} • {topThree[0].user?.currentTrimester ? `${topThree[0].user.currentTrimester} Trimester` : 'N/A'}
                                        </div>
                                        <div className={styles.cardTitle}>{topThree[0].title}</div>
                                        <div className={styles.cardStats}>
                                            👍 {topThree[0].upvotes} • 👎 {topThree[0].downvotes} • 👁 {topThree[0].views}
                                        </div>
                                        <div className={styles.cardScore}>Net Score: {topThree[0].netScore}</div>
                                    </div>
                                )}

                                {/* Third Place */}
                                {topThree[2] && (
                                    <div className={`${styles.podiumCard} ${styles.thirdPlace}`} onClick={() => handleContentClick(topThree[2])}>
                                        <div className={styles.rankBadge}>#3</div>
                                        <div
                                            className={styles.cardAvatar}
                                            style={{ background: 'linear-gradient(135deg, #fdba74, #fb923c)' }}
                                        >
                                            {(topThree[2].user?.fullName || topThree[2].user?.username || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.cardName}>{topThree[2].user?.fullName || 'Unknown User'}</div>
                                        <div className={styles.cardHandle}>@{topThree[2].user?.username || 'unknown'}</div>
                                        <div className={styles.cardInfo}>
                                            📚 {topThree[2].user?.department || 'N/A'} • {topThree[2].user?.currentTrimester ? `${topThree[2].user.currentTrimester} Trimester` : 'N/A'}
                                        </div>
                                        <div className={styles.cardTitle}>{topThree[2].title}</div>
                                        <div className={styles.cardStats}>
                                            👍 {topThree[2].upvotes} • 👎 {topThree[2].downvotes} • 👁 {topThree[2].views}
                                        </div>
                                        <div className={styles.cardScore}>Net Score: {topThree[2].netScore}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Detailed Table Section */}
                        <div className={styles.section2}>
                            <b className={styles.topTalentsThis}>Top Content (this semester)</b>
                            <div className={styles.combinedRankingsFrom}>Top ranked {activeTab} content based on net score (Upvotes - Downvotes).</div>

                            <div className={styles.table}>
                                <div className={styles.headerRow}>
                                    <div className={styles.cell}>Rank</div>
                                    <div className={styles.cell2}>Creator</div>
                                    <div className={styles.cell3}>Content Title</div>
                                    <div className={styles.cell4}>Upvotes</div>
                                    <div className={styles.cell5}>Downvotes</div>
                                    <div className={styles.cell6}>Views</div>
                                    <div className={styles.cell7}>Net Score</div>
                                    <div className={styles.cell8}></div>
                                </div>
                                <div className={styles.body}>
                                    {currentData.length > 0 ? (
                                        currentData.map((entry, index) => (
                                            <div className={styles.row} key={entry._id}>
                                                <div className={styles.data1}>#{index + 1}</div>
                                                <div className={styles.data}>
                                                    <b className={styles.eashaElehi}>{entry.user?.fullName || entry.user?.username || 'Unknown User'}</b>
                                                    <div className={styles.eashaelehi442}>@{entry.user?.username || 'unknown'}</div>
                                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                                        {entry.user?.department || 'N/A'} • {entry.user?.currentTrimester ? `${entry.user.currentTrimester} Trimester` : 'N/A'}
                                                    </div>
                                                </div>
                                                <div className={styles.data2} onClick={() => handleContentClick(entry)} style={{ cursor: 'pointer' }}>
                                                    <div className={styles.contentTitle} title={entry.title}>
                                                        {entry.title.length > 30 ? entry.title.substring(0, 30) + '...' : entry.title}
                                                    </div>
                                                </div>
                                                <div className={styles.data326}>{entry.upvotes}</div>
                                                <div className={styles.data327}>{entry.downvotes}</div>
                                                <div className={styles.data25}>{entry.views.toLocaleString()}</div>
                                                <b className={styles.data975}>{entry.netScore}</b>
                                                <div className={styles.dataView} onClick={() => handleContentClick(entry)}>View</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                                            No data available for this category yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Leaderboard;
