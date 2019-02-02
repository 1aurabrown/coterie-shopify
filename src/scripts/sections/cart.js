/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import $ from 'jquery';
import {register} from '@shopify/theme-sections';
import QuantitySelect from '../modules/quantity-select';

const selectors = {
  quantitySelect: '[data-quantity-select]'
};

register('cart', {
  onLoad() {
    this.$container = $(this.container);
    this.namespace = `.${this.id}`;

    this.settings = {};
    let _this = this;
    this.quantitySelects = $(selectors.quantitySelect, this.$container).map(function(index, el) {
      return new QuantitySelect({
        container: $(el, _this.$container),
        namespace: _this.namespace,
        getInventory: function() {
          return parseInt(this.$input.attr('max'))
        }
      })
    })
  },

  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload() {
    this.$container.off(this.namespace);
    this.quantitySelect.unload();
  },
});
