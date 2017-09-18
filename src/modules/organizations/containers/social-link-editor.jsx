import React from 'react';
import SOCIAL_ICONS from '../../../lib/social-icons';
import DragReorderable from 'drag-reorderable';
import cloneDeep from 'lodash.clonedeep';
import { difference, sortBy, intersection, filter, chain } from 'lodash';
import { connect } from 'react-redux';
import { setOrganizationSocialLinkPath, setOrganizationSocialOrder, setOrganizationUrls } from '../action-creators';

class SocialLinkEditor extends React.Component {
  constructor(props) {
    super(props);

    this.createSocialOrder = this.createSocialOrder.bind(this);
    this.handleUpdateSocialInput = this.handleUpdateSocialInput.bind(this);
    this.handleLinkReorder = this.handleLinkReorder.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
    this.renderRow = this.renderRow.bind(this);

    const socialOrder = Object.keys(SOCIAL_ICONS);
    this.state = {
      socialOrder,
      links: []
    };
  }

  componentDidMount() {
    this.setInitialPositions();
    this.createSocialOrder(Object.keys(SOCIAL_ICONS));
    this.setState({ links: this.props.organizationUrls })
  }

  setInitialPositions() {
    const socialLinks = this.props.organizationUrls.filter(url => url.path)
    const externalUrls = this.props.organizationUrls.filter(url => !url.path)

    const sortedSocialLinks = sortBy(socialLinks, 'position')
    const positionedSocialLinks = sortedSocialLinks.map((link, index) => {
      return Object.assign(link, { position: index })
    })

    this.props.dispatch(setOrganizationUrls({ organizationUrls: [...positionedSocialLinks, ...externalUrls]}))
  }

  // Extract the social urls and check to see if they have value.
  // If they do, order them above empty social urls.
  createSocialOrder(socialOrder) {
    // extract social urls that have a value set.
    const setSocialUrls = chain(this.props.organizationUrls)
      .filter(url => url.path)
      .sortBy('position')
      .map(url => url.site)
      .value()

    // Extract social urls that don't have values set.
    const unsetSocialUrls = difference(socialOrder, setSocialUrls)

    const newSocialOrder = [...setSocialUrls, ...unsetSocialUrls]

    this.setState({ socialOrder: newSocialOrder });
    this.props.dispatch(setOrganizationSocialOrder({ socialOrder: newSocialOrder }));
  }

  handleUpdateSocialInput(site, e) {
    let index = this.indexFinder(this.state.links, site);
    if (index < 0) { index = this.state.links.length; }

    if (e.target.value) {
      const changes = {
        label: '',
        path: e.target.value,
        site,
        url: `https://${site}${e.target.value}`,
        position: this.state.socialOrder.indexOf(site)
      };

      const linksCopy = cloneDeep(this.state.links);
      linksCopy[index] = changes;
      this.setState({ links: linksCopy });
      this.props.dispatch(setOrganizationSocialLinkPath({ organizationUrls: linksCopy }))
    } else {
      this.handleRemoveLink(site);
    }
  }

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

  handleRemoveLink(linkToRemove) {
    const linksCopy = cloneDeep(this.state.links);
    const indexToRemove = this.indexFinder(linksCopy, linkToRemove);

    if (indexToRemove > -1) {
      linksCopy.splice(indexToRemove, 1);
      this.setState({ links: linksCopy });
    }
  }

  handleDisableDrag(event) {
    event.target.parentElement.parentElement.parentElement.setAttribute('draggable', false);
  }

  handleEnableDrag(event) {
    event.target.parentElement.parentElement.parentElement.setAttribute('draggable', true);
  }

  indexFinder(toSearch, toFind) {
    return toSearch.findIndex(i => (i.site === toFind));
  }

  renderRow(site, i) {
    const index = this.indexFinder(this.state.links, site);
    const value = index >= 0 ? this.state.links[index].path : '';

    return (
      <tr key={i}>
        <td>{site}</td>
        <td>
          <input
            type="text"
            name={`urls.${site}.url`}
            value={value}
            onChange={this.handleUpdateSocialInput.bind(this, site)}
            onMouseDown={this.handleDisableDrag}
            onMouseUp={this.handleEnableDrag}
          />
        </td>
        <td>
          <button type="button" onClick={this.handleRemoveLink.bind(this, site)}>
            <i className="fa fa-remove" />
          </button>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <table className="edit-social-links">
        <DragReorderable
          tag="tbody"
          items={this.state.socialOrder}
          render={this.renderRow}
          onChange={this.handleLinkReorder}
        />
      </table>
    );
  }
}

SocialLinkEditor.defaultProps = {
  organization: {
    urls: []
  }
};

SocialLinkEditor.propTypes = {
  organization: React.PropTypes.shape({
    urls: React.PropTypes.array
  })
};


function mapStateToProps(state) {
  const organizationUrls = state.organizationUrls || state.organization.urls;

  return {
    organizationUrls,
    socialOrder: state.socialOrder
  };
}

export default connect(mapStateToProps)(SocialLinkEditor);



