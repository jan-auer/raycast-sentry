import { List } from "@raycast/api";
import { Project, toggleBookmark, useProjects } from "./hooks/useProjects";
import ProjectItem from "./components/ProjectItem";
import OrganizationDropdown from "./components/OrganizationDropdown";
import WithOrganization, { OrganizationProps } from "./components/WithOrganization";
import { Organization } from "./api/base";

type ProjectListProps = {
  organization: Organization;
  projects: Project[] | undefined;
  title: string;
  onToggleBookmark: (projectId: string) => void;
};

function ProjectListSection({ organization, projects, title, onToggleBookmark }: ProjectListProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <List.Section title={title}>
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          organization={organization}
          project={project}
          onToggleBookmark={() => onToggleBookmark(project.id)}
        />
      ))}
    </List.Section>
  );
}

function ProjectsCommand({ organization }: OrganizationProps) {
  const { data, isLoading, mutate } = useProjects(organization);

  async function toggle(projectId: string) {
    const project = data?.find((p) => p.id === projectId);

    if (project) {
      await mutate(toggleBookmark(organization, project), {
        optimisticUpdate: (old) => old?.map((p) => (p.id === projectId ? { ...p, isBookmarked: !p.isBookmarked } : p)),
        rollbackOnError: true,
        shouldRevalidateAfter: false,
      });
    }
  }

  const starred = data?.filter((project) => project.isBookmarked);
  const mine = data?.filter((project) => !project.isBookmarked && project.isMember);
  const other = data?.filter((project) => !project.isBookmarked && !project.isMember);

  return (
    <List isLoading={isLoading} searchBarAccessory={<OrganizationDropdown />}>
      <ProjectListSection organization={organization} projects={starred} title="Starred" onToggleBookmark={toggle} />
      <ProjectListSection organization={organization} projects={mine} title="My Projects" onToggleBookmark={toggle} />
      <ProjectListSection organization={organization} projects={other} title="Other" onToggleBookmark={toggle} />
    </List>
  );
}

export default function Command() {
  return <WithOrganization>{(props) => <ProjectsCommand {...props} />}</WithOrganization>;
}
