import React from 'react';
import { Link } from 'react-router';
import { config } from '../../../constants/config';

// TODO I think avatar will break and Edit link wrong with programs,
// need dynamic Edit link, change from Link to <a> with href determined
// progrmatically based on resourceType

const ResourcesList = ({
  resources,
  resourcesAvatars,
  resourceType,
  showAvatar,
  showOwnerName,
  showRemove,
  onRemove,
  showStatus,
  title
}) => {
  const findAvatar = (resource) => {
    // TODO why is the links property for organization 'linked'?
    return resourcesAvatars.filter(avatar => avatar.links.linked.id === resource.id);
  };

  return (
    <div>
      <h2 className="resources-list__title">{title}</h2>
      <ul className="resources-list__list">
        {resources.map((resource) => {
          let avatar = {};
          if (showAvatar && resourcesAvatars && findAvatar(resource).length) {
            avatar = findAvatar(resource)[0];
          }
          let statusMessage;
          if (showStatus) {
            switch (resource.launch_approved) {
              case undefined:
                statusMessage = 'UNKNOWN';
                break;
              case true:
                statusMessage = 'Launch Approved';
                break;
              case false:
                statusMessage = 'NOT PUBLICLY VISIBILE';
                break;
              default:
                statusMessage = 'unknown';
            }
          }
          return (
            <li key={resource.id} className="resources-list__item">
              <div className="resources-list__row">
                <Link
                  to={`/${resourceType}/${resource.id}`}
                  className="resources-list__edit resources-list--action"
                >
                  {showAvatar && avatar &&
                    <img src={avatar.src} alt="avatar" className="resources-list__avatar" />}
                  <div className="resources-list__description">
                    <strong>{resource.display_name}</strong>{' '}
                    {showOwnerName &&
                      <small>{`by ${resource.links.owner.display_name}`}</small>}
                    {showStatus &&
                      <span
                        className={`color-label ${resource.launch_approved ? 'green' : 'red'}`}
                      >
                        {statusMessage}
                      </span>}
                  </div>
                  <span className="resources-list__icon">
                    <i className="fa fa-pencil fa-fw" />
                    <small>Edit</small>
                  </span>
                </Link>
                <a
                  className="resources-list__icon resources-list--action"
                  href={`${config.zooniverseURL}${resourceType}/${resource.slug}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i className="fa fa-hand-o-right fa-fw" />
                  <small>View</small>
                </a>
                {showRemove && onRemove &&
                  <button
                    className="button resources-list__icon resources-list--action"
                    onClick={onRemove.bind(null, resource.id)}
                    type="button"
                  >
                    <i className="fa fa-trash-o fa-fw" />
                    <small>Remove</small>
                  </button>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ResourcesList.defaultProps = {
  showAvatar: false,
  showOwnerName: false,
  showRemove: false,
  showStatus: false,
};

ResourcesList.propTypes = {
  resources: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      display_name: React.PropTypes.string,
      description: React.PropTypes.string,
      introduction: React.PropTypes.string
    })
  ),
  resourcesAvatars: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      src: React.PropTypes.string
    })
  ),
  resourceType: React.PropTypes.string,
  showAvatar: React.PropTypes.bool,
  showOwnerName: React.PropTypes.bool,
  showRemove: React.PropTypes.bool,
  onRemove: React.PropTypes.func,
  showStatus: React.PropTypes.bool,
  title: React.PropTypes.string,
};

export default ResourcesList;
