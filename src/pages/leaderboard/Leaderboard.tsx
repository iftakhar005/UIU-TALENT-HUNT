import { type FunctionComponent, useEffect, useState } from 'react';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import styles from '../../styles/Leaderboard.module.css';

interface LeaderboardUser {
    _id: string; // User ID
    netScore: number;
    totalUpvotes: number;
    totalDownvotes: number;
    totalViews: number;
    entryCount: number;
    avgRating: number;
    type: 'video' | 'audio' | 'blog';
    user: {
        _id: string;
        fullName: string;
        username: string;
        avatar: string;
    };
}

interface LeaderboardData {
    videos: LeaderboardUser[];
    audios: LeaderboardUser[];
    blogs: LeaderboardUser[];
}

const Leaderboard: FunctionComponent = () => {
    const { Navbar } = useNavbar();
    const { Footer } = useFooter();
    const [data, setData] = useState<LeaderboardData>({ videos: [], audios: [], blogs: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'blog'>('video');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'https://uiu-talent-hunt-backend.onrender.com/api';
                const response = await fetch(`${apiUrl}/leaderboard`);

                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }

                const result = await response.json();
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

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '☆'; // Simple representation
        if (fullStars < 5 && !hasHalfStar) stars += '☆'.repeat(5 - fullStars);
        return stars.substring(0, 5); // Ensure max 5 char length roughly
    };

    const getBadgeClass = (type: string) => {
        switch (type) {
            case 'video': return styles.video2;
            case 'audio': return styles.audioBadge;
            case 'blog': return styles.blogBadge;
            default: return styles.video2;
        }
    };

    const getBadgeText = (type: string) => {
        switch (type) {
            case 'video': return 'Top Video Creator';
            case 'audio': return 'Top Audio Artist';
            case 'blog': return 'Top Blogger';
            default: return 'Creator';
        }
    };

    // Get current tab data
    const currentData = activeTab === 'video' ? data.videos : activeTab === 'audio' ? data.audios : data.blogs;

    // Top 3 for Podium
    const topThree = currentData.slice(0, 3);
    // Rest for Table
    const restList = currentData.slice(3);

    return (
        <div className={styles.leaderboard}>
            <Navbar />
            <div className={styles.main}>
                <b className={styles.heading1}>Talent Leaderboard</b>
                <div className={styles.discoverTheTop}>Discover the top creators across Video, Audio, and Blog portals.</div>

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
                                    <div className={`${styles.podiumCard} ${styles.secondPlace}`}>
                                        <div className={styles.rankBadge}>#2</div>
                                        <div
                                            className={styles.cardAvatar}
                                            style={{ background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }} // Placeholder if no image
                                        />
                                        <div className={styles.cardName}>{topThree[1].user.fullName}</div>
                                        <div className={styles.cardHandle}>@{topThree[1].user.username}</div>
                                        <div className={styles.cardStats}>
                                            {(topThree[1].avgRating || 0).toFixed(1)} avg • {topThree[1].totalUpvotes} votes
                                        </div>
                                        <div className={styles.cardScore}>Score: {topThree[1].netScore}</div>
                                        {/* <span className={styles.viewProfileBtn}>View Profile</span> */}
                                    </div>
                                )}

                                {/* First Place */}
                                {topThree[0] && (
                                    <div className={`${styles.podiumCard} ${styles.firstPlace}`}>
                                        <div className={styles.rankBadge} style={{ background: '#f59e0b', color: 'black' }}>#1 Overall</div>
                                        <div
                                            className={styles.cardAvatar}
                                            style={{ background: 'linear-gradient(135deg, #fcd34d, #f59e0b)' }}
                                        />
                                        <div className={styles.cardName}>{topThree[0].user.fullName}</div>
                                        <div className={styles.cardHandle}>@{topThree[0].user.username}</div>
                                        <div className={styles.cardStats}>
                                            {topThree[0].entryCount} entries • {topThree[0].totalViews} views
                                        </div>
                                        <div className={styles.cardScore}>Engagement Score: {topThree[0].netScore}</div>
                                        <span className={styles.viewProfileBtn}>{getBadgeText(activeTab)}</span>
                                    </div>
                                )}

                                {/* Third Place */}
                                {topThree[2] && (
                                    <div className={`${styles.podiumCard} ${styles.thirdPlace}`}>
                                        <div className={styles.rankBadge}>#3</div>
                                        <div
                                            className={styles.cardAvatar}
                                            style={{ background: 'linear-gradient(135deg, #fdba74, #fb923c)' }}
                                        />
                                        <div className={styles.cardName}>{topThree[2].user.fullName}</div>
                                        <div className={styles.cardHandle}>@{topThree[2].user.username}</div>
                                        <div className={styles.cardStats}>
                                            {(topThree[2].avgRating || 0).toFixed(1)} avg • 0 requests
                                        </div>
                                        <div className={styles.cardScore}>Score: {topThree[2].netScore}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Detailed Table Section (Rank 4+) or All if user prefers list */}
                        <div className={styles.section2}>
                            <b className={styles.topTalentsThis}>Top Talents (this semester)</b>
                            <div className={styles.combinedRankingsFrom}>Combined rankings from {activeTab} portals.</div>

                            <div className={styles.table}>
                                <div className={styles.headerRow}>
                                    <div className={styles.cell}>Rank</div>
                                    <div className={styles.cell2}>Talent</div>
                                    <div className={styles.cell3}>Primary Portal</div>
                                    <div className={styles.cell4}>Avg. Rating</div>
                                    <div className={styles.cell5}>Total Upvotes</div>
                                    <div className={styles.cell6}>Entries</div>
                                    <div className={styles.cell7}>Net Score</div>
                                    <div className={styles.cell8}></div>
                                </div>
                                <div className={styles.body}>
                                    {currentData.length > 0 ? (
                                        currentData.map((entry, index) => (
                                            <div className={styles.row} key={entry._id}>
                                                <div className={styles.data1}>#{index + 1}</div>
                                                <div className={styles.data}>
                                                    <b className={styles.eashaElehi}>{entry.user.fullName || entry.user.username}</b>
                                                    <div className={styles.eashaelehi442}>@{entry.user.username}</div>
                                                </div>
                                                <div className={styles.data2}>
                                                    <div className={getBadgeClass(activeTab)}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
                                                </div>
                                                <div className={styles.data3}>
                                                    <div className={styles.div3}>{renderStars(entry.avgRating || 0)}</div>
                                                    <div className={styles.div4}>{(entry.avgRating || 0).toFixed(1)}</div>
                                                </div>
                                                <div className={styles.data326}>{entry.totalUpvotes}</div>
                                                <div className={styles.data25}>{entry.entryCount}</div>
                                                <b className={styles.data975}>{entry.netScore}</b>
                                                <div className={styles.dataView}>View profile</div>
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
