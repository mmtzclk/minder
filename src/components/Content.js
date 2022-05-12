import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BiSearchAlt,
  IoIosArrowDropdownCircle,
  BiReset,
} from "react-icons/all";

import Users from "./Users";

function Content({ users, user }) {
  const [show, handleShow] = useState("none");

  const transitionNavBar = () => {
    if (window.scrollY > 60) {
      handleShow("0 30px 30px -20px #333");
    } else {
      handleShow("none");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);
    return () => {
      window.removeEventListener("scroll", transitionNavBar);
    };
  }, []);

  return (
    <StyledContent show={show}>
      <Top>
        <h1>Who's Nearby?</h1>
        <Search>
          <BiSearchAlt />
          <input placeholder="Search name or username" type="text" />
        </Search>
      </Top>
      <hr />
      <HolyFilter>
        <Filter>
          <Select back={IoIosArrowDropdownCircle}>
            <option hidden defaultValue value="grapefruit">
              Distance
            </option>
            <option value="lime">1 km</option>
            <option value="coconut">3 km</option>
            <option value="mango">5 km</option>
            <option value="mango">5 km and more</option>
          </Select>
        </Filter>
        <Filter>
          <Select back={IoIosArrowDropdownCircle}>
            <option hidden defaultValue value="grapefruit">
              Height
            </option>
            <option value="lime">1.40m - 1.64m</option>
            <option value="coconut">1.65m - 1-74m</option>
            <option value="mango">1.75m - 1.89m</option>
            <option value="mango">1.90m and more</option>
          </Select>
        </Filter>
        <Filter>
          <Select back={IoIosArrowDropdownCircle}>
            <option hidden defaultValue value="grapefruit">
              Weight
            </option>
            <option value="lime">40 kg - 50 kg</option>
            <option value="coconut">51 kg - 65kg</option>
            <option value="mango">65 kg and more</option>
          </Select>
        </Filter>
        <Filter>
          <Select back={IoIosArrowDropdownCircle}>
            <option hidden defaultValue value="distance">
              Gender
            </option>
            <option value="lime">Male</option>
            <option value="coconut">Female</option>
            <option value="mango">Other</option>
          </Select>
        </Filter>
        <Filter>
          <BiReset className="reset-icon" color="#5e6474" size="35" />
        </Filter>
      </HolyFilter>
      <hr className="shadow" />
      <Users users={users} user={user} />
    </StyledContent>
  );
}

const StyledContent = styled.div`
  overflow: scroll;
  overflow-x: hidden;
  padding: 40px 5vw;
  color: #313746;
  width: 100%;
  @media screen and (max-width: 1440px) {
    padding: 20px 2vw;
  }
  @media screen and (max-width: 1024px) {
  }
  @media screen and (max-width: 768px) {
    padding: 10px 60px;
  }
  @media screen and (max-width: 425px) {
    padding: 5px 15px;
  }
  hr {
    border: 1px solid #f2f2f2;
  }
  .shadow {
    border: none;
    height: 50px;
    margin-top: 0;
    border-bottom: 1px solid white;
    box-shadow: ${(props) => props.show};
    transition: all 0.5s ease;
  }
`;

const HolyFilter = styled.div`
  padding-top: 30px;
  display: flex;
  align-items: center;
  position: relative;
  .reset-icon {
    margin-left: 20px;
  }
  @media screen and (max-width: 1440px) {
    flex-wrap: wrap;
    justify-content: center;
  }
  @media screen and (max-width: 425px) {
    display: none;
  }
`;

const Filter = styled.div`
  margin-right: 10px;
  @media screen and (max-width: 1440px) {
    margin-bottom: 10px;
  }
`;

const Select = styled.select`
  width: 200px;
  padding: 10px 15px;
  border-color: #bfbfbf;
  border-radius: 20px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg stroke='currentColor' fill='%23C1C3C8' stroke-width='0' viewBox='0 0 512 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M48 256c0 114.9 93.1 208 208 208s208-93.1 208-208S370.9 48 256 48 48 141.1 48 256zm289.1-43.4c7.5-7.5 19.8-7.5 27.3 0 3.8 3.8 5.6 8.7 5.6 13.6s-1.9 9.9-5.7 13.7l-94.3 94c-7.6 6.9-19.3 6.7-26.6-.6l-95.7-95.4c-7.5-7.5-7.6-19.7 0-27.3 7.5-7.5 19.7-7.6 27.3 0l81.1 81.9 81-79.9z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 165px center;
  background-size: 25px;
  color: #5e6474;
  font-size: 20px;
`;

const Top = styled.div`
  font-size: 1.5vw;
  display: flex;
  padding-top: 20px;
  justify-content: space-between;
  padding-bottom: 20px;
  @media screen and (max-width: 1024px) {
    font-size: 1rem;
  }
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  color: #6f737d;

  input {
    ::placeholder {
      color: #6f737d;
    }
    position: relative;
    padding: 15px 20px 15px 48px;
    width: 300px;
    background-color: #f2f2f2;
    font-size: 16px;
    border: none;
    border-radius: 50px;
    outline: none;
  }
  svg {
    position: relative;
    z-index: 1;
    right: -45px;
  }
`;

export default Content;
