import React, { useState } from "react";
import styled from "styled-components";
import { NavLink, Link } from "react-router-dom";
import firebase from "firebase";

import {
  MdLocalPostOffice,
  FaUserPlus,
  FaUserMinus,
  RiCompassDiscoverFill,
  GiChewedHeart,
} from "react-icons/all";
import db from "../firebase";

function UserDetail(props) {
  const username = props.props.match.params.username;
  const profile =
    props.users &&
    props.users.filter((loggedUser) => loggedUser.email === props.user.email);
  const [isFriend, setIsFriend] = useState();
  db.collection("user")
    .doc(profile[0] && profile[0].email)
    .get()
    .then((data) => {
      data.data() && data.data().friends.includes(username)
        ? setIsFriend(true)
        : setIsFriend(false);
    });
  const userPhotos = props.users.filter((user) => user.username === username);
  /*  const userq = props.users.username.map().filter((user) => {
    user.username === username;
  }); */

  const addFriend = () => {
    props.user
      ? db
          .collection("user")
          .doc(props.user.email)
          .get()
          .then((data) => {
            data.data().friends.includes(username)
              ? db
                  .collection("user")
                  .doc(props.user.email)
                  .update({
                    friends:
                      firebase.firestore.FieldValue.arrayRemove(username),
                  }) && setIsFriend(false)
              : db
                  .collection("user")
                  .doc(props.user.email)
                  .update({
                    friends: firebase.firestore.FieldValue.arrayUnion(username),
                  }) && setIsFriend(true);
          })
      : alert("Need To Login!");
  };
  return (
    <div>
      {props.users
        .filter((user) => user.username === username)
        .map((user) => (
          <StyledUserDetail key={user.username}>
            <StyledNav>
              <Link to="/">
                <Logo>
                  <GiChewedHeart color="#ff675d" size="60" />
                  <h1>Minder</h1>
                </Logo>
              </Link>
              <Header>
                <ul>
                  <NavLink to="/" exact activeClassName="active">
                    <li>
                      <RiCompassDiscoverFill size="40" />
                      <h2>Discover</h2>
                    </li>
                  </NavLink>
                </ul>
              </Header>
            </StyledNav>
            <User>
              <UserInfo>
                <Image>
                  <img src={user.avatar} alt="" />
                </Image>
                <Info>
                  <Username>
                    <h1>
                      {user.name} <span>@{user.username}</span>{" "}
                    </h1>
                  </Username>
                  <Description>
                    <p>{user.description}</p>
                    Gender: {user.gender.toUpperCase()} <br />
                    Age: {user.age} <br />
                    Height: {user.height} <br />
                    Weight: {user.weight}
                  </Description>
                  <Buttons isFriend={isFriend}>
                    <button>
                      <MdLocalPostOffice />
                      Message
                    </button>
                    {isFriend ? (
                      <button onClick={addFriend}>
                        <FaUserMinus />
                        Unfollow
                      </button>
                    ) : (
                      <button onClick={addFriend}>
                        <FaUserPlus /> Follow
                      </button>
                    )}
                  </Buttons>
                </Info>
              </UserInfo>
            </User>
            <UserFeeds>
              <Feeds>
                <h4>Feeds</h4>
                {isFriend ? (
                  userPhotos[0] && (
                    <Photos>
                      {userPhotos[0].photos.map((photo) => (
                        <Feed key={photo}>
                          <img src={photo} alt={photo} />
                        </Feed>
                      ))}
                    </Photos>
                  )
                ) : (
                  <HiddenProfile>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/minder-7d9a9.appspot.com/o/locked.jpg?alt=media&token=9cf96e90-a873-45e2-8fcf-7715896e2230"
                      alt=""
                    />
                  </HiddenProfile>
                )}
              </Feeds>
            </UserFeeds>
          </StyledUserDetail>
        ))}
    </div>
  );
}

