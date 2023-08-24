import { List } from "@raycast/api";
import IssueItem from "./IssueItem";
import { MAX_ISSUES, QUERY_UNRESOLVED, useIssues } from "../hooks/useIssues";
import ProjectDropdown from "./ProjectDropdown";
import { useProject } from "../hooks/useProjects";
import { OrganizationProps } from "./WithOrganization";

type IssueSearchProps = OrganizationProps & {
  navigationTitle?: string;
  query?: string;
};

export default function IssueSearch({ navigationTitle, query = QUERY_UNRESOLVED, organization }: IssueSearchProps) {
  const [project, setProject] = useProject();

  const { data: issues, isLoading } = useIssues(organization, query, project);
  const count = issues?.length || 0;
  const total = count == MAX_ISSUES ? MAX_ISSUES + "+" : count;

  return (
    <List
      isLoading={isLoading}
      navigationTitle={navigationTitle}
      searchBarPlaceholder={query}
      searchBarAccessory={<ProjectDropdown organization={organization} selected={project} onSelect={setProject} />}
    >
      <List.Section title={`Trending · ${total}`}>
        {issues?.map((issue) => (
          <IssueItem key={issue.id} issue={issue} showProject={!project || project === "-1"} />
        ))}
      </List.Section>
    </List>
  );
}
