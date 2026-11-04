import { useState } from 'react';
import { useNavigate } from 'react-router';

const DEMO_LOGIN = 'mykhailo2';
const DEMO_PASSWORD = 'mykhailo2';

export default function LoginPage({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!login.trim()) nextErrors.login = 'Enter your login.';
    if (!password) nextErrors.password = 'Enter your password.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    if (login.trim() !== DEMO_LOGIN || password !== DEMO_PASSWORD) {
      setErrors({ form: 'The login or password is incorrect. Please try again.' });
      return;
    }

    if (!onLogin()) {
      setErrors({ form: 'Allow cookies in your browser to sign in.' });
      return;
    }
    navigate('/dashboard', { replace: true });
  }

  function handleChange(field, value) {
    if (field === 'login') setLogin(value);
    else setPassword(value);
    setErrors((previous) => ({ ...previous, [field]: '', form: '' }));
  }

  return (
    <main className="login-layout">
      <section className="login-story" aria-labelledby="welcome-title">
        <p className="story-description">A simple look at the next five days.<br />So you can get on with yours.</p>
        <div className="sky-art" aria-hidden="true">
          <div className="sky-orbit" />
          <div className="sky-sun" />
          <div className="sky-cloud sky-cloud--back" />
          <div className="sky-cloud" />
          <span className="sky-caption">A little perspective, rain or shine.</span>
        </div>
      </section>
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-card">
          <span className="small-icon" aria-hidden="true">↗</span>
          <h2 id="login-title">Welcome back.</h2>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="login">Login</label>
              <input id="login" name="login" value={login} autoComplete="username"
                placeholder="Enter your login" required
                aria-invalid={Boolean(errors.login || errors.form)}
                aria-describedby={errors.login ? 'login-error' : errors.form ? 'form-error' : undefined}
                onChange={(event) => handleChange('login', event.target.value)} />
              {errors.login && <p id="login-error" className="field-error" role="alert">{errors.login}</p>}
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={password}
                autoComplete="current-password" placeholder="Enter your password" required
                aria-invalid={Boolean(errors.password || errors.form)}
                aria-describedby={errors.password ? 'password-error' : errors.form ? 'form-error' : undefined}
                onChange={(event) => handleChange('password', event.target.value)} />
              {errors.password && <p id="password-error" className="field-error" role="alert">{errors.password}</p>}
            </div>
            {errors.form && <p id="form-error" className="form-error" role="alert">{errors.form}</p>}
            <button className="button button--primary" type="submit">Sign in <span aria-hidden="true">→</span></button>
          </form>
          <p className="demo-hint">Demo access <span>Login & password: <strong>mykhailo2</strong></span></p>
        </div>
      </section>
    </main>
  );
}
