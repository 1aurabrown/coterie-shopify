import $ from 'jquery';
import {register} from '@shopify/theme-sections';
import onSignupSubmit from '../modules/signup'

const selectors = {
  form: 'form'
};


register('email-capture', {
  onLoad() {
    this.$container = $(this.container);
    onSignupSubmit(this.$container, selectors.form);
  }
});