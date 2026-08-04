import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, Heart, MapPin, Landmark, Sparkles, TreePine, Ticket, Compass,
  X, Star, SlidersHorizontal, LocateFixed, ArrowUpDown, Map as MapIcon,
  Grid3x3, ChevronDown
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const COLORS = {
  bg: "#0D1B1E",
  surface: "#142A2D",
  surfaceLight: "#1C3A3D",
  border: "#25423F",
  gold: "#E3A857",
  green: "#7FA678",
  coral: "#E8735F",
  text: "#F3EDE4",
  muted: "#93A8A4",
};

const CATEGORY_META = {
  historical: { label: "Historical", icon: Landmark, color: COLORS.gold },
  religious: { label: "Religious", icon: Sparkles, color: "#C9A0DC" },
  nature: { label: "Nature", icon: TreePine, color: COLORS.green },
  entertainment: { label: "Entertainment", icon: Ticket, color: COLORS.coral },
  other: { label: "Other", icon: Compass, color: "#7FB3C9" },
};

// ---------------------------------------------------------------------------
// Sample data — realistic, well-known Sri Lankan attractions
// ---------------------------------------------------------------------------
const PLACES = [
  { id: 1, name: "Sigiriya Rock Fortress", district: "Matale", province: "Central", category: "historical", lat: 7.957, lng: 80.7603, feeLocal: 50, feeForeign: 30, rating: 4.8, blurb: "A 5th-century rock citadel rising 200m above the jungle, crowned with palace ruins and ancient frescoes." },
  { id: 2, name: "Temple of the Sacred Tooth Relic", district: "Kandy", province: "Central", category: "religious", lat: 7.2936, lng: 80.6413, feeLocal: 0, feeForeign: 10, rating: 4.7, blurb: "Sri Lanka's most sacred Buddhist shrine, said to house a tooth relic of the Buddha." },
  { id: 3, name: "Galle Fort", district: "Galle", province: "Southern", category: "historical", lat: 6.03, lng: 80.2167, feeLocal: 0, feeForeign: 0, rating: 4.7, blurb: "A walled coastal fort built by the Portuguese and fortified by the Dutch, now a living old town." },
  { id: 4, name: "Yala National Park", district: "Hambantota", province: "Southern", category: "nature", lat: 6.3728, lng: 81.5183, feeLocal: 60, feeForeign: 25, rating: 4.6, blurb: "One of the world's best places to spot leopards, alongside elephants and crocodiles." },
  { id: 5, name: "Nine Arch Bridge", district: "Badulla", province: "Uva", category: "other", lat: 6.8794, lng: 81.0602, feeLocal: 0, feeForeign: 0, rating: 4.6, blurb: "A colonial-era stone viaduct wrapped in tea country mist, famous for passing trains." },
  { id: 6, name: "Adam's Peak (Sri Pada)", district: "Ratnapura", province: "Sabaragamuwa", category: "religious", lat: 6.8096, lng: 80.4994, feeLocal: 0, feeForeign: 0, rating: 4.8, blurb: "A pilgrimage mountain topped with a sacred footprint, climbed overnight to catch sunrise." },
  { id: 7, name: "Anuradhapura Sacred City", district: "Anuradhapura", province: "North Central", category: "historical", lat: 8.3114, lng: 80.4037, feeLocal: 50, feeForeign: 25, rating: 4.6, blurb: "Ruins of Sri Lanka's first ancient capital, with dagobas and a 2,000-year-old sacred fig tree." },
  { id: 8, name: "Polonnaruwa Ancient City", district: "Polonnaruwa", province: "North Central", category: "historical", lat: 7.9403, lng: 81.0188, feeLocal: 50, feeForeign: 25, rating: 4.6, blurb: "The compact ruins of Sri Lanka's medieval capital, best explored by bicycle." },
  { id: 9, name: "Dambulla Cave Temple", district: "Matale", province: "Central", category: "religious", lat: 7.8567, lng: 80.6493, feeLocal: 0, feeForeign: 10, rating: 4.7, blurb: "Five cave shrines carved into a rock face, filled with Buddhist murals and statues." },
  { id: 10, name: "Mirissa Beach", district: "Matara", province: "Southern", category: "nature", lat: 5.9483, lng: 80.4589, feeLocal: 0, feeForeign: 0, rating: 4.5, blurb: "A crescent bay known for whale watching, surf breaks, and palm-lined sand." },
  { id: 11, name: "Horton Plains National Park", district: "Nuwara Eliya", province: "Central", category: "nature", lat: 6.8021, lng: 80.7973, feeLocal: 60, feeForeign: 25, rating: 4.5, blurb: "A misty highland plateau leading to World's End, a sheer 870m escarpment." },
  { id: 12, name: "Jaffna Fort", district: "Jaffna", province: "Northern", category: "historical", lat: 9.6615, lng: 80.0086, feeLocal: 0, feeForeign: 0, rating: 4.3, blurb: "A star-shaped Dutch fort overlooking the Jaffna lagoon, still being restored." },
  { id: 13, name: "Nallur Kandaswamy Temple", district: "Jaffna", province: "Northern", category: "religious", lat: 9.6685, lng: 80.0234, feeLocal: 0, feeForeign: 0, rating: 4.6, blurb: "A vividly painted Hindu temple famed for its 25-day annual festival." },
  { id: 14, name: "Fort Frederick", district: "Trincomalee", province: "Eastern", category: "historical", lat: 8.5776, lng: 81.233, feeLocal: 0, feeForeign: 0, rating: 4.3, blurb: "A headland fort with grazing deer, leading to the cliffside Koneswaram Temple." },
  { id: 15, name: "Pigeon Island National Park", district: "Trincomalee", province: "Eastern", category: "nature", lat: 8.7167, lng: 81.2, feeLocal: 60, feeForeign: 20, rating: 4.5, blurb: "A snorkeling reserve with reef sharks and coral just offshore." },
  { id: 16, name: "Batticaloa Lagoon", district: "Batticaloa", province: "Eastern", category: "nature", lat: 7.7167, lng: 81.7, feeLocal: 0, feeForeign: 0, rating: 4.2, blurb: "A calm brackish lagoon known for boat rides and its singing fish legend." },
  { id: 17, name: "Kandy Lake", district: "Kandy", province: "Central", category: "other", lat: 7.2914, lng: 80.6428, feeLocal: 0, feeForeign: 0, rating: 4.4, blurb: "An artificial lake ringed by a walking path in the heart of Kandy." },
  { id: 18, name: "Pinnawala Elephant Orphanage", district: "Kegalle", province: "Sabaragamuwa", category: "entertainment", lat: 7.3, lng: 80.3833, feeLocal: 100, feeForeign: 20, rating: 4.1, blurb: "A rescue and breeding sanctuary famous for its riverside elephant bathing hour." },
  { id: 19, name: "Ravana Falls", district: "Badulla", province: "Uva", category: "nature", lat: 6.8331, lng: 81.0568, feeLocal: 0, feeForeign: 0, rating: 4.2, blurb: "A wide roadside waterfall tied to the Ramayana legend of King Ravana." },
  { id: 20, name: "Wilpattu National Park", district: "Puttalam", province: "North Western", category: "nature", lat: 8.45, lng: 80.05, feeLocal: 60, feeForeign: 25, rating: 4.5, blurb: "Sri Lanka's largest park, dotted with natural sand-rimmed lakes called villus." },
  { id: 21, name: "Negombo Fish Market", district: "Gampaha", province: "Western", category: "other", lat: 7.2083, lng: 79.8358, feeLocal: 0, feeForeign: 0, rating: 4.0, blurb: "A dawn fish market where outrigger boats unload the night's catch." },
  { id: 22, name: "Colombo National Museum", district: "Colombo", province: "Western", category: "historical", lat: 6.9101, lng: 79.8613, feeLocal: 100, feeForeign: 10, rating: 4.3, blurb: "The island's largest museum, holding royal regalia and ancient artifacts." },
  { id: 23, name: "Gangaramaya Temple", district: "Colombo", province: "Western", category: "religious", lat: 6.9169, lng: 79.8567, feeLocal: 0, feeForeign: 3, rating: 4.5, blurb: "An eclectic temple complex mixing Sri Lankan, Thai, and Chinese architecture." },
  { id: 24, name: "Galle Face Green", district: "Colombo", province: "Western", category: "entertainment", lat: 6.923, lng: 79.843, feeLocal: 0, feeForeign: 0, rating: 4.2, blurb: "An oceanfront promenade that turns into a street-food carnival at sunset." },
  { id: 25, name: "Ridiyagama Safari Park", district: "Hambantota", province: "Southern", category: "entertainment", lat: 6.1667, lng: 81.0333, feeLocal: 300, feeForeign: 15, rating: 3.9, blurb: "A drive-through safari park with African and local wildlife." },
  { id: 26, name: "Ussangoda", district: "Hambantota", province: "Southern", category: "nature", lat: 6.1667, lng: 81.1167, feeLocal: 0, feeForeign: 0, rating: 4.1, blurb: "A red-earthed coastal plateau linked to folklore of a meteor strike." },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Rough linear projection of the island's bounding box onto a stylized
// teardrop silhouette (illustrative, not cartographically precise).
function project(lat, lng) {
  const x = 20 + ((lng - 79.5) / (81.9 - 79.5)) * 260;
  const y = 480 - ((lat - 5.9) / (9.9 - 5.9)) * 460;
  return { x, y };
}

function formatFee(local, foreign) {
  if (local === 0 && foreign === 0) return "Free entry";
  return `Rs ${local} · $${foreign}`;
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function ExploreSriLanka() {
  const [view, setView] = useState("explore"); // explore | map | favorites
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // name | rating | distance
  const [favorites, setFavorites] = useState(() => new Set());
  const [userLoc, setUserLoc] = useState(null);
  const [locStatus, setLocStatus] = useState("idle"); // idle | loading | granted | denied
  const [selectedId, setSelectedId] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const cardRefs = useRef({});

  useEffect(() => {
    const el = document.createElement("style");
    el.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');`;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function enableLocation() {
    if (!navigator.geolocation) {
      setLocStatus("denied");
      return;
    }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("granted");
        setSortBy("distance");
      },
      () => setLocStatus("denied"),
      { timeout: 8000 }
    );
  }

  const enriched = useMemo(() => {
    return PLACES.map((p) =>
      userLoc ? { ...p, distanceKm: haversineKm(userLoc, p) } : p
    );
  }, [userLoc]);

  const filtered = useMemo(() => {
    let list = enriched.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.district.toLowerCase().includes(query.toLowerCase()) ||
        p.province.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      const matchesView = view !== "favorites" || favorites.has(p.id);
      return matchesQuery && matchesCategory && matchesView;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "distance" && userLoc)
        return a.distanceKm - b.distanceKm;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [enriched, query, category, view, favorites, sortBy, userLoc]);

  const counts = useMemo(() => {
    const c = { all: PLACES.length };
    Object.keys(CATEGORY_META).forEach((k) => {
      c[k] = PLACES.filter((p) => p.category === k).length;
    });
    return c;
  }, []);

  function focusPlace(id) {
    setSelectedId(id);
    if (view === "map") setView("explore");
    requestAnimationFrame(() => {
      cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    setTimeout(() => setSelectedId(null), 2200);
  }

  return (
    <div
      style={{ background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', sans-serif", minHeight: "100%" }}
      className="w-full"
    >
      {/* ---------------- Hero ---------------- */}
      <header
        className="px-5 pt-8 pb-6 sm:px-10 sm:pt-12 sm:pb-8 relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at 15% 0%, ${COLORS.surfaceLight} 0%, ${COLORS.bg} 55%)`,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3" style={{ color: COLORS.gold }}>
            <Compass size={16} />
            <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
              9 provinces · 25 districts
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl mb-2"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            Explore Sri Lanka
          </h1>
          <p className="text-sm sm:text-base mb-6" style={{ color: COLORS.muted }}>
            {PLACES.length} handpicked places — temples, ruins, coastline, and wild parks.
          </p>

          {/* Search */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 mb-3"
            style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <Search size={18} style={{ color: COLORS.muted }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search places or districts..."
              className="bg-transparent outline-none flex-1 text-sm sm:text-base placeholder:opacity-60"
              style={{ color: COLORS.text }}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X size={16} style={{ color: COLORS.muted }} />
              </button>
            )}
          </div>

          {/* Location prompt */}
          {locStatus !== "granted" && (
            <button
              onClick={enableLocation}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm w-full sm:w-auto justify-center transition-opacity hover:opacity-90"
              style={{ background: "rgba(127,166,120,0.16)", color: COLORS.green, border: `1px solid rgba(127,166,120,0.35)` }}
            >
              <LocateFixed size={16} />
              {locStatus === "loading" ? "Locating..." : locStatus === "denied" ? "Location unavailable — enter a district instead" : "Enable location for distance sorting"}
            </button>
          )}
          {locStatus === "granted" && (
            <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.green }}>
              <LocateFixed size={16} /> Sorting by distance from you
            </div>
          )}
        </div>
      </header>

      {/* ---------------- Tabs ---------------- */}
      <div
        className="sticky top-0 z-10 px-5 sm:px-10 flex items-center gap-1 py-3"
        style={{ background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="max-w-5xl mx-auto w-full flex items-center gap-1">
          {[
            { id: "explore", label: "Explore", icon: Grid3x3 },
            { id: "map", label: "Map", icon: MapIcon },
            { id: "favorites", label: "Favorites", icon: Heart, badge: favorites.size },
          ].map((t) => {
            const Icon = t.icon;
            const active = view === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: active ? COLORS.bg : COLORS.muted,
                  background: active ? COLORS.gold : "transparent",
                }}
              >
                <Icon size={15} />
                {t.label}
                {!!t.badge && (
                  <span
                    className="text-[10px] rounded-full px-1.5 py-0.5 ml-0.5"
                    style={{
                      background: active ? COLORS.bg : COLORS.surfaceLight,
                      color: active ? COLORS.gold : COLORS.text,
                    }}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-5 sm:px-10 py-6">
        {view !== "map" && (
          <>
            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-2 -mx-1 px-1">
              <Pill active={category === "all"} onClick={() => setCategory("all")} label={`All · ${counts.all}`} color={COLORS.text} />
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <Pill
                  key={key}
                  active={category === key}
                  onClick={() => setCategory(key)}
                  label={`${meta.label} · ${counts[key]}`}
                  color={meta.color}
                  Icon={meta.icon}
                />
              ))}
            </div>

            {/* Sort control */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs" style={{ color: COLORS.muted }}>
                {filtered.length} {filtered.length === 1 ? "place" : "places"}
              </span>
              <div className="relative">
                <button
                  onClick={() => setSortOpen((s) => !s)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.muted }}
                >
                  <ArrowUpDown size={12} />
                  Sort: {sortBy === "distance" ? "Distance" : sortBy === "rating" ? "Rating" : "Name"}
                  <ChevronDown size={12} />
                </button>
                {sortOpen && (
                  <div
                    className="absolute right-0 mt-1 rounded-lg overflow-hidden z-20 w-36"
                    style={{ background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}` }}
                  >
                    {["name", "rating", "distance"].map((opt) => (
                      <button
                        key={opt}
                        disabled={opt === "distance" && !userLoc}
                        onClick={() => {
                          setSortBy(opt);
                          setSortOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs capitalize disabled:opacity-40"
                        style={{ color: COLORS.text }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <EmptyState view={view} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <PlaceCard
                    key={p.id}
                    place={p}
                    isFavorite={favorites.has(p.id)}
                    onToggleFavorite={() => toggleFavorite(p.id)}
                    highlighted={selectedId === p.id}
                    innerRef={(el) => (cardRefs.current[p.id] = el)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {view === "map" && (
          <MapView
            places={filtered.length ? filtered : enriched}
            onSelect={focusPlace}
            favorites={favorites}
          />
        )}
      </main>

      <footer className="text-center text-xs py-8" style={{ color: COLORS.muted, fontFamily: "'Space Mono', monospace" }}>
        Sample data for demonstration · coordinates are approximate
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function Pill({ active, onClick, label, color, Icon }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors"
      style={{
        borderColor: active ? color : COLORS.border,
        background: active ? `${color}22` : "transparent",
        color: active ? color : COLORS.muted,
      }}
    >
      {Icon && <Icon size={12} />}
      {label}
    </button>
  );
}

function PlaceCard({ place, isFavorite, onToggleFavorite, highlighted, innerRef }) {
  const meta = CATEGORY_META[place.category];
  const Icon = meta.icon;
  return (
    <div
      ref={innerRef}
      className="rounded-xl p-4 flex flex-col gap-3 transition-shadow"
      style={{
        background: COLORS.surface,
        border: `1px solid ${highlighted ? meta.color : COLORS.border}`,
        boxShadow: highlighted ? `0 0 0 3px ${meta.color}33` : "none",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${meta.color}22`, color: meta.color }}
          >
            <Icon size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{place.name}</p>
            <p className="text-xs flex items-center gap-1" style={{ color: COLORS.muted }}>
              <MapPin size={10} /> {place.district}, {place.province}
            </p>
          </div>
        </div>
        <button onClick={onToggleFavorite} aria-label="Toggle favorite" className="shrink-0 pt-1">
          <Heart
            size={18}
            fill={isFavorite ? COLORS.coral : "none"}
            style={{ color: isFavorite ? COLORS.coral : COLORS.muted }}
          />
        </button>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: COLORS.muted }}>
        {place.blurb}
      </p>

      <div className="flex items-center justify-between text-xs pt-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <span className="flex items-center gap-1" style={{ color: COLORS.gold }}>
          <Star size={12} fill={COLORS.gold} /> {place.rating}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", color: COLORS.muted }}>
          {formatFee(place.feeLocal, place.feeForeign)}
        </span>
        {place.distanceKm != null && (
          <span style={{ fontFamily: "'Space Mono', monospace", color: COLORS.green }}>
            {place.distanceKm.toFixed(0)} km
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ view }) {
  const msg =
    view === "favorites"
      ? "No favorites yet. Tap the heart on any place to save it here."
      : "No places match your search or filters.";
  return (
    <div
      className="rounded-xl py-16 text-center text-sm"
      style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, color: COLORS.muted }}
    >
      {msg}
    </div>
  );
}

function MapView({ places, onSelect, favorites }) {
  const islandPath =
    "M150 20 C220 20 270 80 275 150 C280 220 260 280 240 330 C220 380 190 430 150 480 C110 430 80 380 60 330 C40 280 20 220 25 150 C30 80 80 20 150 20 Z";
  return (
    <div
      className="rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6"
      style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
    >
      <div className="flex-1 flex justify-center">
        <svg viewBox="0 0 300 500" className="w-full max-w-xs">
          <path d={islandPath} fill={COLORS.surfaceLight} stroke={COLORS.border} strokeWidth="2" />
          {places.map((p) => {
            const { x, y } = project(p.lat, p.lng);
            const meta = CATEGORY_META[p.category];
            const isFav = favorites.has(p.id);
            return (
              <g key={p.id} onClick={() => onSelect(p.id)} style={{ cursor: "pointer" }}>
                <circle cx={x} cy={y} r={isFav ? 7 : 5} fill={meta.color} opacity={0.9} stroke={COLORS.bg} strokeWidth="1.5" />
                {isFav && <circle cx={x} cy={y} r={10} fill="none" stroke={COLORS.coral} strokeWidth="1.5" />}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="sm:w-48 flex flex-col gap-2 justify-center">
        <p className="text-xs uppercase tracking-wide mb-1" style={{ color: COLORS.muted, fontFamily: "'Space Mono', monospace" }}>
          Legend
        </p>
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <div key={key} className="flex items-center gap-2 text-xs" style={{ color: COLORS.muted }}>
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: meta.color }} />
              <Icon size={12} style={{ color: meta.color }} />
              {meta.label}
            </div>
          );
        })}
        <p className="text-[11px] mt-3 leading-relaxed" style={{ color: COLORS.muted }}>
          Tap a pin to jump to its card in the Explore list.
        </p>
      </div>
    </div>
  );
}
