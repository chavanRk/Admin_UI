import React, { useEffect, useState } from "react";
import "./UsersList.css";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Pagination Start
  const [pageCount, setPageCount] = useState(0);
  const itemPerPage = 10;
  const totalPages = Math.ceil(users.length / itemPerPage);
  const pageChange = ({ selected }) => {
    setPageCount(selected);
  };
  // pagination end

  useEffect(() => {
    getUsersDetails();
  }, []);
  const getUsersDetails = () => {
    fetch(`https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        // console.log(data);
      })
      // catch error
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  // Delete User
  const deleteUser = (selectedUser) => {
    let userAfterDeletion = users.filter((user) => {
      return user.id !== selectedUser;
    });
    setUsers(userAfterDeletion);
  };

  // Delete Selected Users
  const deleteSelectedUsers = () => {
    let userAfterDeletion = users.filter((user) => {
      return !selectedUsers.includes(user.id);
    });
    setUsers(userAfterDeletion);
    setSelectedUsers([]);
  };  
  

  // Edit Data 
  const editUserDetails = (selectedUser) => {
    const updatedName = prompt("Enter updated name:");
    const updatedEmail = prompt("Enter updated email:");
    const updatedRole = prompt("Enter updated role:");

    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser) {
        return {
          ...user,
          name: updatedName,
          email: updatedEmail,
          role: updatedRole,
        };
      } else {
        return user;
      }
    });
    setUsers(updatedUsers);
  };

  return (
    <div className="container">
      <br />
      <input
        type="text"
        name="name"
        placeholder=" Search by name, email or role "
        onChange={(e) => setSearchUser(e.target.value)}
      />

      <table className="table">
        <tr>
          <th>
            <input type="checkbox" />{" "}
            
          </th>
          <th>Name </th>
          <th>Email </th>
          <th>Role</th>
          <th>Actions</th>
        </tr>

        {users
          //Search Data by Input
          .filter((user) => {
            if (searchUser === "") return user;
            else if (
              user.name.includes(searchUser) ||
              user.email.includes(searchUser) ||
              user.role.includes(searchUser)
            ) {
              return user;
            }
            return null;
          })
          .slice(pageCount * itemPerPage, pageCount * itemPerPage + itemPerPage)
          .map((user) => (
            <tr key={user.id}>
              <input type="checkbox" />
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="btn">
                <button onClick={() => editUserDetails(user.id)}>
                  <AiFillEdit />
                </button>
                <button onClick={() => deleteUser(user.id)}>
                  <AiFillDelete />
                </button>
              </td>
            </tr>
          ))}
          <button onClick={deleteSelectedUsers}>Delete Selected</button>
      </table>
      <br />
      <br />

      <ReactPaginate
        className="pagination"
        previousLabel={"Prev"}
        nextLabel={"Next"}
        pageCount={totalPages}
        onPageChange={pageChange}
        breakClassName={"ant-pagination"}
      />
    </div>
  );
}

export default UsersList;
