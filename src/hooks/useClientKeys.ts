import { useCachedPromise } from "@raycast/utils";
import { Organization, request } from "../api/base";
import { Project } from "./useProjects";

export type ClientKey = {
  id: string;
  name: string;
  projectId: string;
  public: string;
  secret: string;
  isActive: boolean;
  dsn: {
    secret: string;
    public: string;
    csp: string;
    security: string;
    minidump: string;
    unreal: string;
    cdn: string;
  };
};

export async function loadClientKeys(organization: Organization, project: Project) {
  const response = await request(`projects/${organization.slug}/${project.slug}/keys/`, organization);
  if (!response.ok) {
    throw new Error("Failed to fetch Sentry client keys");
  }

  return (await response.json()) as ClientKey[];
}

export function useClientKeys(organization: Organization, project: Project) {
  useCachedPromise(
    async (orgId, projectId) => {
      console.log(`loading client keys for ${orgId}/${projectId}`);
      return loadClientKeys(organization, project);
    },
    [organization.id, project.id]
  );
}
