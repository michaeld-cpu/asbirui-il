import * as React from "react";
import { AiTemplate } from "../templates/ai/AiTemplate";

/*
  Renders the REAL AI console template at a fixed 1440×900 "design size" and
  scales it down to fit whatever box it's dropped into — so the homepage preview
  is a live render of the actual page, not a separate mockup. Non-interactive;
  the wrapping <a> handles navigation to #ai.
*/
const DESIGN_W = 1440;
const DESIGN_H = 900;

export function TemplatePreview() {
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(0.3);

  React.useEffect(() => {
    const box = boxRef.current?.parentElement; // the aspect-ratio stage
    if (!box) return;
    const update = () => {
      const w = box.clientWidth;
      setScale(w / DESIGN_W);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
      style={{
        width: DESIGN_W,
        height: DESIGN_H,
        transform: `scale(${scale})`,
      }}
      aria-hidden="true"
    >
      <AiTemplate sub="" />
    </div>
  );
}
