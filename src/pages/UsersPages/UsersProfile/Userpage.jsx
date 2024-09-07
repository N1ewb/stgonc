import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import DefaultProfile from "../../../static/images/default-profile.png";
import "./Userpage.css";
import { useDB } from "../../../context/db/DBContext";
import { useStorage } from "../../../context/storage/StorageContext";

const Userpage = () => {
  const auth = useAuth();
  const db = useDB();
  const storage = useStorage();
  const [user, setUser] = useState();

  // const handleUploadImage = async (event) => {
  //   const file = event.target.files[0];
  //   if (file && auth.currentUser) {
  //     try {
  //       setLoading(true);
  //       const { imageId } = await storage.UploadImage(
  //         file,
  //         auth.currentUser.uid
  //       );
  //       setUploadedImageId(imageId);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const fetchImage = async () => {
  //     if (uploadedImageId) {
  //       try {
  //         setLoading(true);
  //         const data = await storage.RetrieveImage(uploadedImageId);
  //         setImageData(data);
  //         setError(null);
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchImage();
  // }, [uploadedImageId, storage]);

  const handleGetUser = async () => {
    if (auth.currentUser) {
      const user = await db.getUser(auth.currentUser.uid);
      setUser(user);
    }
  };

  const handleChangePhoto = async (event) => {
    const file = event.target.files[0];
    if (file && auth.currentUser) {
      try {
        await db.handleChangeUserProfile(file);
        console.log("Profile photo updated successfully");
      } catch (err) {
        console.error("Error updating profile photo:", err.message);
      }
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      handleGetUser();
    }
  }, []);

  return (
    <div className="Userpage-container">
      <div className="">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Account</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Password</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">Notification</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="fourth">Help</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9} style={{ border: "1px solid black" }}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <div
                    className="account-tab-container"
                    style={{ width: "100%" }}
                  >
                    <p>General Info</p>
                    <div
                      className="change-pfp"
                      style={{
                        display: "flex",
                        width: "50%",
                        justifyContent: "space-around",
                      }}
                    >
                      <p>
                        Your Photo<br></br>
                        <span>This will be displayed on your Profile: </span>
                      </p>
                      <img
                        src={auth.currentUser.photoUrl || DefaultProfile}
                        alt="your pfp"
                        width="70px"
                        height="70px"
                      />
                      <div
                        className=""
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          top: "50px",
                          right: "48px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          width: "25px",
                          height: "25px",
                          padding: "2px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="file"
                          name="updateProfile"
                          onChange={handleChangePhoto}
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div
                      className=""
                      style={{
                        display: "flex",
                        width: "50%",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>First Name</p>
                      <p>{user && user.firstName}</p>
                      <p>Last Name</p>
                      <p>{user && user.lastName}</p>
                      <p>Email</p>
                      <p>{user && user.email}</p>
                      <p>Phone Number</p>
                      <p>{user && user.phoneNumber}</p>
                      <p>SPC {user && user.role}</p>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
                <Tab.Pane eventKey="third">First tab content</Tab.Pane>
                <Tab.Pane eventKey="fourth">Second tab content</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </div>
  );
};

export default Userpage;
