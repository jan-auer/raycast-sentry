import { Action, ActionPanel, Color, Icon, Image, List, Toast, showToast, useNavigation } from "@raycast/api";
import { useOrganization, useOrganizations } from "./hooks/useOrganizations";
import { Organization } from "./api/base";

export function organizationAvatar(organization: Organization) {
  return organization.avatar ? { source: organization.avatar, mask: Image.Mask.RoundedRectangle } : Icon.Window;
}

type SwitchOrganizationProps = {
  isGuard?: boolean;
};

export default function Command({ isGuard }: SwitchOrganizationProps) {
  const { pop } = useNavigation();

  const [organization, setOrganization] = useOrganization();
  const { data, isLoading } = useOrganizations();

  function selectOrg(org: Organization) {
    setOrganization(org);
    if (!isGuard) {
      pop();
    }
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
