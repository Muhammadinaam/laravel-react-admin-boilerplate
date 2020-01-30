import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class BoolDisplay extends Component {
    static propTypes = {
        value: PropTypes.bool,
    }

    render() {
        return (
            <>
                {this.props.value ? <i className="fa fa-check text-success" /> : <i className="fa fa-times text-danger" /> }
            </>
        )
    }
}

export default BoolDisplay
