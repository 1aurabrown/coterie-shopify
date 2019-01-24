import $ from 'jquery';
import {register} from '@shopify/theme-sections';

const selectors = {
  menuToggle: '[data-menu-toggle]',
  mobileNav: '[data-mobile-nav]',
  submenu: '[data-submenu]',
  submenuLink: '[data-submenu-link]',
  submenuDismiss: '[data-submenu-dismiss]'
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



    this.$container.on('click' + this.namespace, selectors.submenu, function(e) {
      console.log(e.currentTarget, e.target)
      console.log($(e.target).parents(selectors.submenuDismiss).length)
      if ($(e.target).is(selectors.submenuDismiss) ||
        $(e.target).parents(selectors.submenuDismiss).length > 0 ){

          $(e.currentTarget).removeClass('active');

      } else if ($(e.target).is(selectors.submenuLink) ||
          $(e.target).parents(selectors.submenuLink).length > 0 ){

          e.preventDefault();
          $(e.currentTarget).addClass('active');
      }
    })
  },

  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload() {
    this.$container.off(this.namespace);
  },
});
