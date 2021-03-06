import React from 'react';
import { connect } from 'react-redux';
import Notification from 'grommet/components/Notification';
import { ZooFooter } from 'zooniverse-react-components';
import SiteNav from './site-nav';
import Landing from './landing';
import { setAppNotification } from '../action-creators';
import AdminContainer from '../containers/admin-container';

const Layout = props =>
  <div className="layout">
    <header className="layout__header">
      <SiteNav />
    </header>

    {props.adminMode && (<div className="layout__admin-indicator" title="Admin mode on!" />)}

    <main className="layout__main">
      {props.appNotification.status &&
        <Notification
          status={props.appNotification.status}
          message={props.appNotification.message}
          closer={true}
          onClose={() => { props.dispatch(setAppNotification({ message: null, status: null })); }}
        />}
      {(props.user && props.loginInitialized && props.children ?
        props.children : <Landing userBoolean={props.user !== null} />)}
    </main>

    <ZooFooter adminContainer={<AdminContainer />} />
  </div>;

Layout.propTypes = {
  adminMode: React.PropTypes.bool,
  appNotification: React.PropTypes.shape({
    message: React.PropTypes.string,
    status: React.PropTypes.string
  }),
  children: React.PropTypes.node,
  dispatch: React.PropTypes.func,
  loginInitialized: React.PropTypes.bool,
  user: React.PropTypes.shape({ id: React.PropTypes.string }),
};

Layout.defaultProps = {
  adminMode: false,
  appNotification: {
    message: null,
    status: null
  },
  loginInitialized: false,
  toggleAdminMode: () => {},
  user: null,
};

function mapStateToProps(state) {
  return {
    adminMode: state.adminMode,
    appNotification: state.appNotification,
    loginInitialized: state.initialized,
    user: state.user,
  };
}

export default connect(mapStateToProps)(Layout);
