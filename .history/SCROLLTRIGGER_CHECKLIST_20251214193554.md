# ScrollTrigger Quick Fix Checklist

## Issues Found: 23 Total (3 CRITICAL, 7 HIGH, 10 MEDIUM, 3 LOW)

---

## 🔴 CRITICAL (Fix First)

- [ ] **PrizeSection.tsx** - DOM Elements Never Removed
  - Location: Lines 84-130
  - Issue: 70+ coins/notes created but never deleted from DOM
  - Fix: Add `removeChild()` in cleanup + store tweens to kill
  - Impact: Massive memory leak on each scroll

- [ ] **EventTimeline.tsx** - Unsafe DOM Element Storage
  - Location: Lines 73-75
  - Issue: Using `__alignDotsCleanup` on DOM element (unsafe, causes leaks)
  - Fix: Use closure scope instead of DOM properties
  - Impact: Type errors + memory leaks

- [ ] **GSAPSetup.tsx** - Global ScrollTrigger Kill
  - Location: Line 62
  - Issue: `ScrollTrigger.getAll().forEach(trigger => trigger.kill())`
  - Fix: Remove this line - let each component cleanup
  - Impact: Breaks all scroll animations when setup unmounts

---

## 🟠 HIGH (Fix Next)

- [ ] **Footer.tsx** - Duplicate Plugin Registration
  - Location: Lines 5 & 12
  - Issue: `gsap.registerPlugin(ScrollTrigger)` called twice
  - Fix: Remove one (duplicate line)

- [ ] **Multiple Components** - toggleActions 'reverse' Bug
  - Components: Sponsors, Organizers, Teams, Footer
  - Issue: `toggleActions: 'play none none reverse'` causes reverse animations on scroll up
  - Fix: Change to `toggleActions: 'play none none none'` (or remove)

- [ ] **All Components** - Missing Error Handling
  - Issue: `document.querySelector()` returns null but code assumes element exists
  - Fix: Add null checks before using elements
  - Pattern:
    ```tsx
    const element = document.querySelector('.selector');
    if (!element) return; // Add this!
    ```

- [ ] **PrizeSection.tsx** - Conflicting Animations
  - Location: Lines 19-30 & 32-45
  - Issue: Two separate ScrollTriggers animating same elements differently
  - Fix: Consolidate into single animated timeline

- [ ] **HeroSection.tsx** - SplitText Never Cleaned
  - Issue: SplitText instance not killed on unmount
  - Fix: Add `subtitleSplit?.revert()` in cleanup

- [ ] **Sponsors.tsx** - Multiple Animations on Same Elements
  - Issue: `.sponsor-card` animated twice with different triggers
  - Fix: Remove second animation, consolidate

- [ ] **All Components** - No Accessibility (prefers-reduced-motion)
  - Issue: No check for `window.matchMedia('(prefers-reduced-motion: reduce)')`
  - Fix: Skip animations if user prefers reduced motion

---

## 🟡 MEDIUM (Fix Soon)

- [ ] **EventTimeline.tsx** - No Resize Throttling
  - Location: Lines 60-66
  - Issue: `window.addEventListener('resize', alignDots)` fires 100+ times
  - Fix: Add debounce/throttle with 150ms delay

- [ ] **PrizeSection.tsx** - Layout Thrashing
  - Location: Lines 50-75
  - Issue: Multiple `getBoundingClientRect()` in loops
  - Fix: Batch DOM reads, then batch DOM writes

- [ ] **All Components** - No Viewport Optimization
  - Issue: ScrollTriggers created even if element never visible
  - Fix: Use IntersectionObserver to only create when visible

- [ ] **All Components** - Inconsistent Stagger Values
  - Issue: `stagger: 0.05`, `0.06`, `0.1`, `0.2` across components
  - Fix: Standardize to `0.06` or `0.08` globally

- [ ] **Sponsors.tsx** - No ScrollTrigger.batch()
  - Issue: Uses ScrollTrigger.create() instead of batch
  - Fix: Use `ScrollTrigger.batch()` for better performance

