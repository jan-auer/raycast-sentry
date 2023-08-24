import { AsyncState, useCachedPromise, useCachedState } from "@raycast/utils";
import { Organization, request } from "../api/base";
import { Dispatch, SetStateAction } from "react";

type AvatarType = "upload" | "letter_avatar";

type Avatar = {
  avatarType: AvatarType;
  avatarUuid?: string;
};

type ApiOrganization = {
  id: string;
  name: string;
  slug: string;
  avatar: Avatar;
  links: {
    organizationUrl: string;
    regionUrl: string;
  };
};

export function useOrganizations(): AsyncState<Organization[]> {
  return useCachedPromise(async () => {
    console.debug("Loading organizations");

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
      avatar:
        organization.avatar.avatarType === "upload"
          ? `${organization.links.organizationUrl}/organization-avatar/${organization.avatar.avatarUuid}/`
          : undefined,
    }));
  });
}

export function useOrganization(): [Organization | null, Dispatch<SetStateAction<Organization | null>>] {
  return useCachedState<Organization | null>("organization10", null);
}
