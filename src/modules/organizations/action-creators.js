import * as types from '../../constants/action-types';

export function setCurrentOrganization(organization) {
  return {
    type: types.SET_CURRENT_ORGANIZATION,
    organization,
  };
}

export function setCollaboratedOrganizations(collaboratedOrganizations) {
  return {
    type: types.SET_COLLABORATED_ORGANIZATIONS,
    collaboratedOrganizations,
  };
}

export function setOwnedOrganizations(ownedOrganizations) {
  return {
    type: types.SET_OWNED_ORGANIZATIONS,
    ownedOrganizations,
  };
}

export function setOrganizationsAvatars(organizationsAvatars) {
  return {
    type: types.SET_ORGANIZATIONS_AVATARS,
    organizationsAvatars
  };
}

export function setOrganizationCollaborators(organizationCollaborators) {
  return {
    type: types.SET_ORGANIZATION_COLLABORATORS,
    organizationCollaborators,
  };
}

export function setOrganizationOwner(organizationOwner) {
  return {
    type: types.SET_ORGANIZATION_OWNER,
    organizationOwner,
  };
}

export function setOrganizationPage(organizationPage) {
  return {
    type: types.SET_ORGANIZATION_PAGE,
    organizationPage,
  };
}

export function setOrganizationProjects(projects) {
  return {
    type: types.SET_ORGANIZATION_PROJECTS,
    projects,
  };
}

export function setOrganizationAvatar(organizationAvatar) {
  return {
    type: types.SET_ORGANIZATION_AVATAR,
    organizationAvatar
  };
}

export function setOrganizationBackground(organizationBackground) {
  return {
    type: types.SET_ORGANIZATION_BACKGROUND,
    organizationBackground
  };
}

export function setOrganizationExternalLinkUrl({ organizationUrls }) {
  return {
    type: types.SET_ORGANIZATION_EXTERNAL_LINK_URL,
    organizationUrls
  };
}

export function setOrganizationExternalLinkLabel({ organizationUrls }) {
  return {
    type: types.SET_ORGANIZATION_EXTERNAL_LINK_LABEL,
    organizationUrls
  };
}

export function setOrganizationSocialLinkPath({ organizationUrls }) {
  return {
    type: types.SET_ORGANIZATION_SOCIAL_LINK_PATH,
    organizationUrls
  };
}

export function setOrganizationSocialOrder({ socialOrder }) {
  return {
    type: types.SET_ORGANIZATION_SOCIAL_ORDER,
    socialOrder
  };
}

export function setOrganizationUrls({ organizationUrls }) {
  return {
    type: types.SET_ORGANIZATION_URLS,
    organizationUrls
  };
}

export function setOrganizationExternalOrder({ externalOrder }) {
  return {
    type: types.SET_ORGANIZATION_EXTERNAL_ORDER,
    externalOrder
  };
}

