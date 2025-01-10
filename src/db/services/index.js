const {
  createChannelService,
  getChannelsService,
  updateChannelService,
  deleteChannelService
} = require('./channels');

const {
  createWorkspaceService,
  getWorkspacesService,
  getWorkspaceByIdService,
  updateWorkspaceService
} = require('./workspaces');

const {
  createUserService,
  getUserByClerkIdService,
  getUserByIdService,
  updateUserService,
  deleteUserService
} = require('./users');

const {
  createMessageService,
  getChannelMessagesService,
  updateMessageService,
  deleteMessageService,
  getThreadMessagesService
} = require('./messages');

const {
  createWorkspaceMemberService,
  getWorkspaceMembersService,
  updateWorkspaceMemberRoleService,
  deleteWorkspaceMemberService
} = require('./workspace_members');

const {
  createMessageReactionService,
  getMessageReactionsService,
  deleteMessageReactionService,
  toggleMessageReactionService
} = require('./message_reactions');

const {
  createChannelMemberService,
  getChannelMembersService,
  isChannelMemberService,
  deleteChannelMemberService
} = require('./channel_members');

module.exports = {
  // Channel services
  createChannelService,
  getChannelsService,
  updateChannelService,
  deleteChannelService,

  // Workspace services  
  createWorkspaceService,
  getWorkspacesService,
  getWorkspaceByIdService,
  updateWorkspaceService,

  // User services
  createUserService,
  getUserByClerkIdService,
  getUserByIdService,
  updateUserService,
  deleteUserService,

  // Message services
  createMessageService,
  getChannelMessagesService,
  updateMessageService,
  deleteMessageService,
  getThreadMessagesService,

  // Workspace member services
  createWorkspaceMemberService,
  getWorkspaceMembersService,
  updateWorkspaceMemberRoleService,
  deleteWorkspaceMemberService,

  // Message reaction services
  createMessageReactionService,
  getMessageReactionsService,
  deleteMessageReactionService,
  toggleMessageReactionService,

  // Channel member services
  createChannelMemberService,
  getChannelMembersService,
  isChannelMemberService,
  deleteChannelMemberService
};
