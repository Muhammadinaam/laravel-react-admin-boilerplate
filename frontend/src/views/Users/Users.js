import React, { Component } from "react";
import BsCard from "../../components/BsCard";
import Table from "../../components/Table";
import EditBtn from "../../components/EditBtn";
import DeleteBtn from "../../components/DeleteBtn";
import AddNewBtn from "../../components/AddNewBtn";
import BoolDisplay from "../../components/BoolDisplay";

export class Users extends Component {
  columns = [
    { name: "Name", data: "name" },
    { name: "User Type", data: "user_type" },
    {
      name: "Is Super Admin",
      className: 'text-center',
      render: rowData => {
        return <BoolDisplay value={rowData.is_super_admin === 1} />;
      }
    },
    { name: "Role", data: "role.name" },
    {
      name: "Status",
      render: rowData => {
        return rowData.status === 1 ? (
          <span className="badge badge-success">Activated</span>
        ) : (
          <span className="badge badge-danger">Deactivated</span>
        );
      }
    },
    {
      name: "Action",
      width: "20%",
      className: "text-center",
      render: rowData => {
        return (
          <>
            <EditBtn permission="edit_user" className="" url={"users/" + rowData.id + "/edit"} />
            <DeleteBtn permission="delete_user" className="ml-1" url="users" id={rowData.id} callBack={() => this.refreshTableMethod()} />
          </>
        );
      }
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      news: []
    };
  }

  render() {
    return (
      <div className="animated fadeIn">
        <BsCard
          cardHeader={
            <div>
              Users
              <AddNewBtn permission="add_user" url="/users/create" />
            </div>
          }
          cardBody={
            <div>
              <Table setRefreshTableMethod={method => this.refreshTableMethod = method} tableClassName="" columns={this.columns} url="users" />
            </div>
          }
        />
      </div>
    );
  }
}

export default Users;
