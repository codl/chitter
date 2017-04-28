import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import emojify from '../../../emoji';
import escapeTextContentForBrowser from 'escape-html';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import IconButton from '../../../components/icon_button';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';

const messages = defineMessages({
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval' }
});

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => ({
    autoPlayGif: state.getIn(['meta', 'auto_play_gif'])
  });

  return mapStateToProps;
};

class Avatar extends React.PureComponent {

  constructor (props, context) {
    super(props, context);

    this.state = {
      isHovered: false
    };

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOver () {
    if (this.state.isHovered) return;
    this.setState({ isHovered: true });
  }

  handleMouseOut () {
    if (!this.state.isHovered) return;
    this.setState({ isHovered: false });
  }

  render () {
    const { account, autoPlayGif }   = this.props;
    const { isHovered } = this.state;

    return (
      <Motion defaultStyle={{ radius: 90 }} style={{ radius: spring(isHovered ? 30 : 90, { stiffness: 180, damping: 12 }) }}>
        {({ radius }) =>
          <a
            href={account.get('url')}
            className='account__header__avatar'
            target='_blank'
            rel='noopener'
            style={{ borderRadius: `${radius}px`, backgroundImage: `url(${autoPlayGif || isHovered ? account.get('avatar') : account.get('avatar_static')})` }}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            onFocus={this.handleMouseOver}
            onBlur={this.handleMouseOut}
          />
        }
      </Motion>
    );
  }

}

Avatar.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
  autoPlayGif: PropTypes.bool.isRequired
};

class Header extends React.Component {

  render () {
    const { account, me, intl } = this.props;

    if (!account) {
      return null;
    }

    let displayName = account.get('display_name');
    let info        = '';
    let actionBtn   = '';
    let lockedIcon  = '';

    if (displayName.length === 0) {
      displayName = account.get('username');
    }

    if (me !== account.get('id') && account.getIn(['relationship', 'followed_by'])) {
      info = <span className='account--follows-info' style={{ position: 'absolute', top: '10px', right: '10px', opacity: '0.7', display: 'inline-block', verticalAlign: 'top', background: 'rgba(0, 0, 0, 0.4)', textTransform: 'uppercase', fontSize: '11px', fontWeight: '500', padding: '4px', borderRadius: '4px' }}><FormattedMessage id='account.follows_you' defaultMessage='Follows you' /></span>
    }

    if (me !== account.get('id')) {
      if (account.getIn(['relationship', 'requested'])) {
        actionBtn = (
          <div style={{ position: 'absolute', top: '10px', left: '20px' }}>
            <IconButton size={26} disabled={true} icon='hourglass' title={intl.formatMessage(messages.requested)} />
          </div>
        );
      } else if (!account.getIn(['relationship', 'blocking'])) {
        actionBtn = (
          <div style={{ position: 'absolute', top: '10px', left: '20px' }}>
            <IconButton size={26} icon={account.getIn(['relationship', 'following']) ? 'user-times' : 'user-plus'} active={account.getIn(['relationship', 'following'])} title={intl.formatMessage(account.getIn(['relationship', 'following']) ? messages.unfollow : messages.follow)} onClick={this.props.onFollow} />
          </div>
        );
      }
    }

    if (account.get('locked')) {
      lockedIcon = <i className='fa fa-lock' />;
    }

    const content         = { __html: emojify(account.get('note')) };
    const displayNameHTML = { __html: emojify(escapeTextContentForBrowser(displayName)) };

    return (
      <div className='account__header' style={{ backgroundImage: `url(${account.get('header')})` }}>
        <div style={{ padding: '20px 10px' }}>
          <Avatar account={account} autoPlayGif={this.props.autoPlayGif} />

          <span style={{ display: 'inline-block', fontSize: '20px', lineHeight: '27px', fontWeight: '500' }} className='account__header__display-name' dangerouslySetInnerHTML={displayNameHTML} />
          <span className='account__header__username' style={{ fontSize: '14px', fontWeight: '400', display: 'block', marginBottom: '10px' }}>@{account.get('acct')} {lockedIcon}</span>
          <div style={{ fontSize: '14px' }} className='account__header__content' dangerouslySetInnerHTML={content} />

          {info}
          {actionBtn}
        </div>
      </div>
    );
  }

}

Header.propTypes = {
  account: ImmutablePropTypes.map,
  me: PropTypes.number.isRequired,
  onFollow: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  autoPlayGif: PropTypes.bool.isRequired
};

export default connect(makeMapStateToProps)(injectIntl(Header));
