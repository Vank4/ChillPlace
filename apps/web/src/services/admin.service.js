const ADMIN_STATE_KEY = "chillplace.adminState";

const placeImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBSPrDS47m3rJ0Zv1n_yePcUGkAcWu9NwZLGijRUo63XF90dkY946wL4Yk7eFTFIwLHY_a_q2gTsGEivgxH3LNGgZz6nQHv_Lo6szSGGQkbpUONlIEKb1F1LIgoYzZuSFqV9NMXadWppXKlg-zawDc8UVtdzmgy9C8OOr1PStS6JfT3CLSN6aVo-iyn2cxO8yr8Utv73LWrfXcyFH7nroLU7wQ6mkf_xsWvUh4sTuu6aM5QVYt0cs2p2kaNgKT0QKugslViNfI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCwOUD49c6zKgQwGL2cl_uORfCkqfSWgKx1pLMrJ5mlVaN0E-oizJpkOJQ_vwbhLt9YpA_S2VowvEBr6LAdDkpquP2VWEsfAIcZTZ_3DpzFc2RPDhhz-tU4-bxQuQo33OJ2shpZ5Vp8smzsji7SjQdIuLJeXWqNDM8-GKUNJ3tlgQHJVAuOWZ6WRXSuvcITm5ki43_UdRXJngXO_QH5QCbPzAejegVhl_j9At8xPUsgTaS3s3X3iz42btURcXfwzD9BxbDSZhSA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAYWID7FPpgYwQG_AYGlZdTjhLw6Jh7T8IQqmhU-Y2iCcU-D9CxZkZLzJYGJwIcvCx2oKYGNe3_Hh9tr6DsgK4PAciKZ2CpBSO03BSSHFtMPMs9qKz9N0fEIsumS4E9D7N2f-DPZfXv8fzx0WSar4yXe9bcCVYD6VjPcBC-q9JxnzFXcSgWj96-X6KfVRg1_nPJo0Qyq2sThYgR-0DpcQaWX0yKSOpyqj-2P39J7X2plcNvlLJbLx0jFYcmAWLrKXz9lmw"
];

const defaultAdminState = {
  users: [
    { id: "u1", name: "Nguyễn An Nhiên", email: "annhien.creative@gmail.com", role: "Creator", status: "active", joined: "15/03/2026", initials: "AN" },
    { id: "u2", name: "Trần Minh Quân", email: "quan.business@chillplace.vn", role: "Business", status: "active", joined: "22/02/2026", initials: "MQ" },
    { id: "u3", name: "Lê Kim Chi", email: "kimchi.vibe@yahoo.com", role: "User", status: "suspended", joined: "10/01/2026", initials: "KC" },
    { id: "u4", name: "Phạm Hoàng Nam", email: "nam.pham99@outlook.com", role: "Guest", status: "active", joined: "05/04/2026", initials: "HN" },
    { id: "u5", name: "Hà Linh", email: "halinh@chillplace.vn", role: "Moderator", status: "active", joined: "18/05/2026", initials: "HL" }
  ],
  places: [
    { id: "p1", name: "Cà phê Rooftop Moon-Night", area: "Quận 1, TP. Hồ Chí Minh", rating: 4.8, status: "pending", image: placeImages[0] },
    { id: "p2", name: "The Secret Lounge & Bar", area: "Quận 3, TP. Hồ Chí Minh", rating: 5, status: "approved", image: placeImages[1] },
    { id: "p3", name: "Villa Peace Oasis", area: "Hội An, Quảng Nam", rating: 4.5, status: "pending", image: placeImages[2] }
  ],
  reports: [
    { id: "r1", title: "Khai trương ChillBar", author: "@minh_traveler", type: "Bài viết", reason: "Phản cảm", priority: "high", status: "pending", excerpt: "Chỗ này cực cháy, anh em qua ngay nhé...", image: placeImages[0] },
    { id: "r2", title: "Đánh giá tại The Bloom", author: "@user_9921", type: "Đánh giá", reason: "Spam/lừa đảo", priority: "medium", status: "pending", excerpt: "Nội dung tố cáo hành vi gian lận thương mại...", image: placeImages[1] },
    { id: "r3", title: "Hỗn chiến tại phố đi bộ", author: "@news_fast", type: "Video", reason: "Bạo lực", priority: "critical", status: "pending", excerpt: "Video ghi lại cảnh ẩu đả giữa hai nhóm thanh niên...", image: placeImages[2] }
  ],
  roleRequests: [
    { id: "q1", name: "Trần Gia Huy", targetRole: "Creator", reason: "Sáng tạo nội dung review địa điểm", status: "pending", date: "Hôm nay, 09:20" },
    { id: "q2", name: "Mộc Garden Cafe", targetRole: "Business", reason: "Xác minh chủ sở hữu địa điểm", status: "pending", date: "Hôm qua, 16:45" },
    { id: "q3", name: "Linh Chill", targetRole: "Creator", reason: "Kênh đạt 12.5k người theo dõi", status: "approved", date: "17/06/2026" }
  ],
  tags: ["#cafe", "#rooftop", "#studyspot", "#chill", "#workspace", "#dalat"],
  categories: ["Cà phê", "Nhà hàng", "Sự kiện", "Không gian làm việc", "Du lịch"]
};

export function getAdminState() {
  try {
    return { ...defaultAdminState, ...JSON.parse(localStorage.getItem(ADMIN_STATE_KEY) || "{}") };
  } catch {
    return defaultAdminState;
  }
}

export function updateAdminCollection(collection, id, changes) {
  const state = getAdminState();
  const next = {
    ...state,
    [collection]: state[collection].map((item) => item.id === id ? { ...item, ...changes } : item)
  };
  persist(next);
  return next;
}

export function addAdminTaxonomy(collection, value) {
  const state = getAdminState();
  const normalized = collection === "tags" && !value.startsWith("#") ? `#${value}` : value;
  const next = { ...state, [collection]: [...new Set([...state[collection], normalized.trim()])] };
  persist(next);
  return next;
}

export function removeAdminTaxonomy(collection, value) {
  const state = getAdminState();
  const next = { ...state, [collection]: state[collection].filter((item) => item !== value) };
  persist(next);
  return next;
}

function persist(state) {
  localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("chillplace:admin-updated", { detail: state }));
}
