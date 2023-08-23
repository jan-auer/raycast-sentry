import { AsyncState, useCachedPromise } from "@raycast/utils";
import { Organization, request } from "../api/base";
import { URLSearchParams } from "url";

export type IssueLevel = "error" | "warning" | "info";

export type Assignee = {
  type: "user" | "team";
  id: string;
  name: string;
  email?: string;
};

export type ApiIssue = {
  id: string;
  shortId: string;
  title: string;
  culprit: string;
  permalink: string;
  level: IssueLevel;
  project: {
    id: string;
    name: string;
    slug: string;
    platform: string;
  };
  metadata: {
    value: string;
    type: string;
    filename: string;
    function: string;
  };
  assignedTo: Assignee | null;
};

export function useIssues(organization: Organization | null, projectId?: string | null): AsyncState<ApiIssue[]> {
  return useCachedPromise(
    async (_, projectId: string) => {
      if (!organization) {
        return [];
      }

      console.debug(`loading issues for project ${projectId}`);

      const url =
        `organizations/${organization.slug}/issues/?` +
        new URLSearchParams({
          query: "is:unresolved",
          shortIdLookup: "1",
          project: projectId,
        });

      const response = await request(url, organization);
      if (!response.ok) {
        throw new Error("Failed to fetch Sentry issues");
      }

      const issues = (await response.json()) as ApiIssue[];
      return issues;
    },
    [organization?.id, projectId || "-1"]
  );
}
