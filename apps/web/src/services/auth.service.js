const AUTH_SESSION_KEY = "chillplace.authSession";
const REGISTERED_USERS_KEY = "chillplace.registeredUsers";
const PASSWORD_RESET_REQUESTS_KEY = "chillplace.passwordResetRequests";

const defaultMockUsers = [
  {
    id: "u1",
    name: "Minh Nguyen",
    username: "minh_chill",
    email: "minh@chillplace.vn",
    password: "ChillPlace123",
    role: "user"
  }
];

function wait(ms = 700) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function readRegisteredUsers() {
  try {
    const rawUsers = window.localStorage.getItem(REGISTERED_USERS_KEY);
    return rawUsers ? JSON.parse(rawUsers) : [];
  } catch {
    return [];
  }
}

function getUsers() {
  return [...defaultMockUsers, ...readRegisteredUsers()];
}

function createUsername(name, email) {
  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return normalizedName || normalizeEmail(email).split("@")[0];
}

function createSession(user) {
  return {
    token: `mock-token-${user.id}-${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    },
    createdAt: new Date().toISOString()
  };
}

function saveSession(session, remember) {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export async function loginWithEmail({ email, password, remember = false }) {
  await wait();

  const user = getUsers().find((item) => normalizeEmail(item.email) === normalizeEmail(email));

  if (!user || user.password !== password) {
    throw new Error("Email hoặc mật khẩu chưa đúng. Vui lòng kiểm tra lại.");
  }

  const session = createSession(user);
  saveSession(session, remember);
  return session;
}

export async function loginWithProvider(provider) {
  await wait(550);

  const user = defaultMockUsers[0];
  const session = {
    ...createSession(user),
    provider
  };

  saveSession(session, true);
  return session;
}

export async function registerWithEmail({
  firstName,
  lastName,
  email,
  phone,
  password
}) {
  await wait(850);

  const normalizedEmail = normalizeEmail(email);

  if (getUsers().some((user) => normalizeEmail(user.email) === normalizedEmail)) {
    throw new Error("Email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác.");
  }

  const name = `${lastName.trim()} ${firstName.trim()}`.trim();
  const registeredUsers = readRegisteredUsers();
  const user = {
    id: `u${Date.now()}`,
    name,
    username: createUsername(name, email),
    email: normalizedEmail,
    phone: phone.trim(),
    password,
    role: "user"
  };

  window.localStorage.setItem(
    REGISTERED_USERS_KEY,
    JSON.stringify([...registeredUsers, user])
  );

  const session = createSession(user);
  saveSession(session, true);
  return session;
}

export async function requestPasswordReset(email) {
  await wait(750);

  const normalizedEmail = normalizeEmail(email);
  const userExists = getUsers().some(
    (user) => normalizeEmail(user.email) === normalizedEmail
  );

  if (userExists) {
    let requests = [];

    try {
      const rawRequests = window.localStorage.getItem(PASSWORD_RESET_REQUESTS_KEY);
      requests = rawRequests ? JSON.parse(rawRequests) : [];
    } catch {
      requests = [];
    }

    const nextRequest = {
      id: `reset-${Date.now()}`,
      email: normalizedEmail,
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };

    window.localStorage.setItem(
      PASSWORD_RESET_REQUESTS_KEY,
      JSON.stringify([nextRequest, ...requests].slice(0, 10))
    );
  }

  return {
    email: normalizedEmail,
    message:
      "Nếu email thuộc một tài khoản ChillPlace, liên kết đặt lại mật khẩu sẽ được gửi trong vài phút."
  };
}

export function getAuthSession() {
  const rawSession =
    window.localStorage.getItem(AUTH_SESSION_KEY) ??
    window.sessionStorage.getItem(AUTH_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    return null;
  }
}

export function logout() {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
}
