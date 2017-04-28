import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import InnerHeader from '../../account/components/header';
import ActionBar from '../../account/components/action_bar';
import MissingIndicator from '../../../components/missing_indicator';

class Header extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleMention = this.handleMention.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.handleMute = this.handleMute.bind(this);
  }

  handleFollow () {
    this.props.onFollow(this.props.account);
  }

  handleBlock () {
    this.props.onBlock(this.props.account);
  }

  handleMention () {
    this.props.onMention(this.props.account, this.context.router);
  }

  handleReport () {
    this.props.onReport(this.props.account);
    this.context.router.push('/report');
  }

  handleMute() {
    this.props.onMute(this.props.account);
  }

  render () {
    const { account, me } = this.props;

    if (account === null) {
      return <MissingIndicator />;
    }

    return (
      <div className='account-timeline__header'>
        <InnerHeader
          account={account}
          me={me}
          onFollow={this.handleFollow}
        />

        <ActionBar
          account={account}
          me={me}
          onBlock={this.handleBlock}
          onMention={this.handleMention}
          onReport={this.handleReport}
          onMute={this.handleMute}
        />
      </div>
    );
  }
}

Header.propTypes = {
  account: ImmutablePropTypes.map,
  me: PropTypes.number.isRequired,
  onFollow: PropTypes.func.isRequired,
  onBlock: PropTypes.func.isRequired,
  onMention: PropTypes.func.isRequired,
  onReport: PropTypes.func.isRequired,
  onMute: PropTypes.func.isRequired
};

Header.contextTypes = {
  router: PropTypes.object
};

export default Header;
