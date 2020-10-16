const fs = require("fs");

class Component {
  constructor({ templateFileName, initialProps = {}, parentElement = null }) {
    this.props = initialProps;
    this.parentElement = parentElement;

    const templateString = templateFileName
      ? fs.readFileSync(templateFileName, "utf8")
      : null;

    this.template = this.stringToTemplate(templateString.trim());
  }

  stringToTemplate(templateString) {
    if (!templateString) {
      return null;
    }

    const doc = new DOMParser().parseFromString(templateString, "text/xml");
    return doc ? doc.firstChild : null;
  }

  mount() {
    if (!this.parentElement || !this.template) {
      return;
    }
    this.parentElement.appendChild(this.template);
  }

  dismount() {
    // do someshit here
    return;
  }

  update(props) {
    this.props = props;
  }

  render(props) {
    return;
  }
}

module.exports = {
  Component: Component,
};
