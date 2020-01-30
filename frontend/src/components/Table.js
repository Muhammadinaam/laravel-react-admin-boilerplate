import React, { Component } from "react";
import axios from "axios";

export class Table extends Component {

  mounted = false;

  constructor(props) {
    super(props);

    this.state = {
      quickSearch: "",
      tableData: null,
      loading: false
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.refreshTableData();
    this.props.setRefreshTableMethod(this.refreshTableData.bind(this));
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  refreshTableData() {
    this.setState({ loading: true });
    this.loadData(this.getRequestParams());
  }

  loadNextPage = e => {
    e.preventDefault();
    const tableData = this.state.tableData;
    let paramsData = this.getRequestParams();
    paramsData["page"] = +tableData.current_page + 1;
    this.loadData(paramsData);
  };

  loadPreviousPage = e => {
    e.preventDefault();
    const tableData = this.state.tableData;
    let paramsData = this.getRequestParams();
    paramsData["page"] = +tableData.current_page - 1;
    this.loadData(paramsData);
  };

  loadData(paramsData) {
    this.setState({ loading: true });
    axios
      .get(process.env.REACT_APP_API_URL + "api/" + this.props.url, {
        params: paramsData
      })
      .then(data => {
        if (this.mounted) {
          this.setState({ tableData: data.data });
        }
      })
      .finally(() => {
        if (this.mounted) {
          this.setState({ loading: false });
        }
      });
  }

  renderCell(rowData, columnInfo) {
    if (columnInfo.data) {

      let parts = columnInfo.data.split('.');
      let cellValue = null;
      if(parts.length > 1) {
        parts.forEach(part => {
          cellValue = cellValue == null ? rowData[part] : cellValue[part];
        })
        return cellValue;
      }

      return rowData[columnInfo.data];
    }

    if (columnInfo.render) {
      return columnInfo.render(rowData);
    }
  }

  generateTableRows() {
    if (this.state.loading) {
      return (
        <tr>
          <td colSpan="100" className="text-center">
            Loading...
          </td>
        </tr>
      );
    }

    if (this.state.tableData != null) {
      const rowsData = this.state.tableData.data;
      if (rowsData.length === 0) {
        return (
          <tr>
            <td colSpan="100" className="text-center">
              No Data Found
            </td>
          </tr>
        );
      } else {
        return rowsData.map((row, rowIndex) => {
          return (
            <tr key={rowIndex}>
              {this.props.columns.map((column, colIndex) => {
                return (
                  <td key={colIndex} className={column["className"]}>
                    {this.renderCell(row, column)}
                  </td>
                );
              })}
            </tr>
          );
        });
      }
    }

    return (
      <tr>
        <td colSpan="100" className="text-center">
          Loading...
        </td>
      </tr>
    );
  }

  generateTableFooter() {
    if (this.state.tableData) {
      return (
        <div className="row">
          <div className="col-md-6">
            <small>
              Page: <b>{this.state.tableData.current_page}</b>, Showing{" "}
              <b>
                {this.state.tableData.total < this.state.tableData.per_page
                  ? this.state.tableData.total
                  : this.state.tableData.per_page}
              </b>{" "}
              of{" total "}
              <b>{this.state.tableData.total}</b> records
            </small>
          </div>
          <div className="col-md-6">
            <ul className="pagination pagination-sm float-right disabled">
              <li
                className={
                  "page-item " +
                  (this.state.loading ||
                    this.state.tableData.prev_page_url == null
                    ? "disabled"
                    : "")
                }
              >
                <button
                  className="page-link"
                  onClick={this.loadPreviousPage}
                >
                  Previous
                </button>
              </li>
              <li
                className={
                  "page-item " +
                  (this.state.loading ||
                    this.state.tableData.next_page_url == null
                    ? "disabled"
                    : "")
                }
              >
                <button className="page-link" onClick={this.loadNextPage}>
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      );
    }
  }

  searchInputKeyUp = e => {
    this.setState({ quickSearch: e.target.value }, () => {
      this.loadData(this.getRequestParams())
    });
  };

  getRequestParams() {
    let params = {
      quick_search: this.state.quickSearch,
      page: this.state.tableData ? this.state.tableData.current_page : 1
    };
    return params;
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6"></div>
          <div className="input-group mb-3 col-md-6">
            <input
              type="text"
              className="form-control"
              onKeyUp={this.searchInputKeyUp}
            />
            <div className="input-group-append">
              <span className="input-group-text">
                <i className="fa fa-search"></i>
              </span>
            </div>
          </div>
        </div>

        <table className={"table " + this.props.tableClassName}>
          <thead>
            <tr>
              {this.props.columns.map((column, index) => {
                return (
                  <th
                    key={index}
                    width={column["width"]}
                    className={column["className"]}
                  >
                    {column["name"]}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{this.generateTableRows()}</tbody>
        </table>
        {this.generateTableFooter()}
      </div>
    );
  }
}

export default Table;
