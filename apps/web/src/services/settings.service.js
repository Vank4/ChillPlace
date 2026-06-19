const USER_SETTINGS_KEY = "chillplace.userSettings";

export const defaultUserSettings = {
  pushNotifications: true,
  emailNotifications: true,
  systemUpdates: true,
  locationSharing: true,
  activityStatus: false,
  darkMode: false,
  postVisibility: "friends",
  language: "vi",
  fontSize: "medium",
  twoFactorEnabled: false
};

export function getUserSettings() {
  try {
    const storedSettings = JSON.parse(
      window.localStorage.getItem(USER_SETTINGS_KEY) ?? "{}"
    );

    return {
      ...defaultUserSettings,
      ...storedSettings
    };
  } catch {
    return defaultUserSettings;
  }
}

export function applyThemePreference(darkMode = getUserSettings().darkMode) {
  if (typeof document === "undefined") return;

  const nextTheme = darkMode ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
}

export function initializeThemePreference() {
  applyThemePreference(getUserSettings().darkMode);
}

export async function updateUserSettings(nextSettings) {
  await new Promise((resolve) => window.setTimeout(resolve, 260));

  const settings = {
    ...getUserSettings(),
    ...nextSettings,
    updatedAt: new Date().toISOString()
  };

  window.localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));

  if (Object.prototype.hasOwnProperty.call(nextSettings, "darkMode")) {
    applyThemePreference(settings.darkMode);
  }

  window.dispatchEvent(
    new CustomEvent("chillplace:settings-updated", { detail: settings })
  );

  return settings;
}
