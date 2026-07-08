import { useMemo, useState } from 'react';
import qrImage from '../qr.png';

const BOT_URL = 'https://max.ru/id6316031790_bot';
const SUPPORT_EMAIL = 'online@immun-center.ru';

function normalizePhoneDigits(rawValue) {
  const digits = rawValue.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith('8')) {
    return `7${digits.slice(1)}`.slice(0, 11);
  }

  if (digits.startsWith('7')) {
    return digits.slice(0, 11);
  }

  return `7${digits}`.slice(0, 11);
}

function formatPhone(rawValue) {
  const digits = normalizePhoneDigits(rawValue);

  if (!digits) {
    return '';
  }

  const local = digits.slice(1);
  const parts = ['+7'];

  if (local.length > 0) {
    parts.push(` ${local.slice(0, 3)}`);
  }

  if (local.length > 3) {
    parts.push(` ${local.slice(3, 6)}`);
  }

  if (local.length > 6) {
    parts.push(`-${local.slice(6, 8)}`);
  }

  if (local.length > 8) {
    parts.push(`-${local.slice(8, 10)}`);
  }

  return parts.join('');
}

function BotLink({ className = '' }) {
  return (
    <a className={`bot-link ${className}`.trim()} href={BOT_URL} target="_blank" rel="noreferrer">
      <span className="bot-icon" aria-hidden="true">
        M
      </span>
      <span>
        <strong>Открыть бота в MAX</strong>
        <small>Активируйте бота и запросите код</small>
      </span>
      <span className="arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}

const content = {
  email: {
    accent: 'Email',
    inputLabel: 'Email',
    inputPlaceholder: 'name@example.ru',
    inputMode: 'email',
    button: 'Получить код',
    introTitle: 'Вход по Email',
    introText: 'Укажите email, который был указан при оформлении. На него придет код подтверждения.',
    steps: [
      'Введите email, указанный при регистрации.',
      'Нажмите «Получить код» и откройте письмо.',
      'Введите код из письма для входа в кабинет.',
    ],
  },
  max: {
    accent: 'MAX',
    inputLabel: 'Телефон',
    inputPlaceholder: '+7 900 000-00-00',
    inputMode: 'tel',
    button: 'Получить код',
    introTitle: 'Вход через MAX',
    introText: 'Активируйте бота в MAX и получите код по зарегистрированному номеру телефона.',
    steps: [
      'Откройте бота кнопкой или QR-кодом.',
      'Введите номер телефона и запросите код.',
      'Введите код из сообщения MAX.',
    ],
  },
};

function App() {
  const [method, setMethod] = useState('email');
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const active = content[method];
  const alternative = method === 'email' ? 'max' : 'email';

  const isValid = useMemo(() => {
    if (method === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    return value.replace(/\D/g, '').length >= 10;
  }, [method, value]);
  const showValidation = submitted && !isValid;
  const showSuccess = submitted && isValid;
  const fieldMessage = showValidation
    ? method === 'email'
      ? 'Проверьте формат email.'
      : 'Введите номер телефона полностью.'
    : showSuccess
      ? method === 'email'
        ? 'Запрос принят. Проверьте код в письме.'
        : 'Запрос принят. Проверьте код в MAX.'
      : 'Код придет только для зарегистрированного контакта.';

  const handleMethodChange = (nextMethod) => {
    setMethod(nextMethod);
    setValue('');
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleValueChange = (event) => {
    const nextValue = event.target.value;
    setValue(method === 'max' ? formatPhone(nextValue) : nextValue);
    setSubmitted(false);
  };

  return (
    <main className="page-shell">
      <section className="login-layout" aria-label="Вход в личный кабинет">
        <div className="login-panel">
          <div className="brand-mark" aria-hidden="true">
            ЛК
          </div>
          <div className="heading-group">
            <p className="eyebrow">Личный кабинет</p>
            <h1>Вход</h1>
            <p>Выберите удобный способ и получите код подтверждения.</p>
          </div>

          <div className="method-tabs" role="tablist" aria-label="Способ входа">
            <button
              className={method === 'email' ? 'active' : ''}
              type="button"
              role="tab"
              aria-selected={method === 'email'}
              onClick={() => handleMethodChange('email')}
            >
              Email
            </button>
            <button
              className={method === 'max' ? 'active' : ''}
              type="button"
              role="tab"
              aria-selected={method === 'max'}
              onClick={() => handleMethodChange('max')}
            >
              MAX
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-field">{active.inputLabel}</label>
            <input
              id="login-field"
              name="login"
              type={method === 'email' ? 'email' : 'tel'}
              inputMode={active.inputMode}
              autoComplete={method === 'email' ? 'email' : 'tel'}
              enterKeyHint="send"
              maxLength={method === 'email' ? 80 : 16}
              placeholder={active.inputPlaceholder}
              required
              value={value}
              onChange={handleValueChange}
              className={showValidation ? 'invalid' : ''}
              aria-describedby="field-hint"
              aria-invalid={showValidation}
            />
            <p
              id="field-hint"
              className={`hint ${showValidation ? 'error' : ''} ${showSuccess ? 'success' : ''}`}
              aria-live="polite"
            >
              {fieldMessage}
            </p>

            <button className="primary-button" type="submit">
              {active.button}
            </button>

            {method === 'max' && <BotLink className="mobile-bot-link" />}
          </form>

          <div className="divider">
            <span />
            или
            <span />
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={() => handleMethodChange(alternative)}
          >
            Войти через {content[alternative].accent}
          </button>

          <p className="support">
            Проблемы с регистрацией? Напишите на{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </div>

        <aside className="info-panel" aria-label="Инструкция по входу">
          {method === 'max' && (
            <div className="qr-block">
              <img src={qrImage} alt="QR-код для открытия бота MAX" />
              <BotLink />
            </div>
          )}

          <div className="notice">
            <h2>{active.introTitle}</h2>
            <p>{active.introText}</p>
          </div>

          <div className="steps">
            <h2>Как войти</h2>
            <ol>
              {active.steps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
