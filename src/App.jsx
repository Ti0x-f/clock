import React from 'react'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      currentSession: 25,
      currentBreak: 5
    };
  }

  



  render() {
    return (
      <div className = "session-and-break">
        <Selector id="session" decrement={true} increment={true} value={this.state.sessionLength}/>
        <Selector id="break" decrement={true} increment={true} value={this.state.breakLength} />
      </div>
    );
  }
}

const Selector = ({id, decrement, increment, value}) => {
  return (
    <div id="{id}-label">
      <p>{id.charAt(0).toUpperCase() + id.slice(1)} Length</p>
      <button id="{id}-increment" onClick={increment}>+</button>
      <p id="{id}-length">{value}</p>
      <button id="{id}-decrement" onClick={decrement}>-</button>
    </div>
  );

} 


export default App;