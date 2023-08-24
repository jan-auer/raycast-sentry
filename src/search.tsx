import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { SavedSearch, useSearches } from "./hooks/useSearches";
import { Organization, formatUrl } from "./api/base";
import WithOrganization, { OrganizationProps } from "./components/WithOrganization";
import { useProject } from "./hooks/useProjects";
import ProjectDropdown from "./components/ProjectDropdown";

type SearchItemProps = {
  organization: Organization;
  project: string;
  search: SavedSearch;
};

function SearchItem({ organization, project, search }: SearchItemProps) {
  const url = formatUrl(`issues/searches/${search.id}/`, organization, { sort: search.sort, project }, true);

  return (
    <List.Item
      id={search.id}
      title={search.name}
      subtitle={search.query}
      icon={Icon.MagnifyingGlass}
      actions={
        <ActionPanel>
          <Action.Push
            title="Search Issues"
            icon={Icon.MagnifyingGlass}
            target={
              <List>
                <List.EmptyView title="Issue Search" description="Not implemented" icon={Icon.MagnifyingGlass} />
              </List>
            }
          />
          <Action.OpenInBrowser url={url} />
          <Action.CopyToClipboard title="Copy Query" content={search.query} />
        </ActionPanel>
      }
    />
  );
}

function SearchCommand({ organization }: OrganizationProps) {
  const [optionalProject, setProject] = useProject();
  const project = optionalProject || "-1";
  const { data, isLoading } = useSearches(organization);

  const saved = data?.filter((s) => !s.isGlobal);
  const recommended = data?.filter((s) => s.isGlobal);
  const customUrl = formatUrl("issues/", organization, { project }, true);

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={<ProjectDropdown organization={organization} selected={project} onSelect={setProject} />}
    >
      <List.Item
        title="Start custom search in Browser"
        icon={Icon.Globe}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser url={customUrl} />
          </ActionPanel>
        }
      />
      {
        <>
          <List.Section title="Saved Searches">
            {saved &&
              saved.map((search) => (
                <SearchItem key={search.id} organization={organization} project={project} search={search} />
              ))}
          </List.Section>
          <List.Section title="Recommended Searches">
            {recommended &&
              recommended.map((search) => (
                <SearchItem key={search.id} organization={organization} project={project} search={search} />
              ))}
          </List.Section>
        </>
      }
    </List>
  );
}

export default function Command() {
  return <WithOrganization>{(props) => <SearchCommand {...props} />}</WithOrganization>;
}
