import { Action, ActionPanel, Color, Icon, Image, List, Toast, showToast, useNavigation } from "@raycast/api";
import { useOrganization, useOrganizations } from "./hooks/useOrganizations";
import { Organization } from "./api/base";

export function organizationAvatar(organization: Organization) {
  return organization.avatar ? { source: organization.avatar, mask: Image.Mask.RoundedRectangle } : Icon.Window;
}

export default function Command() {
  const { pop } = useNavigation();

  const [organization, setOrganization] = useOrganization();
  const { data, isLoading } = useOrganizations();

  function selectOrg(org: Organization) {
    setOrganization(org);
    pop();
    showToast(Toast.Style.Success, `Switched to organization "${org.name}"`);
  }

  const single = data?.length === 1;
  const placeholder = single ? "Please confirm your Sentry organization..." : "Choose your Sentry organiation...";
  const action = single ? "Confirm" : "Switch Organization";

  return (
    <List isLoading={isLoading} searchBarPlaceholder={placeholder}>
      {data?.map((org) => (
        <List.Item
          key={org.id}
          id={org.id}
          title={org.name}
          icon={organizationAvatar(org)}
          accessories={[
            organization?.id == org.id ? { tag: { value: "active", color: Color.Blue } } : {},
            { text: org.slug },
          ]}
          actions={
            <ActionPanel>
              <Action title={action} onAction={() => selectOrg(org)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
