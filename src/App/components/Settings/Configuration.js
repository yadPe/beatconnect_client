import React from 'react'
import TextInput from '../common/TextInput';
import { setIrcUser, setIrcPass, setIRCIsBot, setOSUApiKey, setPrefix, setAutoBeat, setAutoImport } from './actions';
import injectSheet from 'react-jss';
import Toggle from '../common/Toggle';

const styles = {
  Configuration: {
    width: '80%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-evenly'
  }
};

const Configuration = ({ classes, theme, values }) => {
  const { irc, osuApi, prefix, autoBeat, autoImport } = values;
  const items = [
    { name: 'irc user', value: irc.username, action: setIrcUser, type: String },
    { name: 'irc password', value: irc.password, action: setIrcPass, type: String, pass: true },
    { name: 'special bot account', value: irc.isBotAccount, action: setIRCIsBot, type: Boolean },
    { name: 'osu api key', value: osuApi.key, action: setOSUApiKey, type: String, pass: true },
    { name: 'bot prefix', value: prefix, action: setPrefix, type: String },
    { name: 'auto import maps', value: autoImport, action: setAutoImport, type: Boolean },
    // { name: 'autoBeat', value: autoBeat, action: setAutoBeat, type: Boolean }
  ]
  const renderFields = () => {
    return items.map(item => {
      if (item.type === String) {
        return (
          <div key={item.name}>
            <p style={{ fontSize: '50%' }}>{item.name}</p>
            <TextInput
              theme={theme.style}
              color={theme.color}
              placeholder={item.name}
              value={item.value}
              type={item.pass ? 'password' : null}
              onChange={e => item.action(e.target.value)}
            />
          </div>
        )
      }
      if (item.type === Boolean) {
        return (
          <div key={item.name}>
            <p style={{ fontSize: '50%' }}>{item.name}</p>
            <Toggle
              theme={theme}
              checked={item.value}
              onChange={e => item.action(e.target.checked)}
            />
          </div>
        )
      }
    })
  }
  return (
    <React.Fragment>
      <p>Configuration</p>
      <div className={classes.Configuration}>
        {renderFields()}
      </div>
    </React.Fragment>
  );
}

export default injectSheet(styles)(Configuration);