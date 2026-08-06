/**
 * Synthetic-but-realistic data layer for the SUDA Director Command Centre.
 * All figures are deterministically derived from the district name so the
 * dashboards stay stable across renders while varying per district.
 */

export type District = {
  name: string;
  division: string;
  ulbs: number;
  municipalCorporations: number;
  urbanPopLakh: number;
};

export const DISTRICTS: District[] = [
  { name: "Alipurduar", division: "Jalpaiguri", ulbs: 1, municipalCorporations: 0, urbanPopLakh: 1.1 },
  { name: "Bankura", division: "Medinipur", ulbs: 3, municipalCorporations: 0, urbanPopLakh: 2.4 },
  { name: "Birbhum", division: "Burdwan", ulbs: 6, municipalCorporations: 0, urbanPopLakh: 3.1 },
  { name: "Cooch Behar", division: "Jalpaiguri", ulbs: 6, municipalCorporations: 0, urbanPopLakh: 2.6 },
  { name: "Dakshin Dinajpur", division: "Malda", ulbs: 2, municipalCorporations: 0, urbanPopLakh: 1.5 },
  { name: "Darjeeling", division: "Jalpaiguri", ulbs: 4, municipalCorporations: 1, urbanPopLakh: 5.4 },
  { name: "Hooghly", division: "Burdwan", ulbs: 13, municipalCorporations: 1, urbanPopLakh: 20.7 },
  { name: "Howrah", division: "Presidency", ulbs: 3, municipalCorporations: 1, urbanPopLakh: 30.7 },
  { name: "Jalpaiguri", division: "Jalpaiguri", ulbs: 4, municipalCorporations: 0, urbanPopLakh: 3.4 },
  { name: "Jhargram", division: "Medinipur", ulbs: 1, municipalCorporations: 0, urbanPopLakh: 0.7 },
  { name: "Kalimpong", division: "Jalpaiguri", ulbs: 1, municipalCorporations: 0, urbanPopLakh: 0.5 },
  { name: "Kolkata", division: "Presidency", ulbs: 1, municipalCorporations: 1, urbanPopLakh: 44.9 },
  { name: "Malda", division: "Malda", ulbs: 2, municipalCorporations: 0, urbanPopLakh: 3.2 },
  { name: "Murshidabad", division: "Presidency", ulbs: 8, municipalCorporations: 0, urbanPopLakh: 9.4 },
  { name: "Nadia", division: "Presidency", ulbs: 11, municipalCorporations: 0, urbanPopLakh: 11.5 },
  { name: "North 24 Parganas", division: "Presidency", ulbs: 27, municipalCorporations: 4, urbanPopLakh: 57.3 },
  { name: "Paschim Bardhaman", division: "Burdwan", ulbs: 6, municipalCorporations: 2, urbanPopLakh: 23.1 },
  { name: "Paschim Medinipur", division: "Medinipur", ulbs: 8, municipalCorporations: 0, urbanPopLakh: 6.8 },
  { name: "Purba Bardhaman", division: "Burdwan", ulbs: 6, municipalCorporations: 0, urbanPopLakh: 6.2 },
  { name: "Purba Medinipur", division: "Medinipur", ulbs: 5, municipalCorporations: 0, urbanPopLakh: 4.5 },
  { name: "Purulia", division: "Medinipur", ulbs: 3, municipalCorporations: 0, urbanPopLakh: 2.3 },
  { name: "South 24 Parganas", division: "Presidency", ulbs: 7, municipalCorporations: 1, urbanPopLakh: 20.4 },
  { name: "Uttar Dinajpur", division: "Malda", ulbs: 4, municipalCorporations: 0, urbanPopLakh: 2.9 },
];

export const ALL_DISTRICTS = "All Districts (State)";

export function getDistrict(name: string): District | null {
  return DISTRICTS.find((d) => d.name === name) ?? null;
}

