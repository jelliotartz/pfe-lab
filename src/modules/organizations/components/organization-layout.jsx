import React from 'react';
import { IndexLink, Link } from 'react-router';
import { config } from '../../../constants/config';

const OrganizationLayout = ({ children, navItems, organizationSlug, organizationId }) => (
  <div className="organization-layout">
    <nav className="organization-layout__nav">
      <ul className="nav-list">
        <li><div className="nav-list-header">Organization #{organizationId}</div></li>
        <li>
          <a
            className="view-org-button"
            href={`${config.zooniverseURL}/organizations/${organizationSlug}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View Organization
          </a>
        </li>
        {navItems.map((item, index) => {
          let LinkType;
          let linkTo;
          if (index === 0) {
            LinkType = IndexLink;
            linkTo = '';
          } else {
            LinkType = Link;
            linkTo = item.to;
          }
          return (
            <li key={item.label}>
              <LinkType
                to={`/organizations/${organizationId}/${linkTo}`}
                className="nav-list__item"
                activeClassName="active"
              >
                {item.label}
              </LinkType>
            </li>);
        })}
      </ul>
    </nav>

    <section className="organization-layout__section">{children}</section>
  </div>
);

OrganizationLayout.propTypes = {
  children: React.PropTypes.node,
  navItems: React.PropTypes.arrayOf(React.PropTypes.object),
  organizationId: React.PropTypes.string,
  organizationSlug: React.PropTypes.string,
};

OrganizationLayout.defaultProps = {
  children: null,
  navItems: [
    { to: 'edit', label: 'Edit' },
    { to: 'about', label: 'About' },
    { to: 'collaborators', label: 'Collaborators' },
    { to: 'projects', label: 'Projects' },
  ],
  organizationId: '',
  organizationSlug: '',
};

export default OrganizationLayout;
