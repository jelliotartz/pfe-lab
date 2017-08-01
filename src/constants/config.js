const DEFAULT_ENV = 'staging';

const API_APPLICATION_IDS = {
  production: '',
  staging: 'a6965f9d7fbe7e921cbf1fc032a02c1b1cc4652cbd6823256a7cc5944ae2c4e1',
  development: 'a6965f9d7fbe7e921cbf1fc032a02c1b1cc4652cbd6823256a7cc5944ae2c4e1'
};

const env = process.env.NODE_ENV || DEFAULT_ENV;

const ZOONIVERSE_URL = {
  production: 'https://www.zooniverse.org',
  staging: 'https://org-demo.pfe-preview.zooniverse.org',
  development: 'https://org-demo.pfe-preview.zooniverse.org'
};

export const config = { // eslint-disable-line import/prefer-default-export
  panoptesAppId: API_APPLICATION_IDS[env],
  zooniverseURL: ZOONIVERSE_URL[env]
};