export function districtProfile(name: string) {
  if (name === ALL_DISTRICTS) {
    return {
      name: ALL_DISTRICTS,
      division: "All Divisions",
      ulbs: DISTRICTS.reduce((s, d) => s + d.ulbs, 0),
      municipalCorporations: DISTRICTS.reduce((s, d) => s + d.municipalCorporations, 0),
      urbanPopLakh: +DISTRICTS.reduce((s, d) => s + d.urbanPopLakh, 0).toFixed(1),
    } as District;
  }
  return getDistrict(name) ?? DISTRICTS[0];
}

/* ---------------- deterministic pseudo randomness ---------------- */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rand(seed: string, min: number, max: number, decimals = 0): number {
  const x = (hash(seed) % 100000) / 100000;
  const v = min + x * (max - min);
  return +v.toFixed(decimals);
}

export function pick<T>(seed: string, arr: T[]): T {
  return arr[hash(seed) % arr.length];
}

function scale(name: string) {
  const p = districtProfile(name);
  return p.urbanPopLakh / 10;
}

/* ---------------- shared vocabulary ---------------- */

export const MISSIONS = [
  "PMAY-U / Banglar Bari",
  "AMRUT 2.0",
  "SBM-U 2.0 (Mission Nirmal Bangla)",
  "DAY-NULM",
  "NUHM",
  "UPHC Strengthening",
  "CBPHC",
  "NVBDCP",
  "Solid Waste Management",
] as const;

export const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

export type RagStatus = "red" | "amber" | "green";

export function ragOf(value: number, amber: number, green: number): RagStatus {
  if (value >= green) return "green";
  if (value >= amber) return "amber";
  return "red";
}

const OFFICERS = [
  "Sri A. Bhattacharya, EO",
  "Smt. R. Mondal, SDO",
  "Sri D. Ghosh, Ex. Engineer",
  "Smt. P. Sen, Municipal Commissioner",
  "Sri K. Roy, Chairperson-in-Council",
  "Sri S. Dutta, DPO (SUDA)",
  "Smt. M. Chakraborty, Health Officer",
];

const ACTIONS = [
  "Show-cause issued to ULB",
  "Review meeting convened",
  "Field inspection scheduled",
  "Fund release put on hold",
  "Escalated to Divisional Commissioner",
  "Vendor penalty invoked",
];

export type ExceptionRow = {
  id: string;
  issue: string;
  ulb: string;
  location: string;
  officer: string;
  action: string;
  deadline: string;
  decision: string;
  status: Exclude<RagStatus, "green">;
};

export function ulbNames(district: string): string[] {
  const p = districtProfile(district);
  const base =
    district === ALL_DISTRICTS
      ? ["Kolkata MC", "Howrah MC", "Bidhannagar MC", "Siliguri MC", "Asansol MC", "Durgapur MC", "Barrackpore", "Baruipur", "Kalyani", "Berhampore", "Chandannagar", "Habra"]
      : Array.from({ length: Math.min(12, Math.max(4, p.ulbs)) }, (_, i) =>
          `${district.split(" ")[0]} ${["Municipality", "Municipality (N)", "Municipality (S)", "Notified Area", "MC", "Municipality (E)", "Municipality (W)", "Municipality-II", "Municipality-III", "Municipality-IV", "Municipality-V", "Municipality-VI"][i]}`,
        );
  return base;
}