const HiddenProfile = styled.div`
  margin-top: 30px;
  img {
    width: 100%;
    height: 475px;
    object-fit: cover;
  }
`;

const UserFeeds = styled.div`
  margin: 40px 15%;
  @media screen and (max-width: 768px) {
    margin: 20px 5%;
  }
`;
const Photos = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 40px;
`;
const Feeds = styled.div`
  @media screen and (max-width: 768px) {
    margin-top: 200px;
  }
  h4 {
    font-size: 25px;
  }
`;
const Feed = styled.div`
  width: 24%;
  margin-bottom: 20px;
  @media screen and (max-width: 1024px) {
    width: 48%;
  }
  @media screen and (max-width: 425px) {
    width: 100%;
  }
  cursor: pointer;
  img {
    width: 100%;
    height: 450px;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const User = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledUserDetail = styled.div`
  color: #313746;
`;

const UserInfo = styled.div`
  display: flex;
  max-width: 70%;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    max-width: 100%;
    align-items: center;
    justify-content: center;
  }
  @media screen and (max-width: 1100px) {
    max-width: 90%;
  }
`;
const Image = styled.div`
  width: 100%;
  @media screen and (max-width: 768px) {
    text-align: center;
  }
  img {
    width: 400px;
    height: 550px;
    object-fit: cover;
    @media screen and (max-width: 1024px) {
      width: 24rem;
      height: 24rem;
      border-radius: 50%;
    }
    @media screen and (max-width: 425px) {
      width: 20rem;
      height: 20rem;
      border-radius: 50%;
    }
  }
`;
const Info = styled.div`
  margin-left: 20px;
  position: relative;
`;
const Username = styled.div`
  @media screen and (max-width: 768px) {
    text-align: center;
  }
  h1 {
    font-size: 3rem;
  }
  span {
    font-size: 2rem;
  }
`;
const Description = styled.div`
  @media screen and (max-width: 768px) {
    text-align: center;
  }
  p {
    @media screen and (max-width: 768px) {
      text-align: center;
      width: 100%;
    }
    @media screen and (max-width: 1100px) {
      width: 100%;
    }
    margin-bottom: 1rem;
    width: 50%;
  }
`;
const Buttons = styled.div`
  margin-top: 40px;
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  @media screen and (max-width: 768px) {
    bottom: -100px;
    align-items: center;
    justify-content: center;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: #ff675d;
    padding-top: 10px;
    padding-bottom: 10px;
    border: 3px solid #ff675d;
    border-radius: 50px;
    font-size: 1.5rem;
    width: 150px;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    margin-left: 30px;
    svg {
      margin-right: 5px;
    }
    @media screen and (max-width: 425px) {
      margin: auto;
    }
    @media screen and (max-width: 940px) {
      font-size: 1.25rem;
    }
  }
`;
const StyledNav = styled.div`
  background-color: #313746;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  a {
    text-decoration: none;
  }
  .active {
    li {
      color: white;
    }
  }
`;

const Logo = styled.div`
  margin-left: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  @media screen and (max-width: 640px) {
    margin-left: 20px;
  }
  h1 {
    @media screen and (max-width: 640px) {
      font-size: 2rem;
    }
    @media screen and (max-width: 425px) {
      display: none;
    }
    font-size: 3rem;
    color: white;
    padding-left: 10px;
    font-style: italic;
  }
`;

const Header = styled.header`
  ul {
    list-style-type: none;
    padding-top: 10px;
    padding-bottom: 30px;
    display: flex;
    li {
      margin-right: 30px;
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
        @media screen and (max-width: 640px) {
          font-size: 1rem;
          padding-left: 5px;
        }
        @media screen and (max-width: 425px) {
          font-size: 0.75rem;
          padding-left: 5px;
        }
        @media screen and (max-width: 340px) {
          display: none;
          padding-left: 0;
        }
      }
    }
  }
`;

export default UserDetail;
