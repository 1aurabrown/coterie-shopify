import $ from 'jquery';
import {register} from '@shopify/theme-sections';

const selectors = {
  menuToggle: '[data-menu-toggle]',
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


    this.$container.on('click' + this.namespace, selectors.menuToggle, function() {
      this.showSubnav($(selectors.submenu).first())
    }.bind(this))

    this.$container.on('click' + this.namespace, selectors.submenu, this.showHideSubmenu.bind(this))
  },

  showHideSubmenu(e) {
    if ($(e.target).is(selectors.submenuDismiss) ||
        $(e.target).parents(selectors.submenuDismiss).length > 0 ){

          this.hideSubnav($(e.currentTarget));

      } else if ($(e.target).is(selectors.submenuLink) ||
        $(e.target).parents(selectors.submenuLink).length > 0 ){
          e.preventDefault();
          if ($(e.currentTarget).hasClass('active')) {
            this.hideSubnav($(e.currentTarget));
          } else {
            this.showSubnav($(e.currentTarget));
          }
      }
  },

  showSubnav($el) {
    $('body').css({ overflow: 'hidden' })
    this.$container.addClass('subnav-active');
    $el.addClass('active');
  },

  hideSubnav($el) {
    $('body').css({ overflow: 'unset' })
    this.$container.removeClass('subnav-active');
    $el.removeClass('active');
  },

  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload() {
    this.$container.off(this.namespace);
  },
});
