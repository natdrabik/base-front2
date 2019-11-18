import { Ajax } from './ajax';
import { Notification } from './notifications';
import { parseParamsFromData, trigger } from './helpers';
// import { isEmail } from './validations';

class Form {
  constructor(container, options={}) {

    const defaults = {
      'clean-after-success': false,
      'validate': false
    }

    this._form = container;
    this._action = this._form.action;
    this._method = this._form.method;
    this._submitting = false;

    const optionsFromData = parseParamsFromData(this._form, 'form');

    this._options = Object.assign(defaults, optionsFromData, options);

    this._validate = this._options.validate;

    this._form.addEventListener('submit', this.onSubmit.bind(this));
    this._form.addEventListener('focus', this.onFocus.bind(this), true);
    this._form.addEventListener('change', this.onChange.bind(this), true);
    this._form.addEventListener('click', this.onSubmitClick.bind(this), true);
    this._form.addEventListener('submit:success', this.onSubmitSuccess.bind(this), true);
    this._form.addEventListener('submit:error', this.onSubmitError.bind(this), true);
  }

  onSubmit(event) {
    if (this._submitting) return false;

    let formData = new FormData(this._form);

    // Validate if necessary

    // console.log(this._validate);
    if (this._options.validate && !this.validateForm().valid) {
      event.preventDefault();
      this._validate = this._options.validate;
      return Notification({
        type: 'error',
        title: 'Oops! Encontramos erros no formulário',
        message: 'Preencha os campos obrigatórios e tente novamente',
        background: this._form.dataset.notificationBg,
        color: this._form.dataset.notificationColor
      });
    }

    if (this._options.beforeSubmit) {
      try {
        formData = this._options.beforeSubmit.call(this, formData);
      } catch(e) {
        event.preventDefault();
        this._validate = this._options.validate;
        return Notification({
          type: 'error',
          title: 'Oops! Encontramos erros no formulário',
          message: 'Preencha os campos obrigatórios e tente novamente',
          background: this._form.dataset.notificationBg,
          color: this._form.dataset.notificationColor
        });
      }
    }

    this._submitting = true;
    this._form.classList.add('is--submitting');
    event.preventDefault();

    Array.from(this._form.querySelectorAll('[type="submit"]')).forEach(function(input) {
      input.disabled = true;
    });

    const method = this._method;
    const action = this._action;
    // const form = this._form;

    return Ajax(this.requestCallback, {action, method, formData}).call(this, event);
  }

  onFocus(event) {
    let input = event.target;
    input.parentNode.classList.remove('is--invalid');

    let messagebox = input.parentNode.querySelector(`[data-message-for="${input.getAttribute('name')}"]`);

    if (messagebox) {
      if (messagebox.dataset.formGenerated) return messagebox.parentNode.removeChild(messagebox);

      messagebox.setAttribute('aria-hidden', true);
      messagebox.innerHTML = '';
    }
  }

  onChange(event) {
    let input = event.target;
    let name = input.name;

    Array.from(this._form.querySelectorAll(`[name="${name}"]`)).forEach((el) => {
      el.parentNode.classList.remove('is--invalid');
    });

    Array.from(this._form.querySelectorAll(`[data-message-for="${name}"]`)).forEach((messagebox) => {
      if (messagebox.dataset.formGenerated) return messagebox.parentNode.removeChild(messagebox);
      messagebox.setAttribute('aria-hidden', true);
      messagebox.innerHTML = '';
    })
  }

  onSubmitClick(event) {
    // console.log(event.target);
    if (event.target.matches('[type="submit"]')) {
      let $button = event.target;

      if ($button.dataset.formAction) this._action = $button.dataset.formAction;
      if ($button.dataset.formMethod) this._method = $button.dataset.formMethod;
      if ($button.dataset.formValidate) this._validate = true;
    }
  }

  onSubmitSuccess(event) {
    this._submitting = false;
    this._form.classList.remove('is--submitting');

    if (this._options['clean-after-success']) this._form.reset();

    Array.from(this._form.querySelectorAll('[type="submit"]')).forEach(function(input) {
      input.removeAttribute('disabled');
    });
  }

  onSubmitError(event) {
    this._submitting = false;
    this._form.classList.remove('is--submitting');

    Array.from(this._form.querySelectorAll('[type="submit"]')).forEach(function(input) {
      input.removeAttribute('disabled');
    });
  }

