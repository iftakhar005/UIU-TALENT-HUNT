import { type FunctionComponent } from 'react';
import useNavbar from '../../hooks/useNavbar';
import styles from '../../styles/Leaderboard.module.css';

const Leaderboard: FunctionComponent = () => {
    const { Navbar } = useNavbar();

    return (
        <div className={styles.leaderboard}>
            <Navbar />
            <div className={styles.main}>
                <b className={styles.heading1}>Talent Leaderboard</b>
                <div className={styles.discoverTheTop}>Discover the top creators across Video, Audio, and Blog portals.</div>
                <div className={styles.scoreIsCalculatedContainer}>
                    <span>
                        <span>Score is calculated using a weighted combination of<br /></span>
                        <b>average rating</b>
                        <span>{`, `}</span>
                        <b>engagement (views / plays / reads)</b>
                        <span>, and<br /></span>
                        <b>number of unique raters</b>
                        <span> to highlight consistent talent<br />across the UIU community.</span>
                    </span>
                </div>

                <div className={styles.section2}>
                    <b className={styles.topTalentsThis}>Top Talents (this semester)</b>
                    <div className={styles.combinedRankingsFrom}>Combined rankings from video streaming, audio streaming, and smart blogging portals.</div>
                    <div className={styles.table}>
                        <div className={styles.headerRow}>
                            <div className={styles.cell}><div className={styles.rank}>Rank</div></div>
                            <div className={styles.cell2}><div className={styles.talent}>Talent</div></div>
                            <div className={styles.cell3}><div className={styles.primaryPortal}>Primary Portal</div></div>
                            <div className={styles.cell4}><div className={styles.avgRating}>Avg. Rating</div></div>
                            <div className={styles.cell5}><div className={styles.ratings}>Ratings</div></div>
                            <div className={styles.cell6}><div className={styles.entries}>Entries</div></div>
                            <div className={styles.cell7}><div className={styles.engagementScore}>Engagement Score</div></div>
                            <div className={styles.cell8} />
                        </div>
                        <div className={styles.body}>
                            <div className={styles.row}>
                                <div className={styles.data1}>#1</div>
                                <div className={styles.data}>
                                    <b className={styles.eashaElehi}>Easha Elehi</b>
                                    <div className={styles.eashaelehi442}>@eashaelehi44</div>
                                </div>
                                <div className={styles.data2}><div className={styles.video2}>Video</div></div>
                                <div className={styles.data3}>
                                    <div className={styles.div3}>★★★★★</div>
                                    <div className={styles.div4}>4.8</div>
                                </div>
                                <div className={styles.data326}>326</div>
                                <div className={styles.data25}>25</div>
                                <b className={styles.data975}>97.5</b>
                                <div className={styles.dataView}>View profile</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
