import React from 'react';
import DragReorderable from 'drag-reorderable';
import Box from 'grommet/components/Box';
import ExternalLinkRow from '../components/external-link-row';
import { connect } from 'react-redux';
import { setOrganizationExternalLinkUrl, setOrganizationExternalLinkLabel, setOrganizationUrls, setOrganizationExternalOrder } from '../action-creators';
import { difference, sortBy, intersection, filter, chain, cloneDeep } from 'lodash';

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
      externalOrder: []
    }
  }

  componentDidMount() {
    this.setInitialPositions();
    this.createExternalOrder();
    this.setState({ links: this.props.organizationUrls });
  }

  handleAddLink() {
    const newLink = {
      url: 'https://example.com/',
      label: 'Example',
      position: this.state.externalOrder.length
    }

    const orderedExternalLinks = chain(this.state.links)
      .filter(url => !url.path)
      .sortBy('position')
      .value()

    orderedExternalLinks.push(newLink);

    // this.setInitialPositions();

    const linksCopy = cloneDeep(this.state.links);
    linksCopy.push(newLink);
    this.setState({ links: linksCopy });

    this.props.dispatch(setOrganizationUrls({ organizationUrls: linksCopy }))


    this.setState({ externalOrder: orderedExternalLinks });
    this.props.dispatch(setOrganizationExternalOrder({ externalOrder: orderedExternalLinks }));
    this.createExternalOrder();
  }

  handleLabelChange(event, index) {
    // debugger;
    // if (index < 0) {
    //   index = this.props.organizationUrls.length
    // }

    const linksCopy = cloneDeep(this.state.links);
    linksCopy[index].label = event.target.value;
    // debugger;
    this.setState({ links: linksCopy });

    this.props.dispatch(setOrganizationExternalLinkLabel({ organizationUrls: linksCopy }))
  }

  indexFinder(toSearch, toFind) {
    return toSearch.findIndex(i => (i.url === toFind));
  }

  // sets initial positions for both external and social links
  setInitialPositions() {
    const socialLinks = this.props.organizationUrls.filter(url => url.path)
    const externalUrls = this.props.organizationUrls.filter(url => !url.path)

    const sortedSocialLinks = sortBy(socialLinks, 'position')
    const positionedSocialLinks = sortedSocialLinks.map((link, index) => {
      return Object.assign(link, { position: index })
    })

    const sortedExternalLinks = sortBy(externalUrls, 'position');
    const positionedExternalLinks = sortedExternalLinks.map((link, index) => {
      return Object.assign(link, { position: index })
    })

    this.props.dispatch(setOrganizationUrls({ organizationUrls: [...positionedSocialLinks, ...externalUrls]}))
  }


  // Extract the external urls and sort them by position
  createExternalOrder() {
    const orderedExternalLinks = chain(this.props.organizationUrls)
      .filter(url => !url.path)
      .sortBy('position')
      .value()

    this.setState({ externalOrder: orderedExternalLinks });
    this.props.dispatch(setOrganizationExternalOrder({ externalOrder: orderedExternalLinks }));
  }

  // handleLinkReorder(newLinkOrder) {
  //   const socialUrls = this.state.links.filter(url => url.path);
  //   const urls = newLinkOrder.concat(socialUrls);
  //   this.setState({ links: urls });
  //   this.props.dispatch(setOrganizationUrls({ organizationUrls: urls }))
  // }

  handleLinkReorder(newLinkOrder) {
    // Filter out the links that don't have values set.
    const setSocialUrls = this.props.organizationUrls.filter(url => url.path).map(url => url.site);
    const externalUrls = this.props.organizationUrls.filter(url => !url.path)

    // Create an array of site values that are included in newLinkOrder and setSocialUrls.
    // The order of sites is determined by newLinkOrder.
    const newLinks = intersection(newLinkOrder, setSocialUrls)

    // Iterate over the new links, find the target url in this.props.organizaitonUrls, and update its position
    const newUrls = newLinks.map((link, index) => {
      const targetUrl = this.props.organizationUrls.find(url => url.site === link)
      return Object.assign(targetUrl, {position: newLinkOrder.indexOf(link)})
    })

    // update redux store with new positions for organizationUrls
    this.props.dispatch(setOrganizationUrls({ organizationUrls: [...newUrls, ...externalUrls]}))
    this.createSocialOrder(newLinkOrder)
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

          <button type="button" onClick={this.handleAddLink.bind(this)}>Add a link</button>
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
