import { Action, ActionPanel, getPreferenceValues, List } from "@raycast/api";
import { useState } from "react";
import { ActionOpenExtensionPreferences } from "./components/action-open-extension-preferences";
import { IpEmptyView } from "./components/ip-empty-view";
import { searchIpGeolocation } from "./hooks/hooks";
import { Preferences } from "./types/preferences";
import { isEmpty } from "./utils/common-utils";
import { listIcons } from "./utils/constants";

interface IpArgument {
  ipAddress: string;
}

export default function QueryIpGeolocation(props: { arguments: IpArgument }) {
  const { ipAddress } = props.arguments;
  const { language, coordinatesFormat } = getPreferenceValues<Preferences>();
  const [searchContent, setSearchContent] = useState<string>(ipAddress);
  const { ipGeolocation, loading } = searchIpGeolocation(language, searchContent.trim(), coordinatesFormat);

  const emptyViewTitle = () => {
    if (loading) {
      return "Loading...";
    }
    if (ipGeolocation.length === 0 && !isEmpty(searchContent)) {
      return "Invalid Query";
    }
    return "IP Geolocation";
  };

  return (
    <List
      isLoading={loading}
      searchBarPlaceholder={"Query geolocation of IP or domain"}
      searchText={searchContent}
      onSearchTextChange={setSearchContent}
      throttle={true}
    >
      <IpEmptyView title={emptyViewTitle()} />
      {ipGeolocation.map((value, index) => (
        <List.Item
          key={index}
          icon={listIcons[index]}
          title={value[0]}
          subtitle={value[1]}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard icon={listIcons[index]} title={`Copy ${value[0]}`} content={value[1]} />
              <Action.CopyToClipboard
                title={`Copy All Info`}
                content={JSON.stringify(Object.fromEntries(ipGeolocation), null, 2)}
              />
              <ActionOpenExtensionPreferences />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
