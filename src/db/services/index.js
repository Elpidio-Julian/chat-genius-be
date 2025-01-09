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
  updateWorkspaceService
};
