import React, { Component } from "react";
import { Formik } from "formik";
import CrudHelper from "../classes/CrudHelper";
import { withRouter } from 'react-router-dom';
import ErrorFocus from "../components/ErrorFocus";

export class FormWrapper extends Component {

  mounted = false;

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      initialValues: props.initialValues,
      editingId: null
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(parentProps) {
    this.setState({ editingId: parentProps.editingId });

    if (parentProps.editingId) {
      this.setState({ loading: true });
      CrudHelper.loadResourceForEdit(this.props.resourceUrl, parentProps.editingId).then(
        response => {
          if (this.mounted) {
            let data = response.data;
            let initialValues = this.props.setInitialValuesFromResposeData(data);
            this.setState({
              loading: false,
              initialValues: initialValues
            });
          }
        }
      );
    }
  }

  render() {
    return (
      this.state.loading ? (
        "Loading..."
      ) : (
          <Formik
            initialValues={this.state.initialValues}
            validationSchema={this.props.validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              let method =
                this.props.editingId == null ? "store" : "update";
              CrudHelper.storeOrUpdate(
                method,
                this.props.resourceUrl,
                this.props.editingId,
                values,
                () => this.props.history.push('/' + this.props.resourceUrl)
              ).finally(() => {
                setSubmitting(false);
              });
            }}
          >
            {({ values, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                {/* {JSON.stringify(values)} */}

                {this.props.formInputs({ values, handleSubmit, isSubmitting })}
                <ErrorFocus />

                <div className="text-right">
                  <button
                    type="submit"
                    className="btn btn btn-primary"
                    disabled={isSubmitting}
                  >
                    <i className="fa fa-save"></i>&nbsp; Save
                      </button>
                </div>
              </form>
            )}
          </Formik>
        )
    );
  }
}

export default withRouter(FormWrapper);