export function exceptions(district: string, topic: string, count = 6): ExceptionRow[] {
  const ulbs = ulbNames(district);
  const issues: Record<string, string[]> = {
    fund: [
      "UC pending beyond 12 months",
      "Instalment unspent for 90+ days",
      "SOE not uploaded for Q2",
      "Interest earned not remitted",
      "Diversion flagged in audit",
      "Bank reconciliation mismatch",
    ],
    swm: [
      "Door-to-door collection below 80%",
      "Legacy dump not bio-mined",
      "MRF non-functional",
      "Source segregation below 60%",
      "Compost plant under-utilised",
      "Vehicle tracking offline",
    ],
    health: [
      "UPHC without full-time MO",
      "Dengue positivity above threshold",
      "Larval survey coverage low",
      "Vaccine cold-chain breach",
      "OPD footfall drop >30%",
      "ASHA vacancy above 20%",
    ],
    housing: [
      "Geo-tag pending for sanctioned units",
      "Beneficiary instalment delayed",
      "Construction stalled at plinth",
      "Land dispute at site",
      "DPR revision pending",
      "Completion certificate not issued",
    ],
    drain: [
      "Silt clearance below 50%",
      "Canal encroachment reported",
      "Pump station non-operational",
      "Waterlogging recurrent hotspot",
      "Outfall blocked",
      "Monsoon control room not set up",
    ],
    grievance: [
      "Grievance open beyond 30 days",
      "Repeat complaint from same ward",
      "Escalated incident unresolved",
      "SLA breach in water supply",
      "Street-light restoration overdue",
      "No response to CM helpline ticket",
    ],
    project: [
      "Physical progress lags financial",
      "Tender re-invited twice",
      "Contractor abandoned site",
      "Utility shifting pending",
      "Third-party QC report awaited",
      "Cost overrun above 15%",
    ],
    revenue: [
      "Property tax demand not raised",
      "Collection efficiency below 55%",
      "Trade licence renewal drive stalled",
      "Assessment register outdated",
      "Arrears above 3 years",
      "Online payment gateway down",
    ],
    data: [
      "MIS entry pending for 3 weeks",
      "Duplicate beneficiary records",
      "ULB not integrated with state API",
      "Aadhaar seeding below 70%",
      "Geo-coordinates missing",
      "Monthly return not filed",
    ],
    general: [
      "Indicator below state benchmark",
      "Data not reported this month",
      "Physical verification pending",
      "Deviation from approved plan",
      "Committee meeting not held",
      "Compliance report overdue",
    ],
  };
  const pool = issues[topic] ?? issues.general;
  return Array.from({ length: count }, (_, i) => {
    const s = `${district}-${topic}-${i}`;
    return {
      id: `EX-${rand(s + "id", 10000, 99999)}`,
      issue: pool[i % pool.length],
      ulb: ulbs[i % ulbs.length],
      location: `Ward ${rand(s + "w", 1, 40)}, ${ulbs[i % ulbs.length]}`,
      officer: pick(s + "o", OFFICERS),
      action: pick(s + "a", ACTIONS),
      deadline: `${rand(s + "d", 1, 28)} ${pick(s + "m", ["Aug", "Sep", "Oct"])} 2026`,
      decision: pick(s + "dec", [
        "Approve revised timeline",
        "Sanction additional fund",
        "Direct recovery from ULB",
        "Order enquiry",
        "Note for compliance",
      ]),
      status: rand(s + "st", 0, 10) > 5 ? "red" : "amber",
    };
  });
}

/* ---------------- dashboard datasets ---------------- */

export function cockpit(district: string) {
  const p = districtProfile(district);
  const k = scale(district);
  return {
    profile: p,
    kpis: {
      fundUtilisation: rand(district + "fu", 54, 92, 1),
      grievanceRedressal: rand(district + "gr", 62, 96, 1),
      swmSegregation: rand(district + "sg", 45, 93, 1),
      housingCompletion: rand(district + "hc", 40, 88, 1),
      revenueCollection: rand(district + "rc", 48, 89, 1),
      projectsOnTrack: rand(district + "pt", 55, 94, 1),
      activeIncidents: Math.round(rand(district + "ai", 4, 60) * Math.max(0.4, k)),
      dataCompleteness: rand(district + "dc", 66, 99, 1),
    },
    trend: MONTHS.map((m, i) => ({
      month: m,
      utilisation: rand(`${district}u${i}`, 35, 95, 1),
      grievances: Math.round(rand(`${district}g${i}`, 120, 900) * Math.max(0.3, k)),
      revenue: Math.round(rand(`${district}r${i}`, 200, 1600) * Math.max(0.3, k)),
    })),
    missionMix: MISSIONS.map((m, i) => ({
      mission: m,
      progress: rand(`${district}${m}${i}`, 38, 96, 1),
      spend: Math.round(rand(`${district}s${m}`, 80, 900) * Math.max(0.3, k)),
    })),
    alerts: exceptions(district, "general", 6),
  };
}

