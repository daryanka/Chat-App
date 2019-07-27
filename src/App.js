import React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";
import ColorPanel from "./Components/ColorPanel/ColorPanel";
import SidePanel from "./Components/SidePanel/SidePanel";
import Messages from "./Components/Messages/Messages";
import MetaPanel from "./Components/MetaPanel/MetaPanel";
import { useSelector } from "react-redux";

function App(props) {
  const [user, setUser] = React.useState();
  const userState = useSelector(state => {
    return state.user;
  });
  React.useEffect(() => {
    setUser(userState.currentUser);
  }, []);

  console.log(user);

  if (user) {
    return (
      <Grid columns="equal" className="app" style={{ background: "#eee" }}>
        <ColorPanel />
        <SidePanel currentUser={userState.currentUser} />

        <Grid.Column style={{ marginLeft: "320px" }}>
          <Messages />
        </Grid.Column>

        <Grid.Column width={4}>
          <MetaPanel />
        </Grid.Column>
      </Grid>
    );
  } else {
    return null;
  }
}

export default App;
