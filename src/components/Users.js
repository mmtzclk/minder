import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { getDistance } from "geolib";

import { MdLocalPostOffice } from "react-icons/all";

function Users({ users, user }) {
  const [show, setShow] = useState(0);
  const [geolocation, setGeolocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const mouseEnter = () => {
    setShow(1);
  };
  const mouseOut = () => {
    setShow(0);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(showPosition);
  }, []);

  const showPosition = (position) => {
    setGeolocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  const loggedUser = user;

  return (
    <StyledUsers show={show}>
      {users.map((user) => (
        <React.Fragment key={user.name}>
          {loggedUser && user.email === loggedUser.email ? (
            ""
          ) : (
            <User show={show} onMouseOver={mouseEnter} onMouseOut={mouseOut}>
              <img show={show} src={user.avatar} alt={user.username} />
              <Info className="info">
                <h1>{user.name}</h1>
                <h4>
                  {(
                    getDistance(
                      {
                        latitude: geolocation.latitude,
                        longitude: geolocation.longitude,
                      },
                      {
                        latitude: user.location.x_,
                        longitude: user.location.N_,
                      }
                    ) / 1000
                  ).toFixed(2)}
                  {" km "}
                </h4>
              </Info>
              <Hidden show={show} className="hidden">
                <Link to={`/user/${user.username}`}>
                  <ProfileButton>Visit Profile</ProfileButton>
                </Link>
                <MessageButton>
                  <MdLocalPostOffice size="40" />
                </MessageButton>
              </Hidden>
            </User>
          )}
        </React.Fragment>
      ))}
    </StyledUsers>
  );
}

const StyledUsers = styled.div`
  color: white;
  display: flex;
  flex-wrap: wrap;
`;

const User = styled.div`
  position: relative;
  width: 23%;
  margin-bottom: 20px;
  margin-right: 10px;
  @media screen and (max-width: 1440px) {
    width: 45%;
  }
  @media screen and (max-width: 1024px) {
    width: 100%;
  }

  img {
    width: 100%;
    height: 25vw;
    border-radius: 20px;
    object-fit: cover;
    transition: all 0.5s ease;
    @media screen and (max-width: 1440px) {
      height: 40vw;
    }
    @media screen and (max-width: 1024px) {
      height: 70vw;
    }
    @media screen and (max-width: 768px) {
      height: 100vw;
    }
  }
  .hidden {
    transition: all 1s ease;
  }
  .info {
    transition: all 0.5s ease;
  }
  &:hover {
    .hidden {
      opacity: 1;
    }
    .info {
      bottom: 90px;
    }
    img {
      filter: brightness(50%);
    }
  }
`;

const Info = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;

  h4 {
    color: #c1c3c8;
  }
`;

const Hidden = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  align-items: center;
  opacity: 0;
`;

const ProfileButton = styled.button`
  background-color: transparent;
  color: white;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 3px solid #ff675d;
  border-radius: 50px;
  font-size: 1.5rem;
  width: 150px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;

  &:hover {
    color: #ff675d;
    background-color: white;
  }
`;

const MessageButton = styled.button`
  position: absolute;
  color: white;
  padding: 5px;
  border: none;
  background-color: #ff675d;
  border-radius: 50px;
  cursor: pointer;
  outline: none;
  margin-left: 20px;
  transition: all 0.3s ease;

  &:hover {
    color: #ff675d;
    background-color: white;
  }
`;

export default Users;
