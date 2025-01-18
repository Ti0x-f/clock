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
    this.decrement = this.decrement.bind(this);
    this.increment = this.increment.bind(this);
  }

  decrement(sessionOrBreak) {
    if (sessionOrBreak === "break") {
      this.setState((prevState) => ({
        breakLength: Math.max(1, prevState.breakLength - 1),
        currentBreak: Math.max(1, prevState.breakLength - 1)
      }));
    } else if (sessionOrBreak === "session") {
      this.setState((prevState) => ({
        sessionLength: Math.max(1, prevState.sessionLength - 1),
        currentSession: Math.max(1, prevState.sessionLength - 1)
      }));
    }
  }

  increment(sessionOrBreak) {
    if (sessionOrBreak === "break") {
      this.setState((prevState) => ({
        breakLength: Math.min(60, prevState.breakLength + 1),
        currentBreak: Math.min(60, prevState.breakLength + 1)
      }));
    } else if (sessionOrBreak === "session") {
      this.setState((prevState) => ({
        sessionLength: Math.min(60, prevState.sessionLength + 1),
        currentSession: Math.min(60, prevState.sessionLength + 1)
      }));
    }
  }



  render() {
    return (
      <div className = "session-and-break">
        <Selector id="session" decrement={this.decrement} increment={this.increment} value={this.state.sessionLength}/>
        <Selector id="break" decrement={this.decrement} increment={this.increment} value={this.state.breakLength} />
      </div>
    );
  }
}

const Selector = ({id, decrement, increment, value}) => {
  return (
    <div id={id + "-label"}>
      <p>{id.charAt(0).toUpperCase() + id.slice(1)} Length</p>
      <button id={id + "-increment"} onClick={() => increment(id)}>+</button>
      <p id={id + "-length"}>{value}</p>
      <button id={id + "-decrement"} onClick={() => decrement(id)}>-</button>
    </div>
  );

} 


export default App;