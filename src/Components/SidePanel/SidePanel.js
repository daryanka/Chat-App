import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";

const SidePanel = props => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.rem" }}
    >
      <UserPanel {...props} />
      <Channels {...props} />
    </Menu>
  );
};

export default SidePanel;
