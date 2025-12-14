# ScrollTrigger Review - Complete Analysis & Issues Found

## ⚠️ CRITICAL ISSUES

### 1. **Memory Leaks & Cleanup Issues**

#### Problem in Multiple Components:
- **EventTimeline.tsx**: Uses custom property `__alignDotsCleanup` on DOM element to store cleanup function
  - **Issue**: Storing functions on DOM elements causes memory leaks and type safety issues
  - **Code**:
    ```tsx
    (container as unknown as { __alignDotsCleanup?: () => void }).__alignDotsCleanup = () => {
      // ...
    };
    ```

#### Issues Found:
1. **Unsafe type assertions** - `as unknown as` breaks TypeScript safety
2. **No guarantee cleanup runs** - If component unmounts before cleanup function is saved, it won't execute
3. **DOM pollution** - Adding custom properties to DOM elements is bad practice

---

### 2. **ScrollTrigger Registration Duplication**

#### Problem: Multiple registrations in Footer.tsx
```tsx
gsap.registerPlugin(ScrollTrigger);
import Image from 'next/image';
// ...
gsap.registerPlugin(ScrollTrigger); // DUPLICATE!
```

**Impact**: Redundant calls, potential issues with plugin initialization

---

### 3. **No Error Handling for DOM Queries**

#### Found in:
- **PrizeSection.tsx** (Lines 31-167)
- **EventTimeline.tsx** (Lines 32-76)
- **Sponsors.tsx**
- **Organizers.tsx**
- **Teams.tsx**
- **FAQs.tsx**

#### Issue:
```tsx
const amountEl = document.querySelector('.prize-amount') as HTMLElement | null;
if (amountEl) {
  // Only checks if element exists, but runs SAME animation multiple times on scroll
}
```

**Problem**: If selector doesn't match anything, animations silently fail or cause runtime errors

---

### 4. **Multiple ScrollTrigger.create() Instances Without Unique Identifiers**

#### Problem in PrizeSection.tsx:
- Line 19: `ScrollTrigger.create({ trigger: sectionRef.current, ... })`
- Line 34: `ScrollTrigger.create({ trigger: amountEl, ... })`

**Issue**: Two separate ScrollTriggers on same/overlapping elements
- Can cause competing animations
- Difficult to clean up properly
- No IDs for tracking

---

### 5. **toggleActions Causing Reverse Animations**

#### Found in Multiple Components:
```tsx
toggleActions: 'play none none reverse'  // Organizers, Teams, Sponsors, etc.
```

**Issues**:
1. Animation reverses when scrolling up (jarring UX)
2. Conflicts with `once: true` in some components
3. Inconsistent across components
4. Can cause flickering if user rapidly scrolls

---

### 6. **Race Conditions: Missing onComplete Cleanup**

#### PrizeSection.tsx (Lines 95-105):
```tsx
onComplete: () => {
  const finalX = gsap.utils.random(leftBound, rightBound);
  const finalY = floorY - gsap.utils.random(6, pr.height * 0.25);
  gsap.set(coin, { left: `${finalX}px`, top: `${finalY}px`, x: 0, y: 0 });
  coin.style.opacity = '1';
}
```

**Issues**:
1. **DOM elements never removed** - 70 coins + notes created but never cleaned up
2. **Memory accumulation** - Each scroll trigger creates new elements
3. **Potential layout thrashing** - Dynamic style changes without batching

---

### 7. **Inconsistent Animation Cleanup**

#### GSAPSetup.tsx (Lines 61-62):
```tsx
ScrollTrigger.getAll().forEach(trigger => trigger.kill());
```

**Problem**: This indiscriminately kills ALL ScrollTriggers on the page
- If multiple components use ScrollTrigger, this breaks them
- Should use `ctx.revert()` from gsap.context() instead

---

### 8. **No Protection Against Multiple Component Mounts**

#### Problem:
If component mounts/unmounts multiple times (navigation, React Strict Mode in dev):
- Old ScrollTriggers aren't cleaned properly
- New ones are created on top of old ones
- Memory usage grows exponentially

