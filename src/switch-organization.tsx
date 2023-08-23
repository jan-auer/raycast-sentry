import { Action, ActionPanel, Color, Icon, Image, List, Toast, showToast, useNavigation } from "@raycast/api";
import { useOrganization, useOrganizations } from "./hooks/useOrganizations";
import { Organization } from "./api/base";

export function organizationAvatar(organization: Organization) {
  return organization.avatar ? { source: organization.avatar, mask: Image.Mask.RoundedRectangle } : Icon.Window;
}

export default function Command() {
  const { data, isLoading } = useOrganizations();
  const [organization, setOrganization] = useOrganization();

  const { pop } = useNavigation();

  function selectOrg(org: Organization) {
    setOrganization(org);
    pop();
    showToast(Toast.Style.Success, `Switched to organization "${org.name}"`);
  }

  return (
    <List isLoading={isLoading}>
      {data?.map((org) => (
        <List.Item
          key={org.id}
          title={org.name}
          icon={organizationAvatar(org)}
          accessories={[
            organization?.id == org.id ? { tag: { value: "active", color: Color.Blue } } : {},
            { text: org.slug },
          ]}
          actions={
            <ActionPanel>
              <Action title="Switch Organization" onAction={() => selectOrg(org)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
