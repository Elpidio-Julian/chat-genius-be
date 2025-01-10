# Database Services Documentation

This document provides a comprehensive overview of the database services layer in the application. The services layer acts as an abstraction between the database and the application logic, providing clean and reusable methods for database operations.

## Directory Structure

Located in `src/db/services/`, the services are organized by entity type:

- `channels.js` - Channel management operations
- `channel_members.js` - Channel membership operations (pending implementation)
- `messages.js` - Message handling operations
- `message_reactions.js` - Message reaction operations (pending implementation)
- `users.js` - User management operations
- `workspaces.js` - Workspace management operations
- `workspace_members.js` - Workspace membership operations
- `index.js` - Service aggregation and exports

## Service Aggregation

The `index.js` file serves as the central point for exporting all database services. It imports individual services from their respective files and re-exports them in a organized manner. This allows other parts of the application to import services from a single location:

```javascript
const services = require('./db/services');
```

Services are grouped by entity type in the exports:

- Channel Services
  - `createChannelService`
  - `getChannelsService`
  - `updateChannelService`
  - `deleteChannelService`

- Workspace Services
  - `createWorkspaceService`
  - `getWorkspacesService`
  - `getWorkspaceByIdService`
  - `updateWorkspaceService`

- User Services
  - `createUserService`
  - `getUserByClerkIdService`
  - `getUserByIdService`
  - `updateUserService`
  - `deleteUserService`

- Message Services
  - `createMessageService`
  - `getChannelMessagesService`
  - `updateMessageService`
  - `deleteMessageService`
  - `getThreadMessagesService`

- Workspace Member Services
  - `createWorkspaceMemberService`
  - `getWorkspaceMembersService`
  - `updateWorkspaceMemberRoleService`
  - `deleteWorkspaceMemberService`

## Service Details

### Users Service (`users.js`)

The users service handles all user-related database operations. It interfaces with the `users` table and provides the following operations:

#### Functions

1. `createUserService({ clerk_id, email, full_name, avatar_url })`
   - Creates a new user in the database
   - Parameters:
     - `clerk_id`: Unique identifier from Clerk authentication
     - `email`: User's email address
     - `full_name`: User's full name
     - `avatar_url`: URL to user's avatar image
   - Returns: Created user object

2. `getUserByClerkIdService(clerkId)`
   - Retrieves a user by their Clerk ID
   - Parameters:
     - `clerkId`: Clerk authentication identifier
   - Returns: User object or null if not found

3. `getUserByIdService(userId)`
   - Retrieves a user by their database ID
   - Parameters:
     - `userId`: Database user ID
   - Returns: User object or null if not found

4. `updateUserService(userId, { full_name, avatar_url })`
   - Updates user information
   - Parameters:
     - `userId`: Database user ID
     - `full_name`: (Optional) New full name
     - `avatar_url`: (Optional) New avatar URL
   - Returns: Updated user object or null if not found

5. `deleteUserService(userId)`
   - Deletes a user from the database
   - Parameters:
     - `userId`: Database user ID
   - Returns: Deleted user object or null if not found

### Workspaces Service (`workspaces.js`)

The workspaces service manages workspace-related database operations. It provides functionality for creating and managing workspaces.

#### Functions

1. `createWorkspaceService({ name, slug, icon_url })`
   - Creates a new workspace
   - Parameters:
     - `name`: Workspace name
     - `slug`: URL-friendly workspace identifier
     - `icon_url`: URL to workspace icon
   - Returns: Created workspace object

2. `getWorkspacesService()`
   - Retrieves all workspaces
   - Returns: Array of workspace objects ordered by creation date

3. `getWorkspaceByIdService(id)`
   - Retrieves a specific workspace by ID
   - Parameters:
     - `id`: Workspace UUID
   - Returns: Workspace object or null if not found
   - Includes UUID validation

4. `updateWorkspaceService(id, { name, slug, icon_url })`
   - Updates workspace information
   - Parameters:
     - `id`: Workspace UUID
     - `name`: (Optional) New workspace name
     - `slug`: (Optional) New workspace slug
     - `icon_url`: (Optional) New icon URL
   - Returns: Updated workspace object or null if not found

