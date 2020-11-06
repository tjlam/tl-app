class RotaryController {
  constructor(document) {
    this.document = document;
    const allSelectable = document.querySelectorAll('#screen-a, #screen-b');
    this.selectableTree = {
      val: 'root',
      children: this.setSelectableTree(allSelectable, {}),
    };
    this.address = [];
  }

  setSelectableTree(allSelectable, visited) {
    const nodes = [];
    for (let el of allSelectable) {
      if (el.id in visited) {
        continue;
      }
      visited[el.id] = true;
      const children = el.querySelectorAll('.selectable');
      if (children.length) {
        nodes.push({
          val: el,
          children: this.setSelectableTree(children, visited),
        });
      } else {
        nodes.push({ val: el, children: null });
      }
    }

    return nodes;
  }

  setAddress(newAddress) {
    this.address = newAddress;
  }

  shiftAddress(numMoves) {
    const lastIndex = this.address.length - 1;
    this.address[lastIndex] = Math.max(0, this.address[lastIndex] + numMoves);
  }

  // go down a level (go into children)
  digAddress() {
    this.address.push(0);
  }

  getNode(root, address) {
    if (!root) {
      console.log('no root');
      return;
    }

    if (!address.length || !root.children) {
      return root;
    }
    const newAddress = [...address];
    const index = newAddress.shift();
    const newRoot = root.children[index];
    return this.getNode(newRoot, newAddress);
  }

  getCurrentHTMLElement() {
    const node = this.getNode(this.selectableTree, this.address);
    if (!node) {
      return null;
    }

    return this.document.getElementById(node.val.id);
  }

  handleSelect(address, direction) {
    let node = this.getNode(this.selectableTree, address);
    if (!node) {
      // handle animations
      if (direction > 0) {
        this.shiftAddress(-1 * direction);
        node = this.getNode(this.selectableTree, this.address);
      }
      console.log(`error moving ${direction}`);
    }
    this.document.getElementById(node.val.id).classList.add('selected');
    console.log('selecting', this.document.getElementById(node.val.id));
  }

  handleUnSelect(address) {
    const node = this.getNode(this.selectableTree, address);
    if (!node) {
      // handle here
      console.log('error unselecting');
      return;
    }

    this.document.getElementById(node.val.id).classList.remove('selected');
  }

  handleClick(callBack) {
    const node = this.getNode(this.selectableTree, this.address);
    if (node.children) {
      this.handleUnSelect(this.address);
      this.digAddress();
      this.handleSelect(this.address, 0);
    } else if (callBack) {
      callBack();
    }
  }

  handleMove(amount) {
    const numMoves = Math.floor(amount / 2);

    if (!this.address.length) {
      const address = [0];
      this.setAddress(address);
      this.handleSelect(address, numMoves);
    } else {
      this.handleUnSelect(this.address);
      this.shiftAddress(numMoves);
      this.handleSelect(this.address, numMoves);
    }
    console.log(this.address);
  }
}

module.exports = {
  RotaryController: RotaryController,
};
