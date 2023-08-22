import { AsyncState, useCachedPromise } from "@raycast/utils";
import { Organization, request } from "../api/base";

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

export function useIssues(organization: Organization | null): AsyncState<ApiIssue[]> {
  return useCachedPromise(
    async (organization) => {
      if (!organization) {
        return [];
      }

      const response = await request(
        `organizations/${organization.slug}/issues/?query=is%3Aunresolved&shortIdLookup=1`,
        organization
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Sentry issues");
      }

      const issues = (await response.json()) as ApiIssue[];
      return issues;
    },
    [organization]
  );
}
