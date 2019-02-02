import $ from 'jquery';


const selectors = {
  decrease: '[data-decrease]',
  increase: '[data-increase]',
  input: '[data-quantity-input]',
  label: '[data-quantity-label]'
};

export default class QuantitySelect {
  constructor(options) {
    this.$container = $(options.container);
    this.$input = $(selectors.input, this.$container);
    this.$label = $(selectors.label, this.$container);
    this.namespace = options.namespace;
    this.max = options.getInventory; // This should be a function

    this.$container.on('click' + this.namespace, selectors.decrease,
      this.decreaseQuantity.bind(this),
    );

    this.$container.on('click' + this.namespace, selectors.increase,
      this.increaseQuantity.bind(this),
    );
  }

  increaseQuantity() {
    this.setQuantity(parseInt(this.currentValue()) + 1);
  }

  min() {
    var min = parseInt(this.$input.attr('min'));

    if (!min) { min = 0 }
    return min;
  }

  currentValue() {
    return this.$input.val();
  }

  decreaseQuantity() {
    this.setQuantity(this.currentValue() - 1);
  }

  refresh() {
    this.setQuantity(this.currentValue());
  }

  setQuantity(value) {
    var max;
    var min = parseInt(this.$input.attr('min'));

    if (!min) { min = 0 }
    value = Math.max(value, min);

    if (this.max) {
      max = this.max();
      if (max) {
        value = Math.min(value, max);
      }
    }

    this.$input.val(value);
    this.$label.text(value);
  }

  unload() {
    this.$container.off(this.namespace);
  }
}