export function ulbPerformance(district: string) {
  const ulbs = ulbNames(district);
  const rows = ulbs.map((u, i) => {
    const s = `${district}-${u}-${i}`;
    const service = rand(s + "sv", 45, 96, 1);
    const finance = rand(s + "fn", 40, 95, 1);
    const grievance = rand(s + "gv", 42, 97, 1);
    const sanitation = rand(s + "sn", 44, 96, 1);
    const digital = rand(s + "dg", 38, 98, 1);
    const score = +((service + finance + grievance + sanitation + digital) / 5).toFixed(1);
    return { ulb: u, service, finance, grievance, sanitation, digital, score, rank: 0, status: ragOf(score, 60, 78) };
  });
  rows.sort((a, b) => b.score - a.score).forEach((r, i) => (r.rank = i + 1));
  return rows;
}

export function fundUtilisation(district: string) {
  const k = Math.max(0.35, scale(district));
  const schemes = MISSIONS.map((m) => {
    const s = `${district}-fund-${m}`;
    const allocation = Math.round(rand(s + "al", 400, 4200) * k);
    const released = Math.round(allocation * rand(s + "rl", 0.6, 0.98, 2));
    const utilised = Math.round(released * rand(s + "ut", 0.45, 0.97, 2));
    const ucPending = Math.round(released - utilised * rand(s + "uc", 0.7, 1, 2));
    return {
      scheme: m,
      allocation,
      released,
      utilised,
      ucPending: Math.max(0, ucPending),
      utilisationPct: +((utilised / Math.max(1, released)) * 100).toFixed(1),
    };
  });
  return {
    schemes,
    totals: {
      allocation: schemes.reduce((a, s) => a + s.allocation, 0),
      released: schemes.reduce((a, s) => a + s.released, 0),
      utilised: schemes.reduce((a, s) => a + s.utilised, 0),
      ucPending: schemes.reduce((a, s) => a + s.ucPending, 0),
    },
    ageing: [
      { bucket: "0-3 months", value: Math.round(rand(district + "a1", 40, 300) * k) },
      { bucket: "3-6 months", value: Math.round(rand(district + "a2", 30, 220) * k) },
      { bucket: "6-12 months", value: Math.round(rand(district + "a3", 20, 160) * k) },
      { bucket: "> 12 months", value: Math.round(rand(district + "a4", 8, 110) * k) },
    ],
    monthly: MONTHS.map((m, i) => ({
      month: m,
      released: Math.round(rand(`${district}mr${i}`, 60, 620) * k),
      utilised: Math.round(rand(`${district}mu${i}`, 40, 560) * k),
    })),
    exceptions: exceptions(district, "fund", 7),
  };
}

export function missionPerformance(district: string) {
  return MISSIONS.map((m) => {
    const s = `${district}-mp-${m}`;
    const physical = rand(s + "p", 38, 97, 1);
    const financial = rand(s + "f", 35, 96, 1);
    return {
      mission: m,
      physical,
      financial,
      targets: Math.round(rand(s + "t", 500, 9000)),
      achieved: Math.round(rand(s + "a", 300, 8500)),
      status: ragOf((physical + financial) / 2, 55, 75),
      milestones: MONTHS.slice(0, 12).map((mo, i) => ({ month: mo, value: rand(`${s}${i}`, 20, 100, 1) })),
    };
  });
}

