import React from 'react';
import PropTypes from 'prop-types';

export default class Mascot extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor () {
    super();
    this.state = {mascot: null};
    this.handleCreditClick = this.handleCreditClick.bind(this);
  }

  componentDidMount () {
    let mascotP = fetch('https://media.chitter.xyz/mascots/mascots.json', { mode: 'cors' }).then(response => response.json())
      .then(mascots => mascots[Math.floor(Math.random()*mascots.length)]);
    let blobP = mascotP.then(mascot => fetch(mascot.url)).then(resp => resp.blob());
    Promise.all([mascotP, blobP]).then(a => {
      let mascot = a[0];
      let blob = a[1];

      mascot.url = URL.createObjectURL(blob)

      this.setState({mascot: mascot});
    });
  }

  handleCreditClick (e) {
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
    let mascot = this.state.mascot;
    let mascot_style = {
      backgroundImage: 'url('+mascot.url+')'
    };
    if (mascot.height){
      mascot_style.flexBasis = `${mascot.height}px`;
    }
    if (mascot.style){
        mascot_style = { ...mascot_style, ...mascot.style }
    }

    let credit = mascot.credit.name;

    if (mascot.credit.url){
      credit = <a href={mascot.credit.url} onClick={this.handleCreditClick}>
        {mascot.credit.name}
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
