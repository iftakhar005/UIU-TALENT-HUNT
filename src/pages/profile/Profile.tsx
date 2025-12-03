import type { FunctionComponent } from 'react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const ProfilePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onProfileIconClick = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const handleEditProfile = useCallback(() => {
    navigate('/edit-profile');
  }, [navigate]);

  const handleSubmitEntry = useCallback(() => {
    navigate('/submit');
  }, [navigate]);

  const handleNotifications = useCallback(() => {
    navigate('/notifications');
  }, [navigate]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleClosureOutside = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  return (
    <div className={styles.profile} onClick={handleClosureOutside}>
      {/* Header Navigation */}
      <div className={styles.header}>
        <div className={styles.nav}>
          <div 
            className={styles.school}
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            school
          </div>
          <b 
            className={styles.uiuTalentHunt}
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            UIU Talent Hunt
          </b>
          
          <div className={styles.input}>
            <div className={styles.container}>
              <input 
                type="text"
                className={styles.searchInput}
                placeholder="Search entries..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className={styles.searchIcon}>search</div>
            </div>
          </div>

          <div 
            className={styles.button2}
            onClick={handleSubmitEntry}
          >
            <div className={styles.submitEntry}>Submit Entry</div>
          </div>

          <div 
            className={styles.button3}
            onClick={handleNotifications}
          >
            <div className={styles.notifications}>notifications</div>
          </div>

          <img 
            className={styles.buttonIcon}
            alt="Profile Menu"
            onClick={(e) => {
              e.stopPropagation();
              onProfileIconClick();
            }}
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
          />

          <img 
            className={styles.vectorIcon}
            alt="Menu Icon"
            onClick={(e) => {
              e.stopPropagation();
              onProfileIconClick();
            }}
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'/%3E%3C/svg%3E"
          />

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              className={styles.dropdownMenu}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.dropdownItem}>
                My Profile
              </div>
              <div 
                className={styles.dropdownItem}
                onClick={handleEditProfile}
              >
                Edit Profile
              </div>
              <div className={styles.dropdownItem}>
                Settings
              </div>
              <div 
                className={styles.dropdownItem + ' ' + styles.dropdownLogout}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        <div className={styles.section}>
          {/* Stats Cards Row 1 */}
          <div className={styles.paragraphbackground}>
            <div className={styles.videos}>Videos</div>
            <b className={styles.b}>12</b>
            <div className={styles.livePerformances}>3 live<br/>performances</div>
          </div>

          <div className={styles.paragraphbackground2}>
            <div className={styles.audioTracks}>Audio Tracks</div>
            <b className={styles.b2}>8</b>
            <div className={styles.coversPodcasts}>Covers & podcasts</div>
          </div>

          <div className={styles.paragraphbackground3}>
            <div className={styles.blogPosts}>Blog Posts</div>
            <b className={styles.b3}>5</b>
            <div className={styles.musicTech}>Music & tech<br/>stories</div>
          </div>

          <div className={styles.paragraphbackground4}>
            <div className={styles.totalEngagement}>Total Engagement</div>
            <b className={styles.k}>18.4K</b>
            <div className={styles.viewsListens}>views • listens •<br/>reads</div>
          </div>

          <div className={styles.paragraphbackground5}>
            <div className={styles.averageRating}>Average Rating</div>
            <b className={styles.b4}>4.8</b>
            <div className={styles.div}>★★★★★</div>
            <div className={styles.ratings}>326 ratings</div>
          </div>

          {/* Highlights Section */}
          <b className={styles.highlights}>Highlights</b>

          {/* Article Cards */}
          <div className={styles.article}>
            <img 
              className={styles.imageIcon} 
              alt="Classical Mashup"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect fill='%23ff8a3c' width='400' height='240'/%3E%3Ctext x='200' y='120' text-anchor='middle' fill='white' font-size='32' font-weight='bold'%3EVideo Performance%3C/text%3E%3C/svg%3E"
            />
            <div className={styles.videoPerformance}>Video • Performance</div>
            <b className={styles.classicalMashup}>Classical Mashup – UIU<br/>Cultural Night</b>
            <div className={styles.kViews}>7.3K views • 5:42</div>
            <div className={styles.div2}>★★★★☆</div>
            <div className={styles.div3}>4.7</div>
            <div className={styles.singingLiveTalentShow}>#singing #live #talent-show</div>
          </div>

          <div className={styles.article2}>
            <img 
              className={styles.imageIcon} 
              alt="Acoustic Chill"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect fill='%2310b981' width='400' height='240'/%3E%3Ctext x='200' y='120' text-anchor='middle' fill='white' font-size='32' font-weight='bold'%3EAudio Cover%3C/text%3E%3C/svg%3E"
            />
            <div className={styles.audioCover}>Audio • Cover</div>
            <b className={styles.acousticChill}>Acoustic Chill – Study<br/>Session Playlist</b>
            <div className={styles.kPlays}>3.1K plays • 18:20</div>
            <div className={styles.div4}>★★★★★</div>
            <div className={styles.div5}>4.9</div>
            <div className={styles.audioCoverSpotifyStyle}>#audio #cover #spotify-style</div>
          </div>

          <div className={styles.article3}>
            <img 
              className={styles.imageIcon} 
              alt="How UIU Open Mic"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect fill='%233b82f6' width='400' height='240'/%3E%3Ctext x='200' y='120' text-anchor='middle' fill='white' font-size='32' font-weight='bold'%3EBlog Story%3C/text%3E%3C/svg%3E"
            />
            <div className={styles.blogStory}>Blog • Story</div>
            <b className={styles.howUiuOpen}>How UIU Open Mic Changed<br/>My Confidence</b>
            <div className={styles.kReads}>1.2K reads</div>
            <div className={styles.div4}>★★★★☆</div>
            <div className={styles.div7}>4.6</div>
            <div className={styles.blogMotivationStudentLife}>#blog #motivation #student-life</div>
          </div>

          <div className={styles.article4}>
            <img 
              className={styles.imageIcon} 
              alt="Recording Studio Setup"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect fill='%238b5cf6' width='400' height='240'/%3E%3Ctext x='200' y='120' text-anchor='middle' fill='white' font-size='32' font-weight='bold'%3EVideo Tutorial%3C/text%3E%3C/svg%3E"
            />
            <div className={styles.videoTutorial}>Video • Tutorial</div>
            <b className={styles.recordingStudioSetup}>Recording Studio Setup on<br/>a Student Budget</b>
            <div className={styles.kViews2}>2.8K views • 9:10</div>
            <div className={styles.div2}>★★★★☆</div>
            <div className={styles.div7}>4.5</div>
            <div className={styles.tutorialAudioStudio}>#tutorial #audio #studio</div>
          </div>

          {/* Profile Card */}
          <div className={styles.background}>
            <div className={styles.gradient} />
            <img 
              className={styles.imagebordershadowIcon} 
              alt="Profile Avatar"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FF6B6B;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23FFD93D;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='60' cy='60' r='58' fill='url(%23grad1)'/%3E%3Ccircle cx='60' cy='40' r='20' fill='white'/%3E%3Cpath d='M 60 60 Q 35 75 30 100 L 90 100 Q 85 75 60 60 Z' fill='white'/%3E%3C/svg%3E"
            />
            <b className={styles.eashaElahi}>Easha Elahi</b>
            <div className={styles.eashaelehi44}>@eashaelehi44</div>
            <div className={styles.departmentOfCse}>Department of CSE, UIU • Member, UIU Cultural Club</div>
            <div 
              className={styles.button}
              onClick={handleEditProfile}
            >
              <div className={styles.editProfile}>Edit profile</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.horizontalborder}>
            <b 
              className={styles.overview}
            >
              Overview
            </b>
            <div className={styles.gradient2} />
            <div 
              className={styles.videos2}
            >
              Videos
            </div>
            <div 
              className={styles.audios}
            >
              Audios
            </div>
            <div 
              className={styles.blogs}
            >
              Blogs
            </div>
            <div 
              className={styles.about}
            >
              About
            </div>
          </div>
        </div>

        {/* Sidebar - Talent Summary */}
        <div className={styles.aside}>
          <div className={styles.talentSummaryRatingsContainer}>
            <span className={styles.talentSummaryRatingsContainer2}>
              <b>Talent Summary<br/></b>
              <span className={styles.ratingsLeaderboard}>Ratings & leaderboard based on all three<br/>portals.</span>
            </span>
          </div>

          <div className={styles.paragraphbackground6}>
            <div className={styles.div10}>🏆</div>
            <div className={styles.overallInUiu}>#3 Overall in<br/>UIU</div>
          </div>

          <div className={styles.background2}>
            <div className={styles.div11}>🎤</div>
          </div>
          <div className={styles.top1In}>Top 1 in Singing / Music</div>
          <div className={styles.smallHighestRated}>Highest-rated vocal performances this semester.</div>

          <div className={styles.background3}>
            <div className={styles.div11}>🎧</div>
          </div>
          <div className={styles.featuredOnAudio}>Featured on Audio Spotlight</div>
          <div className={styles.small2}>2 tracks highlighted on the home audio feed.</div>

          <div className={styles.background4}>
            <div className={styles.div13}>✍️</div>
          </div>
          <div className={styles.storytellerBadge}>Storyteller Badge</div>
          <div className={styles.smallAwarded}>Awarded for blogs with 500+ reads and 4.5★ rating.</div>

          {/* Leaderboard Table */}
          <b className={styles.leaderboardSnapshot}>Leaderboard Snapshot</b>
          <div className={styles.table}>
            <div className={styles.headerRow}>
              <div className={styles.cell}>
                <div className={styles.rank}>Rank</div>
              </div>
              <div className={styles.cell2}>
                <div className={styles.category}>Category</div>
              </div>
              <div className={styles.cell3}>
                <div className={styles.avgRating}>Avg. Rating</div>
              </div>
              <div className={styles.cell4}>
                <div className={styles.entries}>Entries</div>
              </div>
            </div>

            <div className={styles.body}>
              <div className={styles.row}>
                <b className={styles.data1}>#1</b>
                <div className={styles.data}>
                  <div className={styles.video}>Video</div>
                </div>
                <div className={styles.data49}>4.9</div>
                <div className={styles.data12}>12</div>
              </div>

              <div className={styles.row2}>
                <div className={styles.data2}>
                  <b className={styles.b5}>#4</b>
                </div>
                <div className={styles.data3}>
                  <div className={styles.background5}>
                    <div className={styles.audio}>Audio</div>
                  </div>
                </div>
                <div className={styles.data4}>
                  <div className={styles.div14}>4.7</div>
                </div>
                <div className={styles.data5}>
                  <div className={styles.div15}>8</div>
                </div>
              </div>

              <div className={styles.row3}>
                <b className={styles.data1}>#6</b>
                <div className={styles.data7}>
                  <div className={styles.blog}>Blog</div>
                </div>
                <div className={styles.data45}>4.5</div>
                <div className={styles.data52}>5</div>
              </div>
            </div>
          </div>

          <b className={styles.aboutThisTalent}>About this Talent</b>
          <div className={styles.passionateAboutMusic}>
            Passionate about music, storytelling, and tech. Uses the UIU Talent Showcase to share 
            live performances, acoustic covers, and reflective blogs about student life. Open to 
            collaboration on video projects, podcasts, and cultural events.
          </div>
        </div>

        {/* Logout Button */}
        <div className={styles.mainChild} />
        <b 
          className={styles.logout}
          onClick={handleLogout}
        >
          LogOut
        </b>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.developedByVoid}>Developed by VOID</div>
        <div className={styles.copyright2025By}>© Copyright 2025 by VOID. All rights reserved.</div>
        <img 
          className={styles.linkIcon} 
          alt="Social Links"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='20' fill='%23374151'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-size='20' font-weight='bold'%3E🌐%3C/text%3E%3C/svg%3E"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
