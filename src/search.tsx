import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useOrganization } from "./hooks/useOrganizations";
import { SavedSearch, useSearches } from "./hooks/useSearches";
import { Organization, formatUrl } from "./api/base";

type SearchItemProps = {
  organization: Organization;
  search: SavedSearch;
};

function SearchItem({ organization, search }: SearchItemProps) {
  const url = formatUrl(`issues/searches/${search.id}/`, organization, { sort: search.sort }, true);

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

export default function Command() {
  const [organization] = useOrganization();
  const { data, isLoading } = useSearches(organization);

  const saved = data?.filter((s) => !s.isGlobal);
  const recommended = data?.filter((s) => s.isGlobal);
  const customUrl = formatUrl("issues/", organization, {}, true);

  return (
    <List isLoading={isLoading}>
      <List.Item
        title="Start custom search in Browser"
        icon={Icon.Globe}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser url={customUrl} />
          </ActionPanel>
        }
      />
      {organization && (
        <>
          <List.Section title="Saved Searches">
            {saved && saved.map((search) => <SearchItem key={search.id} organization={organization} search={search} />)}
          </List.Section>
          <List.Section title="Recommended Searches">
            {recommended &&
              recommended.map((search) => <SearchItem key={search.id} organization={organization} search={search} />)}
          </List.Section>
        </>
      )}
    </List>
  );
}
