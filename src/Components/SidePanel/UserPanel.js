import React from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../firebase";
import { useSelector } from "react-redux";

const UserPanel = props => {
  const dropdownOptions = () => {
    return [
      {
        key: "user",
        text: (
          <span>
            Signed in as{" "}
            <strong>
              {props.currentUser && props.currentUser.displayName}
            </strong>
          </span>
        ),
        disabled: true
      },
      {
        key: "avatar",
        text: <span>Change Avatar</span>
      },
      {
        key: "signout",
        text: <span onClick={handleSignout}>Sign out</span>
      }
    ];
  };

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed Out");
      });
  };

  return (
    <Grid style={{ background: "#4c3c4c" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/* {Main App Header} */}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image
                    avatar
                    spaced="right"
                    src={props.currentUser.photoURL}
                  />
                  {props.currentUser.displayName}
                </span>
              }
              options={dropdownOptions()}
            />
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
