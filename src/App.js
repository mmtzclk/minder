import styled from "styled-components";
import { useEffect, useState } from "react";
import GlobalStyle from "./GlobalStyle";
import Nav from "./components/Nav";
import Content from "./components/Content";
import db from "./firebase";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UserDetail from "./components/UserDetail";
import Profile from "./components/Profile";

import { auth } from "./firebase";
import { login, logout, selectUser } from "./login/userSlice";
import { useSelector, useDispatch } from "react-redux";

function App() {
  const [users, setUsers] = useState([]);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const loggedUser =
    users && users.filter((loggedUser) => loggedUser.email === user.email);

  useEffect(() => {
    const fetchItems = async () => {
      await db
        .collection("user")
        .get()
        .then((users) => {
          let screams = [];
          users.forEach((user) => {
            screams.push(user.data());
          });
          setUsers(screams);
        });
    };
    fetchItems();

    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <div>
      <Router>
        <StyledApp>
          <GlobalStyle />

          <Route path="/" exact>
            <Nav user={loggedUser[0]} />
            <Content users={users} user={loggedUser[0]} />
          </Route>
        </StyledApp>
        <Route
          path="/user/:username"
          component={(props) => (
            <UserDetail props={props} users={users} user={user} />
          )}
        />

        <Route
          path="/profile"
          exact
          component={(props) => <Profile props={props} user={loggedUser[0]} />}
        />
      </Router>
    </div>
  );
}

const StyledApp = styled.div`
  max-height: 100vh;
  display: flex;
`;

export default App;
