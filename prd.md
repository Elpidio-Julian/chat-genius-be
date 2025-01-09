# ChatGenius PRD - MVP Specification

## Project Overview
ChatGenius is a real-time team communication platform built with Next.js, Postgres, and Clerk. The MVP focuses on essential messaging features including workspace management, channel-based communication, and thread support, delivering a focused alternative to Slack for small to medium teams.

## User Roles & Core Workflows

**Regular Users**
1. Users sign up/login and join workspaces via email invitation
2. Users send/receive real-time messages in channels and direct messages
3. Users participate in threaded conversations within channels

**Workspace Admins**
1. Admins create and manage channels within their workspace
2. Admins invite and manage team members
3. Admins set basic permissions for channels and members

## Technical Foundation

### Data Models
```sql
-- Core tables only, see previous response for full schema
workspaces
workspace_members
channels
messages
```

### API Endpoints
```javascript
// Workspaces
POST   /api/workspaces
GET    /api/workspaces
GET    /api/workspaces/:id
PATCH  /api/workspaces/:id

// Channels
POST   /api/workspaces/:workspaceId/channels
GET    /api/workspaces/:workspaceId/channels
PATCH  /api/workspaces/:workspaceId/channels/:channelId
DELETE /api/workspaces/:workspaceId/channels/:channelId

// Messages
POST   /api/channels/:channelId/messages
GET    /api/channels/:channelId/messages
PATCH  /api/channels/:channelId/messages/:messageId
DELETE /api/channels/:channelId/messages/:messageId
GET    /api/messages/:messageId/thread

// Members
POST   /api/workspaces/:workspaceId/members
GET    /api/workspaces/:workspaceId/members
DELETE /api/workspaces/:workspaceId/members/:memberId
```

### Key Components
```typescript
// Page Components
pages/
  workspace/[workspaceId]/
    layout.tsx
    page.tsx
    channel/[channelId]/
      page.tsx
      thread/[messageId]/
        page.tsx

// Feature Components
components/
  workspace/
    ChannelList.tsx
    MessageList.tsx
    MessageInput.tsx
    ThreadView.tsx
    MemberList.tsx
    WorkspaceSettings.tsx
```

## MVP Launch Requirements

1. Authentication & Authorization
   - Clerk-based auth with email/password
   - Role-based permissions (admin/member)
   - Workspace invitation system

2. Real-time Communication
   - WebSocket connection for instant messages
   - Message delivery confirmation
   - Typing indicators
   - Online/offline status

3. Channel Management
   - Create public/private channels
   - Basic channel settings (name, description)
   - Channel member management

4. Messaging Features
   - Text message support with markdown
   - Thread creation and navigation
   - Basic message actions (edit, delete)
   - Message persistence and pagination

5. User Experience
   - Responsive design (mobile-first)
   - Real-time updates across all connected clients
   - Basic error handling and loading states
   - Simple onboarding flow

6. Performance Requirements
   - Message load time < 500ms
   - Real-time message delivery < 100ms
   - Support for up to 100 concurrent users per workspace
   - Message history limited to 10k messages per channel for MVP

This PRD focuses on delivering a functional, performant MVP that can be built and launched within a reasonable timeframe while maintaining core functionality expected from a modern chat application.
