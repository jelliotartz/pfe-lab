import React from 'react';
import { Link } from 'react-router';
import { config } from '../../../constants/config';

import { organizationsAvatarsShape, organizationsShape } from '../model';

// TODO organizations need slug props
// TODO abstract out for use with projects
const ListGroup = ({ organizations, organizationsAvatars, showOwnerName, title }) => {
  const findAvatar = (organization) => {
    // TODO why is the links property for organization 'linked'?
    return organizationsAvatars.filter(avatar => avatar.links.linked.id === organization.id);
  };

  return (
    <div>
      <h2 className="organizations-list__title">{title}</h2>
      <ul className="organizations-list__list">
        {organizations.map((organization) => {
          let avatar;
          if (organizationsAvatars) avatar = findAvatar(organization);
          return (
            <li key={organization.id} className="organizations-list__item">
              <div className="organizations-list__row">
                <Link to={`/organizations/${organization.id}`} className="organizations-list__edit organizations-list--action">
                  {avatar && avatar.length > 0 &&
                    <img src={avatar[0].src} alt="avatar" className="organizations-list__avatar" />}
                  <div className="organizations-list__description">
                    <strong>{organization.display_name}</strong>{' '}
                    {showOwnerName &&
                      <small>{`by ${organization.links.owner.display_name}`}</small>}
                  </div>
                  <span className="organizations-list__icon">
                    <i className="fa fa-pencil fa-fw" />
                    <small>Edit</small>
                  </span>
                </Link>
                <a href={`${config.zooniverseURL}/organizations/${organization.slug}`} className="organizations-list__icon organizations-list--action">
                  <i className="fa fa-hand-o-right fa-fw" />
                  <small>View</small>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ListGroup.defaultProps = {
  showOwnerName: false,
};

ListGroup.propTypes = {
  organizations: organizationsShape,
  organizationsAvatars: organizationsAvatarsShape,
  showOwnerName: React.PropTypes.bool,
  title: React.PropTypes.string,
};

export default ListGroup;
