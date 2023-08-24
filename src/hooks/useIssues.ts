import { AsyncState, useCachedPromise } from "@raycast/utils";
import { Organization, request } from "../api/base";
import { URLSearchParams } from "url";

export const MAX_ISSUES = 100;

export type IssueLevel = "error" | "warning" | "info";
export type IssueType = "error" | "default" | "csp" | "transaction" | "hpkp" | "expectct" | "expectstaple";

export type IssueSubstatus =
  | "escalating"
  | "ongoing"
  | "regressed"
  | "new"
  | "archived_until_escalating"
  | "archived_until_condition_met"
  | "archived_forever";

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
  type: IssueType;
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
  count: number;
  userCount: number;
  assignedTo: Assignee | null;
  isUnhandled: boolean;
  substatus: IssueSubstatus;
};

export const QUERY_UNRESOLVED = "is:unresolved";
export const QUERY_REVIEW = "is:unresolved is:for_review assigned_or_suggested:[me, my_teams, none] ";
export const QUERY_REGRESSED = "is:regressed";
export const QUERY_ESCALATING = "is:escalating";

export function useIssues(
  organization: Organization | null,
  query: string,
  projectId?: string | null
): AsyncState<ApiIssue[]> {
  return useCachedPromise(
    async (_, query, projectId: string) => {
      if (!organization) {
        return [];
      }

      console.debug(`loading issues for project ${projectId}`);

      const url =
        `organizations/${organization.slug}/issues/?` +
        new URLSearchParams({
          query: query,
          shortIdLookup: "1",
          statsPeriod: "1h",
          project: projectId,
          sort: "priority",
          limit: MAX_ISSUES.toString(),
        });

      const response = await request(url, organization);
      if (!response.ok) {
        throw new Error("Failed to fetch Sentry issues");
      }

      const issues = (await response.json()) as ApiIssue[];
      return issues.map((issue) => ({
        ...issue,
        count: parseInt(issue.count.toString()),
      }));
    },
    [organization?.id, query, projectId || "-1"]
  );
}
