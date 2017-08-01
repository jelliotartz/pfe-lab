import React from 'react';
import { connect } from 'react-redux';

import apiClient from 'panoptes-client/lib/api-client';
import { organizationShape } from '../model';
import { setCurrentOrganization } from '../action-creators';
import OrganizationLayout from '../components/organization-layout';
import notificationHandler from '../../../lib/notificationHandler';

const DELETE_CONFIRMATION_PHRASE = 'I AM DELETING THIS ORGANIZATION';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deletionInProgress: false
    };

    this.deleteOrganization = this.deleteOrganization.bind(this);
    this.fetchOrganization = this.fetchOrganization.bind(this);
    this.updateOrganization = this.updateOrganization.bind(this);
  }

  componentDidMount() {
    this.fetchOrganization(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params && this.props.params && nextProps.params.id === this.props.params.id) return;
    this.fetchOrganization(nextProps.params.id);
  }

  componentWillUnmount() {
    this.props.dispatch(setCurrentOrganization(null));
  }

  updateOrganization(organizationFields) {
    this.props.organization.update(organizationFields).save()
      .then((updatedOrganization) => {
        this.props.dispatch(setCurrentOrganization(updatedOrganization));
      }).catch((error) => {
        const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

        notificationHandler(this.props.dispatch, notification);
      });
  }

  fetchOrganization(id) {
    if (!id) {
      return;
    }


    apiClient.type('organizations').get(id.toString(), { include: ['avatar', 'background'] })
      .then((org) => {
        this.props.dispatch(setCurrentOrganization(org));
      }).catch((error) => {
        const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

        notificationHandler(this.props.dispatch, notification);
      });
  }

  deleteOrganization() {
    const confirmationMessage = `
      You are about to delete this project and all its data!\n
      Enter ${DELETE_CONFIRMATION_PHRASE} to confirm.`;
    const confirmed = prompt(confirmationMessage) === DELETE_CONFIRMATION_PHRASE;

    if (confirmed) {
      this.setState({ deletionInProgress: confirmed });
      this.props.organization.delete()
        .then(() => {
          this.props.router.push('/organizations');
        }).catch((error) => {
          this.setState({ deletionInProgress: false });
          const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

          notificationHandler(this.props.dispatch, notification);
        });
    }
  }

  render() {
    const children = this.props.children; // eslint-disable-line react/prop-types
    const organization = this.props.organization;
    const organizationId = this.props.params.id;

    // inject props into children
    const wrappedChildren = React.Children.map(children, child =>
      React.cloneElement(child, {
        organization,
        organizationId,
        updateOrganization: this.updateOrganization,
        deleteOrganization: this.deleteOrganization,
        deletionInProgress: this.state.deletionInProgress,
      }),
    );

    return (
      <OrganizationLayout organizationId={organizationId} organizationSlug={organization ? organization.slug : ''}>
        {wrappedChildren}
      </OrganizationLayout>
    );
  }
}

OrganizationContainer.propTypes = {
  dispatch: React.PropTypes.func,
  organization: organizationShape,
  params: React.PropTypes.shape({ id: React.PropTypes.string }),
  router: React.PropTypes.shape({
    push: React.PropTypes.func
  })
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
  };
}

export default connect(mapStateToProps)(OrganizationContainer);
