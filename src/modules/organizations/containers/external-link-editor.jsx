import React from 'react';
import DragReorderable from 'drag-reorderable';
import Box from 'grommet/components/Box';
import ExternalLinkRow from '../components/external-link-row';
import { connect } from 'react-redux';
import { setOrganizationExternalLinkUrl, setOrganizationExternalLinkLabel } from '../action-creators';
import cloneDeep from 'lodash.clonedeep';

class ExternalLinkEditor extends React.Component {

  constructor(props) {
    super(props);
    this.handleAddLink = this.handleAddLink.bind(this);
    this.handleLinkReorder = this.handleLinkReorder.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderTable = this.renderTable.bind(this);

    this.state = {
      links: [],
      linkToAdd: {
        url: 'https://example.com/',
        label: 'Example'
      }
    }
  }

  componentDidMount() {
    this.setState({
      links: this.props.organizationUrls
    });
  }

  handleAddLink() {
    const newLink = this.state.linkToAdd;

    const linksCopy = cloneDeep(this.state.links);
    linksCopy.push(newLink);
    this.setState({ links: linksCopy });
  }

  handleLinkReorder(newLinkOrder) {
    if (this.state.links) {
      const socialUrls = this.state.links.filter(url => url.path);
      const urls = newLinkOrder.concat(socialUrls);
      this.setState({ links: urls });
    }
  }

  handleRemoveLink(event, index) {
    const linksCopy = cloneDeep(this.state.links);
    linksCopy.splice(index, 1);
    this.setState({ links: linksCopy });
  }

  handleUrlChange(event, index) {
    const linksCopy = cloneDeep(this.state.links);
    linksCopy[index].url = event.target.value;
    this.setState({ links: linksCopy });

    this.props.dispatch(setOrganizationExternalLinkUrl({ organizationUrls: linksCopy }))
  }

  handleLabelChange(event, index) {
    const linksCopy = cloneDeep(this.state.links);
    linksCopy[index].label = event.target.value;
    this.setState({ links: linksCopy });

    this.props.dispatch(setOrganizationExternalLinkLabel({ organizationUrls: linksCopy }))
  }

  handleDisableDrag(event) {
    event.target.parentElement.parentElement.parentElement.setAttribute('draggable', false);
  }

  handleEnableDrag(event) {
    event.target.parentElement.parentElement.parentElement.setAttribute('draggable', true);
  }

  renderRow(link) {
    // Find the link's current position in the list
    const index = this.props.organization.urls.findIndex(i => (i._key === link._key));
    return (
      <tr key={link._key}>
        <td>
          <input
            type="text"
            name={link.label}
            value={link.label}
            onChange={event => this.handleLabelChange(event, index)}
            onMouseDown={this.handleDisableDrag}
            onMouseUp={this.handleEnableDrag}
          />
          <input
            type="text"
            name={link.url}
            value={link.url}
            onChange={event => this.handleUrlChange(event, index)}
            onMouseDown={this.handleDisableDrag}
            onMouseUp={this.handleEnableDrag}
          />
        </td>
        <td>
          <button type="button" onClick={event => this.handleRemoveLink(event, index)}>
            <i className="fa fa-remove" />
          </button>
        </td>
      </tr>
    );
  }

  renderTable(urls) {
    const tableUrls = urls.filter(url => !url.path);
    for (const link of tableUrls) {
      if (!link._key) {
        link._key = Math.random();
      }
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>URL</th>
          </tr>
        </thead>
        <DragReorderable
          tag="tbody"
          items={tableUrls}
          render={this.renderRow}
          onChange={this.handleLinkReorder}
        />
      </table>
    );
  }

  render() {
    return (
      <div>
        {(this.props.organizationUrls.length > 0)
          ? this.renderTable(this.props.organizationUrls)
          : null}

          <button type="button" onClick={this.handleAddLink}>Add a link</button>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    organizationUrls: state.organizationUrls || state.organization.urls,
  };
}

export default connect(mapStateToProps)(ExternalLinkEditor);
