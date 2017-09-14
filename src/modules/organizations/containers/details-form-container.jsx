import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DisplayNameSlugEditor } from 'zooniverse-react-components';
import { config } from '../../../constants/config';
import { setCurrentOrganization } from '../action-creators';
import { organizationShape } from '../model';
import MarkdownEditor from '../../common/components/markdown-editor';
import cloneDeep from 'lodash.clonedeep';
import Box from 'grommet/components/Box';
import ExternalLinkRow from '../components/external-link-row';
import bindInput from '../../common/containers/bind-input';
import FormContainer from '../../common/containers/form-container';
import CharLimit from '../../common/components/char-limit';
import notificationHandler from '../../../lib/notificationHandler';

class DetailsFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.collectValues = this.collectValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.resetOrganization = this.resetOrganization.bind(this);

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleAddExternalLink = this.handleAddExternalLink.bind(this);

    this.state = {
      textarea: '',
      links: this.props.organization.urls,
      linkToAdd: {
        url: 'https://example.com/',
        label: 'Example'
      }
    };
  }

  componentDidMount() {
    this.setState({ textarea: this.props.organization.introduction });
  }

  handleUrlChange(event, index) {
    const linksCopy = cloneDeep(this.state.links);
    linksCopy[index].url = event.target.value;
    this.setState({ links: linksCopy });
  }

  handleLabelChange(event, index) {
    const linksCopy = cloneDeep(this.state.links);
    linksCopy[index].label = event.target.value;
    this.setState({ links: linksCopy });
  }

  // currently not working
  handleAddExternalLink() {
    const newLink = this.state.linkToAdd;

    const linksCopy = cloneDeep(this.state.links);
    linksCopy.push(newLink);
    this.setState({ links: linksCopy }); // this does not replace this.state.links with linksCopy. why?
                                         // is it happening async?
    // debugger;
    // this.props.updateOrganization(this.props.organization)
    //   .then(([organization]) => {
    //     this.props.dispatch(setCurrentOrganization(organization));
    //   })
    //   .catch((error) => {
    //     const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

    //     notificationHandler(this.props.dispatch, notification);
    //   });

    // const changes = {
    //   url: 'https://example.com/',
    //   label: 'Example'
    // };


    // this.props.updateOrganization(this.props.organization);
  }

  // currently not working
  handleRemoveLink(linkToRemove, index) {
    const urlList = this.props.organization.urls.slice();
    const indexToRemove = urlList.findIndex(i => (i === linkToRemove));
    if (indexToRemove > -1) {
      urlList.splice(indexToRemove, 1);
      const changes = {
        urls: urlList
      };

      const linksCopy = cloneDeep(this.state.links);
      // linksCopy.push(changes);
      linksCopy.splice(0, linksCopy.length, ...changes.urls);
      this.setState({ links: linksCopy });

    }

    this.props.updateOrganization(patch);
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
            <label className="form__label" htmlFor="urls">
              External Links
              <Box size={{ width: { max: 'medium' } }}>
                <Box direction="row" margin={{ top: 'small' }}>
                  <Box style={{ minWidth: '110px', textAlign: 'center' }}>Label</Box>
                  <Box style={{ minWidth: '110px', textAlign: 'center' }}>Url</Box>
                </Box>
                {this.state.links && this.state.links.map((link, index) =>
                  (<ExternalLinkRow
                    key={`external-link-${index}`}
                    link={link}
                    index={index}
                    onLabelChange={event => this.handleLabelChange(event, index)}
                    onUrlChange={event => this.handleUrlChange(event, index)}
                    onRemoveLink={this.handleRemoveLink.bind(this, link)}
                    onSubmit={this.handleSubmit}
                  />)
                )}
              </Box>
            </label>
            <button type="button" onClick={this.handleAddExternalLink.bind(this)}>Add a link</button>
            <br />
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
  dispatch: () => {},
  organization: {},
  updateOrganization: () => {},
};

DetailsFormContainer.propTypes = {
  dispatch: PropTypes.func,
  organization: organizationShape,
  updateOrganization: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
  };
}

export default connect(mapStateToProps)(DetailsFormContainer);
