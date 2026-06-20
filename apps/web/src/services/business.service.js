const BUSINESS_STATE_KEY = "chillplace.businessState";

const defaultBusinessState = {
  profile: {
    name: "Chill Coffee Hub",
    owner: "Minh Nguyễn",
    category: "Cafe & Workspace",
    area: "Thảo Điền, TP.HCM",
    address: "24 Xuân Thủy, Thảo Điền, TP. Thủ Đức",
    phone: "090 288 6677",
    email: "hello@chillcoffee.vn",
    status: "open",
    priceRange: "VNĐ+",
    rating: 4.8,
    reviews: 326,
    description:
      "Không gian cafe ấm, nhiều ổ cắm, ánh sáng tự nhiên và khu vực yên tĩnh cho làm việc nhóm.",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSPrDS47m3rJ0Zv1n_yePcUGkAcWu9NwZLGijRUo63XF90dkY946wL4Yk7eFTFIwLHY_a_q2gTsGEivgxH3LNGgZz6nQHv_Lo6szSGGQkbpUONlIEKb1F1LIgoYzZuSFqV9NMXadWppXKlg-zawDc8UVtdzmgy9C8OOr1PStS6JfT3CLSN6aVo-iyn2cxO8yr8Utv73LWrfXcyFH7nroLU7wQ6mkf_xsWvUh4sTuu6aM5QVYt0cs2p2kaNgKT0QKugslViNfI",
    hours: [
      { day: "Thứ 2 - Thứ 6", value: "07:00 - 22:00" },
      { day: "Thứ 7 - Chủ nhật", value: "08:00 - 23:00" }
    ],
    amenities: ["Wifi mạnh", "Ổ cắm", "Pet friendly", "Phòng họp nhỏ"]
  },
  places: [
    {
      id: "place-main",
      name: "Chill Coffee Hub",
      area: "Thảo Điền, TP.HCM",
      status: "Đang mở",
      rating: 4.8,
      views: 18400,
      bookings: 126,
      completeness: 92,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBSPrDS47m3rJ0Zv1n_yePcUGkAcWu9NwZLGijRUo63XF90dkY946wL4Yk7eFTFIwLHY_a_q2gTsGEivgxH3LNGgZz6nQHv_Lo6szSGGQkbpUONlIEKb1F1LIgoYzZuSFqV9NMXadWppXKlg-zawDc8UVtdzmgy9C8OOr1PStS6JfT3CLSN6aVo-iyn2cxO8yr8Utv73LWrfXcyFH7nroLU7wQ6mkf_xsWvUh4sTuu6aM5QVYt0cs2p2kaNgKT0QKugslViNfI"
    },
    {
      id: "place-rooftop",
      name: "Chill Rooftop Corner",
      area: "Quận 1, TP.HCM",
      status: "Lên lịch mở",
      rating: 4.6,
      views: 9200,
      bookings: 64,
      completeness: 78,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwOUD49c6zKgQwGL2cl_uORfCkqfSWgKx1pLMrJ5mlVaN0E-oizJpkOJQ_vwbhLt9YpA_S2VowvEBr6LAdDkpquP2VWEsfAIcZTZ_3DpzFc2RPDhhz-tU4-bxQuQo33OJ2shpZ5Vp8smzsji7SjQdIuLJeXWqNDM8-GKUNJ3tlgQHJVAuOWZ6WRXSuvcITm5ki43_UdRXJngXO_QH5QCbPzAejegVhl_j9At8xPUsgTaS3s3X3iz42btURcXfwzD9BxbDSZhSA"
    }
  ],
  media: [
    {
      id: "media-1",
      label: "Ảnh chính",
      type: "Hero",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAYWID7FPpgYwQG_AYGlZdTjhLw6Jh7T8IQqmhU-Y2iCcU-D9CxZkZLzJYGJwIcvCx2oKYGNe3_Hh9tr6DsgK4PAciKZ2CpBSO03BSSHFtMPMs9qKz9N0fEIsumS4E9D7N2f-DPZfXv8fzx0WSar4yXe9bcCVYD6VjPcBC-q9JxnzFXcSgWj96-X6KfVRg1_nPJo0Qyq2sThYgR-0DpcQaWX0yKSOpyqj-2P39J7X2plcNvlLJbLx0jFYcmAWLrKXz9lmw"
    },
    {
      id: "media-2",
      label: "Quầy bar",
      type: "Interior",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCAvz9vq18KzQEqGE9Zy_XoHCinFjY-vE6dGzkD7j36zLzP0Uo1hSaLwA5wG6rlpCQipGNk46QORkx7rO3mvZBg8JPGdoa22IZqtf2qDJ03dHqJL7_WJvNcE_1qtLXlsu-fcWnpnzN8xuW7mAjuMNHph_AJDULENdnbrMMYx2lDFZK6pGhkWTVQgOyupfF8t5B7WvkaGEgwZEuc-ODZcPrjrWHCzGJtPjLV3HHYW5hLgONf_8LvtB2nG21Q8mRJDDygkIF_"
    },
    {
      id: "media-3",
      label: "Signature brunch",
      type: "Menu",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAxLZ3_rnbq_-gwXTW5Y5qB9IuJGmuTkVeWOS7LKmzkpa9hfgIHA-xh-r1_ggdqz_NcEGjyJbr_eF0f8W-mhIFL9GZnAj7a8-0VtxA6CkuTQK2JYYgZCrJ-FDUJteZwRK3w8jRIV8f9WW5zVKntgdtLmopspn9fm8GiMf7i2Y1u5xkWpy2zSnnNUecR6HGvpHODp4SlO2c15eG_LseViKxJGp20WkB6g6mZtwE6C-p5Kq5Jq0fJXT1WGS-DW1phhyV1tt9aFf6"
    }
  ],
  menu: [
    { id: "menu-1", name: "Cold Brew Cam Quế", category: "Đồ uống", price: 69000, status: "Đang bán" },
    { id: "menu-2", name: "Brunch Trứng Bơ", category: "Thức ăn", price: 119000, status: "Best seller" },
    { id: "menu-3", name: "Latte Muối Biển", category: "Đồ uống", price: 65000, status: "Mới" }
  ],
  promotions: [
    {
      id: "promo-happy-hour",
      title: "Happy Hour Thứ 6",
      tag: "GIẢM 50%",
      type: "Giảm giá trực tiếp",
      status: "Đang chạy",
      startDate: "2026-06-14",
      endDate: "2026-06-30",
      reach: 12400,
      redemptions: 842,
      budget: 3200000
    },
    {
      id: "promo-workspace",
      title: "Combo Workspace 4 giờ",
      tag: "TẶNG BÁNH",
      type: "Combo",
      status: "Nháp",
      startDate: "2026-07-01",
      endDate: "2026-07-15",
      reach: 0,
      redemptions: 0,
      budget: 1800000
    }
  ],
  reviews: [
    {
      id: "review-1",
      author: "An Nhiên",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1jgUEkevjwKfwnjMxPZd5a7I8KNDulIm5uNEiqAUzpB_qWLaM8OhEUt6HU7M4PuHl6xVJgVO6etopHkgmKRPUgyP4q-CiJf1e-noaGCQPIBSG6WRUeQMRXhAqXgHzYe4-XubONmXfA9_9c_xHYg0bpFGhjAwZ8MJraQI1qfZWZAEvnxj8uw9T3yPagcg-DQFl_mvDFEp84PD2YfWs_0J1-kxeSGq8C4BRQ7TpbjKo53W3C_-2JV3IJmS4RCc6DUeRBSgtO1EHXSY",
      rating: 5,
      date: "2026-06-18T08:20:00.000Z",
      content: "Quán sáng, nhân viên dễ thương, khu ngồi làm việc rất yên tĩnh. Mình thích nhất cold brew cam quế.",
      status: "pending",
      sentiment: "positive"
    },
    {
      id: "review-2",
      author: "Hoàng Nam",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCss2iS1g9MIawWNYtRnky7xeIsf6NTxi976iMasNL6BEdTGF2K99e_nCI2Xoe36MWLyyksdVvsjJ9Ol22YKj2ksYemTaXexchrHr8Rtg07VEN9WSmBNQLwWBB9q5joNR4P5jzM-3Pv6QMWuuFP1wRkgc2lwD3_inQ9Vf1zirkj3aPawpFFIUJHUXz5oQey_89R8q7vgP1RHwZlutSqTx1-fhN2ILSEJu5TbZv4YzQO09amZRVXH32nQLiYyJxfipTc2nQrUyra0Oc",
      rating: 3,
      date: "2026-06-16T13:15:00.000Z",
      content: "Không gian ổn nhưng cuối tuần khá đông, đợi nước hơi lâu.",
      status: "replied",
      reply: "Cảm ơn bạn Hoàng đã góp ý. Chill Coffee Hub sẽ tối ưu quy trình cuối tuần để phục vụ nhanh hơn.",
      sentiment: "neutral"
    },
    {
      id: "review-3",
      author: "Mai Chi",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB-vyuP3PWBqUeEgrzHikfa88yy7tBIyq5ewUjCgKshkwmiSnRrrRQnj_A0Mm-g468iSThNyRjVHCqFkjWqLZKg0-3xNVXc0S1pbyyXPuC2BLiEQd31JPD-uy7_s8VFuH8StgTj3gJS66YyRYcF45-xbOSCDuRuRx4yzG_Nt0oulfT_-jWixSOhpPqZdPqxHrKATj6WIijhpjtfmLSVGUOUhC0o7sX6O_uUWk_L8Iw-PrbzUV7PhpkywUO3SbT8qQsevIh0pXc-zHm8",
      rating: 5,
      date: "2026-06-15T02:05:00.000Z",
      content: "Ảnh lên rất đẹp, bàn cạnh cửa sổ đúng vibe. Mình đã lưu lại để quay lại với nhóm bạn.",
      status: "pending",
      sentiment: "positive"
    }
  ]
};

