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
import Breakpoints from 'breakpoints-js';
import Flickity from 'flickity-fade';

const selectors = {
  addToCart: '[data-add-to-cart]',
  addToCartText: '[data-add-to-cart-text]',
  comparePrice: '[data-compare-price]',
  comparePriceText: '[data-compare-text]',
  originalSelectorId: '[data-product-select]',
  priceWrapper: '[data-price-wrapper]',
  productJson: '[data-product-json]',
  productPrice: '[data-product-price]',
  images: '[data-product-images]',
  optionVariant: '[data-option-variant]',
  quantitySelect: '[data-quantity-select]',
  description: '[data-product-description]',
  text: '[data-product-text]',
  headings: 'h1, h2, h3, h4, h5, h6',
  section: '[data-product-section]',
  sectionHeading: '[data-product-heading]',
  activeHeading: '.active[data-product-heading]'
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
    this.$description = $(selectors.description, this.$container);
    this.$text = $(selectors.text, this.$container);
    $('table, td, tr', this.$description).attr({ style: ''});
    this.$headings = $(selectors.headings, this.$description);

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
    this.setupSections();
    this.setupFlickity();
    this.checkTextHeight();
    $(window).on('resize' + this.namespace, _.throttle(this.checkTextHeight.bind(this), 200))
    this.$container.on('click' + this.namespace, selectors.sectionHeading, function(e) {
      $(selectors.activeHeading, this.$container)
        .not($(e.target))
        .removeClass('active')
        .next(selectors.section)
        .slideUp(200)
      $(e.target).next(selectors.section).slideToggle(200);
      $(e.target).toggleClass('active');
    })
  },

  setupFlickity() {
    Breakpoints();
    const _this = this;

    Breakpoints.on('xs', {
        enter: function() {
          _this.flickity = new Flickity($(selectors.images, _this.$container)[0], {
            pageDots: false,
            adaptiveHeight: true,
            wrapAround: true,
            fade: true
        })
      },
      leave: function() {
        _this.flickity.destroy();
      }
    });
  },

  checkTextHeight() {
    if (this.$text.outerHeight() + this.$text.offset().top > $(window).height()) {
      this.$text.removeClass('sticky')
    } else {
      this.$text.addClass('sticky')
    }
  },

  setupSections() {
    const _this = this;
    this.$description.find(':empty').remove();
    this.$sections = this.$headings.map(function (i, el) {
      $(el).attr('data-product-heading', 'data-product-heading').addClass("product__description__heading" );
      return $(el).nextUntil(_this.$headings).wrapAll('<div data-product-section="data-product-section" class="product__description__section" />');
    })
    this.$headings.first().before($(selectors.priceWrapper, this.$container));
    this.$text.fadeIn(200);
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
    $(window).off(this.namespace);
    this.quantitySelect.unload();
  },
});
