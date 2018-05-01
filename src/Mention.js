import React from 'react';
import PropTypes from 'prop-types';
import Radium from './OptionalRadium';

import utils from './utils';

function Mention({ display, className, style }) {
  return (
    <strong
      className={className}
      style={{ ...defaultStyle, ...style}}
    >
      { display }
    </strong>
  );
};

Mention.propTypes = {
  /**
   * Called when a new mention is added in the input
   *
   * Example:
   *
   * ```js
   * function(id, display) {
   *   console.log("user " + display + " was mentioned!");
   * }
   * ```
   */
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,

  renderSuggestion: PropTypes.func,

  // TODO React 15.6.2 update PropTypes problems
  /*
  trigger: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(RegExp)
  ]),
  */
  trigger: PropTypes.any,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

Mention.defaultProps = {
  trigger: "@",

  onAdd: () => null,
  onRemove: () => null,
  renderSuggestion: null,
  isLoading: false,
  appendSpaceOnAdd: false
};

const defaultStyle = {
  fontWeight: "inherit"
}

export default Radium(Mention);
