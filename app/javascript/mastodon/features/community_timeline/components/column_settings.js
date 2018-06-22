import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import SettingText from '../../../components/setting_text';
import SettingToggle from '../../notifications/components/setting_toggle';

const messages = defineMessages({
  filter_regex: { id: 'home.column_settings.filter_regex', defaultMessage: 'Filter out by regular expressions' },
  settings: { id: 'home.settings', defaultMessage: 'Column settings' },
});

@injectIntl
export default class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
  };

  render () {
    const { settings, onChange, intl } = this.props;

    return (
      <div>
        <div className='column-settings__row'>
          <SettingToggle settings={settings} settingPath={['other', 'onlyMedia']} onChange={onChange} label={<FormattedMessage id='community.column_settings.media_only' defaultMessage='Media Only' />} />
        </div>

        <span className='column-settings__section'><FormattedMessage id='home.column_settings.advanced' defaultMessage='Advanced' /></span>

        <div className='column-settings__row'>
          <SettingText settings={settings} settingKey={['regex', 'body']} onChange={onChange} label={intl.formatMessage(messages.filter_regex)} />
        </div>
      </div>
    );
  }

}
