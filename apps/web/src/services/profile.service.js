import { mockCurrentUser } from "../data/mockFeed.js";
import { getAuthSession } from "./auth.service.js";

const USER_PROFILE_KEY = "chillplace.userProfile";

const defaultProfile = {
  name: "Minh Nguyễn",
  username: "minh_chill",
  bio: "Tìm kiếm những góc chill bí ẩn giữa lòng Sài Gòn.",
  location: "TP. Hồ Chí Minh",
  membership: "Thành viên",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDajcqUKVr1xes3NrQelC9yqegPthDRcsXT1rVOS2kGCIqb8Fwxaler5B3rXuRus5GvY6P0_xmz83EVwk6hNE2_XQUEjOMck8bfiW1xajoMKpWKNs1Y4CFUdH4JrdOjIKgLJLUv4k0NCvHncPnVpu1GWspppdV3FI8FpZI4Q_yniQe0IUAv2vjRX29wzmfiZDyhiOUUbTX4Etbd_OEhIfBrdVS1rgLf-IVsdjEekdEg5Rike1jbF8j5YBafpywYUC8jaZ6OPMDPJWA",
  coverUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAFu4UNjEx8YRRlkTBLtHFKTV0-8TjyaSMPIihzVZNF44d9zmNGyyAK6kqklbwAfYYEuevD4-q_R8V1Xb8qaAHYcleXABoextHVuTq531gJM15zfd-WcIHGHf_IcuwFVXWzNxIg1pk7Ehsj3Itp9Wck-ZkdQRC3JxXp8sfnDtk2pTYwrBrsHaVY8xvOfGeW8DOVysuJ8hla-H8mH-RVLg4uFd0FmJPMZg-JIfCMnfYMH5VzwTMamAGIFr94qvl9qfsbjvVPrqmrMt4",
  stats: {
    posts: 12,
    followers: "1.2k",
    following: 850
  }
};

function readStoredProfile() {
  try {
    const rawProfile = window.localStorage.getItem(USER_PROFILE_KEY);
    return rawProfile ? JSON.parse(rawProfile) : null;
  } catch {
    return null;
  }
}

export function getUserProfile() {
  const sessionUser = getAuthSession()?.user;
  const storedProfile = readStoredProfile();

  return {
    ...defaultProfile,
    name: sessionUser?.name ?? storedProfile?.name ?? defaultProfile.name,
    username:
      sessionUser?.username ??
      storedProfile?.username ??
      mockCurrentUser.username ??
      defaultProfile.username,
    ...storedProfile,
    stats: {
      ...defaultProfile.stats,
      ...storedProfile?.stats
    }
  };
}

export async function updateUserProfile(profile) {
  await new Promise((resolve) => window.setTimeout(resolve, 500));

  const nextProfile = {
    ...getUserProfile(),
    ...profile,
    stats: getUserProfile().stats,
    updatedAt: new Date().toISOString()
  };

  window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(nextProfile));
  window.dispatchEvent(new CustomEvent("chillplace:profile-updated"));
  return nextProfile;
}

