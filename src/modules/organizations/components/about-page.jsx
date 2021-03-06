import React from 'react';
import MarkdownEditor from '../../common/components/markdown-editor';

import FormContainer from '../../common/containers/form-container';
import { organizationShape, organizationPageShape } from '../model';

const AboutPage = (props) => {
  if (!props.organizationPage) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (Object.keys(props.organizationPage).length === 0) {
    return (
      <div>
        <p>No about page is found.</p>
        <button type="button" onClick={props.onCreatePage}>Create a new about page</button>
      </div>
    );
  }

  return (
    <div>
      <div className="organization-section-header">Organization About Page</div>
      <p>
        This page is for you to describe your organization to the volunteers. Feel free to add detail, but try to avoid jargon. This page renders markdown, so you can format it and add images via the Media Library and links.
      </p>
      <FormContainer onSubmit={props.onSubmit} onReset={props.resetOrganizationPage}>
        <fieldset className="form__fieldset">
          <label className="form__label" htmlFor="content">
            About Page Content
            <br />
            <MarkdownEditor
              id="content"
              name="content"
              onChange={props.onTextAreaChange}
              project={props.organization}
              rows="20"
              value={props.pageContent}
            />
          </label>
        </fieldset>
      </FormContainer>
    </div>
  );
};

AboutPage.propTypes = {
  onCreatePage: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  onTextAreaChange: React.PropTypes.func,
  organization: organizationShape,
  organizationPage: organizationPageShape,
  pageContent: React.PropTypes.string,
  resetOrganizationPage: React.PropTypes.func
};

export default AboutPage;