export function solidWaste(district: string) {
  const k = Math.max(0.35, scale(district));
  return {
    kpis: {
      wasteGeneratedTPD: Math.round(rand(district + "wg", 40, 900) * k),
      processedPct: rand(district + "wp", 42, 94, 1),
      segregationPct: rand(district + "ws", 38, 95, 1),
      doorToDoorPct: rand(district + "wd", 60, 99, 1),
      odfStatus: pick(district + "odf", ["ODF++", "ODF+", "ODF++", "ODF+"]),
      legacyWasteRemainingMT: Math.round(rand(district + "lw", 2000, 90000) * k),
    },
    processing: [
      { type: "Composting", value: rand(district + "c1", 15, 45, 1) },
      { type: "Material Recovery", value: rand(district + "c2", 10, 35, 1) },
      { type: "Bio-methanation", value: rand(district + "c3", 3, 18, 1) },
      { type: "RDF / Co-processing", value: rand(district + "c4", 4, 20, 1) },
      { type: "Landfill", value: rand(district + "c5", 6, 30, 1) },
    ],
    ulbs: ulbNames(district).map((u, i) => ({
      ulb: u,
      collection: rand(`${district}${u}col`, 62, 100, 1),
      segregation: rand(`${district}${u}seg`, 35, 96, 1),
      processing: rand(`${district}${u}pro`, 30, 95, 1),
      swachhRank: rand(`${district}${u}rk`, 1, 400),
    })),
    monthly: MONTHS.map((m, i) => ({
      month: m,
      generated: Math.round(rand(`${district}wgm${i}`, 40, 900) * k),
      processed: Math.round(rand(`${district}wpm${i}`, 30, 800) * k),
    })),
    exceptions: exceptions(district, "swm", 6),
  };
}

export function urbanHealth(district: string) {
  const k = Math.max(0.35, scale(district));
  return {
    kpis: {
      uphcs: Math.round(rand(district + "uphc", 3, 60) * Math.max(0.5, k)),
      opdFootfall: Math.round(rand(district + "opd", 8000, 90000) * Math.max(0.4, k)),
      dengueCases: Math.round(rand(district + "dng", 20, 1800) * Math.max(0.3, k)),
      malariaCases: Math.round(rand(district + "mal", 3, 400) * Math.max(0.3, k)),
      larvalSurveyPct: rand(district + "lsv", 55, 98, 1),
      immunisationPct: rand(district + "imm", 68, 99, 1),
    },
    vector: MONTHS.map((m, i) => ({
      month: m,
      dengue: Math.round(rand(`${district}dg${i}`, 2, 260) * Math.max(0.3, k)),
      malaria: Math.round(rand(`${district}ml${i}`, 0, 60) * Math.max(0.3, k)),
      chikungunya: Math.round(rand(`${district}ck${i}`, 0, 30) * Math.max(0.3, k)),
    })),
    programmes: [
      { name: "NUHM", coverage: rand(district + "p1", 62, 97, 1) },
      { name: "NVBDCP", coverage: rand(district + "p2", 58, 96, 1) },
      { name: "CBPHC", coverage: rand(district + "p3", 55, 94, 1) },
      { name: "UPHC Services", coverage: rand(district + "p4", 60, 98, 1) },
    ],
    hotspots: ulbNames(district)
      .slice(0, 8)
      .map((u, i) => ({
        ward: `Ward ${rand(`${district}${u}hw`, 1, 40)}`,
        ulb: u,
        cases: Math.round(rand(`${district}${u}hc`, 4, 180)),
        houseIndex: rand(`${district}${u}hi`, 1, 18, 1),
        risk: pick(`${district}${u}rk${i}`, ["High", "Moderate", "High", "Low"]),
      })),
    exceptions: exceptions(district, "health", 6),
  };
}

