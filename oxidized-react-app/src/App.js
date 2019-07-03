import React from 'react';
import store from './store';
import logo from './logo.svg';
import './App.css';
import NodeTable from './components/NodeTable'
import {Pane, Heading, Button, TextInput, Icon, Table} from "evergreen-ui";
import {getNodes} from "./actions";

store.dispatch(getNodes());

function App() {
  return (
    <div className="App">
      <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
        <Pane flex={1} alignItems="center" display="flex">
          <Heading size={600}>Oxidized</Heading>
        </Pane>
        <Pane>
          <TextInput
              name="config-search"
              placeholder="Search in Configs"
              marginRight={10}
          />
          <Button appearance="primary"><Icon icon="search"/></Button>
        </Pane>
      </Pane>
      <Pane>
    <NodeTable/>
      </Pane>
    </div>
  );
}

export default App;
