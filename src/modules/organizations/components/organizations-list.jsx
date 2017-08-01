import React from 'react';
import { config } from '../../../constants/config';
import ListGroup from './list-group';

import { organizationsAvatarsShape, organizationsShape } from '../model';

const OrganizationsList = ({ createOrganization, collaboratedOrganizations, organizationsAvatars, ownedOrganizations }) => {
  if (!ownedOrganizations || !collaboratedOrganizations) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div className="organizations-list">
      {ownedOrganizations.length > 0 &&
        <ListGroup organizations={ownedOrganizations} organizationsAvatars={organizationsAvatars} title={'Your Organizations'} />}
      <div className="organizations-list__button-container">
        <button
          type="button"
          className="button organizations-list__button--create"
          onClick={createOrganization}
        >
          Create a new organization
        </button>{' '}
        <a href={`${config.zooniverseURL}/help`} className="button organizations-list__button--info">How-to</a>{' '}
        <a href={`${config.zooniverseURL}/help/glossary`} className="button organizations-list__button--info">Glossary</a>{' '}
        <a href={`${config.zooniverseURL}/help/lab-policies`} className="button organizations-list__button--info">Policies</a>{' '}
        <a href={`${config.zooniverseURL}/lab-best-practices/introduction`} className="button organizations-list__button--info">Best Practices</a>{' '}
        <a href={`${config.zooniverseURL}/talk/18`} className="button organizations-list__button--info">Talk</a>{' '}
      </div>
      <hr />

      {collaboratedOrganizations.length > 0 &&
        <ListGroup organizations={collaboratedOrganizations} showOwnerName={true} title={'Collaborations'} />}
    </div>
  );
};

OrganizationsList.propTypes = {
  createOrganization: React.PropTypes.func,
  collaboratedOrganizations: organizationsShape,
  organizationsAvatars: organizationsAvatarsShape,
  ownedOrganizations: organizationsShape,
};

export default OrganizationsList;
