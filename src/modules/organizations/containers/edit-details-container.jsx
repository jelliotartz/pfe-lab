import React from 'react';
import { connect } from 'react-redux';

import apiClient from 'panoptes-client/lib/api-client';
import EditDetails from '../components/edit-details';
import { organizationShape, organizationAvatarShape, organizationBackgroundShape } from '../model';
import { setCurrentOrganization, setOrganizationAvatar, setOrganizationBackground } from '../action-creators';
import notificationHandler from '../../../lib/notificationHandler';

class EditDetailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.fetchAvatar = this.fetchAvatar.bind(this);
    this.fetchBackground = this.fetchBackground.bind(this);
    this.handleMediaChange = this.handleMediaChange.bind(this);

    this.state = {
      updatingImage: false
    }
  }

  componentWillMount() {
    if (this.props.organization && this.state.updatingImage) {
      this.fetchAvatar(this.props.organization);
      this.fetchBackground(this.props.organization);
      this.setState({updatingImage: false})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.organization !== nextProps.organization || this.state.updatingImage) {
      this.fetchAvatar(nextProps.organization);
      this.fetchBackground(nextProps.organization);
      this.setState({updatingImage: false})
    }
  }

  componentWillUnmount() {
    this.props.dispatch(setOrganizationAvatar({}));
    this.props.dispatch(setOrganizationBackground({}));
    this.setState({updatingImage: false})
  }

  updateImage(type) {
    this.setState({updatingImage: true})
    this.props.organization.get(type)
      .then((image) => {
        if (type === 'background') {
          this.props.dispatch(setOrganizationBackground(image));
        } else if (type === 'avatar') {
          this.props.dispatch(setOrganizationAvatar(image));
        }
      })
      .catch((error) => {
        if (error.status !== 404) {
          const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };
          notificationHandler(this.props.dispatch, notification);
        }
      });

    this.setState({updatingImage: false})
  }

  fetchAvatar(org) {
    if (org.links.avatar && org.links.avatar.id) {
      apiClient.type('avatars').get(org.links.avatar.id)
        .then((avatar) => {
          this.props.dispatch(setOrganizationAvatar(avatar));
        }).catch((error) => {
          if (error.status !== 404) {
            const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

            notificationHandler(this.props.dispatch, notification);
          }
        });
      this.setState({updatingImage: false})
    }

  }

  fetchBackground(org) {
    if (org.links.background && org.links.background.id) {
      apiClient.type('backgrounds').get(org.links.background.id)
        .then((background) => {
          this.props.dispatch(setOrganizationBackground(background));
        }).catch((error) => {
          if (error.status !== 404) {
            const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

            notificationHandler(this.props.dispatch, notification);
          }
        });
      this.setState({updatingImage: false})
    }
  }

  handleMediaChange(type, file) {
    if (type === 'background' || 'avatar') {
      this.setState({ updatingImage: true })
    }
    apiClient.post(this.props.organization._getURL(type), { media: { content_type: file.type } })
      .then(([resource]) => {
        const headers = new Headers();
        const params = {
          method: 'PUT',
          headers: headers,
          mode: 'cors',
          body: file
        };
        fetch(resource.src, params)
          .then((response) => {
            if (response.ok) {
              this.refreshOrganization(type)
              .then(([organization]) => {
                this.props.dispatch(setCurrentOrganization(organization));
              });
            }
          })
          .catch((error) => {
            const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };
            notificationHandler(this.props.dispatch, notification);
          });
        });
  }

  refreshOrganization(resourceTypeToUncache) {
    this.props.organization.uncacheLink(resourceTypeToUncache);
    this.updateImage(resourceTypeToUncache)
    this.setState({updatingImage: false})
    return this.props.organization.refresh();
  }

  render() {
    return (
      <EditDetails
        deleteOrganization={this.props.deleteOrganization}
        deletionInProgress={this.props.deletionInProgress}
        handleMediaChange={this.handleMediaChange}
        organization={this.props.organization}
        organizationAvatar={this.props.organizationAvatar}
        organizationBackground={this.props.organizationBackground}
        updateOrganization={this.props.updateOrganization}
      />
    );
  }
}

EditDetailsContainer.propTypes = {
  deleteOrganization: React.PropTypes.func.isRequired,
  deletionInProgress: React.PropTypes.bool,
  dispatch: React.PropTypes.func,
  organization: organizationShape,
  organizationAvatar: organizationAvatarShape,
  organizationBackground: organizationBackgroundShape,
  updateOrganization: React.PropTypes.func.isRequired
};

EditDetailsContainer.defaultProps = {
  deleteOrganization: () => {},
  deletionInProgress: false,
  updateOrganization: () => {}
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    organizationAvatar: state.organizationAvatar,
    organizationBackground: state.organizationBackground
  };
}

export default connect(mapStateToProps)(EditDetailsContainer);
