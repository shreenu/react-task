/* global gapi */
import React, { Component } from "react";
import { Button } from "reactstrap";
import MenuBar from "./components/MenuBar";
import "./App.css";
import List from "./components/List";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: this.getItems(),
      noOfWorkItems: window.localStorage.length,
      showAddRow: false
    };
    // this.setInitValues();
  }

  spreadsheetId = "1fgK1HuqgKRQD6IxmDxKOWVwrWqT-kyvrrFtyXf-p6T4";

  setInitValues = () => {
    window.localStorage.setItem(
      Date.now(),
      JSON.stringify({
        id: Date.now(),
        workItem: "testing",
        dueDate: "2019-08-13",
        noResourcesNeeded: 8
      })
    );
  };

  deleteItem = keyValue => {
    window.localStorage.removeItem(keyValue);
    this.refreshData();
  };

  insertData = newItem => {
    window.localStorage.setItem(
      newItem.id,
      JSON.stringify({
        ...newItem
      })
    );
    this.refreshData();
  };

  editList = (updatedItem, index) => {
    let tempList = Object.assign([], this.state.listItems);
    tempList[index] = updatedItem;
    console.log(updatedItem.id);
    this.setState({ listItems: tempList });
    console.log(this.state.listItems);
    window.localStorage.setItem(updatedItem.id, JSON.stringify(updatedItem));
    this.refreshData();
  };

  getItems = () => {
    let Items = [];
    for (let i = 0; i <= window.localStorage.length - 1; i++) {
      let key = localStorage.key(i);
      Items.push(JSON.parse(localStorage.getItem(key)));
    }
    return Items;
  };

  uploadSheed = event => {
    this.authenticate()
      .then(this.loadClient)
      .then(this.clearAllDataFromSheet)
      .then(this.insertDataintoSheet)
      .then(data => {
        console.log("okokokokoko");
      });
    event.preventDefault();
  };

  clearAllDataFromSheet = () => {
    return gapi.client.sheets.spreadsheets.values
      .batchClear({
        spreadsheetId: this.spreadsheetId,
        resource: {
          ranges: ["A1:D1000"]
        }
      })
      .then(
        function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
        },
        function(err) {
          console.error("Execute error", err);
        }
      );
  };

  insertDataintoSheet = () => {
    let values = [["ID", "Work Item", "Due Date", "No. resoures needed"]];
    this.state.listItems.forEach(ele => {
      values.push(Object.values(ele));
    });
    return gapi.client.sheets.spreadsheets.values
      .append({
        spreadsheetId: this.spreadsheetId,
        range: ["A1"],
        valueInputOption: "USER_ENTERED",
        resource: {
          majorDimension: "ROWs",
          values: values
        }
      })
      .then(response => {
        var result = response.result;
        console.log(`${result.updates.updatedCells} cells appended.`);
      });
  };

  authenticate = () => {
    return gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/spreadsheets" })
      .then(
        function() {
          console.log("Sign-in successful");
        },
        function(err) {
          console.error("Error signing in", err);
        }
      );
  };

  loadClient = () => {
    return gapi.client
      .load("https://content.googleapis.com/discovery/v1/apis/sheets/v4/rest")
      .then(
        function() {
          console.log("GAPI client loaded for API");
        },
        function(err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  };

  refreshData = even => {
    //this.setInitValues();
    this.setState({
      listItems: this.getItems(),
      noOfWorkItems: window.localStorage.length
    });
  };

  insertandget = event => {
    this.setState({
      showAddRow: this.state.showAddRow ? false : true
    });
  };

  render() {
    return (
      <div className="App container">
        <MenuBar noOfWorkItems={this.state.noOfWorkItems} />
        <br />
        <div className="row">
          <div className="col">
            <Button color="primary" size="lg" onClick={this.uploadSheed}>
              Upload to Google SpreadSheet{" "}
            </Button>{" "}
            <Button color="secondary" size="lg" onClick={this.insertandget}>
              Add new Item
            </Button>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col">
            <List
              listItems={this.state.listItems}
              showAddRow={this.state.showAddRow}
              insertData={this.insertData}
              editList={this.editList}
              deleteItem={this.deleteItem}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
