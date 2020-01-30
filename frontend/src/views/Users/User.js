import React, { Component } from "react";
import { ErrorMessage, Field } from "formik";
import BsCard from "../../components/BsCard";
import * as yup from "yup"; // for everything
import FormWrapper from "../../components/FormWrapper";
import ValidationHelper from '../../classes/ValidationHelper';
import CrudHelper from '../../classes/CrudHelper';

export class User extends Component {
  resourceUrl = "users";
  constructor(props) {
    super(props);

    this.state = {
      editingId: null,
      allRoles: []
    };
  }

  componentDidMount() {
    let editingId = this.props.match.params.id;
    this.setState({
      editingId: editingId,
    });

    CrudHelper.loadAll("roles?load_all=1")
      .then(response => {
        this.setState({ allRoles: response.data });
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
      userid: yup
        .string()
        .min(3, minimum3Message)
        .required(requiredMessage),
      email: yup
        .string()
        .email(ValidationHelper.validEmailMessage())
        .required(requiredMessage),
      mobile: yup
        .string()
        .min(3, minimum3Message)
        .required(requiredMessage),
      password:
        this.state.editingId == null
          ? yup
            .string()
            .min(3, minimum3Message)
            .required(requiredMessage)
          : yup.string().min(3, minimum3Message),
      password_confirmation:
        this.state.editingId == null
          ? yup
            .string()
            .required(requiredMessage)
            .oneOf([yup.ref("password")], "Passwords must match")
          : yup.string().oneOf([yup.ref("password")], "Passwords must match"),
      role_id:
        yup.number()
          .when(['user_type', 'is_super_admin'], {
            is: (user_type, is_super_admin) => {
              return user_type === "Admin User" &&
                (is_super_admin === 0 || is_super_admin === "0");
            },
            then: yup.number().moreThan(0, 'Please select Role').required(requiredMessage)
          })
    });

    return (
      <div className="animated fadeIn">
        <BsCard
          cardHeader={<div>User</div>}
          cardBody={
            <FormWrapper
              editingId={this.state.editingId}
              resourceUrl={this.resourceUrl}
              initialValues={
                {
                  name: '',
                  userid: '',
                  email: '',
                  mobile: '',
                  password: '',
                  password_confirmation: '',
                  user_type: 'Site User',
                  is_super_admin: 0,
                  role_id: 0
                }
              }
              setInitialValuesFromResposeData={(data) => {
                return {
                  name: data.name,
                  userid: data.userid,
                  email: data.email,
                  mobile: data.mobile,
                  password: "",
                  password_confirmation: "",
                  user_type: data.user_type,
                  is_super_admin: data.is_super_admin,
                  role_id: data.role_id ? data.role_id : 0
                }
              }}
              validationSchema={validationSchema}
              formInputs={({ values, handleSubmit, isSubmitting }) => (
                <div className="row">
                  {/* {JSON.stringify(values)} */}
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

                    <div className="form-group">
                      <label htmlFor="userid">User ID</label>
                      <Field
                        type="text"
                        className="form-control"
                        name="userid"
                        id="userid"
                      />
                      <ErrorMessage
                        name="userid"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <Field
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="mobile">Mobile</label>
                      <Field
                        type="text"
                        className="form-control"
                        name="mobile"
                        id="mobile"
                      />
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <Field
                        type="password"
                        className="form-control"
                        name="password"
                        id="password"
                        placeholder={
                          this.state.editingId != null
                            ? "Leave empty if you don't want to change password"
                            : ""
                        }
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger"
                        placeholder={
                          this.state.editingId != null
                            ? "Leave empty if you don't want to change password"
                            : ""
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password_confirmation">
                        Confirm Password
                          </label>
                      <Field
                        type="password"
                        className="form-control"
                        name="password_confirmation"
                        id="password_confirmation"
                      />
                      <ErrorMessage
                        name="password_confirmation"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="user_type">User Type</label>
                      <Field
                        component="select"
                        className="form-control"
                        name="user_type"
                        id="user_type"
                      >
                        <option value="Site User">Site User</option>
                        <option value="Admin User">Admin User</option>
                      </Field>
                      <ErrorMessage
                        name="user_type"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    {values.user_type === "Admin User" && (
                      <div>
                        <div className="form-group">
                          <label htmlFor="is_super_admin">
                            Is Super Admin
                              </label>
                          <Field
                            component="select"
                            className="form-control"
                            name="is_super_admin"
                            id="is_super_admin"
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </Field>
                          <ErrorMessage
                            name="is_super_admin"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                        {values.is_super_admin !== 1 &&
                          values.is_super_admin !== "1" && (
                            <div className="form-group">
                              <label htmlFor="role_id">Role</label>
                              <Field
                                component="select"
                                className="form-control"
                                name="role_id"
                                id="role_id"
                              >
                                <option value="0">---</option>
                                {this.state.allRoles.map(role => (
                                  <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="role_id"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            />
          }
        ></BsCard>
      </div>
    );
  }
}

export default User;
