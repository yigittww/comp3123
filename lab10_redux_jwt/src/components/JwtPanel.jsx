import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearToken, fetchProfile, loadToken, login, saveToken } from '../api';
import { decodeJwt, isExpired, secondsLeft } from '../utils/jwt';

export default function JwtPanel() {
  const [email, setEmail] = useState('demo@gbc.ca');
  const [password, setPassword] = useState('password123');
  const [token, setToken] = useState(() => loadToken());
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [, setTick] = useState(0); // re-render every second for the countdown

  const decoded = useMemo(() => decodeJwt(token), [token]);
  const expired = token ? isExpired(decoded) : false;
  const remaining = token && !expired ? Math.ceil(secondsLeft(decoded)) : 0;

  const doLogout = useCallback((msg) => {
    clearToken();
    setToken(null);
    setProfile(null);
    if (msg) setNotice(msg);
  }, []);

  // Tick once per second so the exp countdown updates,
  // and auto-logout the moment the token expires.
  useEffect(() => {
    if (!token) return undefined;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      if (isExpired(decodeJwt(loadToken()))) {
        doLogout('Session expired — the JWT reached its exp time, so you were logged out.');
      }
    }, 1000);
    return () => clearInterval(id);
  }, [token, doLogout]);

  // On first load: if a stored token is still valid, load the profile.
  useEffect(() => {
    if (!token) return;
    if (isExpired(decodeJwt(token))) {
      doLogout('Stored token was already expired — please log in again.');
      return;
    }
    fetchProfile(token)
      .then((data) => setProfile(data.profile))
      .catch(() => doLogout('Stored token was rejected by the server — please log in again.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    try {
      const data = await login(email, password);
      saveToken(data.token);
      setToken(data.token);
      const prof = await fetchProfile(data.token);
      setProfile(prof.profile);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <h2>Part 2 — JWT Authentication</h2>
      <p className="hint">
        The Express backend signs a real JWT on login. The token is stored in
        localStorage, decoded below, and sent as a Bearer token to the protected
        <code> GET /profile</code> route. Demo account: <b>demo@gbc.ca</b> / <b>password123</b>
      </p>

      {notice && <p className="notice">{notice}</p>}
      {error && <p className="error">{error}</p>}

      {!token || expired ? (
        <form onSubmit={handleLogin} className="login-form">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>
          <button type="submit">Log in &amp; get JWT</button>
        </form>
      ) : (
        <>
          <div className="profile-box">
            <h3>Protected Profile (from GET /profile)</h3>
            {profile ? (
              <ul>
                <li><b>Name:</b> {profile.name}</li>
                <li><b>Email:</b> {profile.email}</li>
                <li><b>Program:</b> {profile.program}</li>
                <li><b>Semester:</b> {profile.semester}</li>
              </ul>
            ) : (
              <p>Loading profile…</p>
            )}
            <p className="countdown">
              Token expires in <b>{remaining}</b> second{remaining === 1 ? '' : 's'} — after that
              this protected area closes automatically.
            </p>
            <button onClick={() => doLogout('Logged out — token removed from localStorage.')}>
              Log out
            </button>
          </div>

          {decoded && (
            <div className="jwt-box">
              <h3>Decoded JWT</h3>
              <p className="token-raw">
                <span className="part-header">{decoded.raw[0]}</span>.
                <span className="part-payload">{decoded.raw[1]}</span>.
                <span className="part-signature">{decoded.raw[2]}</span>
              </p>
              <div className="jwt-grid">
                <div>
                  <h4>Header</h4>
                  <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
                </div>
                <div>
                  <h4>Payload (claims)</h4>
                  <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
                </div>
                <div>
                  <h4>Signature</h4>
                  <pre className="sig">{decoded.signature}</pre>
                  <p className="hint">
                    HMAC-SHA256 with the server secret. The browser can decode the
                    token but cannot forge this signature.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
