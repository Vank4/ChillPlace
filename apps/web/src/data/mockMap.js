import { Coffee, MapPin, Music, Salad, Sparkles } from "lucide-react";
import { mockPlaces } from "../mocks/places.mock.js";

export const mapFilters = [
  { id: "all", label: "Tất cả" },
  { id: "cafe", label: "Cà phê" },
  { id: "food", label: "Ăn tối" },
  { id: "open", label: "Đang mở" },
  { id: "deal", label: "Ưu đãi" }
];

const markerMeta = [
  { x: 34, y: 32, icon: Coffee, tone: "primary" },
  { x: 62, y: 42, icon: Sparkles, tone: "accent" },
  { x: 46, y: 64, icon: Salad, tone: "secondary" },
  { x: 72, y: 66, icon: Coffee, tone: "primary" },
  { x: 24, y: 58, icon: Music, tone: "secondary" },
  { x: 54, y: 24, icon: MapPin, tone: "accent" },
  { x: 38, y: 72, icon: Coffee, tone: "primary" },
  { x: 78, y: 36, icon: Sparkles, tone: "accent" },
  { x: 18, y: 42, icon: Coffee, tone: "primary" },
  { x: 58, y: 74, icon: Salad, tone: "secondary" },
  { x: 28, y: 24, icon: Music, tone: "secondary" },
  { x: 68, y: 22, icon: MapPin, tone: "accent" }
];

export const mapPlaces = mockPlaces.map((place, index) => ({
  ...place,
  ...markerMeta[index % markerMeta.length]
}));

export const selectedMapPlace = mapPlaces[0];