- [ ] **EventHighlights.tsx** - Inconsistent Naming
  - Issue: Uses `.highlight-card` but other components use different patterns
  - Fix: Standardize CSS class naming

- [ ] **Teams.tsx** - Long Component (354 lines)
  - Issue: Too much logic, hard to maintain
  - Fix: Split into sub-components or hooks

- [ ] **GSAPSetup.tsx** - Missing Boundary Checks
  - Issue: No check for `viewport === 0` or `scrollHeight` not ready
  - Fix: Add safety guards before calculations

- [ ] **FAQs.tsx** - Workaround Code
  - Location: Line 37 `gsap.set('.faq-item', { autoAlpha: 1, y: 0 });`
  - Issue: This is a workaround for bad initial state
  - Fix: Ensure proper initial state in styles instead

- [ ] **EventTimeline.tsx** - ScrollSmoother Conflicts
  - Issue: ScrollSmoother in GSAPSetup conflicts with regular ScrollTrigger
  - Fix: Add offset calculations for smoother scroll

---

## 🟢 LOW (Nice to Have)

- [ ] **PrizeSection.tsx** - Dead Code
  - Issue: `green`, `darkGreen`, `gold`, `lightGold` defined but not used
  - Fix: Remove unused variables

- [ ] **All Components** - Inconsistent Error Logging
  - Issue: Some errors logged, some silently fail
  - Fix: Standardize error handling with console.warn/error

- [ ] **Code Comments** - Missing Explanations
  - Issue: Complex logic lacks comments
  - Fix: Add comments for GSAP context usage and cleanup

---

## 📊 Component Status

| Component | Issues | Priority | Est. Time |
|-----------|--------|----------|-----------|
| PrizeSection.tsx | 6 | CRITICAL | 45 min |
| EventTimeline.tsx | 4 | CRITICAL | 30 min |
| GSAPSetup.tsx | 3 | CRITICAL | 15 min |
| Sponsors.tsx | 4 | HIGH | 25 min |
| Organizers.tsx | 3 | HIGH | 20 min |
| Teams.tsx | 3 | HIGH | 20 min |
| FAQs.tsx | 2 | HIGH | 15 min |
| Footer.tsx | 2 | HIGH | 10 min |
| HeroSection.tsx | 2 | HIGH | 15 min |
| EventHighlights.tsx | 1 | MEDIUM | 10 min |
| AboutEventDetails.tsx | 1 | MEDIUM | 10 min |

**Total Estimated Time: ~3.5 hours for complete fix**

---

## 🚀 Implementation Order

### Phase 1: CRITICAL (1 hour)
1. Fix PrizeSection cleanup
2. Fix EventTimeline custom property issue
3. Fix GSAPSetup ScrollTrigger kill
4. Create useScrollTriggerAnimations hook

### Phase 2: HIGH (1.5 hours)
5. Fix Footer duplicate registration
6. Remove toggleActions 'reverse' from 4 components
7. Add error handling to all querySelector calls
8. Fix SplitText cleanup in HeroSection
9. Add accessibility check

### Phase 3: MEDIUM (1 hour)
10. Add resize throttling
11. Add layout thrashing fixes
12. Standardize stagger values
13. Use ScrollTrigger.batch() consistently
14. Add IntersectionObserver

### Phase 4: LOW (30 min)
15. Remove dead code
16. Add comments
17. Standardize error logging

---

## Testing Checklist

After fixes, test:

- [ ] **Scroll Performance**
  - DevTools Performance tab - no jank
  - 60 FPS maintained during scroll
  - Memory doesn't grow over time

- [ ] **Memory Leaks**
  - DevTools Memory profiler - heap doesn't grow
  - Repeated navigation doesn't accumulate memory
  - Long scroll session stable

- [ ] **Edge Cases**
  - Rapid scrolling - animations stable
  - Fast navigation - no leftover animations
  - Viewport resize - layouts adjust correctly
  - Mobile viewport - animations responsive

