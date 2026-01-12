# Admin Dashboard - UIU Talent Hunt

## Overview
The Admin Dashboard allows administrators to manage all content submissions on the UIU Talent Hunt platform. Admins can review pending submissions, approve or reject content, and monitor platform activity.

## Features

### 1. **Content Management**
- **View Pending Submissions**: Browse all pending video, audio, and blog submissions
- **Approve Content**: Accept submissions and publish them to the platform
- **Reject Content**: Decline submissions with optional feedback/reason
- **Filter by Type**: View submissions filtered by content type (video, audio, blog)

### 2. **Dashboard Overview**
- **Active Talents**: Count of users who have submitted at least one entry
- **Total Entries**: Breakdown of videos, audios, and blogs
- **Average Platform Rating**: Overall rating across all approved content
- **Items Needing Review**: Count of pending submissions

### 3. **Top Talents & Leaderboard**
- View top performers across different content types
- Display leading creators by views/plays/reads

### 4. **Moderation Features**
- Pending Submissions counter
- Reported Content tracking
- User Management
- Rating/Leaderboard Rules
- Platform Settings

## Usage

### Accessing the Admin Dashboard
1. Navigate to `/admin` in the application
2. Must be logged in with admin privileges
3. Dashboard displays overview and pending submissions

### Approving Content
1. Review the submission details
2. Click the **Approve** button
3. Content will be published to the platform
4. Submission will be removed from pending list

### Rejecting Content
1. Click the **Reject** button
2. A prompt will ask for rejection reason
3. Enter feedback for the content creator
4. Content will be moved to rejected status

### Viewing Content Details
- **Title**: Content submission title
- **Creator**: Username and submission time
- **Duration/Description**: Length of video/audio or blog description snippet
- **Rating**: Average user rating (initial rating)
- **Flags**: Number of content violations or flags
- **Status**: Current status (pending, approved, rejected)

## API Endpoints (Backend)

### Get Pending Submissions
```
GET /api/admin/content/pending
```
Query Parameters:
- `contentType`: Filter by 'video', 'audio', or 'blog'
- `page`: Page number for pagination (default: 1)
- `limit`: Items per page (default: 20)

### Get All Submissions
```
GET /api/admin/content/all
```
Query Parameters:
- `status`: Filter by 'pending', 'approved', or 'rejected'
- `contentType`: Filter by content type
- `page`: Page number
- `limit`: Items per page

### Approve Content
```
POST /api/admin/content/approve/:id
```
Creates the content in the appropriate collection (Video, Audio, or Blog) and updates the ContentRequest status to 'approved'.

### Reject Content
```
POST /api/admin/content/reject/:id
```
Body:
```json
{
  "reason": "Rejection reason text"
}
```
Updates the ContentRequest status to 'rejected' with reason.

### Get Dashboard Stats
```
GET /api/admin/stats
```
Returns overview statistics for the dashboard.

## Data Structure

### ContentRequest Schema
```typescript
{
  _id: string;
  contentType: 'video' | 'audio' | 'blog';
  title: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  duration?: number; // seconds
  description: string;
  category: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
}
```

## Authentication & Authorization
- Admin access requires authentication token
- Only users with `admin` role can access the dashboard
- All requests must include valid authentication headers

## Files

### Frontend
- [Admin Component](./src/pages/Admin.tsx)
- [Admin Styles](./src/styles/Admin.module.css)

### Backend
- [Admin Routes](./src/routes/admin.js)
- [Admin Controller](./src/controllers/adminController.js)
- [ContentRequest Model](./src/models/ContentRequest.js)

## Future Enhancements
- [ ] Bulk approve/reject functionality
- [ ] Advanced filtering and search
- [ ] Admin notes for content review
- [ ] Content preview modals
- [ ] User management interface
- [ ] Report management system
- [ ] Analytics and insights dashboard
- [ ] Audit log for all admin actions
