const fs = require("fs");

class Component {
  constructor({ templateFileName, initialProps = {} }) {
    this.props = initialProps;

    const templateString = templateFileName
      ? fs.readFileSync(templateFileName, "utf8")
      : null;

    this.template = this.stringToTemplate(templateString.trim());
  }

  stringToTemplate(templateString) {
    if (!templateString) {
      return null;
    }

    const doc = new DOMParser().parseFromString(templateString, "text/html");
    const htmlContents = doc.firstElementChild.getElementsByTagName("body")[0]
      .children[0];
    return doc ? htmlContents : null;
  }

  mount(parentElement) {
    if (!parentElement || !this.template) {
      return;
    }
    parentElement.appendChild(this.template);
  }

  dismount(parentElement) {
    parentElement.removeChild(parentElement.childNodes[0]);
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
