'use client';

import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, Check, FlaskConical, Loader2, Palette, Sparkles } from 'lucide-react';
import {
  appearanceVariables,
  defaultAppearance,
  isAppearance,
  themes,
  type Appearance,
} from '@/lib/appearance';
import { Modal } from './dialogs';
import './appearance.css';

export function AppearancePicker({
  value,
  onApply,
  onClose,
  busy = false,
}: {
  value: Appearance;
  onApply: (theme: Appearance) => Promise<void> | void;
  onClose: () => void;
  busy?: boolean;
}) {
  const [draft, setDraft] = useState<Appearance>(isAppearance(value) ? value : defaultAppearance);
  const [preview, setPreview] = useState<'dashboard' | 'practice'>('dashboard');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  async function apply() {
    setSaving(true);
    setError('');
    try {
      await onApply(draft);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Your theme could not be saved. Try again.');
    } finally {
      setSaving(false);
    }
  }
  const preset = themes.find((t) => t.presetId === draft.presetId);
  const disabled = busy || saving;
  const closeRef = useRef(onClose);
  const disabledRef = useRef(disabled);
  closeRef.current = onClose;
  disabledRef.current = disabled;
  // Keep Modal's focus trap stable while swatches and preview tabs change.
  const dismiss = useCallback(() => {
    if (!disabledRef.current) closeRef.current();
  }, []);
  return (
    <Modal title="Make your study space feel like you" onClose={dismiss}>
      <div className="appearance-picker">
        <span className="modal-eyebrow">
          <Palette size={13} /> A LITTLE MORE YOU
        </span>
        <h2>Your space. Your colors.</h2>
        <p>Pick a palette, take a peek, then make it yours.</p>
        <div className="appearance-preview-tabs" role="tablist" aria-label="Theme preview screen">
          <button
            role="tab"
            aria-selected={preview === 'dashboard'}
            onClick={() => setPreview('dashboard')}
          >
            Dashboard
          </button>
          <button
            role="tab"
            aria-selected={preview === 'practice'}
            onClick={() => setPreview('practice')}
          >
            Practice & rationale
          </button>
        </div>
        <div
          className="appearance-preview"
          style={appearanceVariables(draft) as CSSProperties}
          role="tabpanel"
          aria-label={`${preview === 'dashboard' ? 'Dashboard' : 'Practice'} visual preview`}
        >
          <div className="preview-top">
            <span>
              <FlaskConical size={15} />
              labsprint.
            </span>
            <span>PREVIEW</span>
          </div>
          {preview === 'dashboard' ? (
            <>
              <div className="preview-welcome">A little practice. A stronger you.</div>
              <div className="preview-hero">
                <Sparkles size={17} />
                <strong>
                  One question closer
                  <br />
                  to your RMT.
                </strong>
                <span>
                  Let’s practice <ArrowRight size={12} />
                </span>
              </div>
              <div className="preview-mini-cards">
                <span>
                  <i />
                  Your progress<em>One step at a time</em>
                </span>
                <span>
                  <i />
                  All MLS subjects<em>Always open for you</em>
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="preview-welcome">Your next lightbulb moment.</div>
              <div className="preview-question">
                <small>CLINICAL CHEMISTRY · SAMPLE</small>
                <strong>Which step comes next in your review?</strong>
                <span>
                  <b>A</b> Understand the why <Check size={14} />
                </span>
                <p>
                  <Sparkles size={13} />
                  <strong>The takeaway</strong> A little understanding goes a long way.
                </p>
              </div>
            </>
          )}
          <small className="preview-caption">
            Visual sample · your actual progress stays unchanged
          </small>
        </div>
        <div className="appearance-section-label">
          {preset?.name || 'Your custom palette'}
          <span>20 palettes to explore</span>
        </div>
        <div className="palette-grid" aria-label="Color palettes">
          {themes.map((theme) => (
            <button
              className={`palette-swatch ${draft.presetId === theme.presetId ? 'active' : ''}`}
              key={theme.presetId}
              aria-label={`${theme.name}: ${theme.description}`}
              aria-pressed={draft.presetId === theme.presetId}
              title={theme.name}
              onClick={() =>
                setDraft({
                  presetId: theme.presetId,
                  accent: theme.accent,
                  secondary: theme.secondary,
                  style: draft.style,
                })
              }
            >
              <span
                style={{
                  background: `linear-gradient(125deg, ${theme.accent}, ${theme.secondary})`,
                }}
              >
                {draft.presetId === theme.presetId ? <Check size={16} /> : null}
              </span>
              <small>{theme.name}</small>
            </button>
          ))}
        </div>
        <details className="custom-palette">
          <summary>
            Or mix your own colors <Palette size={15} />
          </summary>
          <div className="custom-color-inputs">
            <label>
              Main color
              <input
                aria-label="Custom main color"
                type="color"
                value={draft.accent}
                onChange={(e) => setDraft({ ...draft, presetId: 'custom', accent: e.target.value })}
              />
            </label>
            <label>
              Second color
              <input
                aria-label="Custom second color"
                type="color"
                value={draft.secondary}
                onChange={(e) =>
                  setDraft({ ...draft, presetId: 'custom', secondary: e.target.value })
                }
              />
            </label>
          </div>
        </details>
        <div className="appearance-style-options" role="group" aria-label="Color style">
          <button
            aria-pressed={draft.style === 'gradient'}
            className={draft.style === 'gradient' ? 'active' : ''}
            onClick={() => setDraft({ ...draft, style: 'gradient' })}
          >
            Soft gradient
          </button>
          <button
            aria-pressed={draft.style === 'solid'}
            className={draft.style === 'solid' ? 'active' : ''}
            onClick={() => setDraft({ ...draft, style: 'solid' })}
          >
            Single color
          </button>
        </div>
        <p className="appearance-accessibility-note">
          We keep buttons and text readable, even with light colors. You can change this anytime in
          Preferences.
        </p>
        {error ? (
          <p className="inline-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="appearance-actions">
          <button className="button secondary" onClick={onClose} disabled={disabled}>
            Cancel
          </button>
          <button className="button primary" disabled={disabled} onClick={apply}>
            {disabled ? <Loader2 size={16} className="spin" /> : <Check size={16} />}Use these
            colors
          </button>
        </div>
      </div>
    </Modal>
  );
}
