import React from "react";
import { Table } from "reactstrap";

export default class List extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.listItems);
    this.state = {
      editableIndex: null,
      listItems: props.listItems,
      showAddRow: props.showAddRow,
      newItem: {
        id: Date.now(),
        workItem: "",
        dueDate: "",
        noResourcesNeeded: ""
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      listItems: nextProps.listItems,
      showAddRow: nextProps.showAddRow,
      newItem: {
        ...this.state.newItem,
        id: Date.now()
      }
    });
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      newItem: {
        ...this.state.newItem,
        [name]: value
      }
    });
  };

  editHandleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      newItem: {
        ...this.state.listItems[this.state.editableIndex],
        [name]: value
      }
    });
  };

  clearValues = () => {
    this.setState({
      newItem: {
        id: "",
        workItem: "",
        dueDate: "",
        noResourcesNeeded: ""
      }
    });
  };

  addItem = event => {
    this.props.insertData(this.state.newItem);
    this.hideAndClearAddItemRow();
    event.preventDefault();
  };

  editItem = index => {
    console.log(this.state.newItem, "new Item");
    console.log(index, "editItem index Item");
    this.props.editList(this.state.newItem, index);
    this.clearValues();
    this.setState({ editableIndex: null });
  };

  changeEditableIndex = index => {
    this.setState({
      newItem: {
        ...this.state.listItems[index]
      }
    });
    this.setState({ editableIndex: index });
    // console.log(index);
  };

  hideAndClearAddItemRow = () => {
    this.clearValues();
    this.setState({ showAddRow: false });
  };

  clearEdit = () => {
    this.setState({ editableIndex: null });
  };

  deleteItem = keyValue => {
    this.props.deleteItem(keyValue);
  };

  render() {
    return (
      <Table hover bordered>
        <thead>
          <tr>
            <td>ID</td>
            <td>Work Item</td>
            <td>Due Date</td>
            <td>No. Resources Needed</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {this.state.showAddRow ? (
            <tr>
              <td>
                <input
                  type="text"
                  name="id"
                  value={this.state.newItem.id}
                  readOnly
                  onChange={this.handleInputChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="workItem"
                  value={this.state.newItem.workItem}
                  onChange={this.handleInputChange}
                />
              </td>
              <td>
                <input
                  type="date"
                  name="dueDate"
                  value={this.state.newItem.dueDate}
                  onChange={this.handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="noResourcesNeeded"
                  value={this.state.newItem.noResourcesNeeded}
                  onChange={this.handleInputChange}
                />
              </td>
              <td>
                <button onClick={this.addItem}>
                  <ion-icon name="checkmark" />
                </button>{" "}
                <button onClick={this.hideAndClearAddItemRow}>
                  <ion-icon name="close" />
                </button>
              </td>
            </tr>
          ) : null}
          {this.state.listItems.map((ele, index) => {
            return this.state.editableIndex === index ? (
              <tr key={ele.id}>
                <td>
                  <input
                    type="text"
                    name="id"
                    value={ele.id}
                    readOnly
                    onChange={this.editHandleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="workItem"
                    defaultValue={ele.workItem}
                    onChange={this.editHandleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={ele.dueDate}
                    onChange={this.editHandleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="noResourcesNeeded"
                    defaultValue={ele.noResourcesNeeded}
                    onChange={this.editHandleInputChange}
                  />
                </td>
                <td>
                  <button onClick={() => this.editItem(index)}>
                    <ion-icon name="checkmark" />
                  </button>{" "}
                  <button onClick={() => this.clearEdit()}>
                    <ion-icon name="close" />
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={ele.id}>
                <td>{ele.id}</td>
                <td>{ele.workItem}</td>
                <td>{ele.dueDate}</td>
                <td>{ele.noResourcesNeeded}</td>
                <td>
                  <button onClick={() => this.changeEditableIndex(index)}>
                    <ion-icon name="create" />
                  </button>
                  <button onClick={() => this.deleteItem(ele.id)}>
                    <ion-icon name="trash" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}