export function housing(district: string) {
  const k = Math.max(0.35, scale(district));
  const sanctioned = Math.round(rand(district + "hs", 2000, 60000) * k);
  const grounded = Math.round(sanctioned * rand(district + "hg", 0.7, 0.97, 2));
  const completed = Math.round(grounded * rand(district + "hcp", 0.4, 0.92, 2));
  return {
    kpis: {
      sanctioned,
      grounded,
      completed,
      occupied: Math.round(completed * rand(district + "ho", 0.78, 0.99, 2)),
      subsidyReleasedCr: +(rand(district + "hsr", 20, 480, 1) * k).toFixed(1),
      avgCompletionDays: rand(district + "hd", 240, 720),
    },
    verticals: [
      { name: "BLC (Banglar Bari)", value: Math.round(sanctioned * 0.55) },
      { name: "AHP", value: Math.round(sanctioned * 0.22) },
      { name: "ISSR", value: Math.round(sanctioned * 0.12) },
      { name: "CLSS", value: Math.round(sanctioned * 0.11) },
    ],
    stages: [
      { stage: "Sanctioned", value: sanctioned },
      { stage: "Grounded", value: grounded },
      { stage: "Plinth", value: Math.round(grounded * 0.82) },
      { stage: "Roof", value: Math.round(grounded * 0.63) },
      { stage: "Completed", value: completed },
    ],
    monthly: MONTHS.map((m, i) => ({
      month: m,
      completed: Math.round(rand(`${district}hm${i}`, 50, 1200) * k),
      instalments: Math.round(rand(`${district}hi${i}`, 80, 1600) * k),
    })),
    ulbs: ulbNames(district).map((u) => ({
      ulb: u,
      sanctioned: Math.round(rand(`${district}${u}s`, 200, 5000)),
      completed: Math.round(rand(`${district}${u}c`, 80, 4200)),
      geoTagPct: rand(`${district}${u}g`, 55, 100, 1),
    })),
    exceptions: exceptions(district, "housing", 6),
  };
}

export function drains(district: string) {
  const k = Math.max(0.35, scale(district));
  return {
    kpis: {
      drainKm: Math.round(rand(district + "dk", 60, 1400) * k),
      desiltedPct: rand(district + "dp", 42, 97, 1),
      pumpStations: Math.round(rand(district + "ps", 2, 60) * Math.max(0.4, k)),
      pumpsOperational: rand(district + "po", 70, 100, 1),
      waterloggingSpots: Math.round(rand(district + "wl", 3, 90) * Math.max(0.4, k)),
      monsoonReadiness: rand(district + "mr", 48, 96, 1),
    },
    readiness: [
      { item: "Silt clearance", value: rand(district + "r1", 45, 98, 1) },
      { item: "Pump servicing", value: rand(district + "r2", 55, 99, 1) },
      { item: "Control room", value: rand(district + "r3", 60, 100, 1) },
      { item: "Encroachment removal", value: rand(district + "r4", 30, 88, 1) },
      { item: "Outfall clearing", value: rand(district + "r5", 40, 95, 1) },
      { item: "Emergency stock", value: rand(district + "r6", 50, 97, 1) },
    ],
    rainfall: MONTHS.map((m, i) => ({
      month: m,
      rainfallMm: Math.round(rand(`${district}rf${i}`, 5, 480)),
      logIncidents: Math.round(rand(`${district}li${i}`, 0, 45)),
    })),
    hotspots: ulbNames(district)
      .slice(0, 8)
      .map((u) => ({
        location: `Ward ${rand(`${district}${u}dw`, 1, 40)}, ${u}`,
        recedeHours: rand(`${district}${u}rh`, 1, 26),
        drainageCapacity: pick(`${district}${u}dc`, ["Adequate", "Deficient", "Critical", "Adequate"]),
        lastCleaned: `${rand(`${district}${u}lc`, 1, 28)} Jun 2026`,
      })),
    exceptions: exceptions(district, "drain", 6),
  };
}

