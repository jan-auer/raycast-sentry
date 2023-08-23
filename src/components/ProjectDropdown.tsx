import { List } from "@raycast/api";
import { Project, useProjects } from "../hooks/useProjects";
import { Organization } from "../api/base";
import { Dispatch, SetStateAction } from "react";

type ProjectListProps = {
  title: string;
  projects: Project[] | null;
};

function ProjectDropdownSection({ title, projects }: ProjectListProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <List.Dropdown.Section title={title}>
      {projects.map((project) => (
        <List.Dropdown.Item
          key={project.id}
          value={project.id}
          title={project.slug}
          icon={{ source: project.urls.platform }}
        />
      ))}
    </List.Dropdown.Section>
  );
}

type ProjectDropdownProps = {
  organization: Organization | null;
  selected: string | null;
  onSelect?: Dispatch<SetStateAction<string | null>>;
};

export default function ProjectDropdown({ organization, selected, onSelect }: ProjectDropdownProps) {
  const { data, isLoading } = useProjects(organization);
  if (!data || data.length < 2) {
    return null;
  }

  const starred = data?.filter((project) => project.isBookmarked);
  const mine = data?.filter((project) => !project.isBookmarked && project.isMember);
  const other = data?.filter((project) => !project.isBookmarked && !project.isMember);

  return (
    <List.Dropdown tooltip="Select Organization" isLoading={isLoading} value={selected || "-1"} onChange={onSelect}>
      <List.Dropdown.Item value="-1" title="All Projects" />

      {starred && starred.length > 0 ? <ProjectDropdownSection title="Starred" projects={starred} /> : null}
      {mine && mine.length > 0 ? <ProjectDropdownSection title="My Projects" projects={mine} /> : null}
      {other && other.length > 0 ? <ProjectDropdownSection title="Other" projects={other} /> : null}
    </List.Dropdown>
  );
}
