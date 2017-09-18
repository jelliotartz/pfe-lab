import * as types from '../../constants/action-types';
import initialState from '../../initial-state';

export default function (state = initialState, action) { // eslint-disable-line import/prefer-default-export
  switch (action.type) {
    case types.SET_CURRENT_ORGANIZATION:
      return { organization: action.organization };
    case types.SET_ORGANIZATIONS_AVATARS:
      return { organizationsAvatars: action.organizationsAvatars };
    case types.SET_COLLABORATED_ORGANIZATIONS:
      return { collaboratedOrganizations: action.collaboratedOrganizations };
    case types.SET_OWNED_ORGANIZATIONS:
      return { ownedOrganizations: action.ownedOrganizations };
    case types.SET_ORGANIZATION_COLLABORATORS:
      return { organizationCollaborators: action.organizationCollaborators };
    case types.SET_ORGANIZATION_OWNER:
      return { organizationOwner: action.organizationOwner };
    case types.SET_ORGANIZATION_PAGE:
      return { organizationPage: action.organizationPage };
    case types.SET_ORGANIZATION_PROJECTS:
      return { organizationProjects: action.projects };
    case types.SET_ORGANIZATION_AVATAR:
      return { organizationAvatar: action.organizationAvatar };
    case types.SET_ORGANIZATION_BACKGROUND:
      return { organizationBackground: action.organizationBackground };
    case types.SET_ORGANIZATION_EXTERNAL_LINK_LABEL:
      return { organizationUrls: action.organizationUrls };
    case types.SET_ORGANIZATION_EXTERNAL_LINK_URL:
      return { organizationUrls: action.organizationUrls };
    case types.SET_ORGANIZATION_SOCIAL_LINK_PATH:
      return { organizationUrls: action.organizationUrls };
    case types.SET_ORGANIZATION_SOCIAL_ORDER:
      return { socialOrder: action.socialOrder };
    case types.SET_ORGANIZATION_URLS:
      return { organizationUrls: action.organizationUrls };
    case types.SET_ORGANIZATION_EXTERNAL_ORDER:
      return { externalOrder: action.externalOrder };
    default:
      return state;
  }
}
