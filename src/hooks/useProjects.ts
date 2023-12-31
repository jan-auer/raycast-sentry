import { useCachedPromise, useCachedState } from "@raycast/utils";
import { Organization, request } from "../api/base";
import { Toast, showToast } from "@raycast/api";
import { Dispatch, SetStateAction } from "react";

export type ProjectUrls = {
  details: string;
  platform: string;
  issues: string;
  alerts: string;
  performance: string;
  releases: string;
  settings: string;
};

export type Team = {
  id: string;
  slug: string;
  name: string;
};

export type Project = {
  id: string;
  slug: string;
  platform: string;
  platforms: string[];
  isBookmarked: boolean;
  isMember: boolean;
  urls: ProjectUrls;
  teams: Team[];
};

function getPlatform(project: Project): string {
  if (project.platform && project.platform != "other") {
    return project.platform;
  }

  return project.platforms.find((p) => p != "other") || project.platform || "other";
}

export function platformUrl(platform: string): string {
  if (platform === "other") {
    platform = "default";
  }

  if (platform === "native" || platform === "c") {
    platform = "cpp";
  }

  return `https://raw.githubusercontent.com/getsentry/platformicons/master/svg_80x80/${platform}.svg`;
}

function projectUrls(organization: Organization, project: Project): ProjectUrls {
  return {
    details: `${organization.url}/projects/${project.slug}/?project=${project.id}`,
    platform: platformUrl(getPlatform(project)),
    issues: `${organization.url}/issues/?project=${project.id}`,
    alerts: `${organization.url}/alerts/rules/?project=${project.id}`,
    performance: `${organization.url}/performance/?project=${project.id}`,
    releases: `${organization.url}/releases/?project=${project.id}`,
    settings: `${organization.url}/settings/projects/${project.slug}/`,
  };
}

export function useProjects(organization: Organization) {
  return useCachedPromise(
    async (orgId: string) => {
      console.debug(`loading projects for organization ${organization.slug} (${orgId})`);
      const response = await request(`organizations/${organization.slug}/projects/`, organization);
      if (!response.ok) {
        throw new Error("Failed to fetch Sentry projects");
      }

      const projects = (await response.json()) as Project[];
      return projects.map((project) => ({
        ...project,
        teams: project.teams.sort((a, b) => a.name.localeCompare(b.name)),
        urls: projectUrls(organization, project),
      }));
    },
    [organization.id]
  );
}

export async function toggleBookmark(organization: Organization, project: Project) {
  const response = await request(`projects/${organization.slug}/${project.slug}/`, organization, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isBookmarked: !project.isBookmarked }),
  });

  if (!response.ok) {
    showToast(Toast.Style.Failure, `Failed to set project star: ${response.status}`);
  }

  showToast(Toast.Style.Success, `Project ${project.slug} ${project.isBookmarked ? "starred" : "unstarred"}`);
}

export function useProject(): [string | null, Dispatch<SetStateAction<string | null>>] {
  return useCachedState<string | null>("project", null);
}
