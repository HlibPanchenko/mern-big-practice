import React from "react";
import "./AdminPage.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import UserCard from "../components/UserCard";
import { API_URL } from "../config.js";
import EnhancedTable from "../components/UserTable";
import { getAllUsers } from "../redux/slices/userSlice";
import BasicTable from "../components/UserTAble2";

interface UserData {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  __v: number;
  likedposts: string[];
  roles: string[];
}

const AdminPage: React.FC = () => {
  const token = localStorage.getItem("token");
  const user = useAppSelector((state) => state.auth.user);
  const allUsers = useAppSelector((state) => state.usersSlice.users);
  // const [allUsers, setAllUsers] = React.useState<UserData[]>([]);
  const dispatch = useAppDispatch();
  console.log(allUsers);
  
  // React.useEffect(() => {
  //   const editHandler = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:4444/auth/getallusers",

  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       console.log(response);
  //       setAllUsers(response.data);
  //     } catch (error: any) {
  //       console.log(error);
  //     }
  //   };
  //   editHandler();
  // }, []);

  React.useEffect(() => {
    console.log(token);
    
    if (token) {
      dispatch(getAllUsers(token));
    }
  }, [dispatch]);

  return (
    <div className="adm">
      <div className="adm-container">
        <div className="adm-content">
          <div className="adm-top">
            <h3 className="adm-title">Users</h3>
            <AvatarGroup total={allUsers?.length}>
              {allUsers?.slice(0, 4).map((user) => (
                <Avatar
                  alt="user photo"
                  key={user._id}
                  src={
                    user.avatar
                      ? `${API_URL + user._id + "/" + user.avatar}`
                      : "/images/user.png"
                  }
                />
              ))}
            </AvatarGroup>
          </div>
          {/* <div className="adm-list">
            <div className="adm-list-superadm">
              <div className="adm-list-cluster">SuperAdmin</div>
              {allUsers
                ?.filter((user) => user.roles.includes("SUPERADMIN"))
                .map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
            </div>
            <div className="adm-list-adm">
              <div className="adm-list-cluster">Admins</div>
              {allUsers
                ?.filter(
                  (user) =>
                    user.roles.includes("ADMIN") &&
                    !user.roles.includes("SUPERADMIN")
                )
                .map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
            </div>
            <div className="adm-list-manager">
              <div className="adm-list-cluster">Managers</div>
              {allUsers
                ?.filter(
                  (user) =>
                    user.roles.includes("MANAGER") &&
                    user.roles.includes("USER") &&
                    !user.roles.includes("ADMIN")
                )
                .map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
            </div>
            <div className="adm-list-users">
              <div className="adm-list-cluster">Users</div>
              {allUsers
                ?.filter((user) => !user.roles.includes("ADMIN" && "MANAGER"))
                .map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
            </div>
          </div> */}
          {/* <EnhancedTable/> */}
          <BasicTable/>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
