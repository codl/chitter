import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

const messages = defineMessages({
  placeholder: { id: 'search.placeholder', defaultMessage: 'Search' }
});

class Search extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleChange (e) {
    this.props.onChange(e.target.value);
  }

  handleClear (e) {
    e.preventDefault();

    if (this.props.value.length > 0 || this.props.submitted) {
      this.props.onClear();
    }
  }

  handleKeyDown (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.props.onSubmit();
    }
  }

  noop () {

  }

  handleFocus () {
    this.props.onShow();
  }

  render () {
    const { intl, value, submitted } = this.props;
    const hasValue = value.length > 0 || submitted;

    return (
      <div className='search'>
        <input
          className='search__input'
          type='text'
          placeholder={intl.formatMessage(messages.placeholder)}
          value={value}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyDown}
          onFocus={this.handleFocus}
        />

        <div role='button' tabIndex='0' className='search__icon' onClick={this.handleClear}>
          <i className={`fa fa-search ${hasValue ? '' : 'active'}`} />
          <i aria-label={intl.formatMessage(messages.placeholder)} className={`fa fa-times-circle ${hasValue ? 'active' : ''}`} />
        </div>
      </div>
    );
  }

}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  submitted: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(Search);
