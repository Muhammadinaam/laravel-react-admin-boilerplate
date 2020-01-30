import React, { Component } from 'react'

export class NoPermission extends Component {
    render() {
        return (
            <div>
                <div className="alert alert-danger">
                  You do not have permission to view this page
                </div>
            </div>
        )
    }
}

export default NoPermission
