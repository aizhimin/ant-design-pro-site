import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { addLocaleData, IntlProvider } from 'react-intl';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import G2 from 'g2';

import enLocale from '../../en-US';
import cnLocale from '../../zh-CN';
import * as utils from '../utils';

import Header from './Header';
import Footer from './Footer';

// 全局 G2 设置
G2.track(false);

const colors = [
  '#8543E0', '#F04864', '#FACC14', '#1890FF', '#13C2C2', '#2FC25B', '#fa8c16', '#a0d911',
];

const config = {
  ...G2.Theme,
  defaultColor: '#1089ff',
  colors: {
    default: colors,
    intervalStack: colors,
  },
  tooltip: {
    background: {
      radius: 4,
      fill: '#000',
      fillOpacity: 0.75,
    },
  },
};

G2.Global.setTheme(config);

if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  require('../../static/style');

  // Expose to iframe
  window.react = React;
  window['react-dom'] = ReactDOM;
  window.antd = require('antd');
  window['ant-design-pro/lib/GlobalFooter'] = require('ant-design-pro/lib/GlobalFooter');
  window['ant-design-pro/lib/FooterToolbar'] = require('ant-design-pro/lib/FooterToolbar');
  /* eslint-enable global-require */
}


let isMobile;
utils.enquireScreen((b) => {
  isMobile = b;
});
export default class Layout extends React.PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const { pathname } = props.location;
    const appLocale = utils.isZhCN(pathname) ? cnLocale : enLocale;
    addLocaleData(appLocale.data);

    this.state = {
      appLocale,
      isMobile,
    };
  }

  componentDidMount() {
    utils.enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      });
    });
  }

  render() {
    const { children, ...restProps } = this.props;
    const { pathname } = this.props.location;
    const { appLocale } = this.state;

    return (
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <LocaleProvider locale={enUS}>
          <div className={`page-wrapper ${pathname === '/' && 'index-page-wrapper'}`}>
            <Header {...restProps} />
            {React.cloneElement(children, { ...children.props, isMobile: this.state.isMobile })}
            <Footer {...restProps} />
          </div>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
