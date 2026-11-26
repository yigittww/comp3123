import { useSyncExternalStore } from 'react';
import { clearLog, getLogSnapshot, subscribeLog } from '../app/actionLog';

// ACTION LOG: fed by (a) a Redux middleware that records every dispatched
// action type and (b) store.subscribe(), which counts state changes.
// This panel subscribes to that log the same way Redux apps subscribe
// to the store.
export default function ActionLogPanel() {
  const version = useSyncExternalStore(subscribeLog, () => getLogSnapshot().version);
  const { entries, stateChangeCount } = getLogSnapshot();

  return (
    <div className="mini-card">
      <h3>Action Log (dispatch + subscribe)</h3>
      <p className="hint">
        Render #{version} · store.subscribe() has fired <b>{stateChangeCount}</b> time
        {stateChangeCount === 1 ? '' : 's'} (once per state change).
      </p>
      {entries.length === 0 ? (
        <p className="hint">No actions yet — click any Redux button above.</p>
      ) : (
        <ul className="log-list">
          {entries.map((entry, i) => (
            <li key={`${entry.time}-${i}`}>
              <code>{entry.label}</code> <span className="log-time">{entry.time}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="small" onClick={clearLog}>
        Clear log
      </button>
    </div>
  );
}
