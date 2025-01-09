require("dotenv").config();
const db = require('../../src/db');
const {
  createWorkspaceService,
  getWorkspacesService,
  getWorkspaceByIdService,
  updateWorkspaceService
} = require("../../src/db/services/workspaces");

// Helper function to create a test workspace
const createTestWorkspace = async (name = "Test Workspace", slug = "test-workspace", icon_url = "https://example.com/icon.png") => {
  return await createWorkspaceService({ name, slug, icon_url });
};

describe("DB Workspaces", () => {
  // Clear the workspaces table before each test
  beforeEach(async () => {
    await db.query('DELETE  FROM workspaces');
  });

  describe("createWorkspaceService", () => {
    it("Creates and returns a new workspace", async () => {
      const workspaceData = {
        name: "My Workspace",
        slug: "my-workspace",
        icon_url: "https://example.com/icon.png"
      };

      const createdWorkspace = await createWorkspaceService(workspaceData);

      expect(createdWorkspace.name).toBe(workspaceData.name);
      expect(createdWorkspace.slug).toBe(workspaceData.slug);
      expect(createdWorkspace.icon_url).toBe(workspaceData.icon_url);
      expect(createdWorkspace.id).toBeDefined();
      expect(createdWorkspace.created_at).toBeDefined();
      expect(createdWorkspace.updated_at).toBeDefined();
    });
  });

  describe("getWorkspacesService", () => {
    it("Returns an array of all workspaces", async () => {
      // Create multiple test workspaces
      const workspace1 = await createTestWorkspace("Workspace 1", "workspace-1");
      const workspace2 = await createTestWorkspace("Workspace 2", "workspace-2");

      const workspaces = await getWorkspacesService();

      expect(Array.isArray(workspaces)).toBe(true);
      expect(workspaces.length).toBe(2);
      expect(workspaces[0].name).toBe(workspace2.name); // Should be ordered by created_at DESC
      expect(workspaces[1].name).toBe(workspace1.name);
    });

    it("Returns empty array when no workspaces exist", async () => {
      const workspaces = await getWorkspacesService();
      expect(workspaces).toEqual([]);
    });
  });

  describe("getWorkspaceByIdService", () => {
    it("Returns a workspace by its ID", async () => {
      const testWorkspace = await createTestWorkspace();
      const foundWorkspace = await getWorkspaceByIdService(testWorkspace.id);

      expect(foundWorkspace.id).toBe(testWorkspace.id);
      expect(foundWorkspace.name).toBe(testWorkspace.name);
      expect(foundWorkspace.slug).toBe(testWorkspace.slug);
      expect(foundWorkspace.icon_url).toBe(testWorkspace.icon_url);
    });

    it("Returns null for non-existent workspace ID", async () => {
      const nonExistentId = "123e4567-e89b-12d3-a456-426614174000"; // Valid UUID that doesn't exist
      const foundWorkspace = await getWorkspaceByIdService(nonExistentId);
      expect(foundWorkspace).toBeNull();
    });

    it("Returns null for invalid UUID format", async () => {
      const foundWorkspace = await getWorkspaceByIdService("999");
      expect(foundWorkspace).toBeNull();
    });
  });

  describe("updateWorkspaceService", () => {
    it("Updates workspace name and returns updated workspace", async () => {
      const testWorkspace = await createTestWorkspace();
      const updatedWorkspace = await updateWorkspaceService(testWorkspace.id, {
        name: "Updated Workspace",
        slug: null,
        icon_url: null
      });

      expect(updatedWorkspace.id).toBe(testWorkspace.id);
      expect(updatedWorkspace.name).toBe("Updated Workspace");
      expect(updatedWorkspace.slug).toBe(testWorkspace.slug);
      expect(updatedWorkspace.icon_url).toBe(testWorkspace.icon_url);
    });

    it("Updates multiple fields simultaneously", async () => {
      const testWorkspace = await createTestWorkspace();
      const updates = {
        name: "New Name",
        slug: "new-slug",
        icon_url: "https://example.com/new-icon.png"
      };

      const updatedWorkspace = await updateWorkspaceService(testWorkspace.id, updates);

      expect(updatedWorkspace.id).toBe(testWorkspace.id);
      expect(updatedWorkspace.name).toBe(updates.name);
      expect(updatedWorkspace.slug).toBe(updates.slug);
      expect(updatedWorkspace.icon_url).toBe(updates.icon_url);
    });

    it("Returns null when updating non-existent workspace", async () => {
      const nonExistentId = "123e4567-e89b-12d3-a456-426614174000"; // Valid UUID that doesn't exist
      const result = await updateWorkspaceService(nonExistentId, {
        name: "New Name"
      });
      expect(result).toBeNull();
    });

    it("Returns null for invalid UUID format", async () => {
      const result = await updateWorkspaceService("999", {
        name: "New Name"
      });
      expect(result).toBeNull();
    });
  });
});
