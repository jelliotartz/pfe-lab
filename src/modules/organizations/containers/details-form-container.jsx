import React from 'react';
import { connect } from 'react-redux';
import { DisplayNameSlugEditor } from 'zooniverse-react-components';
import MarkdownEditor from '../../common/components/markdown-editor';
import { organizationShape } from '../model';
import { setCurrentOrganization } from '../action-creators';
import bindInput from '../../common/containers/bind-input';
import FormContainer from '../../common/containers/form-container';
import CharLimit from '../../common/components/char-limit';

import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';

class DetailsFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.collectValues = this.collectValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.resetOrganization = this.resetOrganization.bind(this);

    this.state = {
      textarea: ''
    };
  }

  componentDidMount() {
    this.setState({ textarea: this.props.organization.introduction });
  }

  handleTextAreaChange(event) {
    const textarea = event.target.value;

    this.setState({ textarea });
  }

  collectValues() {
    // TODO rework this to better work with the MarkdownEditor
    // TODO only submit changed fields!
    const result = {};
    Object.keys(this.fields).forEach((fieldName) => {
      result[fieldName] = this.fields[fieldName].value();
    });
    result.introduction = this.state.textarea;
    return result;
  }

  handleSubmit() {
    const patch = this.collectValues();
    this.props.updateOrganization(patch);
  }

  resetOrganization() {
    this.props.dispatch(setCurrentOrganization(this.props.organization));
  }

  render() {
    // TODO rename prop in markdownz to be resource not project.
    // TODO extract <MarkdownHelp /> into shared components repo.
    // TODO extract MarkdownEditor into its own component put into common folder
    // TODO split into functional component
    const organization = this.props.organization;
    const DescriptionInput = bindInput(organization.description, <input type="text" />);
    this.fields = {};

    console.log(organization.urls)

    return (
      <div>
        <FormContainer onReset={this.resetOrganization}>
          <Form onSubmit={this.handleSubmit}>

            <FormFields>
              <FormField>
                <DisplayNameSlugEditor
                  resource={organization}
                  resourceType="organization"
                  ref={(node) => { this.fields.display_name = node; }}
                />
              </FormField>
            </FormFields>

            <FormFields>
              <FormField label="Description" htmlFor="description" help="This should be a one-line call to action for your organization that displays on your landing page. It will be displayed below the organization's name.">
                <DescriptionInput
                  className="form__input form__input--full-width"
                  id="description"
                  ref={(node) => { this.fields.description = node; }}
                />
                <CharLimit limit={300} string={this.props.organization.description || ''} />

              </FormField>
            </FormFields>

            <FormFields>
              <label className="form__label" htmlFor="introduction">
                Introduction
                <MarkdownEditor
                  id="introduction"
                  name="introduction"
                  onChange={this.handleTextAreaChange}
                  project={this.props.organization}
                  rows="10"
                  value={this.state.textarea}
                />
              </label>
              <small className="form__help">
                Add a brief introduction to get people interested in your organization.
                This will display on your landing page.{' '}
                <CharLimit limit={1500} string={this.state.textarea || ''} />
              </small>
            </FormFields>

            <FormFields>
              <label className="form__label" htmlFor="url-input">
                url input
                <div>this will be a Url Input component</div>
              </label>
              <small className="form__help">
                explanatory text for Url Input
              </small>
            </FormFields>
          </Form>

        </FormContainer>
      </div>
    );
  }
}

DetailsFormContainer.defaultProps = {
  organization: {},
};

DetailsFormContainer.propTypes = {
  dispatch: React.PropTypes.func,
  organization: organizationShape,
  updateOrganization: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
  };
}

export default connect(mapStateToProps)(DetailsFormContainer);