- [ ] **Accessibility**
  - prefers-reduced-motion: skip animations
  - Keyboard navigation - works
  - Screen reader - can read content

- [ ] **Cross-Browser**
  - Chrome/Edge
  - Firefox
  - Safari
  - Mobile browsers

---

## Code Review Checklist

For each fixed component:

- [ ] Uses `useScrollTriggerAnimations` hook
- [ ] `gsap.context()` used properly
- [ ] No DOM element property storage
- [ ] All querySelector calls have null checks
- [ ] `prefersReducedMotion()` checked
- [ ] No toggleActions 'reverse'
- [ ] Cleanup function returns proper cleanup code
- [ ] TypeScript types correct
- [ ] No console errors

---

## Before & After Comparison

### BEFORE (Problem Code)
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      toggleActions: 'play none none reverse', // ❌ Wrong
      onEnter: () => {
        // Multiple animations on same element
        gsap.from('.element', { /* ... */ });
      }
    });

    // No error handling
    const el = document.querySelector('.element');
    gsap.from(el, { /* ... */ }); // ❌ May be null

    // No cleanup for SplitText
    let split = new SplitText(el);
    gsap.from(split.chars, { /* ... */ });
  }, sectionRef);

  return () => ctx.revert();
}, []);
```

### AFTER (Fixed Code)
```tsx
const setupAnimations = useCallback((ctx: gsap.Context) => {
  if (prefersReducedMotion()) {
    gsap.set('.element', { opacity: 1, y: 0 });
    return;
  }

  // Single coordinated trigger
  ScrollTrigger.create({
    trigger: sectionRef.current,
    start: 'top 80%',
    once: true, // ✅ Only animate once
    onEnter: () => {
      gsapAnimateWithA11y('.element', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    },
  });

  // Safe DOM query
  const el = safeQuery('.element');
  if (!el) return; // ✅ Handle null case

  // Cleanup tracked
  let split: SplitText | null = null;
  try {
    split = new SplitText(el);
    gsap.from(split.chars, { /* ... */ });

    // Cleanup in context
    ctx.add(() => {
      split?.revert(); // ✅ Kill SplitText
    });
  } catch (error) {
    console.warn('SplitText initialization failed:', error);
  }
}, []);

useScrollTriggerAnimations(sectionRef, setupAnimations);
```

---

## Helper Functions Reference

### Safe DOM Queries
```tsx
// ✅ USE THESE
const element = safeQuery('.selector');
const elements = safeQueryAll('.selector');

// ❌ DON'T USE
const element = document.querySelector('.selector');
const elements = document.querySelectorAll('.selector');
```

### Animations with Accessibility
```tsx
// ✅ USE THIS
gsapAnimateWithA11y('.element', {
  y: 0,
  opacity: 1,
  duration: 0.6,
});

// ❌ DON'T USE
gsap.to('.element', {
  y: 0,
  opacity: 1,
  duration: 0.6,
});
```

### Custom Hook Usage
```tsx
// ✅ USE THIS
const setupAnimations = useCallback((ctx: gsap.Context) => {
  // Setup animations here
}, []);

useScrollTriggerAnimations(sectionRef, setupAnimations);

// ❌ DON'T USE
useEffect(() => {
  const ctx = gsap.context(() => {
    // Manual setup
  }, sectionRef);
  return () => ctx.revert();
}, []);
```

---

## Performance Targets

After fixes, you should see:

- **Initial Load**: < 3 seconds
- **Scroll FPS**: Consistent 60 FPS
- **Memory Usage**: Stable (no growth on scroll)
- **Bundle Size**: +~2KB (hook utility)
- **Animation Performance**: No jank or stuttering

---

## Questions?

Refer to:
1. **SCROLLTRIGGER_REVIEW.md** - Detailed analysis of each issue
2. **SCROLLTRIGGER_FIXES.md** - Complete implementation examples
3. **GSAP Docs**: https://gsap.com/docs/
4. **ScrollTrigger Guide**: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