export function grievance(district: string) {
  const k = Math.max(0.35, scale(district));
  const received = Math.round(rand(district + "gvr", 400, 9000) * k);
  const resolved = Math.round(received * rand(district + "gvs", 0.62, 0.97, 2));
  return {
    kpis: {
      received,
      resolved,
      pending: received - resolved,
      avgResolutionDays: rand(district + "ard", 2, 21, 1),
      slaCompliance: rand(district + "sla", 55, 97, 1),
      escalated: Math.round(rand(district + "esc", 5, 240) * Math.max(0.4, k)),
    },
    categories: [
      { category: "Water supply", value: Math.round(received * 0.22) },
      { category: "Sanitation / SWM", value: Math.round(received * 0.2) },
      { category: "Roads & drains", value: Math.round(received * 0.18) },
      { category: "Street lighting", value: Math.round(received * 0.13) },
      { category: "Property tax", value: Math.round(received * 0.1) },
      { category: "Building plan", value: Math.round(received * 0.09) },
      { category: "Others", value: Math.round(received * 0.08) },
    ],
    channels: [
      { channel: "CM Helpline (1950)", value: rand(district + "ch1", 15, 40, 1) },
      { channel: "ULB Portal", value: rand(district + "ch2", 12, 35, 1) },
      { channel: "Walk-in", value: rand(district + "ch3", 8, 28, 1) },
      { channel: "Ward Office", value: rand(district + "ch4", 6, 24, 1) },
    ],
    monthly: MONTHS.map((m, i) => ({
      month: m,
      received: Math.round(rand(`${district}gm${i}`, 40, 900) * k),
      resolved: Math.round(rand(`${district}gs${i}`, 30, 850) * k),
    })),
    incidents: exceptions(district, "grievance", 7),
  };
}

export function projects(district: string) {
  const k = Math.max(0.35, scale(district));
  const total = Math.round(rand(district + "pj", 40, 700) * k);
  const sectors = ["Water Supply", "Sewerage", "Roads", "Drainage", "Parks & Green", "Solid Waste", "Urban Transport", "Buildings"];
  return {
    kpis: {
      total,
      ongoing: Math.round(total * rand(district + "pon", 0.4, 0.7, 2)),
      completed: Math.round(total * rand(district + "pcm", 0.2, 0.5, 2)),
      delayed: Math.round(total * rand(district + "pdl", 0.05, 0.25, 2)),
      valueCr: +(rand(district + "pv", 120, 2400, 1) * k).toFixed(1),
      avgDelayDays: rand(district + "pad", 15, 210),
    },
    sectors: sectors.map((s) => ({
      sector: s,
      count: Math.round(rand(`${district}${s}c`, 3, 90) * Math.max(0.4, k)),
      physical: rand(`${district}${s}p`, 30, 98, 1),
      financial: rand(`${district}${s}f`, 25, 96, 1),
    })),
    timeline: MONTHS.map((m, i) => ({
      month: m,
      started: Math.round(rand(`${district}ps${i}`, 1, 26)),
      completed: Math.round(rand(`${district}pc${i}`, 1, 22)),
    })),
    list: ulbNames(district).map((u, i) => {
      const s = `${district}-prj-${i}`;
      const phy = rand(s + "ph", 12, 99, 1);
      return {
        name: `${pick(s + "n", ["Water Supply Augmentation", "Sewerage Network", "Road Resurfacing", "Storm Water Drain", "Market Complex", "MRF Facility", "Park Development", "Bus Terminus"])} — ${u}`,
        ulb: u,
        sector: pick(s + "sec", sectors),
        costCr: rand(s + "cost", 2, 180, 1),
        physical: phy,
        financial: rand(s + "fin", 10, 98, 1),
        agency: pick(s + "ag", ["KMDA", "SUDA", "PHED", "ULB (own)", "WBSUDA-PMU"]),
        status: ragOf(phy, 45, 75),
      };
    }),
    exceptions: exceptions(district, "project", 6),
  };
}

