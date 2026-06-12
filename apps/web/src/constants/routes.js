import {
  Bell,
  Compass,
  Heart,
  Home,
  Map,
  Plus,
  Search,
  Settings,
  User
} from "lucide-react";

export const publicNavItems = [
  { label: "Trang chủ", path: "/", icon: Home },
  { label: "Khám phá", path: "/explore", icon: Compass },
  { label: "Bản đồ", path: "/map", icon: Map },
  { label: "Đã lưu", path: "/favorites", icon: Heart },
  { label: "Cài đặt", path: "/settings", icon: Settings }
];

export const mobileNavItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Search", path: "/search", icon: Search },
  { label: "Đăng", path: "/creator/posts/new", icon: Plus, isCreate: true },
  { label: "Map", path: "/map", icon: Map },
  { label: "Profile", path: "/profile", icon: User }
];

export const headerActions = [
  { label: "Thông báo", path: "/notifications", icon: Bell }
];