#### Example issue in Sponsors.tsx:
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    ScrollTrigger.create({ ... }); // Creates new each mount
  }, sectionRef);
  
  return () => ctx.revert(); // Only reverts context, not nested ScrollTrigger.create()
}, []);
```

---

### 9. **Unsafe DOM Measurements**

#### EventTimeline.tsx (Lines 53-65):
```tsx
const alignDots = () => {
  const axisRect = progressEl.getBoundingClientRect();
  const axisCenterX = axisRect.left + axisRect.width / 2;
  document.querySelectorAll('.timeline-item').forEach((el) => {
    const itemRect = (el as HTMLElement).getBoundingClientRect();
    // ...
  });
};
alignDots();
const onResize = () => alignDots();
window.addEventListener('resize', onResize);
```

**Issues**:
1. **No throttling/debouncing** on resize - calls alignDots on every pixel change
2. **Layout thrashing** - getBoundingClientRect() forces layout recalculation
3. **Missing cleanup** - resize listener removed in custom cleanup, not in ctx.revert()
4. **No mutation observer** - Doesn't handle dynamic DOM changes

---

### 10. **Physics2D Plugin Memory Leak**

#### PrizeSection.tsx (Lines 84-93, 122-130):
```tsx
gsap.to(coin, {
  physics2D: {
    velocity: gsap.utils.random(280, 520),
    angle: gsap.utils.random(80, 100),
    gravity: gsap.utils.random(900, 1200),
  },
  rotation: gsap.utils.random(-360, 360),
  duration: gsap.utils.random(1.0, 1.8),
  ease: 'none',
  onComplete: () => {
    // Coins/notes added to DOM but never removed
  },
});
```

**Issues**:
1. **70+ elements per animation** never garbage collected
2. **No animation kill** - Elements remain in DOM forever
3. **Cumulative performance degradation** - Each scroll trigger adds more elements

---

### 11. **Missing Boundary Checks**

#### GSAPSetup.tsx (Line 35):
```tsx
const ratio = Math.max(viewport / scrollHeight, 0.05); // min thumb size
```

**Missing checks for**:
1. What if `viewport === 0`? (before page load)
2. What if `scrollHeight` is not fully loaded?
3. What if ScrollSmoother hasn't initialized yet?

---

### 12. **SplitText Not Killed**

#### HeroSection.tsx (Lines 46-55):
```tsx
let subtitleSplit: SplitText | null = null;
if (subtitleRef.current) {
  subtitleSplit = new SplitText(subtitleRef.current, { type: 'chars' });
  gsap.from(subtitleSplit.chars, {
    duration: 1.2,
    // ...
  });
}
```

**Issue**: `subtitleSplit.revert()` is never called
- Text nodes remain split
- Memory not released if component unmounts

---

### 13. **Conflicting Animation Targets**

#### Sponsors.tsx (Lines 32-45):
```tsx
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.to(['.sponsors-title', '.sponsor-tier', '.sponsor-card'], {
      y: 0,
      opacity: 1,
      // ...
    });
  }
});

// Later...
gsap.from('.sponsor-card', {
  scrollTrigger: {
    trigger: '.sponsors-grid',
    start: 'top 75%', // Different trigger!
    toggleActions: 'play none none reverse',
  },
  scale: 0.8,
  opacity: 0,
  // ...
});
```

**Problem**: 
- Same elements (`.sponsor-card`) have TWO animations
- Different start points and directions
- Can conflict and cause flickering

---

### 14. **No Viewport Checking**

#### Problem across ALL components:
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // No check if component is in viewport before creating animations
    ScrollTrigger.create({ ... });
  }, sectionRef);
}, []);
```

**Issue**: 
- Animations created even if section never visible
- Wastes memory and CPU
- Especially bad on mobile with many sections

---

### 15. **ScrollSmoother Incompatibility**

#### GSAPSetup.tsx uses ScrollSmoother but other components use regular ScrollTrigger
```tsx
const smoother = ScrollSmoother.create({ ... });
// Then in Sponsors.tsx, Organizers.tsx, etc:
gsap.from(element, {
  scrollTrigger: { ... }
});
```

**Issues**:
1. ScrollSmoother changes scroll behavior
2. Regular ScrollTrigger.create() runs on different scroll events
3. Measurements might be off due to smoothing lag
4. Potential race conditions between scroll and smooth scroll

---

## 🔴 MAJOR ISSUES

### 16. **No Batch Consolidation**

Some components use ScrollTrigger.batch(), others don't:
- **FAQs.tsx, EventHighlights.tsx**: Use batch ✅
- **Sponsors.tsx, Organizers.tsx, Teams.tsx**: Don't use batch ❌

