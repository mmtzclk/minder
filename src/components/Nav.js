import React, { useRef, useState } from "react";
import styled from "styled-components";
import { NavLink, Link, useHistory } from "react-router-dom";
import firebase from "firebase";

import {
  RiCompassDiscoverFill,
  GiChewedHeart,
  FaUser,
  BiChevronsLeft,
  BiChevronsRight,
} from "react-icons/all";
import db, { auth } from "../firebase";

function Nav({ user }) {
  const [navOpen, setNavOpen] = useState(false);
  const [gender, setGender] = useState("male");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const regEmailRef = useRef(null);
  const regPasswordRef = useRef(null);
  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const ageRef = useRef(null);
  const weightRef = useRef(null);
  const heightRef = useRef(null);
  const history = useHistory();
  const [registerForm, setRegisterForm] = useState(false);
  const [location, setLocation] = useState({});
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {})
      .catch((err) => alert(err.message));
  };
  const signOut = (e) => {
    e.preventDefault();
    auth.signOut();
    history.push("/");
  };
  const register = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(
        regEmailRef.current.value,
        regPasswordRef.current.value
      )
      .then((user) => {
        db.collection("user")
          .doc(regEmailRef.current.value)
          .set({
            email: regEmailRef.current.value,
            name: nameRef.current.value,
            username: usernameRef.current.value,
            description: "The user didn't enter information",
            age: ageRef.current.value,
            weight: weightRef.current.value,
            height: heightRef.current.value,
            gender: gender,
            location: new firebase.firestore.GeoPoint(
              location.latitude || 1,
              location.longitude || 1
            ),
            friends: [],
            photos: [],
            avatar:
              "https://firebasestorage.googleapis.com/v0/b/minder-7d9a9.appspot.com/o/no-avatar.jpg?alt=media&token=f1cd0ada-e657-46ea-9802-46a86002c73f",
          })
          .then(() => {
            window.location.reload();
          })
          .catch((err) => alert(err));
      })
      .catch((err) => alert(err.message));
  };

  const getLocation = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(showPosition, (err) => {
      console.log(err);
    });
  };
  const showPosition = (position) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };
  return (
    <div>
      <Burger navOpen={navOpen} onClick={() => setNavOpen(true)}>
        <BiChevronsRight color="#ff675d" size="60" />
      </Burger>
      <StyledNav navOpen={navOpen}>
        <BiChevronsLeft
          id="close-icon"
          color="#ff675d"
          size="60"
          onClick={() => setNavOpen(false)}
        />
        <Link to="/">
          <Logo>
            <GiChewedHeart color="#ff675d" size="60" />
            <h1>Minder</h1>
          </Logo>
        </Link>
        {user ? (
          <MyProfile>
            <Profile>
              <img src={user.avatar} alt="profile" />
              <div>
                <h4>Welcome,</h4>
                <h3>{user.name}</h3>
              </div>
            </Profile>
            <Post onClick={signOut}>Logout</Post>
          </MyProfile>
        ) : !registerForm ? (
          <Login>
            <form>
              <Inputs>
                <input ref={emailRef} type="email" placeholder="E-Mail" />
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"
                />
              </Inputs>
              <Post type="submit" onClick={signIn}>
                Login
              </Post>
              <Post onClick={() => setRegisterForm(true)}>Register</Post>
            </form>
          </Login>
        ) : (
          <Login>
            <form>
              <Inputs>
                <input required ref={nameRef} type="text" placeholder="Name" />
                <input
                  required
                  ref={usernameRef}
                  type="text"
                  placeholder="Username"
                />
                <input required ref={ageRef} type="number" placeholder="Age" />
                <input
                  required
                  ref={weightRef}
                  type="number"
                  placeholder="Weight"
                />
                <input
                  required
                  ref={heightRef}
                  type="number"
                  placeholder="Height"
                />
                <Radios onChange={(e) => setGender(e.target.value)}>
                  <Radio>
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      defaultChecked
                      placeholder="Gender"
                      value="male"
                    />
                    <label htmlFor="male">Male</label>
                  </Radio>
                  <Radio>
                    <input
                      name="gender"
                      type="radio"
                      id="female"
                      value="female"
                      placeholder="Gender"
                    />
                    <label htmlFor="female">Female</label>
                  </Radio>
                  <Radio>
                    <input
                      type="radio"
                      name="gender"
                      id="other"
                      value="other"
                      placeholder="Gender"
                    />
                    <label htmlFor="other">Other</label>
                  </Radio>
                </Radios>
                <Post onClick={getLocation}>Get Location</Post>
                <input
                  required
                  ref={regEmailRef}
                  type="email"
                  placeholder="E-Mail"
                />
                <input
                  required
                  ref={regPasswordRef}
                  type="password"
                  placeholder="Password"
                />
              </Inputs>
              <Post type="submit" onClick={register}>
                Register
              </Post>
              <Post onClick={() => setRegisterForm(false)}>Back to Login</Post>
            </form>
          </Login>
        )}

        <Header>
          <ul>
            <NavLink to="/" exact activeClassName="active">
              <li>
                <RiCompassDiscoverFill size="40" />
                <h2>Discover</h2>
              </li>
            </NavLink>
            {user && (
              <NavLink to="/profile" exact activeClassName="active">
                <li>
                  <FaUser size="40" />
                  <h2>Profile</h2>
                </li>
              </NavLink>
            )}
          </ul>
        </Header>

        <Bottom>
          <h5>©2022 Allrights Reserved</h5>
        </Bottom>
      </StyledNav>
    </div>
  );
}

