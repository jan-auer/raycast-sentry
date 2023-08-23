import { List } from "@raycast/api";
import { useOrganization } from "./hooks/useOrganizations";
import { Project, useProjects } from "./hooks/useProjects";
import { Organization } from "./api/base";
import ProjectItem from "./components/ProjectItem";

type ProjectListProps = {
  organization: Organization | null;
  projects: Project[] | undefined;
  title: string;
};

function ProjectListSection({ organization, projects, title }: ProjectListProps) {
  if (!organization || !projects || projects.length === 0) {
    return null;
  }

  return (
    <List.Section title={title}>
      {projects.map((project) => (
        <ProjectItem key={project.id} organization={organization} project={project} />
      ))}
    </List.Section>
  );
}

export default function Command() {
  const [organization] = useOrganization();
  const { data, isLoading } = useProjects(organization);

  const starred = data?.filter((project) => project.isBookmarked);
  const mine = data?.filter((project) => !project.isBookmarked && project.isMember);
  const other = data?.filter((project) => !project.isBookmarked && !project.isMember);

  return (
    <List isLoading={isLoading}>
      <ProjectListSection organization={organization} projects={starred} title="Starred" />
      <ProjectListSection organization={organization} projects={mine} title="My Projects" />
      <ProjectListSection organization={organization} projects={other} title="Other" />
    </List>
  );
}
