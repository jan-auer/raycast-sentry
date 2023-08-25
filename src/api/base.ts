import { getPreferenceValues } from "@raycast/api";
import fetch, { RequestInit, Response } from "node-fetch";
import { URLSearchParams } from "url";

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

export function formatUrl(
  path: string,
  organization: Organization | null = null,
  query: { [key: string]: string } = {},
  web = false
) {
  const host = organization ? organization.url : "https://sentry.io";
  const url = web ? `${host}/${path}` : `${host}/api/0/${path}`;
  return query && Object.keys(query).length ? url + "?" + new URLSearchParams(query) : url;
}

export function request(path: string, organization?: Organization, params: RequestInit = {}): Promise<Response> {
  const url = formatUrl(path, organization);
  const init = { ...params, headers: { ...params.headers, ...getAuthHeaders() } };
  return fetch(url, init);
}
1;
