import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = props => {
  return (
    <Segment clearing>
      {/* Channel Header */}
      <Header fluid="true" as="h2" floated="left" style={{ marginButtom: 0 }}>
        <span>
          {props.channelName}
          <Icon name={"star outline"} color="black" />
        </span>
        <Header.Subheader>{props.users}</Header.Subheader>
      </Header>
      {/* Channel Search Input */}
      <Header floated="right">
        <Input
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="SearchMessages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
