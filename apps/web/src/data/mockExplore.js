import { Coffee, Flame, Music, Percent, Salad, Sparkles } from "lucide-react";

export const exploreCategories = [
  { id: "popular", label: "Phổ biến nhất", icon: Flame, active: true },
  { id: "cafe", label: "Cà phê", icon: Coffee },
  { id: "food", label: "Nhà hàng", icon: Salad },
  { id: "event", label: "Sự kiện", icon: Music },
  { id: "chill", label: "Chill", icon: Sparkles },
  { id: "deal", label: "Ưu đãi", icon: Percent }
];

export const exploreFilters = [
  { id: "nearby", label: "Gần tôi", active: true },
  { id: "open_now", label: "Đang mở" },
  { id: "price", label: "Giá tốt" },
  { id: "rating", label: "4.5+ sao" },
  { id: "creator", label: "Có review creator" }
];

export const explorePlaces = [
  {
    id: "p1",
    name: "The Bloom Coffee",
    slug: "the-bloom-coffee",
    category: "Cafe",
    area: "Thảo Điền, TP.HCM",
    distance: "3.2 km",
    rating: 4.6,
    reviewCount: 328,
    priceRange: "45k - 120k",
    status: "Đang mở",
    tags: ["studyspot", "matcha", "wifi"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxKs6pAEyNDbO_z1aw6pN7Vo-felEFGKOBypgboeAV1cTEJotvH6vea9PPnITPi6Wrtv-hBF2pjlReOrCJExwq1lp3gfmBwoM6NjXSIl4Qdb9zR-_DG6We6YcsK5jBo_SqkeV2pPto-lGSEdYSyHnVEpH2kg58vr1aFRU1652cmEgEGIuA1JC0jQ7DPm7wCJNlCaarMyjIS25_zEc3yRu_3eZmxwJbDsjtcsLjpg_Sd8ptgNBProhl_L9zHdaje8spOxsMfbBNXZM",
    alt: "Quan cafe toi gian voi anh sang tu nhien va cay xanh."
  },
  {
    id: "p2",
    name: "Skyline Social Bar",
    slug: "skyline-social-bar",
    category: "Rooftop",
    area: "Quận 1, TP.HCM",
    distance: "1.1 km",
    rating: 4.7,
    reviewCount: 514,
    priceRange: "120k - 350k",
    status: "Đang mở",
    tags: ["rooftop", "sunset", "deal"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAG36-jfQ_Pqeqboynff647eY__9WshMfEmwgpolLjVdNY7d97Zrn0V_v8LANsbnAhIXWY-8YtYd6UywfzkBRVG6qrFOGlYKShqpli3ZgSb6ma-ZajP-dsMuAWd68-SRCdV1ARQUtUuapfLHrJG2C2T0PkT4oeO5x9tmEGAhcBG5VFv-Li47n_d77jcS7MPavtKk2yir3E43l6G1mJggoj6OKw4AKteTlpDGYcEtZA5e2a9gERNtKUA4gpIWwVWHFvHVMvQUfG9r8A",
    alt: "Nha hang rooftop buoi toi voi den vang va skyline thanh pho."
  },
  {
    id: "p3",
    name: "Vintage Alley Bistro",
    slug: "vintage-alley-bistro",
    category: "Nhà hàng",
    area: "Quận 3, TP.HCM",
    distance: "2.4 km",
    rating: 4.5,
    reviewCount: 219,
    priceRange: "80k - 220k",
    status: "Sắp đóng",
    tags: ["vintage", "dinner", "date"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxgos1xiTDlKDqJx9sibtRo22IJWLijpXhtDfVWP1CpsBKM9UWgX1ZRN790NHQIZey3m7LrpT9Z9UMu4X_-uGAXWon3Hjl6HYZ44CCC0ybpobpa96izJ9K_ZQXHj1mliWAJ9i7ZaDjDDmfL_Hn8ctY4LhOCYQvGAwCD-_8jdQ8nwlELOCzjMckBijcagk1n1DupRZog1iKpOuiMzCZV-TAK5To-3yKJdeGbwcqfUuRWDideF6-iGzzYLDhiAYLdP3WLfSlpwT4wpU",
    alt: "Nha hang cong nghiep voi ban go dai va anh den am."
  },
  {
    id: "p4",
    name: "Lofi Study Lounge",
    slug: "lofi-study-lounge",
    category: "Study",
    area: "Bình Thạnh, TP.HCM",
    distance: "4.0 km",
    rating: 4.8,
    reviewCount: 172,
    priceRange: "35k - 90k",
    status: "Đang mở",
    tags: ["study", "quiet", "socket"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmefRQaff7N_LKUbFA1qkvEP4kWS3qZkjQN5g5cnmIX3AplXcVGc2VqYVNKHlipgXlqvaxz-t9mxUaFQvIDAShta1TIErG5hnCrD8mmQ-KzynUqnMRWIrPF-ZUod_CqDja_2p0A3j47aAK215sjUJNY80bHhDzjgX4rgNfRK5_rAR2m-YaRhPj18yATncAptxU8XtS7qgNJNCkgU3WnPs-2p-9gC5t9sGdYZftAl4W_a1h-tznVIaRxnDImvC4TKjcFG2wrY_Oqwc",
    alt: "Thu vien lounge hien dai voi ghe da va ke sach lon."
  },
  {
    id: "p5",
    name: "Art House Weekend",
    slug: "art-house-weekend",
    category: "Sự kiện",
    area: "Quận 7, TP.HCM",
    distance: "6.5 km",
    rating: 4.4,
    reviewCount: 96,
    priceRange: "Free - 150k",
    status: "Đang đóng",
    tags: ["event", "gallery", "weekend"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpnXpX0FNGpTTXoai3bWsvQujaL10NpvwyNNLZqFyTjZjUpnnOuphqDY_RF6I6Gi_M0a4qt2VP_vxIQhz2uMqILXdDZXy9OId4SNO2TTV_6Ny-Ek2Mr3rFLL4j6IADPhE0gi_AM-cmJNnHolmf2UMAA5q1ff3_GTTOmo3Ci9qA7c5XUqzTVh9kOvLxrj9VjminXsAKkvuqmkcbghn5uRBAPX0LAqdtkJUALYGErioZRKxIB9tKreVmE8YEg40jiW7efuYY5dnpxAA",
    alt: "Phong trung bay nghe thuat trang sang voi khach tham quan."
  },
  {
    id: "p6",
    name: "Garden Chill Rooftop",
    slug: "garden-chill-rooftop",
    category: "Chill",
    area: "Phú Nhuận, TP.HCM",
    distance: "2.8 km",
    rating: 4.6,
    reviewCount: 267,
    priceRange: "60k - 180k",
    status: "Đang mở",
    tags: ["garden", "sunset", "friends"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjKJfkLZvXHh7PsopCIS0_PCIWMKuqT-VJmUg5OhYVHkkN4Kl1ClPfZAICBU6xxc4NvNHsK_-e1lhe2MqRyzhB-euqwnoZjQAa6Oi7Uf988fdtqPlx-a7tFMvtJC_mf1Ld7c5JzJq0dFHsQA08qCd8uOxOiW1dm7fxG9vFQlBFFB362yzzRWsOiUI5G8ekzY8Qvb6lECDafC0MjuCfTD12nPRqcgcYUAiGhT6hs2ZmVC_OBvBbVSCF3aHdNhfRToVYdUR95zZUYFo",
    alt: "Rooftop garden voi den day va ghe may luc hoang hon."
  }
];

export const exploreStats = [
  { label: "Địa điểm", value: "1.2k" },
  { label: "Đang mở", value: "286" },
  { label: "Review mới", value: "4.8k" }
];
