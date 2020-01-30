import React, { Component } from "react";
import BsCard from "../../components/BsCard";
import Table from "../../components/Table";
import EditBtn from "../../components/EditBtn";
import DeleteBtn from "../../components/DeleteBtn";
import AddNewBtn from "../../components/AddNewBtn";

export class Roles extends Component {
  resourceUrl = "roles";
  columns = [
    { name: "Name", data: "name" },
    { name: "Level", data: "level" },
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
            <EditBtn permission="edit_role" className="" url={this.resourceUrl + "/" + rowData.id + "/edit"} />
            <DeleteBtn permission="delete_role"
              className="ml-1"
              url={this.resourceUrl}
              id={rowData.id}
              callBack={() => this.refreshTableMethod()}
            />
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
              Roles
              <AddNewBtn permission="add_role" url="/roles/create" />
            </div>
          }
          cardBody={
            <div>
              <Table
                setRefreshTableMethod={method =>
                  (this.refreshTableMethod = method)
                }
                tableClassName=""
                columns={this.columns}
                url={this.resourceUrl}
              />
            </div>
          }
        />
      </div>
    );
  }
}

export default Roles;
