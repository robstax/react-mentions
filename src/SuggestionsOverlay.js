import React, { Component, PropTypes } from 'react';
import Radium from './OptionalRadium';
import { defaultStyle } from 'substyle';

import utils from './utils';

import Suggestion from './Suggestion';
import LoadingIndicator from './LoadingIndicator';

class SuggestionsOverlay extends Component {

  static propTypes = {
    suggestions: PropTypes.object.isRequired,
    focusIndex: PropTypes.number,
    scrollFocusedIntoView: PropTypes.bool,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func,
  };

  static defaultProps = {
    suggestions: {},
    onSelect: () => null,
  };

  componentDidUpdate() {
    const { suggestions, suggestionsContainer } = this.refs
    if (!suggestions || suggestionsContainer.offsetHeight >= suggestionsContainer.scrollHeight || !this.props.scrollFocusedIntoView) {
      return
    }

    const scrollTop = suggestionsContainer.scrollTop
    let { top, bottom } = suggestions.children[this.props.focusIndex].getBoundingClientRect();
    const { top: topContainer } = suggestionsContainer.getBoundingClientRect();
    top = top - topContainer + scrollTop;
    bottom = bottom - topContainer + scrollTop;
    
    if(top < scrollTop) {
      suggestionsContainer.scrollTop = top
    } else if(bottom > suggestionsContainer.offsetHeight) {
      suggestionsContainer.scrollTop = bottom - suggestionsContainer.offsetHeight
    }
  }

  render() {
    // do not show suggestions until there is some data
    if(utils.countSuggestions(this.props.suggestions) === 0 && !this.props.isLoading) {
      return null;
    }

    return (
      <div ref="suggestionsContainer"
        {...substyle(this.props)}
        onMouseDown={this.props.onMouseDown}>

        <ul ref="suggestions"
          {...substyle(this.props, "list") }>
          { this.renderSuggestions() }
        </ul>

        { this.renderLoadingIndicator() }
      </div>
    );
  }

  renderSuggestions() {
    return utils.getSuggestions(this.props.suggestions).reduce((result, { suggestions, descriptor }) => [
      ...result,

      ...suggestions.map((suggestion, index) => this.renderSuggestion(
        suggestion,
        descriptor,
        result.length + index
      ))
    ], []);
  }

  renderSuggestion(suggestion, descriptor, index) {
    let id = this.getID(suggestion);
    let isFocused = (index === this.props.focusIndex);

    let { mentionDescriptor, query } = descriptor;

    return (
      <Suggestion { ...substyle(this.props, "item") }
        key={ id }
        id={ id }
        ref={isFocused ? "focused" : null}
        query={ query }
        index={ index }
        descriptor={ mentionDescriptor }
        suggestion={ suggestion }
        focused={ isFocused }
        onClick={ () => this.select(suggestion, descriptor) }
        onMouseEnter={ () => this.handleMouseEnter(index) } />
    );
  }

  getID(suggestion) {
    if(suggestion instanceof String) {
      return suggestion;
    }

    return suggestion.id;
  }

  renderLoadingIndicator () {
    if(!this.props.isLoading) {
      return;
    }

    return <LoadingIndicator { ...substyle(this.props, "loadingIndicator") } />
  }

  handleMouseEnter(index, ev) {
    if(this.props.onMouseEnter) {
      this.props.onMouseEnter(index);
    }
  }

  select(suggestion, descriptor) {
    this.props.onSelect(suggestion, descriptor);
  }

};

export default Radium(SuggestionsOverlay);

const substyle = defaultStyle({
});