**Impact**: Inconsistent performance and memory usage

---

### 17. **Missing autoAlpha Reset**

#### FAQs.tsx (Line 37):
```tsx
gsap.set('.faq-item', { autoAlpha: 1, y: 0 }); // Workaround!
```

**Issue**: Shouldn't need this reset. Indicates underlying animation issue.

---

### 18. **Stagger Timing Inconsistencies**

Different components use different stagger values:
- `stagger: 0.05` (EventHighlights)
- `stagger: 0.06` (Sponsors, EventTimeline)
- `stagger: 0.1` (Organizers)
- `stagger: 0.2` (Teams)

**Impact**: Inconsistent visual experience

---

### 19. **No Accessibility Considerations**

```tsx
// No check for prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Skip animations for users who prefer reduced motion
}
```

**Issue**: Users with accessibility needs get full animations anyway

---

### 20. **Unused Variables & Dead Code**

#### PrizeSection.tsx (Line 58):
```tsx
const green = '#22c55e';
const darkGreen = '#16a34a';
const gold = '#f59e0b';
const lightGold = '#fbbf24';
```

All color variables defined but logic doesn't use them properly. Colors are hardcoded in other places.

---

## 🟡 PERFORMANCE ISSUES

### 21. **Repeated querySelector Calls**

#### Multiple components perform expensive queries every animation:
```tsx
const amountEl = document.querySelector('.prize-amount');
const poolLayer = document.querySelector('.prize-pool-layer');
const pool = document.querySelector('.prize-pool');
```

**Better approach**: Cache selectors outside useEffect or use refs

---

### 22. **Missing Viewport/Intersection Observer**

No checks for:
- Is element in viewport?
- Is element visible?
- Should animation run?

**Fix**: Use Intersection Observer to only create ScrollTrigger when element visible

---

### 23. **Browser Layout Thrashing**

#### EventTimeline.tsx & PrizeSection.tsx:
Calling `getBoundingClientRect()` and `style` changes in tight loops without batching

**Fix**: Use gsap.batch() or requestAnimationFrame to batch DOM reads/writes

---

## 📋 SUMMARY TABLE

| Issue | Severity | Components Affected | Fix Difficulty |
|-------|----------|-------------------|-----------------|
| Memory leaks (DOM not cleaned) | CRITICAL | PrizeSection | High |
| Type safety issues | CRITICAL | EventTimeline | Medium |
| Duplicate ScrollTrigger kills | CRITICAL | All (via GSAPSetup) | High |
| Multiple animations on same elements | CRITICAL | Sponsors, FAQs | High |
| No error handling for DOM queries | HIGH | All components | Low |
| toggleActions conflicts | HIGH | Sponsors, Organizers, Teams, Footer | Medium |
| Unsafe DOM measurements | HIGH | EventTimeline | Medium |
| SplitText not cleaned | HIGH | HeroSection | Low |
| No accessibility support | HIGH | All | Medium |
| Conflicting scroll events (ScrollSmoother) | HIGH | All | High |
| Layout thrashing | MEDIUM | EventTimeline, PrizeSection | High |
| No viewport optimization | MEDIUM | All | High |
| Stagger inconsistencies | MEDIUM | All | Low |
| Dead code & unused variables | LOW | PrizeSection | Low |

---

## ✅ WHAT'S DONE CORRECTLY

1. ✅ Using `gsap.context()` for cleanup (mostly)
2. ✅ Some components use `ScrollTrigger.batch()` (FAQs, EventHighlights)
3. ✅ `once: true` used to prevent multiple triggers
4. ✅ Proper TypeScript types in some places

---

## 🔧 RECOMMENDED FIXES (Priority Order)

### P0 (Do Immediately):
1. Fix PrizeSection DOM cleanup - kill animations and remove elements
2. Remove duplicate ScrollTrigger.registerPlugin() calls
3. Fix EventTimeline custom cleanup pattern
4. Stop killing all ScrollTriggers in GSAPSetup

### P1 (Do Soon):
5. Add error handling for all querySelector calls
6. Remove toggleActions 'reverse' - use 'none'
7. Consolidate conflicting animations
8. Clean up SplitText instances

### P2 (Do Next):
9. Add prefers-reduced-motion support
10. Add Intersection Observer for viewport optimization
11. Cache DOM queries
12. Standardize stagger timing
13. Add resize/scroll event throttling