function readState() {
  try {
    const rawState = window.localStorage.getItem(BUSINESS_STATE_KEY);
    return rawState ? { ...defaultBusinessState, ...JSON.parse(rawState) } : defaultBusinessState;
  } catch {
    return defaultBusinessState;
  }
}

function writeState(state) {
  window.localStorage.setItem(BUSINESS_STATE_KEY, JSON.stringify(state));
}

export function getBusinessState() {
  return readState();
}

export function updateBusinessProfile(profile) {
  const state = readState();
  const nextState = {
    ...state,
    profile: {
      ...state.profile,
      ...profile
    }
  };
  writeState(nextState);
  return nextState.profile;
}

export function savePromotion(promotion) {
  const state = readState();
  const nextPromotion = {
    ...promotion,
    id: `promo-${Date.now()}`,
    status: promotion.status ?? "Đang chạy",
    reach: 0,
    redemptions: 0
  };
  const nextState = {
    ...state,
    promotions: [nextPromotion, ...state.promotions]
  };
  writeState(nextState);
  return nextPromotion;
}

export function replyToReview(reviewId, reply) {
  const state = readState();
  const nextState = {
    ...state,
    reviews: state.reviews.map((review) =>
      review.id === reviewId
        ? {
            ...review,
            reply,
            status: "replied"
          }
        : review
    )
  };
  writeState(nextState);
  return nextState.reviews;
}

