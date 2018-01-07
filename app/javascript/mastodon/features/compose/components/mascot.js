import React from 'react';
import PropTypes from 'prop-types';

export default class Mascot extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor () {
    super();
    this.state = {mascot: null};
    this.go_to_credit = this.go_to_credit.bind(this);
  }

  componentDidMount () {
    fetch('https://media.chitter.xyz/mascots/mascots.json?2').then(response => response.json())
      .then(mascots=>{
        this.setState({mascot: mascots[Math.floor(Math.random()*mascots.length)]});
      });
  }

  go_to_credit (e) {
    if (!this.state.mascot || !this.state.mascot.credit || !this.state.mascot.credit.account_id ||
        e.button !== 0){
      return
    }
    e.preventDefault();
    this.context.router.history.push(`/accounts/${this.state.mascot.credit.account_id}`);
  }

  render () {
    if (!this.state.mascot) {
      return false
    }
    let mascot_style = {
      backgroundImage: 'url('+this.state.mascot.url+')'
    };

    let credit = this.state.mascot.credit.name;
    if (this.state.mascot.credit.url){
      credit = <a href={this.state.mascot.credit.url} onClick={this.go_to_credit}>
        {this.state.mascot.credit.name}
      </a>
    }

    return (
      <div className='mascot' style={mascot_style}>
        <p className='mascot-credit'>
          Mascot drawn by {credit}
        </p>
      </div>
    )
  }

}
