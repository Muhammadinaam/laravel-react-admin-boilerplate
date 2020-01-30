import React, { Component, Fragment } from "react";
import { ErrorMessage, Field } from "formik";
import BsCard from "../../components/BsCard";
import * as yup from "yup"; // for everything
import FormWrapper from "../../components/FormWrapper";
import ValidationHelper from "../../classes/ValidationHelper";
import axios from "axios";

export class Role extends Component {
  resourceUrl = "roles";
  constructor(props) {
    super(props);

    this.state = {
      editingId: null,
      allPermissions: []
    };
  }

  componentDidMount() {
    let editingId = this.props.match.params.id;
    this.setState({
      editingId: editingId
    });

    axios
      .get(process.env.REACT_APP_API_URL + "api/get-all-permissions?grouped=1")
      .then(response => {
        let data = response.data;
        this.setState({ allPermissions: data });
      });
  }

  render() {
    const minimum3Message = ValidationHelper.minimumCharactersMessage(3);
    const requiredMessage = ValidationHelper.requiredMessage();
    const validationSchema = yup.object().shape({
      name: yup
        .string()
        .min(3, minimum3Message)
        .required(requiredMessage),
      level: yup
        .number()
        .typeError(ValidationHelper.validNumberMessage())
        .positive(ValidationHelper.positiveNumberMessage())
        .required(requiredMessage)
    });

    return (
      <div className="animated fadeIn">
        <BsCard
          cardHeader={<div>Role</div>}
          cardBody={
            <FormWrapper
              editingId={this.state.editingId}
              resourceUrl={this.resourceUrl}
              initialValues={{
                name: "",
                level: 0
              }}
              setInitialValuesFromResposeData={data => {
                let permissionsData = {};
                if (data.permissions) {
                  data.permissions.forEach(permission => {
                    permissionsData[permission.idt] = true;
                  });
                }

                return {
                  name: data.name,
                  level: data.level,
                  permissions: permissionsData
                };
              }}
              validationSchema={validationSchema}
              formInputs={({ values, handleSubmit, isSubmitting }) => (
                <>
                  {/* {JSON.stringify(values)} */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <Field
                          type="text"
                          className="form-control"
                          name="name"
                          id="name"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="level">Level</label>
                        <Field
                          type="number"
                          className="form-control"
                          name="level"
                          id="level"
                          aria-describedby="levelHelp"
                        />
                        <span id="levelHelp" className="form-text text-muted">
                          A user with lower level Role will not have access to
                          higher level Roles
                        </span>
                        <ErrorMessage
                          name="level"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <h4>Permissions</h4>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Permission</th>
                            <th className="text-center" width="20%">
                              Allowed
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(this.state.allPermissions).map(
                            permissionGroupName => {
                              return (
                                <Fragment key={permissionGroupName}>
                                  <tr className="table-info">
                                    <td colSpan="2">{permissionGroupName}</td>
                                  </tr>

                                  {this.state.allPermissions[
                                    permissionGroupName
                                  ].map((permissionRow, index) => {
                                    return (
                                      <tr key={permissionRow.idt}>
                                        <td>{permissionRow.name}</td>
                                        <td className="text-center">
                                          <Field
                                            name={
                                              "permissions[" +
                                              permissionRow.idt +
                                              "]"
                                            }
                                            id={
                                              "permissions[" +
                                              permissionRow.idt +
                                              "]"
                                            }
                                          >
                                            {({ field }) => (
                                              <input
                                                type="checkbox"
                                                {...field}
                                                value={field.value || false}
                                                defaultChecked={
                                                  field.value || false
                                                }
                                              />
                                            )}
                                          </Field>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </Fragment>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            />
          }
        ></BsCard>
      </div>
    );
  }
}

export default Role;
