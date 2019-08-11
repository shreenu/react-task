import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";

export default class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noOfWorkItems: props.noOfWorkItems
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ noOfWorkItems: nextProps.noOfWorkItems });
  }

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">React Task</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>Number of Work Items: {this.state.noOfWorkItems}</NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