#### Helper Functions

- `isValidUUID(uuid)`: Validates UUID format using regex pattern

### Messages Service (`messages.js`)

The messages service handles all message-related operations, including thread management. It provides functionality for creating, retrieving, updating, and deleting messages.

#### Functions

1. `createMessageService({ content, user_id, channel_id, parent_id })`
   - Creates a new message
   - Parameters:
     - `content`: Message content
     - `user_id`: ID of the user creating the message
     - `channel_id`: ID of the channel where the message is posted
     - `parent_id`: (Optional) ID of the parent message if this is a thread reply
   - Returns: Created message object

2. `getChannelMessagesService(channelId)`
   - Retrieves all top-level messages in a channel
   - Parameters:
     - `channelId`: ID of the channel
   - Returns: Array of message objects ordered by creation date
   - Note: Only returns messages with no parent (not thread replies)

3. `updateMessageService(messageId, { content })`
   - Updates message content
   - Parameters:
     - `messageId`: UUID of the message to update
     - `content`: New message content
   - Returns: Updated message object or null if not found

4. `deleteMessageService(messageId)`
   - Deletes a message
   - Parameters:
     - `messageId`: UUID of the message to delete
   - Returns: Deleted message object or null if not found

5. `getThreadMessagesService(parentMessageId)`
   - Retrieves all replies in a message thread
   - Parameters:
     - `parentMessageId`: UUID of the parent message
   - Returns: Array of message objects ordered by creation date

### Channels Service (`channels.js`)

The channels service manages channel-related operations within workspaces. It provides functionality for creating and managing channels.

#### Functions

1. `createChannelService(workspaceId, { name, description }, userId)`
   - Creates a new channel in a workspace
   - Parameters:
     - `workspaceId`: ID of the workspace
     - `name`: Channel name
     - `description`: Channel description
     - `userId`: ID of the user creating the channel
   - Returns: Created channel object

2. `getChannelsService(workspaceId)`
   - Retrieves all channels in a workspace
   - Parameters:
     - `workspaceId`: ID of the workspace
   - Returns: Array of channel objects ordered by creation date

3. `updateChannelService(channelId, { name, description })`
   - Updates channel information
   - Parameters:
     - `channelId`: ID of the channel
     - `name`: New channel name
     - `description`: New channel description
   - Returns: Updated channel object or null if not found

4. `deleteChannelService(channelId)`
   - Deletes a channel
   - Parameters:
     - `channelId`: ID of the channel to delete
   - Returns: Deleted channel object or null if not found

### Workspace Members Service (`workspace_members.js`)

The workspace members service manages membership-related operations within workspaces. It provides functionality for managing workspace members and their roles.

#### Functions

1. `createWorkspaceMemberService(workspaceId, id, role)`
   - Creates a new workspace member (invite)
   - Parameters:
     - `workspaceId`: ID of the workspace
     - `id`: ID of the user to add
     - `role`: Role to assign to the user
   - Returns: Created workspace member object

2. `getWorkspaceMembersService(workspaceId)`
   - Retrieves all members in a workspace
   - Parameters:
     - `workspaceId`: ID of the workspace
   - Returns: Array of workspace member objects ordered by creation date

3. `updateWorkspaceMemberRoleService(memberId, role)`
   - Updates a workspace member's role
   - Parameters:
     - `memberId`: ID of the workspace member
     - `role`: New role to assign
   - Returns: Updated workspace member object or null if not found

4. `deleteWorkspaceMemberService(memberId)`
   - Removes a member from a workspace
   - Parameters:
     - `memberId`: ID of the workspace member to remove
   - Returns: Deleted workspace member object or null if not found

### Channel Members Service (`channel_members.js`)

This service is currently pending implementation. It is expected to handle operations related to channel membership, including:
- Adding members to channels
- Removing members from channels
- Managing member permissions within channels
- Retrieving channel member lists

### Message Reactions Service (`message_reactions.js`)

This service is currently pending implementation. It is expected to handle operations related to message reactions, including:
- Adding reactions to messages
- Removing reactions from messages
- Retrieving reactions for messages
- Managing reaction types and counts 