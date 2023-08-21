import { AsyncState, useCachedPromise, useCachedState } from "@raycast/utils";
import { Organization, request } from "../api/base";

type AvatarType = "upload" | "letter_avatar";

type ApiOrganization = {
  id: string;
  name: string;
  slug: string;
  avatar: {
    avatarType: AvatarType;
    avatarUuid?: string;
  };
  links: {
    organizationUrl: string;
    regionUrl: string;
  };
};

export function useOrganizations(): AsyncState<Organization[]> {
  return useCachedPromise(async () => {
    const response = await request("organizations/");
    if (!response.ok) {
      throw new Error("Failed to fetch Sentry organizations");
    }

    const organizations = (await response.json()) as ApiOrganization[];
    return organizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      url: organization.links.organizationUrl,
    }));
  });
}

export function useOrganization() {
  return useCachedState<Organization | null>("organization", null);
}
