'use strict';

/**
 * ФИО должно содержать ровно три слова
 * @param value
 * @returns {boolean}
 */
function isValidFio(value) {
  const wordsCount = value
    .trim()
    .replace(/\s\s+/g, ' ')
    .split(' ')
    .length;

  return wordsCount === 3;
}

/**
 * Проверка email-адреса.
 * Причем только в доменах ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com.
 * @param value
 * @returns {boolean}
 */
function isValidEmail(value) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(ya\.ru|yandex\.(ru|ua|by|kz|com))$/;
  return re.test(value);
}

/**
 * Номер телефона, который начинается на +7, и имеет формат +7(999)999-99-99.
 * Кроме того, сумма всех цифр телефона не должна превышать 30.
 * @param value
 * @returns {boolean}
 */
function isValidPhone(value) {
  const numbers = value.match(/\d/g);

  if (numbers) {
    const sum = numbers
      .map(n => parseInt(n, 10))
      .reduce((a, b) => a + b, 0);

    if (sum > 30) {
      return false;
    }
  }

  const re = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;

  return re.test(value);
}

class Validators {
  static fio(value) {
    return isValidFio(value);
  }

  static email(value) {
    return isValidEmail(value);
  }

  static phone(value) {
    return isValidPhone(value);
  }
}

function onKeyUp(e) {
  const fieldName = e.srcElement.name;
  const fieldValue = e.srcElement.value;

  if (typeof Validators[fieldName] === 'function') {
    if (!Validators[fieldName](fieldValue)) {
      e.srcElement.classList.add('error');
    } else {
      e.srcElement.classList.remove('error');
    }
  }
}

class App {
  /**
   * Инициализируем состояние приложения
   */
  init() {
    this.form = document.getElementById('myForm');
    this.submitButton = document.getElementById('submitButton');
    this.resultContainer = document.getElementById('resultContainer');
    this.fio = this.form.elements.fio;
    this.email = this.form.elements.email;
    this.phone = this.form.elements.phone;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      return false;
    });

    this.submitButton.addEventListener('click', (e) => {
      this.submit();
      e.preventDefault();
      return false;
    });
  }

  /**
   * Возвращает объект с признаком результата валидации (isValid)
   * и массивом названий полей, которые не прошли валидацию (errorFields).
   * @returns {{isValid: boolean, errorFields: string[]}}
   */
  validate() {
    const errorFields = this.getInputElementsName()
      .filter((elName) => {
        if (typeof Validators[elName] === 'function') {
          const fieldValue = this.form.elements[elName].value;
          return !Validators[elName](fieldValue);
        }

        return false;
      });

    const isValid = errorFields.length === 0;

    return {
      isValid,
      errorFields,
    };
  }

  /**
   * Возвращает объект с данными формы, где имена свойств совпадают с именами инпутов.
   * @returns {Object}
   */
  getData() {
    const formData = new FormData(this.form);
    let result = {};

    if (typeof formData.entries === 'function') {
      for (const pair of formData.entries()) {
        result[pair[0]] = pair[1];
      }
    } else {
      // Safari fix
      result = this.getInputElementsName()
        .reduce((obj, key) => Object.assign(obj, { [key]: this.form.elements[key].value }), {});
    }

    return result;
  }

  /**
   * Принимает объект с данными формы и устанавливает их инпутам формы.
   * Поля кроме phone, fio, email игнорируются
   * @param {Object} params
   */
  setData(params) {
    if (params) {
      Object
        .keys(params)
        .filter(key => this.getInputElementsName().includes(key))
        .forEach(key => this[key].value = params[key]);
    }
  }

  /**
   * Выполняет валидацию полей и отправку ajax-запроса, если валидация пройдена.
   * Вызывается по клику на кнопку отправить.
   */
  submit() {
    const validateResult = this.validate();

    this.removeClassError();

    if (!validateResult.isValid) {
      this.addClassError(validateResult.errorFields);

      validateResult.errorFields.forEach(elName =>
        this.form.elements[elName].addEventListener('keyup', onKeyUp)
      );
    } else {
      this.send();
    }
  }

  /**
   * Возвращает имена инпутов в форме
   * @returns {Array.<*>}
   */
  getInputElementsName() {
    const names = [];

    for (let i = 0; i < this.form.elements.length; i++) {
      const el = this.form.elements[i];

      if (el) {
        const name = el.getAttribute('name');

        if (name) {
          names.push(name);
        }
      }
    }

    return names;
  }

  /**
   * Удаляет класс .error со всех элементов формы
   */
  removeClassError() {
    return this.getInputElementsName()
      .forEach(elName => this.form.elements[elName].classList.remove('error'));
  }

  /**
   * Добавляет класс .error к перечисленным полям
   * @param {Array} errorFields
   */
  addClassError(errorFields) {
    return errorFields
      .forEach(elName => this.form.elements[elName].classList.add('error'));
  }

  /**
   * Показываем ошибку
   * @param text
   */
  showError(text) {
    this.resultContainer.innerText = text;
    this.resultContainer.className = 'error';
  }

  /**
   * Показываем успех
   */
  showSuccess() {
    this.resultContainer.innerText = 'Success';
    this.resultContainer.className = '';
  }

  /**
   * Показываем прогресс
   * @param timeout
   */
  showProgress(timeout) {
    let timer = Math.floor(timeout / 1000);

    const i = setInterval(() => {
      timer = timer - 1;
      this.resultContainer.innerText = timer;
      if (timer <= 1) {
        clearInterval(i);
      }
    }, 1000);

    this.resultContainer.innerText = timer;
    this.resultContainer.className = 'progress';
  }

  /**
   * Отправка данных формы
   * @returns {Promise}
   */
  send() {
    const data = this.getData();
    const fetchParams = {
      method: 'POST',
      body: JSON.stringify(data),
    };

    this.submitButton.disabled = true;

    return fetch(this.form.action, fetchParams)
      .then((response) => {
        this.submitButton.disabled = false;
        return response.json();
      })
      .then((result) => {
        switch (result.status) {
          case 'success':
            return this.showSuccess();
          case 'progress': {
            this.submitButton.disabled = true;
            const timeout = parseInt(result.timeout, 10);
            this.showProgress(timeout);
            return setTimeout(() => this.submit(), timeout);
          }
          case 'error':
            return this.showError(result.reason);
        }
      })
      .catch(err => this.showError(err.toString()));
  }
}

const app = new App();

/**
 * Экспортируем глобальный объект MyForm по условию задачи
 */
class MyForm {
  static validate() {
    return app.validate();
  }

  static getData() {
    return app.getData();
  }

  static setData(params) {
    return app.setData(params);
  }

  static submit() {
    return app.submit();
  }
}

window.onload = () => app.init();
