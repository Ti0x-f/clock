import React from 'react'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      currentSession: 25 * 60,
      currentBreak: 5 * 60,
      running: false,
      pause: true,
      sessionRunning: false,
      breakRunning: false
    };
    this.decrement = this.decrement.bind(this);
    this.increment = this.increment.bind(this);
    this.handleStartPause = this.handleStartPause.bind(this);
    this.reset = this.reset.bind(this);
    this.handleTimer = this.handleTimer.bind(this);
  }

  handleStartPause() {
    if (!this.state.sessionRunning && !this.state.breakRunning) {
        this.setState((prevState) => ({
            sessionRunning: !prevState.sessionRunning,
        }));
    }

    this.setState((prevState) => ({
        running: !prevState.running,
        pause: !prevState.pause,
    }));
}

componentDidUpdate(prevProps, prevState) {
  if (!prevState.running && this.state.running) {
      this.handleTimer();
  }
  if (prevState.running && !this.state.running) {
      clearInterval(this.timer);
  }
}



  handleTimer() {
    if (this.timer) clearInterval(this.timer);
    if (this.state.running) {
        this.timer = setInterval(() => {
            this.setState((prevState) => {
                if (prevState.sessionRunning && prevState.currentSession > 0) {
                    return { currentSession: prevState.currentSession - 1 };
                } else if (prevState.breakRunning && prevState.currentBreak > 0) {
                    return { currentBreak: prevState.currentBreak - 1 };
                } else if (prevState.sessionRunning) {
                    return { sessionRunning: false, breakRunning: true, currentSession: this.state.sessionLength * 60  };
                } else {
                    return { sessionRunning: true, breakRunning: false, currentBreak: this.state.breakLength * 60 };
                }
            });
        }, 1000);
    }
}

  reset() {
    this.setState(() => ({
      sessionLength: 25,
      breakLength: 5,
      currentSession: 25 * 60,
      currentBreak: 5 * 60,
      running: false,
      pause: true,
      sessionRunning: false,
      breakRunning: false
    }))
  }

  decrement(sessionOrBreak) {
    if (sessionOrBreak === "break") {
      this.setState((prevState) => ({
        breakLength: Math.max(1, prevState.breakLength - 1),
        currentBreak: Math.max(1, prevState.breakLength - 1) * 60
      }));
    } else if (sessionOrBreak === "session") {
      this.setState((prevState) => ({
        sessionLength: Math.max(1, prevState.sessionLength - 1),
        currentSession: Math.max(1, prevState.sessionLength - 1) * 60
      }));
    }
  }

  increment(sessionOrBreak) {
    if (sessionOrBreak === "break") {
      this.setState((prevState) => ({
        breakLength: Math.min(60, prevState.breakLength + 1),
        currentBreak: Math.min(60, prevState.breakLength + 1) * 60
      }));
    } else if (sessionOrBreak === "session") {
      this.setState((prevState) => ({
        sessionLength: Math.min(60, prevState.sessionLength + 1),
        currentSession: Math.min(60, prevState.sessionLength + 1) * 60
      }));
    }
  }



  render() {
    return (
      <div className="session-and-break">
        <Selector id="session" decrement={this.decrement} increment={this.increment} value={this.state.sessionLength} _
        running={this.state.running}/>
        <Selector id="break" decrement={this.decrement} increment={this.increment} value={this.state.breakLength} _
        running={this.state.running}/>
        <Timer currentSession={this.state.currentSession} currentBreak={this.state.currentBreak} sessionRunning={this.state.sessionRunning} _
        breakRunning={this.state.breakRunning} stopStartHandler={this.handleStartPause} resetHandler={this.reset} pause={this.state.pause}/>
      </div>
    );
  }
}

const Selector = ({id, decrement, increment, value, running}) => {
  return (
    <div id={id + "-label"}>
      <p>{id.charAt(0).toUpperCase() + id.slice(1)} Length</p>
      <button id={id + "-increment"} onClick={() => increment(id)} disabled={running}>
        <i className="fas fa-plus"></i>
      </button>
      <p id={id + "-length"}>{value}</p>
      <button id={id + "-decrement"} onClick={() => decrement(id)} disabled={running}>
        <i className="fas fa-minus"></i>
      </button>
    </div>
  );
}

const Timer = ({currentSession, currentBreak, breakRunning, stopStartHandler, resetHandler, pause}) => {
  const audioRef = React.useRef(null);
  
  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    resetHandler();
  };

  let currentlyRunning = breakRunning ? currentBreak : currentSession;
  let minutes = String(Math.floor(currentlyRunning / 60)).padStart(2, '0');
  let seconds = String(currentlyRunning % 60).padStart(2, '0');
  
  return(
    <div className="timer">
        <p id="timer-label">{breakRunning ? "Break" : "Session"}</p>
        <p id="time-left"><span>{minutes}</span>:<span>{seconds}</span></p>
        <Button usage="Start / Stop" usageHandler={stopStartHandler} id="start_stop" pause={pause}/>
        <Button usage="Reset" usageHandler={handleReset} id="reset"/>
        <Beep toBePlayed={currentlyRunning === 0 ? true : false} ref={audioRef} />
    </div>
  )
}

const Button = ({ usage, usageHandler, id, pause}) => {
  return (
    <button id={id} onClick={usageHandler}>
      {id === "start_stop" ? (
        pause ? <i className="fa fa-play"></i> : <i className="fa fa-pause"></i>
      ) : (
        <i className="fas fa-rotate-left"></i>
      )}
    </button>
  );
};

const Beep = React.forwardRef(({toBePlayed}, ref) => {
  React.useEffect(() => {
    if (toBePlayed && ref.current) {
      ref.current.play().catch(error => {
        console.log("Audio playback failed:", error);
      });
    }
  }, [toBePlayed]);

  return (
    <audio 
      id="beep"
      ref={ref}
      src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" 
      preload="auto"
    />
  );
});

export default App;