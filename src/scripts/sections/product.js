/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import $ from 'jquery';
import _ from 'lodash';
import {formatMoney} from '@shopify/theme-currency';
import {register} from '@shopify/theme-sections';
import QuantitySelect from '../modules/quantity-select';

const selectors = {
  addToCart: '[data-add-to-cart]',
  addToCartText: '[data-add-to-cart-text]',
  comparePrice: '[data-compare-price]',
  comparePriceText: '[data-compare-text]',
  originalSelectorId: '[data-product-select]',
  priceWrapper: '[data-price-wrapper]',
  productJson: '[data-product-json]',
  productPrice: '[data-product-price]',
  optionVariant: '[data-option-variant]',
  quantitySelect: '[data-quantity-select]'
};

const cssClasses = {
  hide: 'hide',
};

const keyboardKeys = {
  ENTER: 13,
};

/**
 * Product section constructor. Runs on page load as well as Theme Editor
 * `section:load` events.
 * @param {string} container - selector for the section container DOM element
 */

register('product', {
  onLoad() {
    this.$container = $(this.container);
    this.namespace = `.${this.id}`;

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      $(selectors.productJson, this.$container).html(),
    );

    this.settings = {};
    this.quantitySelect = new QuantitySelect({
      container: $(selectors.quantitySelect, this.$container)[0],
      namespace: this.namespace,
      getInventory: function() {
        const $variantOptions = $(selectors.optionVariant, this.container)
        const $variant = $variantOptions.filter(':checked');
        return parseInt($variant.data().inventory)
      }
    });

    $(selectors.optionVariant, this.$container).on('change' + this.namespace, this.variantChanged.bind(this))

  },

  variantChanged(e) {
    if (!($(e.target).is(':checked'))) { return; }
    const variant = _.find(this.productSingleObject.variants, function(o) {
      return (o.id == parseInt($(e.target).attr('data-option-variant')))
    })
    this.updateAddToCartState(variant)
    this.updateProductPrices(variant)
    this.quantitySelect.refresh();
  },

  updateAddToCartState(variant) {
    if (variant) {
      $(selectors.priceWrapper, this.$container).removeClass(cssClasses.hide);
    } else {
      $(selectors.addToCart, this.$container).prop('disabled', true);
      $(selectors.addToCartText, this.$container).html(
        theme.strings.unavailable,
      );
      $(selectors.priceWrapper, this.$container).addClass(cssClasses.hide);
      return;
    }

    if (variant.available) {
      $(selectors.addToCart, this.$container).prop('disabled', false);
      $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
    } else {
      $(selectors.addToCart, this.$container).prop('disabled', true);
      $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
    }
  },

  updateProductPrices(variant) {
    const $comparePrice = $(selectors.comparePrice, this.$container);
    const $compareEls = $comparePrice.add(
      selectors.comparePriceText,
      this.$container,
    );

    $(selectors.productPrice, this.$container).html(
      formatMoney(variant.price, theme.moneyFormat),
    );

    if (variant.compare_at_price > variant.price) {
      $comparePrice.html(
        formatMoney(variant.compare_at_price, theme.moneyFormat),
      );
      $compareEls.removeClass(cssClasses.hide);
    } else {
      $comparePrice.html('');
      $compareEls.addClass(cssClasses.hide);
    }
  },

  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload() {
    this.$container.off(this.namespace);
    this.quantitySelect.unload();
  },
});
