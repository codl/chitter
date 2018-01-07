import React from 'react';

export default class Mascot extends React.Component {
  constructor () {
    super();
    this.state = {};
  }

  componentDidMount () {
    fetch('/mascots.json').then(response => response.json())
      .then(mascots=>{
        this.setState({mascot: mascots[Math.floor(Math.random()*mascots.length)]});
      });
  }

  render () {
    let mascot_style = {};
    if (this.state.mascot) {
      mascot_style = {
        backgroundImage: 'url('+this.state.mascot.url+')'
      };

    }

    return (
      <div className='mascot' style={mascot_style}>
        { this.state.mascot &&
          <p className='mascot-credit'>Mascot drawn by {this.state.mascot.credit}</p>
        }
      </div>
    )
  }

}
