import React from "react";
import md5 from "md5";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  Label
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

const Register = () => {
  const [info, setInfo] = React.useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  });

  const [firebaseErr, setFirebaseErr] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const [valid, setValid] = React.useState(false);

  const [errorsUsername, setErrorsUsername] = React.useState(null);
  const [errorsEmail, setErrorsEmail] = React.useState(null);
  const [errorsPassword, setErrorsPassword] = React.useState(null);
  const [errorsPasswordConf, setErrorsPasswordConf] = React.useState(null);

  const handleChange = event => {
    const copy = { ...info };
    copy[event.target.name] = event.target.value;
    setInfo(copy);
  };

  const isFormEmpty = () => {
    return (
      !info.username ||
      !info.email ||
      !info.password ||
      !info.passwordConfirmation
    );
  };

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function passwordValid() {
    if (info.password.length < 6) {
      setErrorsPassword("Password length too short");
      return false;
    } else if (info.passwordConfirmation.length < 6) {
      setErrorsPasswordConf("Password length too short");
      return false;
    } else if (info.password !== info.passwordConfirmation) {
      setErrorsPassword("");
      setErrorsPasswordConf("Password not the same");
      return false;
    } else {
      return true;
    }
  }

  const isFormValid = () => {
    setErrorsUsername("");
    setErrorsEmail("");
    setErrorsPassword("");
    setErrorsPasswordConf("");
    //
    if (isFormEmpty()) {
      if (!info.username) {
        setErrorsUsername("Please enter a username");
      }
      if (!info.password) {
        setErrorsPassword("Please enter a password");
      }
      if (!info.passwordConfirmation) {
        setErrorsPasswordConf("Please confirm your password");
      }
      if (!info.email) {
        setErrorsEmail("Please enter a email");
      }
    } else if (!validateEmail(info.email)) {
      setErrorsEmail("Not a valid Email");
    } else if (!passwordValid()) {
      // setErrorsPassword("Password invalid");
      setValid(false);
    } else {
      setValid(true);
    }
  };

  console.log(`Valid state: ${valid}`);

  const handleSubmit = event => {
    event.preventDefault();
    if (valid) {
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(info.email, info.password)
        .then(user => {
          console.log("created user", user);
          setFirebaseErr("");
          user.user
            .updateProfile({
              displayName: info.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                user.user.email
              )}?d=identicon`
            })
            .then(() => {
              saveUser(user).then(() => {
                console.log("User Saved!");
                setLoading(false);
              });
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
              setFirebaseErr(err.message);
            });
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          setFirebaseErr(err.message);
        });
    }
  };

  const saveUser = data => {
    return firebase
      .database()
      .ref("users")
      .child(data.user.uid)
      .set({
        name: data.user.displayName,
        avatar: data.user.photoURL
      });
  };

  return (
    <Grid className="app" textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 490 }}>
        <Header as="h1" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              value={info.username}
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              type="text"
              onBlur={isFormValid}
              onChange={handleChange}
            />
            {errorsUsername && (
              <Label
                style={{ marginBottom: "10px", marginTop: "0" }}
                basic
                color="red"
                pointing
              >
                {errorsUsername}
              </Label>
            )}
            <Form.Input
              value={info.email}
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              type="email"
              onBlur={isFormValid}
              onChange={handleChange}
            />
            {errorsEmail && (
              <Label
                style={{ marginBottom: "10px", marginTop: "0" }}
                basic
                color="red"
                pointing
              >
                {errorsEmail}
              </Label>
            )}
            <Form.Input
              value={info.password}
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onBlur={isFormValid}
              onChange={handleChange}
            />
            {errorsPassword && (
              <Label
                style={{ marginBottom: "10px", marginTop: "0" }}
                basic
                color="red"
                pointing
              >
                {errorsPassword}
              </Label>
            )}
            <Form.Input
              value={info.passwordConfirmation}
              fluid
              name="passwordConfirmation"
              icon="repeat"
              iconPosition="left"
              placeholder="Confirm Password"
              type="password"
              onBlur={isFormValid}
              onChange={handleChange}
            />
            {errorsPasswordConf && (
              <Label
                style={{ marginBottom: "10px", marginTop: "0" }}
                basic
                color="red"
                pointing
              >
                {errorsPasswordConf}
              </Label>
            )}
            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              onClick={handleSubmit}
              fluid
              color="orange"
              size="large"
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {firebaseErr && (
          <Message error>
            <h3>Error</h3>
            {firebaseErr}
          </Message>
        )}
        <Message>
          Already a user?<Link to="/login"> Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
