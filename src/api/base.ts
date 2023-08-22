import { getPreferenceValues } from "@raycast/api";
import fetch, { RequestInit, Response } from "node-fetch";

function getAuthToken(): string {
  const { authToken }: ExtensionPreferences = getPreferenceValues();
  return authToken;
}

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${getAuthToken()}`,
  };
}

export type Organization = {
  id: string;
  name: string;
  slug: string;
  url: string;
  avatar?: string;
};

export function request(path: string, organization?: Organization, params: RequestInit = {}): Promise<Response> {
  const url = organization ? `${organization.url}/api/0/${path}` : `https://sentry.io/api/0/${path}`;
  const init = { ...params, headers: { ...params.headers, ...getAuthHeaders() } };
  return fetch(url, init);
}
