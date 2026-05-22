import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import SalonDecoSticker from "../SalonDecoSticker";
import {
  getDecoPlacement,
  placementToCss,
  scaleToFontSize,
  type SalonDecoPlacement,
} from "../../lib/salonDecoLayout";
import type { SalonConfig } from "../../lib/profileCustomization";
import { MAX_SALON_DECOS } from "../../lib/profileDecoPrices";

type Props = {
  salon: SalonConfig;
  couleurFamille: string;
  /** Zone hero (relative) dans laquelle on place les stickers. */
  heroRef?: React.RefObject<HTMLDivElement | null>;
  editable?: boolean;
  selectedEm?: string | null;
  onSelectEm?: (em: string) => void;
  onLayoutPatch?: (em: string, patch: Partial<SalonDecoPlacement>) => void;
  animate?: boolean;
  animSet?: import("../../lib/salonDecoLayout").DecoAnimSet;
};

export default function SalonDecoLayer({
  salon,
  couleurFamille,
  heroRef,
  editable = false,
  selectedEm = null,
  onSelectEm,
  onLayoutPatch,
  animate = true,
  animSet = "studio",
}: Props) {
  const dragRef = useRef<{
    em: string;
    startX: number;
    startY: number;
    orig: SalonDecoPlacement;
  } | null>(null);

  const decos = salon.deco
    .filter((d) => !d.startsWith("gif:") && !d.includes("duotone"))
    .slice(0, MAX_SALON_DECOS);

  const updateFromPointer = useCallback(
    (em: string, clientX: number, clientY: number, orig: SalonDecoPlacement) => {
      const box = heroRef?.current;
      if (!box || !onLayoutPatch) return;
      const rect = box.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return;
      const dx = ((clientX - dragRef.current!.startX) / rect.width) * 100;
      const dy = ((clientY - dragRef.current!.startY) / rect.height) * 100;
      onLayoutPatch(em, {
        x: orig.x + dx,
        y: orig.y + dy,
      });
    },
    [heroRef, onLayoutPatch]
  );

  const onPointerDown = (em: string, index: number, e: ReactPointerEvent) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    onSelectEm?.(em);
    const orig = getDecoPlacement(salon, em, index);
    dragRef.current = { em, startX: e.clientX, startY: e.clientY, orig };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (em: string, e: ReactPointerEvent) => {
    if (!editable || !dragRef.current || dragRef.current.em !== em) return;
    updateFromPointer(em, e.clientX, e.clientY, dragRef.current.orig);
  };

  const onPointerUp = (em: string, e: ReactPointerEvent) => {
    if (!editable || dragRef.current?.em !== em) return;
    dragRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {decos.map((em, i) => {
        const placement = getDecoPlacement(salon, em, i);
        const selected = editable && selectedEm === em;
        return (
          <div
            key={em}
            role={editable ? "button" : undefined}
            tabIndex={editable ? 0 : undefined}
            onPointerDown={(e) => onPointerDown(em, i, e)}
            onPointerMove={(e) => onPointerMove(em, e)}
            onPointerUp={(e) => onPointerUp(em, e)}
            onPointerCancel={(e) => onPointerUp(em, e)}
            onClick={(e) => {
              if (!editable) return;
              e.stopPropagation();
              onSelectEm?.(em);
            }}
            style={{
              ...placementToCss(placement, { animate, animIndex: i, animSet }),
              pointerEvents: editable ? "auto" : undefined,
              cursor: editable ? "grab" : undefined,
              touchAction: editable ? "none" : undefined,
              outline: selected ? "2px solid rgba(251,191,36,0.95)" : "none",
              outlineOffset: 2,
              borderRadius: 8,
              boxShadow: selected ? "0 0 0 4px rgba(251,191,36,0.25)" : undefined,
            }}
          >
            <SalonDecoSticker
              em={em}
              fontSize={scaleToFontSize(placement.scale)}
              accentColor={couleurFamille}
            />
            {editable && selected && (
              <span
                style={{
                  position: "absolute",
                  right: -6,
                  bottom: -6,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#fbbf24",
                  border: "2px solid #0f172a",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  pointerEvents: "none",
                }}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </>
  );
}
