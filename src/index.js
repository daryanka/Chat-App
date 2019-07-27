import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import Register from "./Components/Auth/Regiser";
import Login from "./Components/Auth/Login";
import firebase from "./firebase";
import { createStore, applyMiddleware } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { setUser, clearUser } from "./Actions/index";
import thunk from "redux-thunk";
import "semantic-ui-css/semantic.min.css";
import Spinner from "./Spinner";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const Root = props => {
  const dispatch = useDispatch();
  const globalState = useSelector(state => state.user);
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user));
        props.history.push("/");
      } else {
        console.log("hi");
        dispatch(clearUser());
        if (props.location.pathname === "/") {
          props.history.push("/login");
        }
      }
    });
  }, []);

  return globalState.isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

const RootWithAuth = withRouter(Root);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootWithAuth />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
