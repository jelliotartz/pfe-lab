import React from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';

const SocialLinkRow = ({ link, onLabelChange, onUrlChange, onRemoveLink }) =>
  (<Box direction="row">
    <Box>

    </Box>
    <Box>
      <input
        type="text"
        name={link.url}
        value={link.url}
        onChange={onUrlChange}
      />
    </Box>
    <button type="button">
      <i className="fa fa-remove" onClick={onRemoveLink}/>
    </button>
  </Box>);

SocialLinkRow.defaultProps = {
  link: {
    label: '',
    url: '',
  },
  onLabelChange: () => {},
  onUrlChange: () => {},
};

SocialLinkRow.PropTypes = {
  link: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
  }),
  onLabelChange: PropTypes.func,
  onUrlChange: PropTypes.func,
};

export default SocialLinkRow;
