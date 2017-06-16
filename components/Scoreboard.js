import React from 'react';
import PropTypes from 'prop-types';

const INITIAL_STATE = [
  {
    name: "Jim Hoskins",
    score: 32,
    id: 0
  },
  {
    name: "Andrew Hoskins",
    score:10,
    id: 1
  },
  {
    name: "Jim Chris",
    score: 31,
    id: 2
  },
  {
    name: "Jim Hoskins",
    score: 43,
    id: 3
  },
];
let nextId = INITIAL_STATE.length + 1;

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      elapsedTime: 0,
      previousTime: 0,
    }
  }
  
  componentDidMount() {
    this.interval = setInterval(this.onTick.bind(this), 100);
  }
  
  componentWillUnmount() {
     clearInterval(this.interval);
  }
  
  onTick() {
    if (this.state.running) {
      let now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime)
      });
    }
  }
  
  onStart() {
    this.setState({
      running: true,
      previousTime: Date.now(),
    });
  }
  
  onStop() {
    this.setState({
      running: false
    });
  }
  
  onReset() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
    });
  }
  
  render() {
    let startStop = this.state.running ? <button onClick={this.onStop.bind(this)}>Stop</button> 
                                       : <button onClick={this.onStart.bind(this)}>Start</button>;
    let seconds = Math.floor(this.state.elapsedTime/1000);
    
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{ seconds }</div>
        { startStop }
        <button onClick={this.onReset.bind(this)}>Reset</button>
      </div>
    );
  }
}

class AddPlayerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    }
  }
  
  onSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ""});
  }
  
  onNameChange(e) {
    // console.log('onNameChange', e.target.value);
    this.setState({
      name: e.target.value,
    })
  }
  
  render() {
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" value={this.state.name} onChange={this.onNameChange.bind(this)}/>
          <input type="submit" value="Add Player" />
        </form>
      </div>
    );
  }
}

function Stats(props) {
  let totalPlayers = props.players.length;
  let totalPoints = props.players.reduce((total, player) => {return total + player.score}, 0)

  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
          <tr>
          <td>Total Points:</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  );
}

Stats.propTypes = {
  players: PropTypes.array.isRequired
}

function Header(props) {
  return (
    <div className="header">
      <Stats players={props.players} />
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  players: PropTypes.array.isRequired,
}

function Counter(props) {
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={function() {props.onChange(-1);}}> - </button>
      <div className="counter-score"> {props.score} </div>
      <button className="counter-action increment" onClick={function() {props.onChange(1);}}> + </button>
    </div>
  );
}


Counter.propTypes = {
  score: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

function Player(props) {
  return (
    <div className="player">
    <div className="player-name">
      <a className="remove-player" onClick={props.onRemove}>X</a>
      {props.name}
    </div>
    <div className="player-score">
      <Counter score={props.score} onChange={props.onScoreChange} />
    </div>
  </div>
  );
}

Player.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: INITIAL_STATE,
    }
    
  }
          
  onScoreChange(index, delta) {
    this.state.players[index].score += delta;
    this.setState(this.state);
  }
  
  onPlayerAdd(name) {
    this.state.players.push({
      name: name,
      score: 0,
      id: nextId,
    });
    this.setState(this.state);
    nextId += 1;
  }
  
  onRemovePlayer(index) {
   this.state.players.splice(index, 1),
   this.setState(this.state);
  }
  
  render() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players}/>
        <div className="players">
          {this.state.players.map((player, index) => {
            return (
              <Player
                onScoreChange={(delta) => {this.onScoreChange(index, delta)}}
                onRemove={() => this.onRemovePlayer(index)}
                name={player.name}
                score={player.score}
                key={player.id} 
              />
            );
          })}
        </div>
        <AddPlayerForm onAdd={this.onPlayerAdd.bind(this)} />
      </div>
    );
  }
}

Scoreboard.propTypes = {
  title: PropTypes.string,
}

Scoreboard.defaultProps = {
  title: "Scoreboard",
}

export default Scoreboard;