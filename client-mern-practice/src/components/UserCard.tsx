import React from "react";
import Button from "@mui/material/Button";
import "../page/AdminPage.scss";

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

interface allUsersProps {
  user: UserData;
  // quantity: "one" | "all";
}

const UserCard: React.FC<allUsersProps> = ({ user }) => {
  //   const roleToBeAssigned = user?.roles.some((role) => role == "ADMIN");
  const isAdmin = user?.roles.some((role) => role == "ADMIN");

  const roleToAssign = (roles: string[]) => {
    console.log(roles);
    if (roles.includes("SUPERADMIN")) {
      return "---";
    } else if (roles.includes("ADMIN") && !roles.includes("SUPERADMIN")) {
      return "revoke admin status";
    } else if (
      !roles.includes("ADMIN") &&
      !roles.includes("SUPERADMIN") &&
      roles.includes("MANAGER")
    ) {
      return "assign as admin";
    } else {
      return "asign as manager";
    }
  };

  const assignedRole = roleToAssign(user.roles);

  return (
    <div className="adm-user-card userCard">
      <div className="userCard-content">
      <div className="userCard-name">{user.name}</div>
      <div className="userCard-email">{user.email}</div>
      {/* <div className="userCard-date">20.08.2023</div> */}
      <div className="userCard-role">
        {user.roles.map((role, index) => (
          <p key={index}>{role}</p>
        ))}
      </div>
      </div>
          <div className="userCard-buttons">

      <Button className="userCard-btn" variant="outlined">
        {assignedRole}
      </Button>
      <Button className="userCard-btn" variant="outlined" color="error">
  Error
</Button>
          </div>
    </div>
  );
};

export default UserCard;
