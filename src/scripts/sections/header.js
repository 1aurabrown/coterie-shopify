import $ from 'jquery';
import {register} from '@shopify/theme-sections';

const selectors = {
  menuToggle: '[data-menu-toggle]',
  mobileNav: '[data-mobile-nav]'
};

const cssClasses = {
  navVisble: 'visible'
};

/**
 * Header section constructor. Runs on page load as well as Theme Editor
 * `section:load` events.
 * @param {string} container - selector for the section container DOM element
 */

register('header', {
  onLoad() {
    this.$container = $(this.container);
    this.namespace = `.${this.id}`;

    this.$container.on('click' + this.namespace, selectors.menuToggle, function() {
      $(selectors.mobileNav, this.$container).toggleClass('visible');
    })
  },

  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload() {
    this.$container.off(this.namespace);
  },
});
