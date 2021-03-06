import React from 'react';

export const organizationShape = React.PropTypes.shape({
  id: React.PropTypes.string,
  display_name: React.PropTypes.string,
  description: React.PropTypes.string,
  introduction: React.PropTypes.string
});

export const organizationsShape = React.PropTypes.arrayOf(organizationShape);

export const organizationCollaboratorsShape = React.PropTypes.arrayOf(
  React.PropTypes.shape({
    id: React.PropTypes.string,
    roles: React.PropTypes.arrayOf(React.PropTypes.string),
  }),
);

export const organizationOwnerShape = React.PropTypes.shape({
  display_name: React.PropTypes.string,
  id: React.PropTypes.string,
});

export const organizationAvatarShape = React.PropTypes.shape({
  src: React.PropTypes.string
});

export const organizationsAvatarsShape = React.PropTypes.arrayOf(organizationAvatarShape);

export const organizationBackgroundShape = React.PropTypes.shape({
  src: React.PropTypes.string
});

export const organizationPageShape = React.PropTypes.shape({
  id: React.PropTypes.string,
  url_key: React.PropTypes.string,
});
