import React from 'react'
import TextInput from '../common/TextInput';
import { Text } from 'react-desktop';
import { setIrcUser, setIrcPass, setIRCIsBot, setOSUApiKey, setPrefix, setAutoBeat } from './actions';

const Configuration = ({ theme, values }) => {
  const { irc, osuApi, prefix, autoBeat } = values;
  const items = [
    { name: 'irc user', value: irc.username, action: setIrcUser, type: String },
    { name: 'irc password', value: irc.password, action: setIrcPass, type: String, pass: true },
    { name: 'irc bot account', value: irc.isBotAccount, action: setIRCIsBot, type: Boolean },
    { name: 'osu api key', value: osuApi.key, action: setOSUApiKey, type: String, pass: true },
    { name: 'bot prefix', value: prefix, action: setPrefix, type: String },
    { name: 'autoBeat', value: autoBeat, action: setAutoBeat, type: Boolean }
  ]
  const renderFields = () => {
    return items.map(item => {
      if (item.type === String) {
        return (
          <React.Fragment key={item.name}>
            <Text color='#fff'>{item.name}</Text>
            <TextInput
              theme={theme.style}
              color={theme.color}
              placeholder={item.name}
              value={item.value}
              type={item.pass ? 'password' : null}
              onChange={e => item.action(e.target.value)}
            />
          </React.Fragment>
        )
      }
      if (item.type === Boolean) {
        return (
          <React.Fragment key={item.name}>
            <Text color='#fff'>{item.name}</Text>
            <input
              type="checkbox"
              checked={item.value}
              onChange={e => item.action(e.target.checked)}
            />
          </React.Fragment>
        )
      }
    })
  }
  return (
    <React.Fragment>
      <p>Configuration</p>
      {renderFields()}
    </React.Fragment>
  );
}

export default Configuration;