  validateForm() {

    let validation = {
      valid: true,
      elements: []
    };

    function invalidate(el) {
      validation.valid = false;
      validation.elements.push(el);
      el.parentNode.classList.add('is--invalid');
      return true;
    }

    function validate(formEl, formArr) {

      if (formEl.matches('[required]') && (formEl.type !== 'checkbox' && !formEl.value || formEl.type === 'checkbox' && !formEl.checked)) return false;
      if (formEl.name === 'g-recaptcha-response' && !formEl.value)  return false;

      if (formEl.dataset && formEl.dataset.validate) {
        let val = formEl.value || '';
        let is_valid = true;

        let validations = formEl.dataset.validate.split('|');

        validations.forEach((method) => {
          switch(method) {
            case 'email':
              if(!isEmail(val)) is_valid = false;
              break;
            // case 'cpf':
            //   if(!isCpf(val)) is_valid = false;
            //   break;
            case 'notempty':
            case 'required':
              if (formEl.matches('[type="radio"], [type="checkbox"]')) {
                let name = formEl.name;
                let siblings = formArr.filter(el => el.name === name);
                is_valid = siblings.some(el => el.checked);
                break;
              }
              if (!val) is_valid = false;
              break;
            // case 'phone':
            //   if(!isPhone(val)) is_valid = false;
            //   break;
            // case 'youtube':
            //   if(!isYoutube(val)) is_valid = false;
            //   break;
            // case 'zipcode':
            //   if(!isZipcode(val)) is_valid = false;
            //   break;
          }
        });

        return is_valid;
      }


      return true;
    }

    function verifyEl(formEl, i, formArr) {
      let checkIfValid = validate(formEl, formArr);

      if (!checkIfValid) return invalidate(formEl);

      if(!formEl.value && formEl.dataset && formEl.dataset.validate && formEl.dataset.validate.indexOf('or:') === 0) {
        let condition = formEl.dataset.validate;
        let dependencies = condition.substr(3).split('|');

        let checkDependencies = formArr.filter(function(el) {
          return dependencies.indexOf(el.name) > -1 && (!validate(el) || !el.value);
        });

        if (checkDependencies.length) {
          checkDependencies.forEach(function(el) {
            invalidate(el);
          });
          return invalidate(formEl);
        }
      }
    }

    // function verifyDz(dropzone_container, i, formArr) {
    //   let dz = dropzone_container;
    //   let previews = dropzone_container.querySelector('.dropzone-previews')

    //   if (dz.dataset && dz.dataset.validate) {
    //     if (!previews.childNodes.length) invalidate(previews)
    //   }
    // }

    Array.from(this._form.elements).forEach(verifyEl)
    // Array.from(this._form.querySelectorAll('[data-dropzone]')).forEach(verifyDz)

    return validation;
  }

  requestCallback(connectionError, content) {
    this._submitting = false;
    this._action = this._form.action;
    this._method = this._form.method;
    this._validate = this._options.validate;
    this._form.classList.remove('is--submitting');

    Array.from(this._form.querySelectorAll('[type="submit"]')).forEach(function(input) {
      input.removeAttribute('disabled');
    });

    if (connectionError) {
      trigger(this._form, 'submit:error', connectionError);

      return Notification({
        type: 'error',
        message: connectionError,
        redirect: content.redirect
      });
    }

    if (content.status === 'error') {
      if (content.errors && content.errors.length) {
        content.errors.forEach((err) => {
          let input = this._form.querySelector(`[name="${err.name}"]`);

          if (input) {
            let parent = input.parentNode;

            parent.classList.add('is--invalid');

            let messagebox = parent.querySelector(`[data-message-for="${err.name}"]`);

            if (!messagebox || !messagebox.length) {
              messagebox = document.createElement('div');
              messagebox.dataset.messageFor = err.name;
              messagebox.dataset.formGenerated = true;

              parent.insertBefore(messagebox, input.nextSibling);
            }

            messagebox.setAttribute('aria-hidden', false);
            messagebox.innerHTML = err.message;
          }
        });
      }

      trigger(this._form, 'submit:error', content);

    } else {
      trigger(this._form, 'submit:success', content);
    }

    if (content.notifications && content.notifications.length) {
      return content.notifications.forEach((n) => {
        Notification({
          type: n.type,
          title: n.title,
          message: n.message,
          redirect: content.redirect,
          calltoaction: n.calltoaction
        })
      })
    }

    return false;
  }
}
const Forms = {
  init: function (options = {}) {
    Array.from(document.querySelectorAll('form:not([data-disable-ajax])')).map(function (form) {
      return new Form(form, options);
    });
  }
};

export default Forms;
