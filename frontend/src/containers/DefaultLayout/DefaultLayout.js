import React, { Component, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import * as router from "react-router-dom";
import { Container } from "reactstrap";
import { PrivateRoute } from "./../../components/PrivateRoute";
import Auth from "../../classes/Auth";
import cloneDeep from "lodash/cloneDeep";

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";

const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  permittedNavigation = { items: [] };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      username: "",
      errorMessage: null,
      isLoggedIn: false
    };
  }

  async componentDidMount() {
    const isLoggedIn = await Auth.isLoggedIn();
    
    if (isLoggedIn) {
      Auth.loadUserInformationAndSettings(
        () => {
          let newState = {
            loading: false,
            username: Auth.userInformationAndSettings["user_information"].name,
            'isLoggedIn': isLoggedIn
          };

          this.permittedNavigation = this.getfilteredNavigationByPermissions();
          this.setState(newState);
        },
        () => {
          this.setState({
            loading: false,
            errorMessage: "Error occurred in loading User Information.",
            'isLoggedIn': isLoggedIn
          });
        }
      );
    } else {
      this.setState({
        loading: false,
        'isLoggedIn': false
      });
    }
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  signOut(e) {
    e.preventDefault();
    Auth.logout(() => {
      this.props.history.push("/login");
    });
  }

  getfilteredNavigationByPermissions() {
    let filteredNavigationItems = [];
    let nonEmptyNavigationItems = [];
    this.checkPermissionsRecursively(navigation.items, filteredNavigationItems);
    this.checkEmpty(filteredNavigationItems, nonEmptyNavigationItems);

    return { items: nonEmptyNavigationItems };
  }

  checkEmpty(sourceNavItems, destinationNavItems) {
    sourceNavItems.forEach(sourceNavItem => {
      if (sourceNavItem.children) {
        if (sourceNavItem.children.length > 0) {
          destinationNavItems.push(sourceNavItem);
        }
      } else {
        destinationNavItems.push(sourceNavItem);
      }
    });
  }

  checkPermissionsRecursively(sourceNavItems, destinationNavItems) {
    sourceNavItems.forEach((sourceNavItem, sourceNavItemIndex) => {
      if (
        sourceNavItem.permission &&
        Auth.hasPermission(sourceNavItem.permission)
      ) {
        destinationNavItems.push(cloneDeep(sourceNavItem));
      }

      if (sourceNavItem.children) {
        // add this sourceNavItem in destinationNavItems
        destinationNavItems.push(cloneDeep(sourceNavItem));

        let newlyAddedDestinationNavItem =
          destinationNavItems[destinationNavItems.length - 1];
        newlyAddedDestinationNavItem.children = [];
        this.checkPermissionsRecursively(
          sourceNavItem.children,
          newlyAddedDestinationNavItem.children
        );
      }

      if (sourceNavItem.permission && sourceNavItems.children) {
        console.error(
          "Do not set permission attribute of a nav item which has children"
        );
      }
    });
  }

  render() {
    return this.state.loading === true ? (
      this.loading()
    ) : (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader
              username={this.state.username}
              onLogout={e => this.signOut(e)}
            />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              {this.state.loading === false && (
                <AppSidebarNav
                  navConfig={this.permittedNavigation}
                  {...this.props}
                  router={router}
                />
              )}
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            {this.state.errorMessage != null ? (
              <div className="container">
                <br />
                <div className="alert alert-danger" role="alert">
                  {this.state.errorMessage}
                </div>
              </div>
            ) : (
              <>
                <AppBreadcrumb appRoutes={routes} router={router} />
                <Container fluid>
                  <Suspense fallback={this.loading()}>
                    <Switch>
                      {this.state.isLoggedIn === true ? (
                        routes.map((route, idx) => {
                          return route.component ? (
                            <PrivateRoute
                              key={idx}
                              path={route.path}
                              exact={route.exact}
                              name={route.name}
                              component={route.component}
                              permission={route.permission}
                            />
                          ) : null;
                        })
                      ) : (
                        <Redirect to="/login" />
                      )}
                      <Redirect from="/" to="/dashboard" />
                    </Switch>
                  </Suspense>
                </Container>
              </>
            )}
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
