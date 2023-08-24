import { List } from "@raycast/api";
import { Project, useProjects } from "./hooks/useProjects";
import { Organization } from "./api/base";
import ProjectItem from "./components/ProjectItem";
import OrganizationDropdown from "./components/OrganizationDropdown";
import WithOrganization, { OrganizationProps } from "./components/WithOrganization";

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

function ProjectsCommand({ organization }: OrganizationProps) {
  const { data, isLoading } = useProjects(organization);

  const starred = data?.filter((project) => project.isBookmarked);
  const mine = data?.filter((project) => !project.isBookmarked && project.isMember);
  const other = data?.filter((project) => !project.isBookmarked && !project.isMember);

  return (
    <List isLoading={isLoading} searchBarAccessory={<OrganizationDropdown />}>
      <ProjectListSection organization={organization} projects={starred} title="Starred" />
      <ProjectListSection organization={organization} projects={mine} title="My Projects" />
      <ProjectListSection organization={organization} projects={other} title="Other" />
    </List>
  );
}

export default function Command() {
  return <WithOrganization>{(props) => <ProjectsCommand {...props} />}</WithOrganization>;
}
