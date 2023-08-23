import { AsyncState, useCachedPromise } from "@raycast/utils";
import { Organization, request } from "../api/base";

export type SavedSearch = {
  id: string;
  type: number;
  name: string;
  query: string;
  sort: string;
  visibility: string;
  isGlobal: boolean;
  isPinned: boolean;
};

export function useSearches(organization: Organization | null): AsyncState<SavedSearch[]> {
  return useCachedPromise(
    async (orgId: string | undefined) => {
      console.debug(`loading saved searches for organization ${organization?.slug} (${orgId})`);
      if (!organization) {
        return [];
      }

      const response = await request(`organizations/${organization.slug}/searches/`);
      if (!response.ok) {
        throw new Error("Failed to fetch Sentry searches");
      }

      const searches = (await response.json()) as SavedSearch[];
      return searches;
    },
    [organization?.id]
  );
}
