import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Admin.module.css";
import useFooter from "../../hooks/useFooter";

const Admin: FunctionComponent = () => {
  const { Footer } = useFooter();
  const onVectorIconClick = useCallback(() => {
    // TODO: hook up profile/menu actions
    // For now, just log interaction
    console.log("Admin navbar avatar clicked");
  }, []);

  const [showFooter, setShowFooter] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setShowFooter(entry.isIntersecting);
      },
      { root: null, threshold: 0.01 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.admin}>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.aside}>
            <b className={styles.dashboardControls}>Dashboard Controls</b>
            <div className={styles.manageTalentsContent}>
              {`Manage talents, content, ratings &`}
              <br />
              {`reports.`}
            </div>
            <div className={styles.background}>
              <img className={styles.imageborderIcon} alt="Admin avatar" />
              <b className={styles.adminNayeem}>Admin Nayeem</b>
              <div className={styles.superAdministrator}>
                Super Administrator
              </div>
            </div>
            <div className={styles.main2}>Main</div>
            <div className={styles.list}>
              <div className={styles.item}>
                <b className={styles.b}>📊</b>
                <b className={styles.overview}>Overview</b>
              </div>
              <div className={styles.item2}>
                <div className={styles.b}>🎬</div>
                <div className={styles.videoPortal}>Video Portal</div>
              </div>
              <div className={styles.item3}>
                <div className={styles.b}>🎧</div>
                <div className={styles.videoPortal}>Audio Portal</div>
              </div>
              <div className={styles.item4}>
                <div className={styles.div3}>✍️</div>
                <div className={styles.blogPortal}>Blog Portal</div>
              </div>
            </div>
            <div className={styles.moderation}>Moderation</div>
            <div className={styles.list2}>
              <div className={styles.item5}>
                <div className={styles.div4}>📝</div>
                <div className={styles.pendingSubmissions}>
                  Pending
                  <br />
                  Submissions
                </div>
                <div className={styles.background2}>
                  <b className={styles.b2}>7</b>
                </div>
              </div>
              <div className={styles.item6}>
                <div className={styles.div5}>🚩</div>
                <div className={styles.reportedContent}>Reported Content</div>
                <div className={styles.background3}>
                  <b className={styles.b2}>3</b>
                </div>
              </div>
              <div className={styles.item7}>
                <div className={styles.b}>👥</div>
                <div className={styles.userManagement}>User Management</div>
              </div>
            </div>
            <div className={styles.system}>System</div>
            <div className={styles.list3}>
              <div className={styles.item5}>
                <div className={styles.div7}>⭐</div>
                <div className={styles.ratingLeaderboard}>
                  Rating / Leaderboard
                  <br />
                  Rules
                </div>
              </div>
              <div className={styles.item9}>
                <div className={styles.div8}>⚙️</div>
                <div className={styles.platformSettings}>Platform Settings</div>
              </div>
            </div>
            <div className={styles.asideChild} />
            <b className={styles.logout}>LogOut</b>
          </div>

          <div className={styles.section}>
            <b className={styles.heading1}>Admin Overview</b>
            <div className={styles.monitorActivityAcross}>
              Monitor activity across Video, Audio, and Blog portals and approve
              new talents.
            </div>
            <div className={styles.currentSemesterSpringContainer}>
              <span className={styles.currentSemesterSpringContainer2}>
                <span>{`Current semester: `}</span>
                <b className={styles.minAgo}>
                  Spring 2025
                  <br />
                </b>
                <span>{`Last refreshed: `}</span>
                <b className={styles.minAgo}>2 min ago</b>
              </span>
            </div>
            <div className={styles.paragraphbackgroundshadow}>
              <div className={styles.activeTalents}>Active Talents</div>
              <b className={styles.b4}>128</b>
              <div className={styles.thisWeek}>+12 this week</div>
              <div className={styles.studentsWhoUploaded}>
                Students who uploaded at least one entry.
              </div>
            </div>
            <div className={styles.paragraphbackgroundshadow2}>
              <div className={styles.totalEntries}>Total Entries</div>
              <b className={styles.b5}>342</b>
              <div className={styles.videos182}>
                Videos: 182 • Audios: 96 • Blogs: 64
              </div>
            </div>
            <div className={styles.paragraphbackgroundshadow3}>
              <div className={styles.averagePlatformRating}>
                Average Platform Rating
              </div>
              <b className={styles.b6}>{`4.7 `}</b>
              <div className={styles.div9}>★★★★★</div>
              <div className={styles.basedOn1842}>
                Based on 1,842 user ratings.
              </div>
            </div>
            <div className={styles.paragraphbackgroundshadow4}>
              <div className={styles.itemsNeedingReview}>
                Items Needing Review
              </div>
              <b className={styles.b7}>10</b>
              <div className={styles.urgentReports}>3 urgent reports</div>
              <div className={styles.pendingApprovals}>
                Pending approvals + reported content.
              </div>
            </div>

            <div className={styles.backgroundshadow}>
              <div className={styles.pendingContentReviewContainer}>
                <span className={styles.currentSemesterSpringContainer2}>
                  <b>
                    Pending Content Review
                    <br />
                  </b>
                  <span className={styles.approveOrReject}>
                    Approve or reject new submissions before they appear on the
                    platform.
                  </span>
                </span>
              </div>
              <div className={styles.background4}>
                <div className={styles.manualReview}>Manual review</div>
              </div>
              <div className={styles.table}>
                <div className={styles.headerRow}>
                  <div className={styles.cell}>
                    <div className={styles.type}>Type</div>
                  </div>
                  <div className={styles.cell2}>
                    <div className={styles.titleTalent}>Title / Talent</div>
                  </div>
                  <div className={styles.cell3}>
                    <div className={styles.initialRating}>Initial Rating</div>
                  </div>
                  <div className={styles.cell4}>
                    <div className={styles.flags}>Flags</div>
                  </div>
                  <div className={styles.cell5}>
                    <div className={styles.actions}>Actions</div>
                  </div>
                </div>
                <div className={styles.body}>
                  <div className={styles.row}>
                    <div className={styles.data}>
                      <div className={styles.video}>Video</div>
                    </div>
                    <div className={styles.data2}>
                      <b className={styles.classicalMashup}>
                        Classical Mashup – Talent
                        <br />
                        Show
                      </b>
                      <div className={styles.eashaelehi44542}>
                        @eashaelehi44 • 5:42
                      </div>
                    </div>
                    <div className={styles.data3}>
                      <div className={styles.div10}>★★★★★</div>
                      <div className={styles.div11}>
                        4.9
                        <br />
                        (18)
                      </div>
                    </div>
                    <div className={styles.data0}>0</div>
                    <div className={styles.data4}>
                      <div className={styles.button}>
                        <div className={styles.preview}>Preview</div>
                      </div>
                      <div className={styles.button2}>
                        <div className={styles.approve}>Approve</div>
                      </div>
                      <div className={styles.button3}>
                        <div className={styles.reject}>Reject</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.row2}>
                    <div className={styles.data5}>
                      <div className={styles.background5}>
                        <div className={styles.video}>Audio</div>
                      </div>
                    </div>
                    <div className={styles.data6}>
                      <b className={styles.nightStudyLofi}>
                        Night Study Lofi Mix
                      </b>
                      <div className={styles.armanbeats2110}>
                        @armanbeats • 21:10
                      </div>
                    </div>
                    <div className={styles.data7}>
                      <div className={styles.div12}>★★★★☆</div>
                      <div className={styles.div13}>
                        4.5
                        <br />
                        (9)
                      </div>
                    </div>
                    <div className={styles.data8}>
                      <div className={styles.copyright}>
                        1<br />
                        (copyright)
                      </div>
                    </div>
                    <div className={styles.data9}>
                      <div className={styles.button4}>
                        <div className={styles.preview}>Preview</div>
                      </div>
                      <div className={styles.button5}>
                        <div className={styles.approve}>Approve</div>
                      </div>
                      <div className={styles.button6}>
                        <div className={styles.reject}>Reject</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.row3}>
                    <div className={styles.data10}>
                      <div className={styles.blog}>Blog</div>
                    </div>
                    <div className={styles.data11}>
                      <b className={styles.howOpenMic}>
                        How Open Mic Night Built
                        <br />
                        My Confidence
                      </b>
                      <div className={styles.nafisawrites1200}>
                        @nafisaWrites • 1,200 words
                      </div>
                    </div>
                    <div className={styles.data12}>
                      <div className={styles.div10}>★★★★★</div>
                      <div className={styles.div15}>
                        5.0
                        <br />
                        (6)
                      </div>
                    </div>
                    <div className={styles.data0}>0</div>
                    <div className={styles.data4}>
                      <div className={styles.button}>
                        <div className={styles.preview}>Preview</div>
                      </div>
                      <div className={styles.button2}>
                        <div className={styles.approve}>Approve</div>
                      </div>
                      <div className={styles.button3}>
                        <div className={styles.reject}>Reject</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.row4}>
                    <div className={styles.data5}>
                      <div className={styles.data}>
                        <div className={styles.video}>Video</div>
                      </div>
                    </div>
                    <div className={styles.data6}>
                      <b className={styles.standUpComedy}>
                        Stand-up Comedy –<br />
                        Midterm Edition
                      </b>
                      <div className={styles.rafishortfilms730}>
                        @rafiShortFilms • 7:30
                      </div>
                    </div>
                    <div className={styles.data7}>
                      <div className={styles.div12}>★★★☆☆</div>
                      <div className={styles.div13}>
                        3.8
                        <br />
                        (4)
                      </div>
                    </div>
                    <div className={styles.data17}>
                      <div className={styles.language}>
                        2<br />
                        (language)
                      </div>
                    </div>
                    <div className={styles.data9}>
                      <div className={styles.button4}>
                        <div className={styles.preview}>Preview</div>
                      </div>
                      <div className={styles.button5}>
                        <div className={styles.approve}>Approve</div>
                      </div>
                      <div className={styles.button6}>
                        <div className={styles.reject}>Reject</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.backgroundshadow2}>
              <div className={styles.topTalentsContainer}>
                <span className={styles.currentSemesterSpringContainer2}>
                  <b>
                    {`Top Talents & Leaderboard Rules`}
                    <br />
                    {``}
                  </b>
                  <span className={styles.quickViewOf}>
                    Quick view of leading users and how scores are calculated.
                  </span>
                </span>
              </div>
              <div className={styles.background7}>
                <div className={styles.live}>Live</div>
              </div>
              <div className={styles.horizontalborder}>
                <img className={styles.imageIcon} alt="User" />
                <b className={styles.eashaElehi}>Easha Elehi</b>
                <div className={styles.eashaelehi441}>
                  @eashaelehi44 • #1 Overall
                </div>
                <div className={styles.div18}>★★★★★</div>
                <div className={styles.div19}>4.8</div>
              </div>
              <div className={styles.horizontalborder2}>
                <img className={styles.imageIcon} alt="User" />
                <b className={styles.armanHossain}>Arman Hossain</b>
                <div className={styles.armanbeatsTop}>
                  @armanbeats • Top Audio
                </div>
                <div className={styles.div18}>★★★★★</div>
                <div className={styles.div21}>4.9</div>
              </div>
              <div className={styles.horizontalborder3}>
                <img className={styles.imageIcon} alt="User" />
                <b className={styles.nafisaRahman}>Nafisa Rahman</b>
                <div className={styles.nafisawritesTop}>
                  @nafisaWrites • Top Blogger
                </div>
                <div className={styles.div18}>★★★★☆</div>
                <div className={styles.div23}>4.7</div>
              </div>
              <div className={styles.youCanTweak}>
                You can tweak these weights to emphasize quality (rating) or
                reach
                <br />
                (views/plays/reads). Changes will recalculate the leaderboard.
              </div>
              <div className={styles.horizontalborder4}>
                <div className={styles.requireLoginTo}>
                  Require login to rate content
                </div>
                <div className={styles.background8}>
                  <div className={styles.background9} />
                </div>
                <div className={styles.hideItemsBelow}>
                  Hide items below 3★ from homepage
                </div>
                <div className={styles.background10}>
                  <div className={styles.background11} />
                </div>
                <div className={styles.enableManualApproval}>
                  Enable manual approval for new users
                </div>
                <div className={styles.background12}>
                  <div className={styles.background9} />
                </div>
                <div className={styles.theseSwitchesAre}>
                  These switches are visual only in the prototype. In the real
                  app,
                  <br />
                  connect them to your backend config.
                </div>
              </div>
            </div>
            <div ref={sentinelRef} className={styles.scrollSentinel} />
          </div>

          <div className={styles.header}>
            <div className={styles.nav}>
              <div className={styles.school}>school</div>
              <b className={styles.uiuTalentHunt}>UIU Talent Hunt</b>
              <div className={styles.input}>
                <div className={styles.container2}>
                  <div className={styles.searchEntries}>Search entries...</div>
                </div>
                <div className={styles.search}>search</div>
              </div>
              <div className={styles.button13}>
                <div className={styles.submitEntry}>Submit Entry</div>
              </div>
              <div className={styles.button14}>
                <div className={styles.notifications}>notifications</div>
              </div>
              <img className={styles.buttonIcon} alt="avatar" />
              <img
                className={styles.vectorIcon}
                alt="avatar"
                onClick={onVectorIconClick}
              />
            </div>
          </div>

          <div
            className={`${styles.footerFixed} ${
              showFooter ? styles.footerVisible : ""
            }`}
          >
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