export function revenue(district: string) {
  const k = Math.max(0.35, scale(district));
  const demand = +(rand(district + "rvd", 30, 900, 1) * k).toFixed(1);
  const collected = +(demand * rand(district + "rvc", 0.42, 0.93, 2)).toFixed(1);
  return {
    kpis: {
      demandCr: demand,
      collectedCr: collected,
      efficiency: +((collected / Math.max(1, demand)) * 100).toFixed(1),
      arrearsCr: +(demand * rand(district + "rva", 0.15, 0.6, 2)).toFixed(1),
      onlineSharePct: rand(district + "rvo", 22, 88, 1),
      newAssessments: Math.round(rand(district + "rvn", 300, 12000) * Math.max(0.4, k)),
    },
    heads: [
      { head: "Property Tax", demand: +(demand * 0.48).toFixed(1), collected: +(collected * 0.46).toFixed(1) },
      { head: "Trade Licence", demand: +(demand * 0.17).toFixed(1), collected: +(collected * 0.18).toFixed(1) },
      { head: "Water Charges", demand: +(demand * 0.13).toFixed(1), collected: +(collected * 0.12).toFixed(1) },
      { head: "Building Plan Fees", demand: +(demand * 0.1).toFixed(1), collected: +(collected * 0.11).toFixed(1) },
      { head: "Advertisement", demand: +(demand * 0.06).toFixed(1), collected: +(collected * 0.06).toFixed(1) },
      { head: "Rent & Others", demand: +(demand * 0.06).toFixed(1), collected: +(collected * 0.07).toFixed(1) },
    ],
    monthly: MONTHS.map((m, i) => ({
      month: m,
      collection: +(rand(`${district}rm${i}`, 1, 90, 1) * k).toFixed(1),
      target: +(rand(`${district}rt${i}`, 2, 95, 1) * k).toFixed(1),
    })),
    ulbs: ulbNames(district).map((u) => ({
      ulb: u,
      demand: rand(`${district}${u}rd`, 2, 220, 1),
      collected: rand(`${district}${u}rc`, 1, 200, 1),
      efficiency: rand(`${district}${u}re`, 38, 96, 1),
      ownRevenueShare: rand(`${district}${u}rs`, 12, 72, 1),
    })),
    exceptions: exceptions(district, "revenue", 6),
  };
}

export function dataQuality(district: string) {
  const sources = [
    "PMAY-U MIS",
    "SBM-U Portal",
    "AMRUT 2.0 MIS",
    "NULM MIS",
    "HMIS (Health)",
    "e-Municipality (Revenue)",
    "Grievance Portal",
    "GIS / Geo-tagging",
  ];
  return {
    kpis: {
      completeness: rand(district + "dq1", 62, 99, 1),
      timeliness: rand(district + "dq2", 58, 98, 1),
      accuracy: rand(district + "dq3", 65, 99, 1),
      integratedSystems: rand(district + "dq4", 4, 8),
      duplicateRecords: Math.round(rand(district + "dq5", 10, 1800)),
      apiUptime: rand(district + "dq6", 92, 99.9, 2),
    },
    sources: sources.map((s) => ({
      source: s,
      completeness: rand(`${district}${s}c`, 55, 100, 1),
      timeliness: rand(`${district}${s}t`, 45, 100, 1),
      lastSync: `${rand(`${district}${s}h`, 1, 23)}h ago`,
      status: ragOf(rand(`${district}${s}st`, 40, 100, 1), 60, 80),
    })),
    trend: MONTHS.map((m, i) => ({
      month: m,
      completeness: rand(`${district}dqm${i}`, 55, 100, 1),
      timeliness: rand(`${district}dqt${i}`, 45, 100, 1),
    })),
    exceptions: exceptions(district, "data", 6),
  };
}
