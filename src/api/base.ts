import { getPreferenceValues } from "@raycast/api";
import fetch, { Response } from "node-fetch";

function getAuthToken(): string {
  const { authToken }: ExtensionPreferences = getPreferenceValues();
  return authToken;
}

function getAuthParams() {
  return {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  };
}

export type Organization = {
  id: string;
  name: string;
  slug: string;
  url: string;
};

export function request(path: string, organization?: Organization): Promise<Response> {
  const url = organization
    ? `${organization.url}/api/0/organizations/${organization.slug}/${path}`
    : `https://sentry.io/api/0/${path}`;
  return fetch(url, getAuthParams());
}
