

## Multi-Feature Update Plan

### Summary of Changes
1. **Remove Footer** from all pages
2. **Add Dark Mode** toggle
3. **Mobile bottom navigation** bar (Home, Menu, Deals, About, Contact)
4. **Contact page** — rearrange layout, make Reorder bigger/more attractive
5. **Home page** — move Reorder into hero, remove PromoMarquee banner, make Explore Menu cards bigger/more attractive, enhance Best Sellers and Top Deals with visual depth
6. **Add dark mode CSS variables** to `index.css`

---

### 1. Dark Mode Support (`src/index.css`)
Add `.dark` CSS variables block with dark backgrounds, inverted foregrounds, dark cards, and matching borders. Keep primary red the same.

### 2. Dark Mode Toggle (`src/components/Navigation.tsx`)
Add a sun/moon toggle button in the navbar (desktop + mobile) using the existing `ThemeToggle` component.

### 3. Remove Footer from All Pages
Remove `<Footer />` from:
- `src/pages/Index.tsx`
- `src/pages/Menu.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/Deals.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/OrderHistory.tsx`
- `src/pages/Favorites.tsx`
- `src/pages/SavedAddresses.tsx`

### 4. Mobile Bottom Navigation Bar (`src/components/BottomNav.tsx`)
Create a new fixed bottom nav bar visible only on mobile (`lg:hidden`):
- 5 icons+labels: Home, Menu, Deals, About, Contact
- Active state uses primary color
- White/dark bg with top border and shadow
- Include in `App.tsx` or each page layout

### 5. Home Page Changes (`src/pages/Index.tsx` + `src/components/Hero.tsx`)
- **Remove** the `PromoMarquee` and `WaveDivider` components entirely
- **Move Reorder** button inside the hero carousel area (below the banner CTA or as a floating button)
- So the flow is: Hero (with Reorder) → Explore Menu → Best Sellers → Ramadan Deals → Top Deals

### 6. Explore Menu Enhancement (`src/components/MenuCategories.tsx`)
- Make category circles **bigger** (w-28 h-28 on desktop, w-22 h-22 on mobile)
- Add card-like background behind each category with subtle shadow and hover glow
- Make images fill more of the circle
- Add a subtle gradient or colored ring on hover

### 7. Best Sellers Enhancement (`src/components/SignatureItems.tsx`)
- Add a subtle warm/red gradient background behind the section
- Increase card shadow depth, add hover scale effect
- Make food images larger
- Add a decorative pattern or diagonal stripe accent

### 8. Top Deals Enhancement (`src/components/TopDeals.tsx`)
- Add subtle background gradient/pattern
- Give cards more depth with stronger shadows and colored left-border accent
- Larger images, bolder price display

### 9. Contact Page Rearrange (`src/pages/ContactPage.tsx`)
- Make Reorder section prominent — big card at top or bottom with eye-catching red bg, large button
- Rearrange contact cards to be bigger with more spacing
- Make the WhatsApp CTA more prominent

---

### Files to Change

| File | Change |
|------|--------|
| `src/index.css` | Add dark mode CSS variables |
| `src/components/Navigation.tsx` | Add ThemeToggle button |
| `src/components/BottomNav.tsx` | **New** — Mobile bottom tab bar |
| `src/pages/Index.tsx` | Remove Footer, PromoMarquee, WaveDivider |
| `src/components/Hero.tsx` | Integrate Reorder inside hero |
| `src/components/MenuCategories.tsx` | Bigger circles, more visual depth |
| `src/components/SignatureItems.tsx` | Background accent, bigger images, stronger cards |
| `src/components/TopDeals.tsx` | Background pattern, stronger card styling |
| `src/pages/ContactPage.tsx` | Remove Footer, rearrange, bigger Reorder |
| `src/pages/Menu.tsx` | Remove Footer |
| `src/pages/Deals.tsx` | Remove Footer |
| `src/pages/AboutPage.tsx` | Remove Footer |
| `src/pages/OrderHistory.tsx` | Remove Footer |
| `src/pages/Favorites.tsx` | Remove Footer |
| `src/pages/SavedAddresses.tsx` | Remove Footer |
| `src/App.tsx` | Add BottomNav globally |

