const CREATOR_DRAFT_KEY = "chillplace.creatorDraft";
const CREATOR_POSTS_KEY = "chillplace.creatorPosts";

const defaultCoverImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCwOUD49c6zKgQwGL2cl_uORfCkqfSWgKx1pLMrJ5mlVaN0E-oizJpkOJQ_vwbhLt9YpA_S2VowvEBr6LAdDkpquP2VWEsfAIcZTZ_3DpzFc2RPDhhz-tU4-bxQuQo33OJ2shpZ5Vp8smzsji7SjQdIuLJeXWqNDM8-GKUNJ3tlgQHJVAuOWZ6WRXSuvcITm5ki43_UdRXJngXO_QH5QCbPzAejegVhl_j9At8xPUsgTaS3s3X3iz42btURcXfwzD9BxbDSZhSA";

const fallbackCreatorPosts = [
  {
    id: "creator-post-rooftop-cafe",
    title: "Cafe sân thượng ngắm hoàng hôn cực chill",
    content:
      "Một góc nhỏ nhiều nắng, nhạc vừa đủ nhẹ và view thành phố rất hợp để hẹn bạn cuối tuần.",
    status: "published",
    publishedAt: "2026-06-16T08:30:00.000Z",
    updatedAt: "2026-06-16T08:30:00.000Z",
    place: {
      name: "Rooftop Saigon",
      area: "Quận 1, TP.HCM",
      category: "Cafe"
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSPrDS47m3rJ0Zv1n_yePcUGkAcWu9NwZLGijRUo63XF90dkY946wL4Yk7eFTFIwLHY_a_q2gTsGEivgxH3LNGgZz6nQHv_Lo6szSGGQkbpUONlIEKb1F1LIgoYzZuSFqV9NMXadWppXKlg-zawDc8UVtdzmgy9C8OOr1PStS6JfT3CLSN6aVo-iyn2cxO8yr8Utv73LWrfXcyFH7nroLU7wQ6mkf_xsWvUh4sTuu6aM5QVYt0cs2p2kaNgKT0QKugslViNfI",
    metrics: {
      views: 12800,
      likes: 1840,
      comments: 86,
      saves: 412,
      shares: 132
    },
    hashtags: ["CafeSgon", "Sunset", "Rooftop"]
  },
  {
    id: "creator-post-dalat-forest",
    title: "Sáng sớm trong rừng Đà Lạt",
    content:
      "Không khí lạnh, ánh sáng xuyên qua tán cây và cảm giác đi rất chậm giữa thành phố mù sương.",
    status: "published",
    publishedAt: "2026-06-13T01:20:00.000Z",
    updatedAt: "2026-06-13T01:20:00.000Z",
    place: {
      name: "Đồi thông Đà Lạt",
      area: "Đà Lạt, Lâm Đồng",
      category: "Outdoor"
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYWID7FPpgYwQG_AYGlZdTjhLw6Jh7T8IQqmhU-Y2iCcU-D9CxZkZLzJYGJwIcvCx2oKYGNe3_Hh9tr6DsgK4PAciKZ2CpBSO03BSSHFtMPMs9qKz9N0fEIsumS4E9D7N2f-DPZfXv8fzx0WSar4yXe9bcCVYD6VjPcBC-q9JxnzFXcSgWj96-X6KfVRg1_nPJo0Qyq2sThYgR-0DpcQaWX0yKSOpyqj-2P39J7X2plcNvlLJbLx0jFYcmAWLrKXz9lmw",
    metrics: {
      views: 9400,
      likes: 1320,
      comments: 54,
      saves: 388,
      shares: 91
    },
    hashtags: ["DalatVibe", "Morning", "Nature"]
  },
  {
    id: "creator-post-workspace",
    title: "Một góc làm việc yên tĩnh giữa trung tâm",
    content:
      "Không gian sáng, ổ điện đủ dùng và bàn rộng nên rất hợp để đổi gió khi cần tập trung.",
    status: "scheduled",
    publishedAt: "2026-06-20T03:00:00.000Z",
    updatedAt: "2026-06-17T10:15:00.000Z",
    place: {
      name: "The Study Room",
      area: "Quận 3, TP.HCM",
      category: "Workspace"
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAvz9vq18KzQEqGE9Zy_XoHCinFjY-vE6dGzkD7j36zLzP0Uo1hSaLwA5wG6rlpCQipGNk46QORkx7rO3mvZBg8JPGdoa22IZqtf2qDJ03dHqJL7_WJvNcE_1qtLXlsu-fcWnpnzN8xuW7mAjuMNHph_AJDULENdnbrMMYx2lDFZK6pGhkWTVQgOyupfF8t5B7WvkaGEgwZEuc-ODZcPrjrWHCzGJtPjLV3HHYW5hLgONf_8LvtB2nG21Q8mRJDDygkIF_",
    metrics: {
      views: 0,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0
    },
    hashtags: ["Workspace", "Focus", "HiddenGem"]
  }
];

const fallbackCreatorDrafts = [
  {
    id: "creator-draft-hidden-brunch",
    title: "Brunch cuối tuần trong hẻm nhỏ",
    content:
      "Cần thêm vài dòng về món nên thử, mức giá và thời điểm quán đẹp nhất trong ngày.",
    updatedAt: "2026-06-17T06:45:00.000Z",
    place: {
      name: "Maison Brunch",
      area: "Thảo Điền, TP.HCM",
      category: "Restaurant"
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxLZ3_rnbq_-gwXTW5Y5qB9IuJGmuTkVeWOS7LKmzkpa9hfgIHA-xh-r1_ggdqz_NcEGjyJbr_eF0f8W-mhIFL9GZnAj7a8-0VtxA6CkuTQK2JYYgZCrJ-FDUJteZwRK3w8jRIV8f9WW5zVKntgdtLmopspn9fm8GiMf7i2Y1u5xkWpy2zSnnNUecR6HGvpHODp4SlO2c15eG_LseViKxJGp20WkB6g6mZtwE6C-p5Kq5Jq0fJXT1WGS-DW1phhyV1tt9aFf6",
    completion: 72,
    missingItems: ["Thêm ảnh bìa", "Gắn hashtag"]
  },
  {
    id: "creator-draft-night-walk",
    title: "Đi bộ đêm quanh bờ sông",
    content:
      "Phần cảm nhận đã ổn, cần kiểm tra lại địa điểm và thêm ảnh ngang cho mobile.",
    updatedAt: "2026-06-15T13:10:00.000Z",
    place: {
      name: "Bến Bạch Đằng",
      area: "Quận 1, TP.HCM",
      category: "Check-in"
    },
    imageUrl: defaultCoverImage,
    completion: 58,
    missingItems: ["Chọn địa điểm chính", "Viết mô tả dài hơn"]
  }
];

function readJson(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCreatorDraft() {
  return readJson(CREATOR_DRAFT_KEY, null);
}

export function saveCreatorDraft(draft) {
  const nextDraft = {
    ...draft,
    updatedAt: new Date().toISOString()
  };

  writeJson(CREATOR_DRAFT_KEY, nextDraft);
  return nextDraft;
}

export function clearCreatorDraft() {
  window.localStorage.removeItem(CREATOR_DRAFT_KEY);
}

export function getCreatorPosts() {
  return readJson(CREATOR_POSTS_KEY, []);
}

export function getCreatorPostList() {
  const storedPosts = getCreatorPosts().map((post) => ({
    ...post,
    imageUrl: post.imageUrl ?? post.media?.[0]?.previewUrl ?? defaultCoverImage,
    metrics: {
      views: 0,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      ...post.metrics
    }
  }));

  return [...storedPosts, ...fallbackCreatorPosts];
}

export function getCreatorDraftList() {
  const currentDraft = getCreatorDraft();
  const activeDraft =
    currentDraft && (currentDraft.title || currentDraft.content || currentDraft.selectedPlaceId)
      ? [
          {
            id: "creator-draft-current",
            title: currentDraft.title || "Bản nháp đang viết",
            content: currentDraft.content || "Anh đang có một bản nháp được lưu tự động.",
            updatedAt: currentDraft.updatedAt,
            place: {
              name: currentDraft.locationKeyword || "Chưa chọn địa điểm",
              area: "Creator Center",
              category: "Draft"
            },
            imageUrl: defaultCoverImage,
            completion: getDraftCompletion(currentDraft),
            missingItems: getDraftMissingItems(currentDraft),
            isCurrent: true
          }
        ]
      : [];

  return [...activeDraft, ...fallbackCreatorDrafts];
}

export async function publishCreatorPost(post) {
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  const nextPost = {
    ...post,
    id: `creator-post-${Date.now()}`,
    status: "published",
    publishedAt: new Date().toISOString()
  };

  writeJson(CREATOR_POSTS_KEY, [nextPost, ...getCreatorPosts()]);
  clearCreatorDraft();
  return nextPost;
}

function getDraftCompletion(draft) {
  const score = [
    draft.title,
    draft.content && draft.content.trim().split(/\s+/).length >= 20,
    draft.selectedPlaceId,
    draft.hashtags?.length
  ].filter(Boolean).length;

  return Math.max(18, score * 22);
}

function getDraftMissingItems(draft) {
  const missingItems = [];

  if (!draft.title) missingItems.push("Thêm tiêu đề");
  if (!draft.content || draft.content.trim().split(/\s+/).length < 20) {
    missingItems.push("Viết nội dung chi tiết hơn");
  }
  if (!draft.selectedPlaceId) missingItems.push("Gắn địa điểm");
  if (!draft.hashtags?.length) missingItems.push("Thêm hashtag");

  return missingItems.slice(0, 2);
}
