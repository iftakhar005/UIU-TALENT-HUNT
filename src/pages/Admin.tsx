import { FunctionComponent, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Admin.module.css';

interface ContentRequest {
  _id: string;
  contentType: 'video' | 'audio' | 'blog';
  title: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  duration?: number;
  blogContent?: string;
  description: string;
  category: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

const Admin: FunctionComponent = () => {
  const navigate = useNavigate();
  const [contentRequests, setContentRequests] = useState<ContentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content/pending');
      const data = await response.json();
      if (data.success) {
        setContentRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching content requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contentId: string) => {
    try {
      const response = await fetch(`/api/admin/content/approve/${contentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setContentRequests(contentRequests.filter(c => c._id !== contentId));
        alert('Content approved successfully');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error approving content:', error);
      alert('Error approving content');
    }
  };

  const handleReject = async (contentId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/admin/content/reject/${contentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      const data = await response.json();
      if (data.success) {
        setContentRequests(contentRequests.filter(c => c._id !== contentId));
        alert('Content rejected successfully');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error rejecting content:', error);
      alert('Error rejecting content');
    }
  };

  const handleLogout = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <div className={styles.admin}>
      {/* Header */}
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
          <img className={styles.buttonIcon} alt="" />
          <img className={styles.vectorIcon} alt="" onClick={handleLogout} />
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.container}>
          {/* Sidebar */}
          <div className={styles.aside}>
            <b className={styles.dashboardControls}>Dashboard Controls</b>
            <div className={styles.manageTalentsContent}>
              {`Manage talents, content, ratings &`}
              <br/>
              {`reports.`}
            </div>
            <div className={styles.background}>
              <img className={styles.imageborderIcon} alt="Admin Avatar" />
              <b className={styles.adminNayeem}>Admin Nayeem</b>
              <div className={styles.superAdministrator}>Super Administrator</div>
            </div>

            <div className={styles.main2}>Main</div>
            <div className={styles.list}>
              <div 
                className={styles.item} 
                onClick={() => setActiveTab('overview')}
                style={{ cursor: 'pointer', backgroundColor: activeTab === 'overview' ? '#1e293b' : 'transparent' }}
              >
                <b className={styles.b}>📊</b>
                <b className={styles.overview}>Overview</b>
              </div>
              <div className={styles.item2} onClick={() => setActiveTab('videos')} style={{ cursor: 'pointer' }}>
                <div className={styles.b}>🎬</div>
                <div className={styles.videoPortal}>Video Portal</div>
              </div>
              <div className={styles.item3} onClick={() => setActiveTab('audios')} style={{ cursor: 'pointer' }}>
                <div className={styles.b}>🎧</div>
                <div className={styles.videoPortal}>Audio Portal</div>
              </div>
              <div className={styles.item4} onClick={() => setActiveTab('blogs')} style={{ cursor: 'pointer' }}>
                <div className={styles.div3}>✍️</div>
                <div className={styles.blogPortal}>Blog Portal</div>
              </div>
            </div>

            <div className={styles.moderation}>Moderation</div>
            <div className={styles.list2}>
              <div className={styles.item5} onClick={() => setActiveTab('pending')} style={{ cursor: 'pointer' }}>
                <div className={styles.div4}>📝</div>
                <div className={styles.pendingSubmissions}>Pending<br/>Submissions</div>
                <div className={styles.background2}>
                  <b className={styles.b2}>{contentRequests.length}</b>
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
                <div className={styles.ratingLeaderboard}>Rating / Leaderboard<br/>Rules</div>
              </div>
              <div className={styles.item9}>
                <div className={styles.div8}>⚙️</div>
                <div className={styles.platformSettings}>Platform Settings</div>
              </div>
            </div>

            <div className={styles.asideChild} />
            <b className={styles.logout} onClick={handleLogout} style={{ cursor: 'pointer' }}>
              LogOut
            </b>
          </div>

          {/* Main Content */}
          <div className={styles.section}>
            <b className={styles.heading1}>Admin Overview</b>
            <div className={styles.monitorActivityAcross}>
              Monitor activity across Video, Audio, and Blog portals and approve new talents.
            </div>
            <div className={styles.currentSemesterSpringContainer}>
              <span className={styles.currentSemesterSpringContainer2}>
                <span>{`Current semester: `}</span>
                <b className={styles.minAgo}>Spring 2025<br/></b>
                <span>{`Last refreshed: `}</span>
                <b className={styles.minAgo}>2 min ago</b>
              </span>
            </div>

            {/* Stats Cards */}
            <div className={styles.paragraphbackgroundshadow}>
              <div className={styles.activeTalents}>Active Talents</div>
              <b className={styles.b4}>128</b>
              <div className={styles.thisWeek}>+12 this week</div>
              <div className={styles.studentsWhoUploaded}>Students who uploaded at least one entry.</div>
            </div>

            <div className={styles.paragraphbackgroundshadow2}>
              <div className={styles.totalEntries}>Total Entries</div>
              <b className={styles.b5}>342</b>
              <div className={styles.videos182}>Videos: 182 • Audios: 96 • Blogs: 64</div>
            </div>

            <div className={styles.paragraphbackgroundshadow3}>
              <div className={styles.averagePlatformRating}>Average Platform Rating</div>
              <b className={styles.b6}>{`4.7 `}</b>
              <div className={styles.div9}>★★★★★</div>
              <div className={styles.basedOn1842}>Based on 1,842 user ratings.</div>
            </div>

            <div className={styles.paragraphbackgroundshadow4}>
              <div className={styles.itemsNeedingReview}>Items Needing Review</div>
              <b className={styles.b7}>{contentRequests.length}</b>
              <div className={styles.urgentReports}>
                {contentRequests.length > 0 ? `${contentRequests.length} pending` : 'All approved'}
              </div>
              <div className={styles.pendingApprovals}>Pending approvals + reported content.</div>
            </div>
            <div className={styles.backgroundshadow}>
              <div className={styles.pendingContentReviewContainer}>
                <span className={styles.currentSemesterSpringContainer2}>
                  <b>Pending Content Review<br/></b>
                  <span className={styles.approveOrReject}>
                    Approve or reject new submissions before they appear on the platform.
                  </span>
                </span>
              </div>
              <div className={styles.background4}>
                <div className={styles.manualReview}>Manual review</div>
              </div>

              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading pending content...</div>
              ) : contentRequests.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  No pending content requests. All submissions have been reviewed!
                </div>
              ) : (
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
                    {contentRequests.map((content, index) => (
                      <div key={content._id} className={index % 2 === 0 ? styles.row : styles.row2}>
                        <div className={styles.data}>
                          <div className={styles.video}>
                            {content.contentType.charAt(0).toUpperCase() + content.contentType.slice(1)}
                          </div>
                        </div>
                        <div className={content.contentType === 'audio' ? styles.data6 : styles.data2}>
                          <b className={styles.classicalMashup}>{content.title}</b>
                          <div className={styles.eashaelehi44542}>
                            @{content.user.username} • {content.duration ? `${Math.floor(content.duration / 60)}:${String(content.duration % 60).padStart(2, '0')}` : content.description.substring(0, 30) + '...'}
                          </div>
                        </div>
                        <div className={content.contentType === 'audio' ? styles.data7 : styles.data3}>
                          <div className={styles.div10}>★★★★☆</div>
                          <div className={content.contentType === 'audio' ? styles.div13 : styles.div11}>
                            4.5<br/>(0)
                          </div>
                        </div>
                        <div className={content.contentType === 'audio' ? styles.data8 : styles.data0}>
                          0
                        </div>
                        <div className={content.contentType === 'audio' ? styles.data9 : styles.data4}>
                          <div className={content.contentType === 'audio' ? styles.button4 : styles.button}>
                            <div className={styles.preview}>Preview</div>
                          </div>
                          <div className={content.contentType === 'audio' ? styles.button5 : styles.button2}>
                            <div 
                              className={styles.approve}
                              onClick={() => handleApprove(content._id)}
                              style={{ cursor: 'pointer' }}
                            >
                              Approve
                            </div>
                          </div>
                          <div className={content.contentType === 'audio' ? styles.button6 : styles.button3}>
                            <div 
                              className={styles.reject}
                              onClick={() => handleReject(content._id)}
                              style={{ cursor: 'pointer' }}
                            >
                              Reject
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top Talents & Leaderboard */}
            <div className={styles.backgroundshadow2}>
              <div className={styles.topTalentsContainer}>
                <span className={styles.currentSemesterSpringContainer2}>
                  <b>{`Top Talents & Leaderboard Rules`}<br/>{``}</b>
                  <span className={styles.quickViewOf}>Quick view of leading users and how scores are calculated.</span>
                </span>
              </div>
              <div className={styles.background7}>
                <div className={styles.live}>Live</div>
              </div>

              <div className={styles.horizontalborder}>
                <img className={styles.imageIcon} alt="Easha Elehi" />
                <b className={styles.eashaElehi}>Easha Elehi</b>
                <div className={styles.eashaelehi441}>@eashaelehi44 • #1 Overall</div>
                <div className={styles.div18}>★★★★★</div>
                <div className={styles.div19}>4.8</div>
              </div>

              <div className={styles.horizontalborder2}>
                <img className={styles.imageIcon} alt="Arman Hossain" />
                <b className={styles.armanHossain}>Arman Hossain</b>
                <div className={styles.armanbeatsTop}>@armanbeats • Top Audio</div>
                <div className={styles.div18}>★★★★★</div>
                <div className={styles.div21}>4.9</div>
              </div>

              <div className={styles.horizontalborder3}>
                <img className={styles.imageIcon} alt="Nafisa Rahman" />
                <b className={styles.nafisaRahman}>Nafisa Rahman</b>
                <div className={styles.nafisawritesTop}>@nafisaWrites • Top Blogger</div>
                <div className={styles.div18}>★★★★☆</div>
                <div className={styles.div23}>4.7</div>
              </div>

              <div className={styles.youCanTweak}>
                You can tweak these weights to emphasize quality (rating) or reach (views/plays/reads). 
                Changes will recalculate the leaderboard.
              </div>

              <div className={styles.horizontalborder4}>
                <div className={styles.requireLoginTo}>Require login to rate content</div>
                <div className={styles.background8}>
                  <div className={styles.background9} />
                </div>
                <div className={styles.hideItemsBelow}>Hide items below 3★ from homepage</div>
                <div className={styles.background10}>
                  <div className={styles.background11} />
                </div>
                <div className={styles.enableManualApproval}>Enable manual approval for new users</div>
                <div className={styles.background12}>
                  <div className={styles.background9} />
                </div>
                <div className={styles.theseSwitchesAre}>
                  These switches are visual only in the prototype. In the real app, connect them to your backend config.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.developedByVoid}>Developed by VOID</div>
        <div className={styles.copyright2025By}>© Copyright 2025 by VOID. All rights reserved.</div>
        <img className={styles.linkIcon} alt="" />
      </div>
    </div>
  );
};

export default Admin;
