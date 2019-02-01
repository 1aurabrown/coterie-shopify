import $ from 'jquery';
import {register} from '@shopify/theme-sections';

const selectors = {
  sectionBody: '[data-section-body]',
  sectionToggle: '[data-section-toggle]',
  sections: '[data-section]',
  activeSection: '.active[data-section]'
};

register('guide', {
  onLoad() {
    this.$container = $(this.container);
    this.namespace = `.${this.id}`;
    this.$sections = $(selectors.sections, this.$container);
    this.$sections.on('click' + this.namespace, selectors.sectionToggle, function(e) {
      const $activeSection = $(selectors.activeSection, this.$container).not($(e.delegateTarget));
      $activeSection.removeClass('active')
      $(selectors.sectionBody, $activeSection).slideUp(200);

      $(e.delegateTarget).toggleClass('active')
      $(selectors.sectionBody, e.delegateTarget).slideToggle(200);
    })
  },

  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload() {
    this.$container.off(this.namespace);
    this.$sections.off(this.namespace);
  },
});