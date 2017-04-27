import React from 'react';

import { organizationShape } from '../model';

import bindInput from '../../common/containers/bind-input';
import FormContainer from '../../common/containers/form-container';

const EditDetails = ({ organization, updateOrganization, resetOrganization }) => {
  // TODO: ARB: this should be broken up into a container and some components
  if (!organization) {
    return (
      <div>Loading...</div>
    );
  }

  const fields = {};

  const collect = () => {
    const result = {};
    Object.keys(fields).forEach((fieldName) => {
      result[fieldName] = fields[fieldName].value;
    });
    return result;
  };

  const onSubmit = (values) => {
    console.log('values', values);
    const patch = collect();
    updateOrganization(patch);
  };

  const onReset = () => {
    resetOrganization();
  };

  const NameInput = bindInput(organization.display_name, <input type="text" />);
  const DescriptionInput = bindInput(organization.description, <textarea />);

  return (
    <div>
      <h1>Edit Organization Details</h1>
      <FormContainer onSubmit={onSubmit} onReset={onReset}>
        <label htmlFor="display_name">
          Name: <input type="text" id="display_name" defaultValue={organization.display_name} />
        </label>
        <br />
        <label htmlFor="description">
          Description: <textarea id="description" defaultValue={organization.description} />
        </label>
      </FormContainer>
    </div>
  );
};

EditDetails.propTypes = {
  organization: organizationShape,
  resetOrganization: React.PropTypes.func,
  updateOrganization: React.PropTypes.func,
};

export default EditDetails;
