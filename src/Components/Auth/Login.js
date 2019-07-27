import React from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

const Login = () => {
  const [info, setInfo] = React.useState({
    email: "",
    password: ""
  });

  const [firebaseErr, setFirebaseErr] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const handleChange = event => {
    const copy = { ...info };
    copy[event.target.name] = event.target.value;
    setInfo(copy);
  };

  const isFormValid = () => {
    if (info.email && info.password) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid()) {
      setFirebaseErr();
      setErrorMsg("");
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(info.email, info.password)
        .then(signedInUser => {
          setLoading(false);
          console.log(signedInUser);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          setFirebaseErr(err.message);
        });
    } else {
      console.log("hi");
      setErrorMsg("Please fill out both email and password.");
    }
  };

  return (
    <Grid className="app" textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 490 }}>
        <Header as="h1" icon color="violet" textAlign="center">
          <Icon name="code branch" color="violet" />
          Login To DevChat
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              value={info.email}
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              type="email"
              onChange={handleChange}
            />
            <Form.Input
              value={info.password}
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={handleChange}
            />
            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              onClick={handleSubmit}
              fluid
              color="violet"
              size="large"
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {errorMsg && <Message error>{errorMsg}</Message>}
        {firebaseErr && (
          <Message error>
            <h3>Error</h3>
            {firebaseErr}
          </Message>
        )}
        <Message>
          Don't have an account?<Link to="/register"> Regiseter</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
