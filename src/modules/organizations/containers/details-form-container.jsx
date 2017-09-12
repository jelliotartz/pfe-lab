import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DisplayNameSlugEditor } from 'zooniverse-react-components';
import { config } from '../../../constants/config';
import { setCurrentOrganization } from '../action-creators';
import { organizationShape } from '../model';
import MarkdownEditor from '../../common/components/markdown-editor';
import bindInput from '../../common/containers/bind-input';
import FormContainer from '../../common/containers/form-container';
import CharLimit from '../../common/components/char-limit';

// import only the clone deep method?
import _ from 'lodash';
import Box from 'grommet/components/Box';

const ExternalLinkRow = ({ link, onLabelChange, onUrlChange, index }) =>
  <Box direction="row">
    <Box>
      <input
        type="text"
        name={link.label}
        value={link.label}
        onChange={onLabelChange}
      />
    </Box>
    <Box>
      <input
        type="text"
        name={link.url}
        value={link.url}
        onChange={onUrlChange}
      />
    </Box>
  </Box>



class DetailsFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.collectValues = this.collectValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.resetOrganization = this.resetOrganization.bind(this);

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);

    this.state = {
      textarea: '',
      links: this.props.organization.urls
    };
  }

  componentDidMount() {
    this.setState({ textarea: this.props.organization.introduction });
  }

  handleUrlChange(event, index) {
    // create copy of this state links
    const linksCopy = _.cloneDeep(this.state.links);
    linksCopy[index].url = event.target.value; // this mutates state. bad!
    this.setState({ links: linksCopy });
  }

  handleLabelChange(event, index) {
    // create copy of this state links
    const linksCopy = _.cloneDeep(this.state.links)
    linksCopy[index].label = event.target.value; // this mutates state. bad!
    this.setState({ links: linksCopy });
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
    result.urls = this.state.links;

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

    return (
      <div>
        <FormContainer onSubmit={this.handleSubmit} onReset={this.resetOrganization}>
          <fieldset className="form__fieldset">
            <DisplayNameSlugEditor
              origin={config.zooniverseURL}
              resource={organization}
              resourceType="organization"
              ref={(node) => { this.fields.display_name = node; }}
            />
          </fieldset>
          <fieldset className="form__fieldset">
            <label className="form__label" htmlFor="description">
              Description
              <DescriptionInput
                className="form__input form__input--full-width"
                id="description"
                ref={(node) => { this.fields.description = node; }}
              />
            </label>
            <small className="form__help">
              This should be a one-line call to action for your organization that displays on your landing page.
              It will be displayed below the organization&apos;s name.{' '}
              <CharLimit limit={300} string={this.props.organization.description || ''} />
            </small>
          </fieldset>
          <fieldset className="form__fieldset">
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
          </fieldset>

          <fieldset className="form__fieldset">
            <label className="form__label">
              External Links
              <Box size={{width: {max: 'medium'}}}>
                <Box direction="row" margin={{top: 'small'}}>
                  <Box style={{minWidth: '110px', textAlign: 'center'}}>Label</Box>
                  <Box style={{minWidth: '110px', textAlign: 'center'}}>Url</Box>
                </Box>
                {this.state.links && this.state.links.map((link, index) =>
                  <ExternalLinkRow
                    key={`external-link-${index}`}
                    link={link}
                    index={index}
                    onLabelChange={(event) => this.handleLabelChange(event, index)}
                    onUrlChange={(event) => this.handleUrlChange(event, index)}
                  />
                )}
              </Box>
            </label>
            <small className="form__help">
              Adding an external link will make it appear as a new tab alongside
              the about, classify, talk, and collect tabs.
            </small>
          </fieldset>

        </FormContainer>
      </div>
    );
  }
}


DetailsFormContainer.defaultProps = {
  organization: {},
};

DetailsFormContainer.propTypes = {
  dispatch: PropTypes.func,
  organization: organizationShape,
  updateOrganization: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
  };
}

export default connect(mapStateToProps)(DetailsFormContainer);
