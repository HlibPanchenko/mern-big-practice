import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { setUsers } from "../redux/slices/userSlice";

const theme = createTheme({
  palette: {
    primary: {
      main: "#388e3c",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#E0C2FF",
      light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#47008F",
    },
  },
});

export default function BasicTable() {
  const allUsers = useAppSelector((state) => state.usersSlice.users);
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();

  function upRole(user: any) {
    if (
      user.roles[user.roles.length - 1] == "ADMIN" ||
      user.roles[user.roles.length - 1] == "SUPERADMIN"
    ) {
      return "----";
    } else if (user.roles[user.roles.length - 1] == "MANAGER") {
      return "UP TO ADMIN";
    } else {
      return "UP TO MANAGER";
    }
  }
  function downRole(user: any) {
    if (user.roles[user.roles.length - 1] == "ADMIN") {
      return "DOWN TO MANAGER";
    } else if (user.roles[user.roles.length - 1] == "MANAGER") {
      return "DOWN TO USER";
    } else {
      return "----";
    }
  }

  async function handleUpRole(id: string) {
    try {
      const response = await axios.post(
        `http://localhost:4444/auth/upuserole/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.users);
      dispatch(setUsers(response.data.users));
    } catch (error) {
      console.log("ошибка повышения статуса пользователя", error);
      // navigate("/");
    }
  }
  async function handleDownRole(id: string) {
    try {
      const response = await axios.post(
        `http://localhost:4444/auth/downuserole/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.users);
      dispatch(setUsers(response.data.users));
    } catch (error) {
      console.log("ошибка повышения статуса пользователя", error);
      // navigate("/");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            {/* <TableRow>
              <TableCell
                align="center"
                sx={{
                  p: 2,
                  display: "flex",
                  gap:2,
                  width: "100%",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                Sort <FilterListIcon />
              </TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell>Users</TableCell>
              {/* <TableCell align="center">Name</TableCell> */}
              <TableCell align="center">Mail</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Assign</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUsers?.map((user) => (
              <TableRow
                key={user.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                {/* <TableCell align="center">{user.name}</TableCell> */}
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">
                  {user.roles[user.roles.length - 1]}
                </TableCell>
                {/* <TableCell align="center">{user.roles.join(", ")}</TableCell> */}
                <TableCell
                  align="center"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Button
                    className="userCard-btn"
                    variant="outlined"
                    color="primary"
                    disabled={upRole(user) === "----"}
                    onClick={() => handleUpRole(user._id)}
                  >
                    {upRole(user)}
                  </Button>
                  <Button
                    className="userCard-btn"
                    variant="outlined"
                    color="error"
                    disabled={downRole(user) === "----"}
                    onClick={() => handleDownRole(user._id)}

                  >
                    {downRole(user)}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}
