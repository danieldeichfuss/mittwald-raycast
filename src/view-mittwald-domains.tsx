import { ActionPanel, Action, Icon, List, getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";

interface Preferences {
  token: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();

  const { isLoading, data: domains } = useFetch<
    { connected: boolean; domain: string; domainId: string; projectId: string }[]
  >("https://api.mittwald.de/v2/domains", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${preferences.token}`,
    },
  });

  return (
    <List isLoading={!domains && !isLoading}>
      {domains?.map((domain) => (
        <List.Item
          key={domain.domainId}
          icon={domain.connected ? Icon.CheckCircle : Icon.XMarkCircle}
          title={domain.domain}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                url={`https://studio.mittwald.de/app/projects/${domain.projectId}/domains/`} // TODO: find out how to generate the correct url incl. ingress
              ></Action.OpenInBrowser>
              <Action.CopyToClipboard content={domain.domain} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
