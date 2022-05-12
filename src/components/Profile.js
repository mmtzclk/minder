import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import firebase from "firebase";
import {
  RiUserSettingsFill,
  GiChewedHeart,
  MdAddAPhoto,
  AiFillLike,
  ImCloudUpload,
  MdSave,
} from "react-icons/all";
import Nav from "./Nav";
import db, { storage } from "../firebase";
import { Link } from "react-router-dom";

function Profile({ user }) {
  const [image, setImage] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState(false);

  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const weightRef = useRef(null);
  const heightRef = useRef(null);
  const descRef = useRef(null);

  const onFileSubmit = (e) => {
    e.preventDefault();
    const uploadTask = storage
      .ref(`userphotos/${user.username}/${image.name}`)
      .put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => console.log(err),
      () => {
        storage
          .ref()
          .child(`userphotos/${user.username}/${image.name}`)
          .getDownloadURL()
          .then((url) => {
            setImage(null);
            db.collection("user")
              .doc(user.email)
              .update({
                photos: firebase.firestore.FieldValue.arrayUnion(url),
              });
          })
          .then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
      }
    );
  };
  const onFileChange = async (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const changeProfilePicture = async (e) => {
    const ppUrl = e.target.files[0];
    storage
      .ref(`userphotos/${user.username}/${ppUrl.name}`)
      .put(ppUrl)
      .on(
        "state_changed",
        (snapshot) => {},
        (err) => console.log(err),
        () => {
          storage
            .ref()
            .child(`userphotos/${user.username}/${ppUrl.name}`)
            .getDownloadURL()
            .then((url) => {
              db.collection("user").doc(user.email).update({
                avatar: url,
              });
            })
            .then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            });
        }
      );
  };

  const editProfile = async () => {
    await db
      .collection("user")
      .doc(user.email)
      .update({
        name: nameRef.current.value || user.name,
        age: ageRef.current.value || user.age,
        weight: weightRef.current.value || user.weight,
        height: heightRef.current.value || user.height,
        description: descRef.current.value || user.description,
      });
    window.location.reload();
  };

  useEffect(() => {
    const fetchPics = async () => {
      const pics = await db
        .collection("user")
        .doc(user && user.email)
        .get();
      setPhotos(pics.data() && pics.data().photos);
    };
    fetchPics();
  }, [user]);
  return (
    <StyledProfile>
      <Nav user={user} />
      <StyledContent>
        <Top>
          <LogoMobile>
            <Link to={"/"}>
              <GiChewedHeart id="home-mobile" color="#ff675d" size="60" />
            </Link>
          </LogoMobile>

          <h1>Your Profile</h1>
        </Top>
        <hr />
        {user && (
          <StyledUserDetail key={user.username}>
            <User>
              <UserInfo>
                <Image>
                  {settings && (
                    <label>
                      <div>
                        <MdAddAPhoto size="50" />
                        <input
                          onChange={changeProfilePicture}
                          name="file"
                          id="file"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                        />
                      </div>
                    </label>
                  )}

                  <img src={user.avatar} alt="" />
                </Image>

                <Info>
                  <Username>
                    <h1>
                      {user.name} <span>@{user.username}</span>{" "}
                    </h1>
                  </Username>
                  {settings && (
                    <StyledSettings>
                      <EditProfileForm>
                        <label>
                          Username:
                          <input
                            disabled
                            placeholder={user.username}
                            type="text"
                          />
                        </label>
                        <label>
                          E-mail:
                          <input
                            disabled
                            placeholder={user.email}
                            type="text"
                          />
                        </label>
                        <label>
                          Name:
                          <input
                            ref={nameRef}
                            placeholder={user.name}
                            type="text"
                          />
                        </label>
                        <label>
                          Age:
                          <input
                            ref={ageRef}
                            placeholder={user.age}
                            type="number"
                          />
                        </label>
                        <label>
                          Height:
                          <input
                            ref={heightRef}
                            placeholder={user.height}
                            type="number"
                          />
                        </label>
                        <label>
                          Weight:
                          <input
                            ref={weightRef}
                            placeholder={user.weight}
                            type="number"
                          />
                        </label>
                      </EditProfileForm>
                      <EditDesc>
                        <label>
                          Description:
                          <textarea
                            placeholder={user.description}
                            ref={descRef}
                          ></textarea>
                        </label>
                      </EditDesc>
                    </StyledSettings>
                  )}
                  {!settings && (
                    <Description>
                      <p>{user.description}</p>
                    </Description>
                  )}

                  <Buttons>
                    <button
                      onClick={() =>
                        settings ? setSettings(false) : setSettings(true)
                      }
                    >
                      <RiUserSettingsFill />
                      Edit Profile
                    </button>

                    {settings && (
                      <button onClick={editProfile}>
                        <MdSave />
                        Save
                      </button>
                    )}
                    {!settings && (
                      <label htmlFor="file">
                        <input
                          onChange={onFileChange}
                          name="file"
                          id="file"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                        />
                        {image === null ? (
                          <div>
                            <MdAddAPhoto />
                            <span>Add Photo</span>
                          </div>
                        ) : (
                          <div>
                            <MdAddAPhoto />
                            <span> Added</span>
                          </div>
                        )}
                      </label>
                    )}
                    {image === null ? (
                      ""
                    ) : progress === 100 ? (
                      setTimeout(() => {
                        setProgress(0);
                      }, 5000) && (
                        <button onClick={onFileSubmit}>
                          <AiFillLike />
                          Success
                        </button>
                      )
                    ) : (
                      <button onClick={onFileSubmit}>
                        <ImCloudUpload />
                        Upload
                      </button>
                    )}
                  </Buttons>
                </Info>
              </UserInfo>
            </User>
            <UserFeeds>
              {!settings && (
                <Feeds>
                  <h4>Highlights</h4>
                  <Photos>
                    {photos &&
                      photos.map((photo) => {
                        return (
                          <Feed key={photo}>
                            <img src={photo} alt="" />
                          </Feed>
                        );
                      })}
                  </Photos>
                </Feeds>
              )}
            </UserFeeds>
          </StyledUserDetail>
        )}
      </StyledContent>
    </StyledProfile>
  );
}

const EditProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media screen and (max-width: 1024px) {
    padding-left: 30px;
  }
  @media screen and (max-width: 425px) {
    padding-left: 40px;
  }
  input {
    margin-left: 20px;
    width: 500px;
    padding: 10px;
    @media screen and (max-width: 1024px) {
      width: 400px;
    }
    @media screen and (max-width: 425px) {
      width: 200px;
    }
  }
  label {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0px;
  }
`;

const StyledSettings = styled.div`
  margin-top: 20px;
  display: flex;
  @media screen and (max-width: 1540px) {
    flex-direction: column;
  }
`;

const UserFeeds = styled.div`
  margin: 40px 0;
  @media screen and (max-width: 1024px) {
    margin: 20px 5%;
  }
`;
const Photos = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 40px;
`;
const Feeds = styled.div`
  @media screen and (max-width: 1024px) {
    margin-top: 200px;
  }
  h4 {
    font-size: 25px;
  }
`;
const Feed = styled.div`
  width: 23%;
  margin-bottom: 20px;
  margin-right: 15px;
  cursor: pointer;
  @media screen and (max-width: 1024px) {
    width: 47%;
  }
  @media screen and (max-width: 425px) {
    width: 100%;
  }
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const User = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const StyledUserDetail = styled.div`
  color: #313746;
  margin-top: 40px;
`;

const UserInfo = styled.div`
  display: flex;
  @media screen and (max-width: 1024px) {
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
  position: relative;
  @media screen and (max-width: 1024px) {
    padding-left: 2vw;
  }
  @media screen and (max-width: 425px) {
    padding-left: 9vw;
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
  div {
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: white;
    border-radius: 5px;
    cursor: pointer;
  }
  svg {
    padding: 5px;
  }
  input {
    display: none;
  }
`;
const Info = styled.div`
  margin-left: 20px;
  position: relative;
  @media screen and (max-width: 768px) {
    min-width: 80vw;
  }
`;
const Username = styled.div`
  @media screen and (max-width: 1024px) {
    text-align: center;
  }
  h1 {
    font-size: 80px;
    @media screen and (max-width: 1024px) {
      text-align: center;
    }
    @media screen and (max-width: 768px) {
      font-size: 40px;
    }
  }
  span {
    font-size: 40px;
    @media screen and (max-width: 768px) {
      font-size: 20px;
    }
  }
`;
const Description = styled.div`
  width: 50%;
  @media screen and (max-width: 1024px) {
    text-align: center;
    width: 100%;
    padding: 10px 20px;
  }
`;
const Buttons = styled.div`
  margin-top: 40px;
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  @media screen and (max-width: 1540px) {
    bottom: -150px;
    align-items: center;
    justify-content: center;
    height: 150px;
  }
  @media screen and (max-width: 425px) {
    flex-wrap: wrap;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: transparent;
    color: #ff675d;
    padding: 10px 20px;
    min-width: 230px;
    border: 3px solid #ff675d;
    border-radius: 50px;
    font-size: 1.5rem;
    width: 150px;
    cursor: pointer;
    outline: none;
    margin-left: 30px;
    transition: all 0.3s ease;
    @media screen and (max-width: 940px) {
      font-size: 1.25rem;
    }
    @media screen and (max-width: 425px) {
      margin: auto;
      font-size: 1em;
      min-width: 150px;
    }
  }
  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  label {
    background-color: transparent;
    color: #ff675d;
    padding: 10px 20px;
    min-width: 230px;
    border: 3px solid #ff675d;
    border-radius: 50px;
    font-size: 1.5rem;
    width: 150px;
    cursor: pointer;
    outline: none;
    margin-left: 30px;
    transition: all 0.3s ease;
    @media screen and (max-width: 940px) {
      font-size: 1.25rem;
    }
    @media screen and (max-width: 425px) {
      margin: auto;
      font-size: 1em;
      min-width: 150px;
    }
    div {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
  form {
    display: flex;
  }
`;

const StyledProfile = styled.div`
  display: flex;
`;

const StyledContent = styled.div`
  overflow: scroll;
  overflow-x: hidden;
  padding: 40px 5vw;
  color: #313746;
  width: 100%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1440px) {
    padding: 20px 2vw;
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

const Top = styled.div`
  font-size: 1.5vw;
  display: flex;
  padding-top: 20px;
  justify-content: space-between;
  padding-bottom: 20px;
  align-items: center;

  @media screen and (max-width: 1024px) {
    font-size: 1rem;
  }
  @media screen and (max-width: 425px) {
    font-size: 0.75rem;
  }
`;

const LogoMobile = styled.div`
  @media screen and (min-width: 426px) {
    display: none;
  }
`;

const EditDesc = styled.div`
  @media screen and (min-width: 1540px) {
    margin-left: 3rem;
  }
  @media screen and (max-width: 1024px) {
    margin-left: 0;
  }
  @media screen and (max-width: 425px) {
    margin-left: 40px;
  }
  textarea {
    margin-left: 20px;
    width: 500px;
    height: 100px;
    padding: 10px;
    @media screen and (max-width: 1024px) {
      width: 400px;
    }
    @media screen and (max-width: 425px) {
      width: 200px;
    }
  }
  label {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0px;
  }
`;

export default Profile;
