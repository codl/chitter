import { Motion, spring } from 'react-motion';
import AmigaBall from './amigaball';
import PropTypes from 'prop-types';

class IconButton extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (e) {
    e.preventDefault();

    if (!this.props.disabled) {
      this.props.onClick(e);
    }
  }

  render () {
    let style = {
      fontSize: `${this.props.size}px`,
      width: `${this.props.size * 1.28571429}px`,
      height: `${this.props.size * 1.28571429}px`,
      lineHeight: `${this.props.size}px`,
      ...this.props.style
    };

    if (this.props.active) {
      style = { ...style, ...this.props.activeStyle };
    }

    const classes = ['icon-button'];

    if (this.props.active) {
      classes.push('active');
    }

    if (this.props.disabled) {
      classes.push('disabled');
    }

    if (this.props.inverted) {
      classes.push('inverted');
    }

    if (this.props.overlay) {
      classes.push('overlayed');
    }
    if (this.props.className) {
      classes.push(this.props.className)
    }

    if (this.props.icon == "amiga"){
      return (
        <AmigaBall
          title={this.props.title}
          onClick={this.handleClick}
          active={this.props.active}
          size={this.props.size}
          />
      );
    }
    else {

      return (
        <Motion defaultStyle={{ rotate: this.props.active ? -360 : 0 }} style={{ rotate: this.props.animate ? spring(this.props.active ? -360 : 0, { stiffness: 120, damping: 7 }) : 0 }}>
          {({ rotate }) =>
            <button
              aria-label={this.props.title}
              title={this.props.title}
              className={classes.join(' ')}
              onClick={this.handleClick}
              style={style}>
              <i style={{ transform: `rotate(${rotate}deg)` }} className={`fa fa-fw fa-${this.props.icon}`} aria-hidden='true' />
            </button>
          }
        </Motion>
      );
    }
  }

}

IconButton.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.number,
  active: PropTypes.bool,
  style: PropTypes.object,
  activeStyle: PropTypes.object,
  disabled: PropTypes.bool,
  inverted: PropTypes.bool,
  animate: PropTypes.bool,
  overlay: PropTypes.bool
};

IconButton.defaultProps = {
  size: 18,
  active: false,
  disabled: false,
  animate: false,
  overlay: false
};

export default IconButton;
