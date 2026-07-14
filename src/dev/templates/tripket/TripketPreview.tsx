import "./tripket-theme.css";
import { TripketDashboard } from "./TripketDashboard";

/*
  The Tripket admin DASHBOARD as a standalone preview — rendered in the
  `preview/tripket` iframe on the Templates page. Just the dashboard content
  on the light maritime surface (a scaled thumbnail doesn't need the full
  sidebar/topbar chrome); the "Visit live site" link points at the real
  deployed app for the complete product.
*/
export function TripketPreview() {
  return (
    <div className="tripket-admin min-h-screen w-full px-8 py-7">
      <TripketDashboard />
    </div>
  );
}
