import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { Project } from "../hooks/useProjects";

type ProjectProps = {
  project: Project;
  onToggleBookmark: () => void;
};

export default function ProjectItem({ project, onToggleBookmark }: ProjectProps) {
  return (
    <List.Item
      id={project.id}
      title={project.slug}
      icon={{ source: project.urls.platform }}
      accessories={project.isBookmarked ? [{ icon: Icon.Star }] : []}
      actions={
        <ActionPanel>
          <ActionPanel.Section title="Open in Browser">
            <Action.OpenInBrowser title="Open Issues" icon={Icon.Tray} url={project.urls.issues} />
            <Action.OpenInBrowser title="Open Details" icon={Icon.Globe} url={project.urls.details} />
            <Action.OpenInBrowser title="Open Alerts" icon={Icon.Bell} url={project.urls.alerts} />
            <Action.OpenInBrowser title="Open Performance" icon={Icon.Bolt} url={project.urls.performance} />
            <Action.OpenInBrowser title="Open Releases" icon={Icon.Layers} url={project.urls.releases} />
          </ActionPanel.Section>
          <ActionPanel.Section title="Settings">
            <Action.CopyToClipboard title="Copy Client Key (DSN)" content={"TODO"} />
            {project.isBookmarked ? (
              <Action title="Unstar Project" icon={Icon.StarDisabled} onAction={onToggleBookmark} />
            ) : (
              <Action title="Star Project" icon={Icon.Star} onAction={onToggleBookmark} />
            )}
            <Action.OpenInBrowser title="Open Settings" icon={Icon.Cog} url={project.urls.settings} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
