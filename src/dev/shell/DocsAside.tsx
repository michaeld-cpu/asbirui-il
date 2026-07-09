import { MotionPromoStatic, MotionPromoFloating } from "./MotionPromoCard";

/*
  Right-hand aside for the docs shell (React-Bits-style): a large announcement
  card spotlighting Asbir Motion. On desktop (xl+) it's a static aside; below xl
  the content column keeps its width and the card becomes a dismissible floating
  card pinned bottom-left (HeroUI-style), so mobile still sees the promo.
*/

export function DocsAside() {
  return (
    <>
      {/* desktop: static aside */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-80 shrink-0 overflow-y-auto py-10 pl-6 pr-6 xl:block">
        <MotionPromoStatic />
      </aside>

      {/* mobile / tablet: floating dismissible card (hidden on xl where the
          aside shows instead) */}
      <MotionPromoFloating dismissKey="asbir-motion-docs" corner="bottom-left" className="xl:hidden" />
    </>
  );
}
