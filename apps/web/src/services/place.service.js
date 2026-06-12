import { mockPlaces } from "../mocks/places.mock.js";
import { getOpeningStatus } from "../utils/openingStatus.js";

const SAVED_PLACES_KEY = "chillplace.savedPlaces";
const RECENT_SEARCHES_KEY = "chillplace.recentSearches";
const SELECTED_FILTERS_KEY = "chillplace.selectedFilters";

function wait(ms = 450) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

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

function normalizeText(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function applyFilters(places, params = {}) {
  let result = places.map(withComputedOpeningStatus);

  if (params.keyword) {
    const keyword = normalizeText(params.keyword);
    result = result.filter((place) => {
      const searchableText = [
        place.name,
        place.category,
        place.area,
        place.priceRange,
        ...place.tags
      ]
        .map(normalizeText)
        .join(" ");

      return searchableText.includes(keyword);
    });
  }

  if (params.category === "deal") {
    result = result.filter((place) => place.hasDeal);
  } else if (params.category && params.category !== "popular") {
    result = result.filter((place) => place.categoryId === params.category);
  }

  if (params.openNow) {
    result = result.filter((place) => getOpeningStatus(place.openingHours).isOpen);
  }

  if (params.minRating) {
    result = result.filter((place) => place.rating >= Number(params.minRating));
  }

  if (params.hasDeal) {
    result = result.filter((place) => place.hasDeal);
  }

  if (params.hasCreatorReview) {
    result = result.filter((place) => place.hasCreatorReview);
  }

  if (params.nearby) {
    result.sort((a, b) => a.distanceValue - b.distanceValue);
  }

  if (params.savedOnly) {
    const savedIds = getSavedPlaceIds();
    result = result.filter((place) => savedIds.includes(place.id));
  }

  if (params.sort === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
}

function withComputedOpeningStatus(place) {
  const openingStatus = getOpeningStatus(place.openingHours);

  return {
    ...place,
    status: openingStatus.label,
    statusCode: openingStatus.tone
  };
}

export async function getPlaces(params = {}) {
  await wait(params.delayMs);

  if (params.forceError) {
    throw new Error("Mock API error");
  }

  return applyFilters(mockPlaces, params);
}

export async function getPlaceById(placeId) {
  await wait(260);
  const place = mockPlaces.find((item) => item.id === placeId || item.slug === placeId);
  return place ? withComputedOpeningStatus(place) : null;
}

export function getSavedPlaceIds() {
  return readJson(SAVED_PLACES_KEY, []);
}

export function toggleSavedPlace(placeId) {
  const savedIds = getSavedPlaceIds();
  const nextSavedIds = savedIds.includes(placeId)
    ? savedIds.filter((savedId) => savedId !== placeId)
    : [...savedIds, placeId];

  writeJson(SAVED_PLACES_KEY, nextSavedIds);
  return nextSavedIds;
}

export function saveRecentSearch(keyword) {
  const cleanKeyword = keyword.trim();

  if (!cleanKeyword) {
    return getRecentSearches();
  }

  const nextSearches = [
    cleanKeyword,
    ...getRecentSearches().filter((item) => normalizeText(item) !== normalizeText(cleanKeyword))
  ].slice(0, 6);

  writeJson(RECENT_SEARCHES_KEY, nextSearches);
  return nextSearches;
}

export function getRecentSearches() {
  return readJson(RECENT_SEARCHES_KEY, []);
}

export function saveSelectedFilters(filters) {
  writeJson(SELECTED_FILTERS_KEY, filters);
}

export function getSelectedFilters() {
  return readJson(SELECTED_FILTERS_KEY, {
    category: "popular",
    filters: ["nearby"],
    keyword: ""
  });
}
