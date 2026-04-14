import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { makeAvatarSvg } from '../../services/avatar.service';
import type { AtributoAvatar, DynamicFeatures, ElementoInventarioAvatar } from '../../types/avatar.types';
import './AvatarLootBox.css';

interface Props {
  unownedItems: ElementoInventarioAvatar[];
  atributos:    AtributoAvatar[];
  baseFeatures: DynamicFeatures;
  onOpen:       () => Promise<ElementoInventarioAvatar | null>;
  disabled?:    boolean;
}

// ── Layout constants ──────────────────────────────────────────────────────────
const TILE_W  = 84;
const GAP     = 10;
const VISIBLE = 7;    // tiles shown in viewport at once
const WIN_IDX = 40;   // winner lands at this index in the strip

// ── Helper ────────────────────────────────────────────────────────────────────
function buildStrip(
  items:   ElementoInventarioAvatar[],
  winner:  ElementoInventarioAvatar,
): ElementoInventarioAvatar[] {
  const pool    = [...items].sort(() => Math.random() - 0.5);
  const before  = Array.from({ length: WIN_IDX }, (_, i) => pool[i % pool.length]);
  const after   = Array.from({ length: 5       }, (_, i) => pool[(i + 1) % pool.length]);
  return [...before, winner, ...after];
}

// ── Component ─────────────────────────────────────────────────────────────────
const AvatarLootBox: React.FC<Props> = ({
  unownedItems,
  atributos,
  baseFeatures,
  onOpen,
  disabled,
}) => {
  const stripRef = useRef<HTMLDivElement>(null);

  const [phase,  setPhase]  = useState<'idle' | 'spinning' | 'done'>('idle');
  const [winner, setWinner] = useState<ElementoInventarioAvatar | null>(null);
  const [strip,  setStrip]  = useState<{ elem: ElementoInventarioAvatar; svg: string }[]>([]);

  // Map attribute id → attribute nombre for quick SVG generation
  const attrById = useMemo(
    () => new Map(atributos.map(a => [a.id, a])),
    [atributos],
  );

  const elemToSvg = useCallback(
    (elem: ElementoInventarioAvatar): string => {
      const attr = attrById.get(elem.id_atributo_avatar);
      if (!attr) return makeAvatarSvg(baseFeatures);
      return makeAvatarSvg({ ...baseFeatures, [attr.nombre]: [elem.nombre] });
    },
    [attrById, baseFeatures],
  );

  // ── Open handler ──────────────────────────────────────────────────────────
  const handleOpen = useCallback(async () => {
    if (phase !== 'idle' || unownedItems.length === 0) return;

    setPhase('spinning');
    setWinner(null);

    const wonItem = await onOpen().catch(() => null);
    if (!wonItem) {
      setPhase('idle');
      return;
    }

    // Build strip — animation is triggered by the useEffect below after DOM commit
    const items = buildStrip(unownedItems, wonItem);
    setStrip(items.map(elem => ({ elem, svg: elemToSvg(elem) })));
    setWinner(wonItem);
  }, [phase, unownedItems, onOpen, elemToSvg]);

  // ── Animate after strip commits to DOM ────────────────────────────────────
  // useEffect fires after React commits the new strip tiles to the DOM,
  // so getBoundingClientRect() returns the actual rendered positions.
  useEffect(() => {
    if (phase !== 'spinning' || strip.length === 0) return;

    // One RAF to let the browser finish layout before measuring
    const raf = requestAnimationFrame(() => {
      const stripEl   = stripRef.current;
      const viewport  = stripEl?.parentElement as HTMLElement | null;
      if (!stripEl || !viewport) return;

      const winnerTile = stripEl.querySelectorAll<HTMLElement>('.lootbox__tile')[WIN_IDX];
      if (!winnerTile) return;

      // Measure actual rendered positions (works even for off-screen elements)
      const vRect = viewport.getBoundingClientRect();
      const wRect = winnerTile.getBoundingClientRect();

      const viewportCx = vRect.left + vRect.width  / 2;
      const winnerCx   = wRect.left + wRect.width  / 2;

      // Shift the strip so the winner tile lands exactly at the viewport centre
      const finalX = viewportCx - winnerCx;

      stripEl.style.transition = 'transform 4s cubic-bezier(0.08, 0.82, 0.17, 1)';
      stripEl.style.transform  = `translateX(${finalX}px)`;
      setTimeout(() => setPhase('done'), 4200);
    });

    return () => cancelAnimationFrame(raf);
  }, [phase, strip]);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    const el = stripRef.current;
    if (el) {
      el.style.transition = 'none';
      el.style.transform  = ''; // clear inline style so CSS class controls layout
    }
    setPhase('idle');
    setWinner(null);
    setStrip([]);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  const viewportWidth = VISIBLE * (TILE_W + GAP) - GAP;
  const allOwned      = unownedItems.length === 0;

  return (
    <div className="lootbox">

      {/* ── Roulette strip ── */}
      <div className="lootbox__viewport" style={{ width: viewportWidth }}>
        {/* Center highlight */}
        <div className="lootbox__center-indicator" />

        <div className={`lootbox__strip${strip.length === 0 ? ' lootbox__strip--idle' : ''}`} ref={stripRef}>
          {strip.length > 0
            ? strip.map(({ elem, svg }, i) => (
                <div
                  key={i}
                  className={`lootbox__tile${
                    phase === 'done' && i === WIN_IDX ? ' lootbox__tile--winner' : ''
                  }`}
                >
                  <div
                    className="lootbox__tile-avatar"
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                  <span className="lootbox__tile-label">{elem.nombre_es ?? elem.nombre}</span>
                </div>
              ))
            : // Placeholder skeleton tiles while idle
              Array.from({ length: VISIBLE }, (_, i) => (
                <div key={i} className="lootbox__tile lootbox__tile--placeholder">
                  <div className="lootbox__tile-avatar" />
                </div>
              ))}
        </div>

        {/* Edge fades */}
        <div className="lootbox__fade lootbox__fade--left"  />
        <div className="lootbox__fade lootbox__fade--right" />
      </div>

      {/* ── Result box ── */}
      <div className={`lootbox__result${phase === 'done' ? ' lootbox__result--revealed' : ''}`}>
        {phase === 'done' && winner ? (
          <>
            <div
              className="lootbox__result-avatar"
              dangerouslySetInnerHTML={{ __html: elemToSvg(winner) }}
            />
            <p className="lootbox__result-name">{winner.nombre_es ?? winner.nombre}</p>
          </>
        ) : (
          <span className="lootbox__result-placeholder">
            {phase === 'spinning' ? '✨' : allOwned ? '🏆' : '?'}
          </span>
        )}
      </div>

      {/* ── Action button ── */}
      {phase === 'done' ? (
        <button className="lootbox__btn lootbox__btn--secondary" onClick={handleReset}>
          Abrir otra vez
        </button>
      ) : (
        <button
          className="lootbox__btn"
          onClick={handleOpen}
          disabled={disabled || phase === 'spinning' || allOwned}
        >
          {allOwned       ? 'Inventario completo'
           : phase === 'spinning' ? 'Abriendo…'
           : 'Abrir'}
        </button>
      )}
    </div>
  );
};

export default AvatarLootBox;
