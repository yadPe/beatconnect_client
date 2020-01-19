import React from 'react';

/* TODO
 * make a dedicated theme provider
 * store theme variant in userPreferences
 * add custom themes
 */

const Theme = () => {
  return (
    <React.Fragment>
      <p>Theme</p>
      <p style={{ fontSize: '50%' }}>Darker</p>
      <input
        type="checkbox"
        //checked={item.value}
        onChange={e =>
          e.target.checked
            ? (document.body.style.backgroundColor = 'transparent')
            : (document.body.style.backgroundColor = '#2a2a2a')
        }
      />
    </React.Fragment>
  );
};

export default Theme;
