import React from 'react';
import TextInput from '../common/TextInput';
import injectSheet from 'react-jss';
import Toggle from '../common/Toggle';
import { Button } from 'react-desktop/windows';
import DropDown from '../common/DropDown';
import CheckBox from '../common/CheckBox';

const styles = {
  Setting: {
    margin: '0 4vmin',
    paddingTop: '20px',
    justifyContent: 'space-evenly',
    '& p': {
      fontSize: '1.05rem',
      textAlign: 'left',
      margin: 0,
      marginLeft: 5,
    },
  },
  subCategory: {
    padding: '20px 20px 20px 20px',
    display: 'flex',
    flex: 3,
    flexWrap: 'wrap',
    border: '1px solid #2a2a2a',
    borderRadius: '5px',
    margin: '15px 0',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    '& > :last-child': {
      marginRight: '0px',
      order: 1,
    },
    '& div': {
      marginRight: '20px',
      '& p': {
        fontWeight: '500',
      },
    },
  },
  Toggle: {
    display: 'inline-flex',
    margin: '0px auto 10px auto',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: '5px',
    borderRadius: '5px',
    // cursor: 'pointer',
    marginRight: '0px !important',
    '& label': {
      margin: 'auto 10px',
    },
  },
  clickable: {
    cursor: 'pointer',
  },
};

const Setting = ({ classes, theme, settingCategory }) => {
  const renderFields = () => {
    return Object.keys(settingCategory).map(subCategory => {
      return (
        <React.Fragment>
          <p style={{ fontWeight: '600' }}>{subCategory.toUpperCase()}</p>
          <div className={classes.subCategory}>
            {settingCategory[subCategory].map(item => {
              switch (item.type) {
                case String:
                  return (
                    <div key={item.name} className={classes[item.name.replace(/ /g, '')]}>
                      <p>{item.name}</p>
                      <TextInput
                        theme={theme.style}
                        color={theme.color}
                        placeholder={item.name}
                        value={item.value}
                        type={item.pass ? 'password' : null}
                        onChange={e => item.action(e.target.value)}
                      />
                    </div>
                  );
                case Boolean:
                  return (
                    <div key={item.name} className={classes.Toggle}>
                      <div style={{ margin: 'auto auto auto 0' }}>
                        <p>{item.name}</p>
                        <p style={{ fontWeight: 100, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                          {item.description}
                        </p>
                      </div>
                      <Toggle theme={theme} checked={item.value} onChange={e => item.action(e.target.checked)} />
                    </div>
                  );
                case 'Button':
                  return (
                    <div style={{ textAlign: 'start' }}>
                      <Button className="btn" push color={theme.color} onClick={item.action}>
                        {item.name}
                      </Button>
                      <div style={{ fontSize: '0.8rem', margin: '0px 8px' }}>{item.description}</div>
                    </div>
                  );
                case 'Text':
                  return (
                    <div
                      key={item.name}
                      className={classes.Toggle}
                      onClick={item.action}
                      style={{ cursor: item.action ? 'pointer' : 'auto' }}
                    >
                      <div style={{ margin: 'auto auto auto 0' }}>
                        <p>{item.name}</p>
                        <p style={{ fontWeight: 100, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                case 'DropDownSelect':
                  return (
                    <div key={item.name} className={classes.Toggle}>
                      <div style={{ margin: 'auto auto auto 0' }}>
                        <p>{item.name}</p>
                        <p style={{ fontWeight: 100, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                          {item.description}
                        </p>
                      </div>
                      <DropDown onSelect={item.action} options={item.options} onBlur={item.action} value={item.value} />
                    </div>
                  );
                case 'CheckBox':
                  return (
                    <div
                      key={item.name}
                      className={`${classes.Toggle} ${classes.clickable}`}
                      onClick={item.disabled ? undefined : item.action}
                      style={{ opacity: item.disabled ? 0.5 : 1 }}
                    >
                      <div style={{ margin: 'auto auto auto 0' }}>
                        <p>{item.name}</p>
                        <p style={{ fontWeight: 100, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                          {item.description}
                        </p>
                      </div>
                      <CheckBox onChange={item.action} checked={item.value} theme={theme} disabled={item.disabled} />
                    </div>
                  );
                default:
                  return <div>{item.name}</div>;
              }
            })}
          </div>
        </React.Fragment>
      );
    });
  };

  return <div className={classes.Setting}>{renderFields()}</div>;
};

export default injectSheet(styles)(Setting);
