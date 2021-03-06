import React from 'react';
import { UserSearch } from 'zooniverse-react-components';

import FormContainer from '../../common/containers/form-container';

import notificationHandler from '../../../lib/notificationHandler';

const ID_PREFIX = 'LAB_COLLABORATORS_PAGE_';

class CollaboratorCreatorContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabledSubmit: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange() {
    // React Select doesn't consistently fire onchange, so this is buggy.
    // Look into alternative that actually uses an input correctly.
    const anyRolesChecked = Object.keys(this.props.possibleRoles).some((role, i) => {
      return this[ID_PREFIX + role].checked;
    });

    if (this.userSearch.value().length > 0 && anyRolesChecked) {
      this.setState({ disabledSubmit: false });
    }
  }

  handleReset() {
    if (this.userSearch.value()) {
      this.userSearch.clear();
    }

    Object.keys(this.props.possibleRoles).map((role, i) => {
      if (this[ID_PREFIX + role].checked) {
        this[ID_PREFIX + role].checked = false;
      }
    });

    if (!this.state.disabled) this.setState({ disabledSubmit: true });
  }

  handleSubmit() {
    const users = this.userSearch.value().map(option => parseInt(option.value));
    const roles = Object.keys(this.props.possibleRoles).map((role, i) => {
      if (this[ID_PREFIX + role].checked) {
        return this[ID_PREFIX + role].value;
      }
    });

    this.props.addCollaborators(roles, users)
      .then(() => {
        this.setState({ disabledSubmit: true });
        this.handleReset();
      }).catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <FormContainer
        disabledSubmit={this.state.disabledSubmit}
        onChange={this.handleChange}
        onReset={this.handleReset}
        onSubmit={this.handleSubmit}
        submitLabel="Add user role"
      >
        <h4 className="collaborators__title">Add another user role</h4>
        <fieldset className="form__fieldset">
          <label htmlFor="user-search" className="form__label">Find a user</label>
          <UserSearch id="user-search" ref={(input) => { this.userSearch = input; }} />
        </fieldset>

        <fieldset className="form__fieldset">
          <dl>
            {Object.keys(this.props.possibleRoles).map((role, i) => {
              return (
                <span key={ID_PREFIX + role}>
                  <dt>
                    <strong><label className="form__label" htmlFor={ID_PREFIX + role}>
                      <input
                        ref={(input) => { this[ID_PREFIX + role] = input; }}
                        id={ID_PREFIX + role}
                        type="checkbox"
                        name="role"
                        value={role}
                        disabled={role === 'owner'}
                        className="collaborators__checkbox"
                      />
                      {this.props.rolesInfo[role].label}
                    </label></strong>
                  </dt>
                  <dd>{this.props.rolesInfo[role].description}</dd>
                </span>
              );
            })}
          </dl>
        </fieldset>
      </FormContainer>
    );
  }
}

CollaboratorCreatorContainer.defaultProps = {
  addCollaborators: () => {},
};

CollaboratorCreatorContainer.propTypes = {
  addCollaborators: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func,
  possibleRoles: React.PropTypes.objectOf(React.PropTypes.string).isRequired,
  rolesInfo: React.PropTypes.objectOf(React.PropTypes.object).isRequired,
};

export default CollaboratorCreatorContainer;