const Inputs = styled.div`
  width: 300px;
  @media screen and (max-width: 425px) {
    width: 100%;
  }
`;

const Burger = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: ${(props) => (props.navOpen ? "none" : "block")};
    position: fixed;
    left: 0;
    top: 50%;
    z-index: 999;
  }
`;

const Radios = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const Radio = styled.div`
  display: flex;
  align-items: center;
  input {
    width: 25px !important;
    height: 25px !important;
    margin-right: 6px;
  }
  label {
    height: 35px;
  }
`;

const Login = styled.div`
  padding: 20px;
  background-color: #464b59;
  border-radius: 10px;
  color: white;

  input {
    width: 100%;
    color: black;
    outline: none;
    height: 40px;
    margin-bottom: 14px;
    border: none;
    border-radius: 5px;
    padding: 5px 15px;
  }
`;

const StyledNav = styled.div`
  overflow: scroll;
  position: sticky;
  width: 20%;
  top: 0;
  left: 0;
  min-width: 400px;
  background-color: #313746;
  padding: 20px;
  min-height: 100vh;

  @media screen and (max-width: 768px) {
    position: fixed;
    min-width: 50%;
    z-index: 999;
  }
  @media screen and (max-width: 425px) {
    position: fixed;
    min-width: 100%;
  }

  @keyframes nav-anim-open {
    0% {
      left: -100%;
    }
    100% {
      left: 0;
    }
  }
  @keyframes nav-anim-close {
    0% {
      left: 0;
    }
    100% {
      left: -100%;
    }
  }

  animation: ${(props) => (props.navOpen ? "nav-anim-open" : "nav-anim-close")}
    0.3s linear;

  #close-icon {
    display: none;

    @media screen and (max-width: 768px) {
      position: absolute;
      right: 0;
      top: 50%;
      display: block;
    }
  }
  a {
    text-decoration: none;
  }
  .active {
    li {
      color: white;
    }
  }
  @media screen and (max-width: 768px) {
    left: ${(props) => (props.navOpen ? "0" : "-100%")};
  }
`;

const Bottom = styled.div`
  text-align: center;
  position: absolute;
  bottom: 20px;
  left: 30%;
  h5 {
    color: #6f737d;
  }
`;

const Logo = styled.div`
  justify-content: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  h1 {
    font-size: 3rem;
    color: white;
    padding-left: 10px;
    font-style: italic;
  }
`;

const MyProfile = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #464b59;
  border-radius: 10px;
  color: white;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 100%;
  }
  h3 {
    font-size: 2rem;
    margin-left: 20px;
  }
  h4 {
    font-size: 1rem;
    margin-left: 20px;
  }
`;

const Post = styled.button`
  background-color: #ff675d;
  color: white;
  padding-top: 10px;
  padding-bottom: 10px;
  border: none;
  border-radius: 50px;
  font-size: 1.5rem;
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
  outline: none;
  margin-bottom: 15px;
`;

const Header = styled.header`
  ul {
    list-style-type: none;
    padding-top: 10px;
    padding-bottom: 30px;

    li {
      padding-top: 20px;
      display: flex;
      align-items: center;
      color: #6f737d;
      cursor: pointer;
      &:hover {
        color: white;
      }
      h2 {
        padding-left: 10px;
        font-size: 1.25rem;
      }
    }
  }
`;

export default Nav;
