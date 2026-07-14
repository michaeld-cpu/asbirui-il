/*
  Tripket admin — mock data store (dashboard slice)
  ------------------------------------------------------------------
  Static mock data lifted verbatim from the source repo's per-line
  dashboard fixture (tripket-admin/lib/dashboard-data.ts, the "2go"
  entry). No fetching / no async — the AsbirUI docs preview renders the
  populated dashboard immediately.

  Exports the exact names the dashboard consumes:
    ACTIVE_LINE, KPI_DATA, WEEKLY_REVENUE, BOOKINGS_6M, PENDING,
    DEPARTURES, peso().
*/

export type ShippingLine = { id: string; name: string };

export type KPI = {
  totalRevenue: number;
  ticketsIssued: number;
  cancellations: number;
  vehicleBookings: number;
  trends: { revenue: number; tickets: number; cancellations: number; vehicles: number };
};

export type WeeklyRevenueDay = { label: string; thisWeek: number; lastWeek: number };

export type BookingsMonth = { label: string; pax: number; veh: number };

export type PendingBooking = {
  ref: string;
  passenger: string;
  pax: number;
  routeFromCode: string;
  routeFromCity: string;
  routeToCode: string;
  routeToCity: string;
  vessel: string;
  vesselType: "RoRo" | "Fast Craft" | "Passenger Ship";
  operator: string;
  voyageId: string;
  departure: string;
  amount: number;
  // Submitted = paid, awaiting operator approval (was "Pending").
  status: "Submitted" | "Confirmed" | "Cancelled";
  bookingDate: string;
  ageMinutes: number;
};

export type Departure = {
  id: string;
  vessel: string;
  type: "RoRo" | "Fast Craft" | "Ferry";
  routeFrom: string;
  routeTo: string;
  depart: string;
  arrive: string;
  arriveOffsetDays?: number;
  durationLabel: string;
  ticketsConfirmed: number;
  ticketsPending: number;
};

/** ₱ peso formatter — thousands separators, no decimals. */
export function peso(n: number): string {
  return `₱${n.toLocaleString()}`;
}

export const ACTIVE_LINE: ShippingLine = { id: "2go", name: "2GO Travel" };

export const KPI_DATA: KPI = {
  totalRevenue: 4_820_000,
  ticketsIssued: 1340,
  cancellations: 28,
  vehicleBookings: 184,
  trends: { revenue: 22, tickets: 18, cancellations: -8, vehicles: 14 },
};

export const WEEKLY_REVENUE: WeeklyRevenueDay[] = [
  { label: "Mon", thisWeek: 132000, lastWeek: 102000 },
  { label: "Tue", thisWeek: 158000, lastWeek: 128000 },
  { label: "Wed", thisWeek: 128000, lastWeek: 108000 },
  { label: "Thu", thisWeek: 188000, lastWeek: 150000 },
  { label: "Fri", thisWeek: 138000, lastWeek: 112000 },
  { label: "Sat", thisWeek: 178000, lastWeek: 140000 },
  { label: "Sun", thisWeek: 112000, lastWeek: 88000 },
];

export const BOOKINGS_6M: BookingsMonth[] = [
  { label: "Nov", pax: 480, veh: 120 },
  { label: "Dec", pax: 1180, veh: 360 },
  { label: "Jan", pax: 620, veh: 180 },
  { label: "Feb", pax: 1040, veh: 480 },
  { label: "Mar", pax: 740, veh: 260 },
  { label: "Apr", pax: 1340, veh: 540 },
];

