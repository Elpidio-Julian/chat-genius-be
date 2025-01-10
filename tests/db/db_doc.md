# Database Tests Documentation

This document provides a comprehensive overview of the database testing suite. The tests ensure the reliability and correctness of database operations across all services.

## Directory Structure

Located in `tests/db/`, the tests are organized by entity type:

- `db.test.js` - Basic database connectivity tests
- `db.users.test.js` - User service tests
- `db.workspaces.test.js` - Workspace service tests
- `db.workspace_members.test.js` - Workspace membership tests
- `db.messages.test.js` - Message service tests
- `db.message_reactions.test.js` - Message reaction tests (pending implementation)
- `db.channels.test.js` - Channel service tests
- `db.channel_members.test.js` - Channel membership tests (pending implementation)

## Test Setup

### Database Connection Test (`db.test.js`)

The base test file verifies database connectivity and provides basic setup:

```javascript
describe('Database Connection', () => {
  test('can connect to database', async () => {
    // Verifies database connection by executing a simple query
    const result = await db.query('SELECT NOW()');
    expect(result.rows).toBeDefined();
  });
});
```

## Service Tests

### User Tests (`db.users.test.js`)

Tests for user-related database operations. Uses a test user fixture:

```javascript
const testUser = {
  clerk_id: 'test_clerk_123',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: 'https://example.com/avatar.png'
};
```

#### Test Suites

1. `createUserService`
   - Creates new user successfully
   - Handles duplicate clerk_id error
   - Handles duplicate email error

2. `getUserByClerkIdService`
   - Retrieves user by clerk_id
   - Returns null for non-existent clerk_id

3. `getUserByIdService`
   - Retrieves user by database id
   - Returns null for non-existent id

4. `updateUserService`
   - Updates user information successfully
   - Handles non-existent user updates
   - Verifies unchanged fields remain intact

5. `deleteUserService`
   - Deletes user successfully
   - Verifies user is removed from database
   - Handles non-existent user deletion

#### Test Setup

Each test suite includes:
- BeforeEach cleanup to ensure test isolation
- Error case handling
- Validation of returned data structures
- Verification of database state after operations

### Message Tests (`db.messages.test.js`)

Tests for message-related database operations, including thread functionality. Uses a complex test setup with dependencies:

#### Test Setup

```javascript
let testUser;
let testWorkspace;
let testChannel;

beforeAll(async () => {
  // Create test dependencies
  testUser = await createUserService({...});
  testWorkspace = await createWorkspaceService({...});
  testChannel = await createChannelService(testWorkspace.id, {...}, testUser.id);
});

beforeEach(async () => {
  // Clean up messages before each test
  await db.query('DELETE FROM messages WHERE channel_id = $1', [testChannel.id]);
});
```

#### Test Suites

1. `createMessageService`
   - Creates new message successfully
   - Validates message content, user_id, and channel_id
   - Verifies timestamp creation

2. `getChannelMessagesService`
   - Retrieves messages for a channel
   - Returns empty array for channels with no messages
   - Verifies message structure and ordering

3. `updateMessageService`
   - Updates message content successfully
   - Verifies updated_at timestamp
   - Handles non-existent message updates
   - Maintains message relationships

4. `deleteMessageService`
   - Deletes message successfully
   - Verifies message removal from channel
   - Handles non-existent message deletion

5. `getThreadMessagesService`
   - Retrieves thread replies for a parent message
   - Returns empty array for messages with no replies
   - Verifies thread message relationships
   - Maintains proper parent-child relationships

#### API Endpoints Tested

The tests cover the following API endpoints:
```
POST   /api/channels/:channelId/messages
GET    /api/channels/:channelId/messages
PATCH  /api/channels/:channelId/messages/:messageId
DELETE /api/channels/:channelId/messages/:messageId
GET    /api/messages/:messageId/thread
```

#### Test Data Structure

Messages test data includes:
- Regular channel messages
- Thread replies (messages with parent_id)
- Message content validation
- Timestamps (created_at, updated_at)
- User and channel relationships

#### Cleanup

Comprehensive cleanup in `afterAll`:
```javascript
afterAll(async () => {
  await db.query('DELETE FROM messages WHERE channel_id = $1', [testChannel.id]);
  await db.query('DELETE FROM channels WHERE workspace_id = $1', [testWorkspace.id]);
  await db.query('DELETE FROM workspaces WHERE id = $1', [testWorkspace.id]);
  await db.query('DELETE FROM users WHERE id = $1', [testUser.id]);
});
```

### Workspace Tests (`db.workspaces.test.js`)

Tests for workspace-related database operations. Includes helper functions for test data creation and comprehensive test coverage.

#### Helper Functions

```javascript
const createTestWorkspace = async (
  name = "Test Workspace",
  slug = "test-workspace",
  icon_url = "https://example.com/icon.png"
) => {
  return await createWorkspaceService({ name, slug, icon_url });
};
```

#### Test Setup

```javascript
beforeEach(async () => {
  await db.query('DELETE FROM workspaces');
});
```

#### Test Suites

1. `createWorkspaceService`
   - Creates new workspace successfully
   - Validates all workspace fields:
     - name
     - slug
     - icon_url
     - id (UUID)
     - created_at
     - updated_at

2. `getWorkspacesService`
   - Retrieves all workspaces
   - Verifies ordering (created_at DESC)
   - Returns empty array when no workspaces exist
   - Validates workspace data structure

3. `getWorkspaceByIdService`
   - Retrieves workspace by UUID
   - Returns null for non-existent workspace
   - Handles invalid UUID format
   - Validates workspace data integrity

4. `updateWorkspaceService`
   - Updates single workspace field
   - Updates multiple fields simultaneously
   - Maintains unchanged fields
   - Returns null for non-existent workspace
   - Handles invalid UUID format
   - Verifies updated_at timestamp

#### Test Data Validation

Each test validates:
1. Data structure integrity
2. UUID format and handling
3. Timestamp presence and updates
4. Field-level updates
5. Null handling
6. Error conditions

#### Data Cleanup

- Each test runs in isolation due to `beforeEach` cleanup
- Uses proper UUID format for ID fields
- Maintains referential integrity
- Cleans up all test data between tests

### Test Patterns

Common patterns across all test files:

1. **Setup and Teardown**
   ```javascript
   beforeEach(async () => {
     // Clean up test data
     await db.query('DELETE FROM table WHERE condition');
   });
   ```

2. **Service Import Pattern**
   ```javascript
   const {
     serviceOne,
     serviceTwo
   } = require('../../src/db/services/service_name');
   ```

3. **Test Structure**
   ```javascript
   describe('Service Name', () => {
     describe('specific function', () => {
       it('should do something specific', async () => {
         // Arrange
         const testData = {...};
         
         // Act
         const result = await serviceFunction(testData);
         
         // Assert
         expect(result).toMatchExpectedPattern();
       });
     });
   });
   ```

4. **Error Handling Tests**
   ```javascript
   it('should handle error condition', async () => {
     await expect(serviceFunction(invalidData))
       .rejects.toThrow();
   });
   ```

### Test Coverage

Each service test file covers:
1. Successful operations
2. Error conditions
3. Edge cases
4. Data validation
5. Database constraints
6. Relationship integrity

## Running Tests

Tests can be run using the following commands:
- All tests: `npm test`
- Specific test file: `npm test tests/db/db.users.test.js`
- Watch mode: `npm test -- --watch`

## Test Data Management

- Each test suite manages its own test data
- Data is cleaned up before each test
- UUIDs are used for IDs
- Test fixtures are used for consistent data patterns
- Foreign key relationships are properly maintained in test data 