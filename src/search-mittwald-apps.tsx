import { ActionPanel, Action, Icon, List, getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";

interface Preferences {
  token: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();

  const { isLoading, data: apps } = useFetch<{ id: string; name: string; tags: string[] }[]>(
    "https://api.mittwald.de/v2/apps",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${preferences.token}`,
      },
      keepPreviousData: true,
    },
  );

  return (
    <List isLoading={!apps && !isLoading}>
      {apps?.map((app) => (
        <List.Item
          key={app.id}
          icon={Icon.AppWindow}
          title={app.name}
          subtitle={app.tags.join(", ")}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={`https://studio.mittwald.de/app/apps/${app.id}`}></Action.OpenInBrowser> //
              TODO: find out how to generate the correct url incl. projectId
              <Action.CopyToClipboard content={`https://studio.mittwald.de/app/apps/${app.id}`} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