export const PENDING: PendingBooking[] = [
  { ref: "TKT-0001", passenger: "Maria Santos",   pax: 2, routeFromCode: "MNL", routeFromCity: "Manila",   routeToCode: "PPS", routeToCity: "Puerto Princesa", vessel: "MV Palawan Breeze",     vesselType: "RoRo", operator: "2GO Travel", voyageId: "VY-9003", departure: "05/19 · 19:00", amount: 4200, status: "Submitted", bookingDate: "2026-05-07", ageMinutes: 124 },
  { ref: "TKT-0002", passenger: "Juan Dela Cruz", pax: 1, routeFromCode: "MNL", routeFromCity: "Manila",   routeToCode: "ILO", routeToCity: "Iloilo",         vessel: "MV Visayan Star",       vesselType: "RoRo", operator: "2GO Travel", voyageId: "VY-9005", departure: "05/18 · 16:00", amount: 1800, status: "Submitted", bookingDate: "2026-05-07", ageMinutes: 96 },
  { ref: "TKT-0003", passenger: "Andrea Lim",     pax: 3, routeFromCode: "MNL", routeFromCity: "Manila",   routeToCode: "CEB", routeToCity: "Cebu City",       vessel: "MV St. Pope John Paul", vesselType: "RoRo", operator: "2GO Travel", voyageId: "VY-9007", departure: "05/20 · 21:00", amount: 5400, status: "Submitted", bookingDate: "2026-05-07", ageMinutes: 78 },
  { ref: "TKT-0004", passenger: "Rico Tan",       pax: 1, routeFromCode: "MNL", routeFromCity: "Manila",   routeToCode: "CDO", routeToCity: "Cagayan de Oro",  vessel: "MV Maligaya",           vesselType: "RoRo", operator: "2GO Travel", voyageId: "VY-9009", departure: "05/19 · 13:00", amount: 3200, status: "Submitted", bookingDate: "2026-05-08", ageMinutes: 52 },
  { ref: "TKT-0005", passenger: "Patricia Reyes", pax: 4, routeFromCode: "BAT", routeFromCity: "Batangas", routeToCode: "CAL", routeToCity: "Calapan",         vessel: "MV Visayan Star",       vesselType: "RoRo", operator: "2GO Travel", voyageId: "VY-9004", departure: "05/18 · 16:00", amount: 3200, status: "Submitted", bookingDate: "2026-05-08", ageMinutes: 31 },
  { ref: "TKT-0006", passenger: "Joanna Cruz",    pax: 1, routeFromCode: "MNL", routeFromCity: "Manila",   routeToCode: "PPS", routeToCity: "Puerto Princesa", vessel: "MV Palawan Breeze",     vesselType: "RoRo", operator: "2GO Travel", voyageId: "VY-9005", departure: "05/19 · 19:00", amount: 2100, status: "Submitted", bookingDate: "2026-05-08", ageMinutes: 18 },
];

export const DEPARTURES: Departure[] = [
  { id: "VY-9003", vessel: "MV Palawan Breeze",     type: "RoRo", routeFrom: "MNL", routeTo: "PPS", depart: "7:00 PM", arrive: "5:00 PM", arriveOffsetDays: 1, durationLabel: "22h",     ticketsConfirmed: 310, ticketsPending: 24 },
  { id: "VY-9004", vessel: "MV Visayan Star",       type: "RoRo", routeFrom: "BAT", routeTo: "CAL", depart: "4:00 PM", arrive: "6:30 PM",                      durationLabel: "2h 30m", ticketsConfirmed: 412, ticketsPending: 9 },
  { id: "VY-9005", vessel: "MV Visayan Star",       type: "RoRo", routeFrom: "MNL", routeTo: "ILO", depart: "4:00 PM", arrive: "1:00 PM", arriveOffsetDays: 1, durationLabel: "21h",     ticketsConfirmed: 380, ticketsPending: 17 },
  { id: "VY-9007", vessel: "MV St. Pope John Paul", type: "RoRo", routeFrom: "MNL", routeTo: "CEB", depart: "9:00 PM", arrive: "6:00 PM", arriveOffsetDays: 1, durationLabel: "21h",     ticketsConfirmed: 290, ticketsPending: 31 },
  { id: "VY-9009", vessel: "MV Maligaya",           type: "RoRo", routeFrom: "MNL", routeTo: "CDO", depart: "1:00 PM", arrive: "1:00 PM", arriveOffsetDays: 2, durationLabel: "48h",     ticketsConfirmed: 240, ticketsPending: 12 },
];
