# ChillPlace: Project Analysis & Design Strategy

## 1. Project Identity & Vision
ChillPlace is a high-energy, "Social + Map" platform for discovering eating, drinking, check-in spots, events, and promotions. The brand personality is **young, fast, intuitive, and media-first**. 

**Core Experience Pillars:**
*   **Media-First:** Video reels, high-quality photos, and carousels are the primary content.
*   **Location-Aware:** Deep integration of maps, place chips, and proximity-based discovery.
*   **Mobile-First:** Designed primarily for on-the-go discovery, with adaptive layouts for tablet and desktop.
*   **Role-Specific:** Distinct experiences for Guest, User, Creator, Business, and Admin.

## 2. Technical Design System Foundations
The design system emphasizes a modern, vibrant aesthetic with high contrast and accessibility.

*   **Primary Palette:**
    *   `#FF6B35` (Primary Orange): Main CTA, active states, trending hashtags.
    *   `#1F4E79` (Trust Blue): Headers, dashboard structure, professional system info.
    *   `#F8FAFC` & `#FFFFFF`: Backgrounds and surface cards.
*   **Typography:** Inter or Plus Jakarta Sans (Modern Sans-Serif).
*   **Design Tokens:** 
    *   **Radius:** Large rounded corners (rounded-2xl/3xl) for a friendly, modern feel.
    *   **Shadows:** Soft, subtle elevation.
    *   **Spacing:** 16px (Mobile) / 24-32px (Desktop).

## 3. Responsive Strategy (Breakpoints)
The layout is fluid and adaptive, not just a simple scale.
*   **Mobile (390px):** Single column, bottom navigation, bottom sheets for overlays.
*   **Tablet (768px):** Multi-column grids for cards, expanded sidebar potential.
*   **Desktop (1440px):** 3-column layout (Sidebar | Main Feed | Side Panels/Map).

## 4. Key Experience Modules
Based on the documentation, the UI is divided into four major functional groups:

### A. Public Discovery (Guest/User)
*   **Home Feed:** Immersive media-first reels/posts with right-side action rails.
*   **Explore/Search:** Chip-based filtering and grid-based place discovery.
*   **Interactive Map:** Full-screen viewport with floating filters and preview sheets.
*   **Place Detail:** Rich media hero sections, ratings, and integrated mini-maps.

### B. User Ecosystem
*   **Profile & Social:** Stats tracking, favorites/saved content, and notification management.
*   **Auth Flow:** Clean, focused mobile-first login/register forms.

### C. Management Centers (Creator & Business)
*   **Creator Center:** Video upload wizards, performance analytics, and post management.
*   **Business Center:** Place profile editor (map pinning), menu/media management, and promotion/event creation.
*   **Form Pattern:** Progressive wizards for mobile; Split-view (Form | Preview) for desktop.

### D. Admin Governance
*   **Overview Dashboard:** High-level system health cards and moderation queues.
*   **Moderation Tools:** Data-heavy tables that transition to cards on mobile. Focus on speed and clarity.

## 5. Interaction & State Requirements
The project mandates a "State-aware" design. Every screen must account for:
*   **Loading:** Skeleton screens that mimic the actual layout.
*   **Empty:** Illustration + clear CTA (e.g., "Start Following" or "Add a Place").
*   **Error:** Clear messaging + retry actions.
*   **Micro-interactions:** Heart bursts (Like), Bookmark bounce (Save), Location pulse (Map).

## 6. Implementation Checklist (Design Strategy)
To align with the "Definition of Done":
1.  **Layout Shells:** Create consistent navigation (Sidebar/Bottom Nav) across roles.
2.  **Media Components:** Standardize aspect ratios (9:16 for Reels, 4:5 for Posts).
3.  **Component Library:** Build variants for all states (Hover, Active, Disabled, Loading).
4.  **Handoff Prep:** Ensure all screens have defined behaviors for different screen sizes.