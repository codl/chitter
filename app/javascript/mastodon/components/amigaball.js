import React from 'react';

class AmigaBall extends React.Component {
  componentDidMount(){
    this.bail=false;
    this.activated=this.props.active?1:0;
    this.offset = Math.random() * Math.PI/2;
    this.frame(0)
  }
  frame(t) {
    if(this.bail) return;

    if(t==0 || this.activated >= 0.001){
      this.draw();
    }

    if(this.props.active){
      this.activated += (1 - this.activated) * 0.03
      if (this.activated > 0.999){
        this.activated = 1;
      }
    }
    else {
      this.activated *= 0.91;
      if (this.activated < 0.001){
        this.activated = 0;
      }
    }

    this.offset += 0.06 * this.activated;
    this.offset = this.offset % (Math.PI/2);

    window.requestAnimationFrame(this.frame.bind(this))
  }
  draw(){
    let ctx = this.refs.canvas.getContext("2d");
    const width = this.refs.canvas.width;
    const height = this.refs.canvas.height;
    const padding = width/9;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `hsla(0, 100%, 50%, ${this.activated})`;
    ctx.beginPath();
    ctx.arc(width/2, height/2, width/2-padding-0.5, 0, 2 * Math.PI);
    ctx.fill();

    function lin(start, end, progress){
      return progress * end + (1-progress) * start;
    }
    // default inactive button color: hsl(225, 16%, 45%)
    ctx.fillStyle = `hsl(
        225,
        ${lin(16, 0, this.activated)}%,
        ${lin(45, 100, this.activated)}%)`;
    ctx.beginPath();
    ctx.moveTo(width/2, padding);
    function go(theta,phi){
        phi -= this.offset;
        phi = Math.max(-Math.PI/2, phi);
        phi = Math.min(Math.PI/2, phi);
        let x = Math.sin(theta) * Math.sin(phi) * (width - 2*padding)/2 + width/2;
        let y = -Math.cos(theta) * (height - 2*padding)/2 + height/2;
        ctx.lineTo(x, y);
    }
    go = go.bind(this);

    // vertical stripe 1
    for(let theta = 0; theta <= Math.PI; theta+=Math.PI/6){
        let phi = -Math.PI/2;
        go(theta, phi);
    }
    for(let theta = Math.PI; theta >= 0; theta-=Math.PI/6){
        let phi = -Math.PI/4;
        go(theta, phi);
    }

    // vertical stripe 2
    for(let theta = 0; theta <= Math.PI; theta+=Math.PI/6){
        let phi = 0;
        go(theta, phi);
    }
    for(let theta = Math.PI; theta >= 0; theta-=Math.PI/6){
        let phi = Math.PI/4;
        go(theta, phi);
    }

    // vertical stripe 3
    for(let theta = 0; theta <= Math.PI; theta+=Math.PI/6){
        let phi = Math.PI/2;
        go(theta, phi);
    }
    for(let theta = Math.PI; theta >= 0; theta-=Math.PI/6){
        let phi = 3*Math.PI/4;
        go(theta, phi);
    }

    for(let tetha = 0; tetha <= 3*Math.PI/4; tetha += Math.PI/8){
        let phi = Math.PI;
        go(tetha, phi);
    }

    go(3*Math.PI/4, -Math.PI/2);
    go(Math.PI/2, -Math.PI/2);
    go(Math.PI/2, Math.PI);
    go(Math.PI/4, Math.PI);
    go(Math.PI/4, -Math.PI/2);

    ctx.closePath();
    ctx.fill();
}

  componentWillUnmount(){
    this.bail = true;
  }
  render() {
    return <canvas ref="canvas"
      className="status__action-bar-button"
      width={this.props.size * 1.28571429}
      height={this.props.size * 1.28571429}
      onClick={this.props.onClick}
      aria-label={this.props.title}
      title={this.props.title}
      style={{ cursor: "pointer", transform: "rotate(20deg)" }}
    />;
  }
}

export default AmigaBall;
