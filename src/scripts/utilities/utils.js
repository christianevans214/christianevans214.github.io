/**
 * Simple wrapper to construct a JS DOM tree. Based on react-hyperscript.
 * @param {string} tag DOM tag.
 * @param {Object} attributes Attributes to set onto DOM component.
 * @param {Array|string=} Either an array of d functions or a string for innerText.
 * @return {Object} DOM element.
 */
export function d(tag, attributes, children='') {
  const element = document.createElement(tag);

  Object.keys(attributes).forEach(attr => {
    if (attr === 'eventListener') return;
    element.setAttribute(attr, attributes[attr]);
  });

  if (attributes.eventListener) {
    element.addEventListener(attributes.eventListener.type, attributes.eventListener.fn);
  }

  if (typeof children === 'string') {
    element.textContent = children;
  }else {
    children.forEach(child => {
      element.appendChild(child);
    });
  }

  return element;
}

/**
 * Toggles class for a given element.
 * @param {Object} element DOM element.
 * @param {string} className class to toggle.
 */
export function toggleClass(element, className) {
  const classArr = element.className.split(' ');
  const classNameIdx = classArr.indexOf(className);
  if (classNameIdx === -1) {
    classArr.push(className);
  } else {
    classArr.splice(classNameIdx, 1);
  }
  element.className = classArr.join(' ');
}
