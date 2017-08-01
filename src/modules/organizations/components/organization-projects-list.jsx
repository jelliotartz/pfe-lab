import React from 'react';

import { config } from '../../../constants/config';
import { projectsShape } from '../../projects/model';

const OrganizationProjectsList = ({ projects, onRemove }) => {
  if (!projects || projects.length < 1) {
    return (<p>No projects associated with this organization</p>);
  }

  return (
    <ul className="organization-projects-list">
      {projects.map(project => (
        <li key={project.id} className="organizations-list__item">
          <div className="organizations-list__row">
            <a href={`${config.zooniverseURL}/lab/${project.id}`} className="organizations-list__edit organizations-list--action">
              <div className="organizations-list__description">
                <strong>{project.display_name}</strong>{' '}
                <small>{`by ${project.links.owner.display_name}`}</small>
                <span className={`color-label ${project.launch_approved ? 'green' : 'red'}`}>{project.launch_approved ? 'Launch Approved' : 'NOT PUBLICLY VISIBLE'}</span>
              </div>
              <span className="organizations-list__icon">
                <i className="fa fa-pencil fa-fw" />
                <small>Edit</small>
              </span>
            </a>
            <a href={`${config.zooniverseURL}/projects/${project.slug}`} className="organizations-list__icon organizations-list--action">
              <i className="fa fa-hand-o-right fa-fw" />
              <small>View</small>
            </a>
            <button
              type="button"
              onClick={onRemove.bind(null, project.id)}
              className="button organizations-list__icon organizations-list--action"
            >
              <i className="fa fa-trash-o fa-fw" />
              <small>Remove</small>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

OrganizationProjectsList.propTypes = {
  projects: projectsShape.isRequired,
  onRemove: React.PropTypes.func.isRequired,
};

export default OrganizationProjectsList;
