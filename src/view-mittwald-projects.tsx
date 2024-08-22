import { ActionPanel, Action, Icon, List, getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";

interface Preferences {
  token: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();

  console.log({ preferences });

  const { isLoading, data } = useFetch<{ customerId: string; description: string; id: string; enabled: boolean }[]>(
    "https://api.mittwald.de/v2/projects",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${preferences.token}`,
      },
    },
  );

  return (
    <List isLoading={!data && !isLoading}>
      {data?.map((item) => (
        <List.Item
          key={item.id}
          icon={item.enabled ? Icon.CheckCircle : Icon.XMarkCircle}
          title={item.description}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                url={`https://studio.mittwald.de/app/projects/${item.id}/dashboard`}
              ></Action.OpenInBrowser>
              <Action.CopyToClipboard content={item.description} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
