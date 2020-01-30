import React, { Component } from "react";

export class BsCard extends Component {
  render() {
    return (
      <div className="card animated fadeIn">
        <div className="card-header">
          {this.props.cardHeader}
        </div>
        <div className="card-body">
          {this.props.cardBody}
        </div>
      </div>
    );
  }
}

export default BsCard;
