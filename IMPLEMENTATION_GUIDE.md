# Step-by-Step Implementation Guide

## Phase 1: Preparation (10 minutes)

### Step 1.1: Review All Documentation
Read in this order:
1. README_SCROLLTRIGGER_FIXES.md (Overview)
2. SCROLLTRIGGER_REVIEW.md (Detailed issues)
3. SCROLLTRIGGER_CHECKLIST.md (Quick reference)

### Step 1.2: Verify Hook File
```bash
# Check that lib/useScrollTriggerAnimations.ts exists
ls -la lib/useScrollTriggerAnimations.ts

# Should see:
# -rw-r--r--  lib/useScrollTriggerAnimations.ts
```

### Step 1.3: Create Backup
```bash
# Backup original components
mkdir -p backups/components
cp components/*.tsx backups/components/
```

---

## Phase 2: Critical Fixes (1 hour)

### 2.1: Fix PrizeSection.tsx (30 minutes)

**What to fix:**
- Remove DOM elements after animation
- Kill animation tweens
- Add safety checks
- Add accessibility

**Steps:**
1. Open `components/PrizeSection.tsx`
2. Replace entire file with code from SCROLLTRIGGER_FIXES.md section "Fix: PrizeSection.tsx"
3. Verify:
   - ✅ Uses `useScrollTriggerAnimations` hook
   - ✅ Has `animationKillersRef` for cleanup
   - ✅ Creates elements only when needed
   - ✅ Removes elements in cleanup
   - ✅ Checks `prefersReducedMotion()`
   - ✅ Uses `gsapAnimateWithA11y()`
   - ✅ Uses `safeQuery()` for DOM access

**Test:**
```bash
npm run dev
# Navigate to prizes section
# Open DevTools → Memory
# Scroll up/down multiple times
# Check: Memory should NOT grow significantly
```

### 2.2: Fix EventTimeline.tsx (20 minutes)

**What to fix:**
- Remove `__alignDotsCleanup` custom property on DOM
- Fix type safety issues
- Add resize throttling
- Use proper context cleanup

**Steps:**
1. Open `components/EventTimeline.tsx`
2. Replace with code from SCROLLTRIGGER_FIXES.md section "Fix: EventTimeline.tsx"
3. Verify:
   - ✅ No `__alignDotsCleanup` custom properties
   - ✅ Uses `debounce()` or `throttle()` for resize
   - ✅ Proper TypeScript types throughout
   - ✅ Event listeners cleaned up in context

**Test:**
```bash
# Resize browser window
# No console errors about unsafe types
# Dots should align without lag
```

### 2.3: Fix GSAPSetup.tsx (10 minutes)

**What to fix:**
- Remove `ScrollTrigger.getAll().forEach(trigger => trigger.kill())`
- Proper error handling
- Safe boundary checks

**Steps:**
1. Open `components/GSAPSetup.tsx`
2. Replace with code from SCROLLTRIGGER_FIXES.md section "Fix: GSAPSetup.tsx"
3. Verify:
   - ✅ No `ScrollTrigger.getAll().forEach()` kill all
   - ✅ Has try/catch for ScrollSmoother creation
   - ✅ Boundary checks before calculations
   - ✅ Proper cleanup in return

**Test:**
```bash
# Page should load without errors
# All scroll animations still work
# No "Cannot read property of null" errors
```

---

## Phase 3: High Priority Fixes (1 hour)

### 3.1: Fix Sponsors.tsx (15 minutes)

**Changes needed:**
```diff
- toggleActions: 'play none none reverse'  ❌
+ once: true                               ✅

- Multiple ScrollTrigger.create()          ❌
+ Single coordinated trigger               ✅

- Direct DOM queries                       ❌
+ Use safeQuery()                          ✅
```

**Implementation:**
```tsx
// REPLACE OLD CODE
const setupAnimations = useCallback((ctx: gsap.Context) => {
  if (prefersReducedMotion()) {
    gsap.set('[data-scroll-section] .sponsor-tier, [data-scroll-section] .sponsor-card', {
      opacity: 1,
      y: 0,
    });
    return;
  }

  // Single trigger instead of multiple
  ScrollTrigger.create({
    trigger: sectionRef.current,
    start: 'top 75%',
    once: true,  // ✅ Only once
    onEnter: () => {
      gsapAnimateWithA11y('[data-scroll-section] .sponsor-tier', {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
      });

      gsapAnimateWithA11y('[data-scroll-section] .sponsor-card', {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.08,
        delay: 0.2,
      });
    },
  });
}, []);

useScrollTriggerAnimations(sectionRef, setupAnimations);
```

**Verify:**
- ✅ No toggleActions 'reverse'
- ✅ Uses `once: true`
- ✅ Single coordinated animation
- ✅ Accessibility supported

### 3.2: Fix Organizers.tsx (15 minutes)

**Pattern:**
```tsx
const setupAnimations = useCallback((ctx: gsap.Context) => {
  if (prefersReducedMotion()) {
    gsap.set('[data-scroll-section] .organizer-card', { opacity: 1, y: 0 });
    return;
  }

  gsapAnimateWithA11y('[data-scroll-section] .organizers-title', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
  });

  ScrollTrigger.batch('[data-scroll-section] .organizer-card', {
    trigger: '[data-scroll-section] .organizers-grid',
    start: 'top 80%',
    once: true,
    onEnter: (batch) => {
      (batch as HTMLElement[]).forEach((el, idx) => {
        gsapAnimateWithA11y(el, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: idx * 0.1,
        });
      });
    },
  });
}, []);

useScrollTriggerAnimations(sectionRef, setupAnimations);
```

### 3.3: Fix Teams.tsx (15 minutes)

**Same pattern as Organizers.tsx**
- Replace old animation code
- Use hook
- Add accessibility
- Remove toggleActions 'reverse'

### 3.4: Fix Footer.tsx (10 minutes)

**Issues:**
1. Duplicate `gsap.registerPlugin(ScrollTrigger)` - remove one
2. Remove `toggleActions: 'play none none reverse'`

```tsx
// REMOVE THIS LINE (appears twice)
gsap.registerPlugin(ScrollTrigger);  // Keep only ONE

// CHANGE THIS
toggleActions: 'play none none reverse'

// TO THIS
once: true
```

### 3.5: Fix HeroSection.tsx (10 minutes)

**Issue: SplitText not cleaned**

```tsx
let subtitleSplit: SplitText | null = null;

useEffect(() => {
  const ctx = gsap.context(() => {
    if (subtitleRef.current) {
      subtitleSplit = new SplitText(subtitleRef.current, { type: 'chars' });
      // ...
      
      // ADD THIS: Cleanup in context
      ctx.add(() => {
        subtitleSplit?.revert();
      });
    }
  }, heroRef);

  return () => {
    ctx.revert();
  };
}, []);
```

### 3.6: Fix FAQs.tsx (15 minutes)

**Remove workaround code:**
```tsx
// DELETE THIS
gsap.set('.faq-item', { autoAlpha: 1, y: 0 }); // ❌ Workaround

// REPLACE WITH HOOK
useScrollTriggerAnimations(sectionRef, setupAnimations);
```

**Add initialization styles:**
```tsx
<Card
  style={{
    opacity: 0,
    transform: 'translateY(30px)',  // Proper initial state
  }}
>
  {/* Content */}
</Card>
```

---

## Phase 4: Medium Priority Fixes (45 minutes)

### 4.1: Add Accessibility to All Remaining Components

Pattern for every component:

```tsx
import { prefersReducedMotion, gsapAnimateWithA11y } from '../lib/useScrollTriggerAnimations';

const setupAnimations = useCallback((ctx: gsap.Context) => {
  // ✅ Always add this first
  if (prefersReducedMotion()) {
    gsap.set('[selector]', { 
      // Final state values
      opacity: 1,
      y: 0,
    });
    return;
  }

  // Normal animations here...
}, []);
```

### 4.2: Add Error Handling to All DOM Queries

**Pattern:**
```tsx
// ❌ Before
const element = document.querySelector('.selector');
gsap.from(element, { /* ... */ }); // May crash!

// ✅ After
import { safeQuery } from '../lib/useScrollTriggerAnimations';

const element = safeQuery('.selector');
if (!element) return;
gsap.from(element, { /* ... */ });
```

### 4.3: Standardize Stagger Values

**Current state:**
- EventHighlights: 0.05
- Sponsors: 0.06
- Organizers: 0.1
- Teams: 0.2

**Standardize to:**
```tsx
stagger: 0.06  // Use consistently everywhere
```

### 4.4: Convert to ScrollTrigger.batch() Where Applicable

**Components that should use batch:**
- Sponsors ✅
- Organizers ✅
- Teams ✅
- FAQs ✅
- EventHighlights (already does)

**Pattern:**
```tsx
// ❌ Old way
gsap.from('.card', {
  scrollTrigger: { /* ... */ },
  stagger: 0.1,
});

// ✅ New way
ScrollTrigger.batch('.card', {
  start: 'top 80%',
  once: true,
  onEnter: (batch) => {
    (batch as HTMLElement[]).forEach((el, idx) => {
      gsapAnimateWithA11y(el, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        delay: idx * 0.06,
      });
    });
  },
});
```

---

## Phase 5: Testing (30 minutes)

### 5.1: Performance Testing

```javascript
// DevTools → Performance tab

// 1. Record 10 seconds of scrolling
// 2. Check for:
//   - FPS: Should be 55-60 (not dropping below 50)
//   - Main thread: Should be < 16ms per frame
//   - Memory: Should be stable (not growing)

// If failing, use Profiler to find bottleneck
```

### 5.2: Memory Leak Testing

```javascript
// DevTools → Memory tab

// 1. Take heap snapshot (Initial)
// 2. Scroll to animations section 20 times
// 3. Take heap snapshot (After)
// 4. Check detached DOM nodes in both

// ❌ Bad: Detached nodes grow from 10 → 100
// ✅ Good: Detached nodes stay ~10
```

### 5.3: Animation Conflict Testing

```javascript
// 1. Inspect elements with DevTools
// 2. Check no element has multiple pending animations
// 3. Rapid scroll through sections - should be smooth
// 4. Console should have 0 warnings/errors
```

### 5.4: Accessibility Testing

```javascript
// DevTools → Rendering → Emulate prefers-reduced-motion

// Test scenarios:
// 1. Page loads - elements visible
// 2. Scroll - elements instantly show (no animation)
// 3. No janky initial states
```

### 5.5: Edge Cases

```javascript
// Test these scenarios:

// 1. Rapid navigation between sections
function rapidNav() {
  document.querySelector('#sponsors').scrollIntoView();
  setTimeout(() => document.querySelector('#team').scrollIntoView(), 200);
  setTimeout(() => document.querySelector('#faqs').scrollIntoView(), 400);
}
rapidNav();
// Should have no visual glitches

// 2. Resize browser while scrolling
// Animation should still work smoothly

// 3. Very slow scrolling (mobile)
// Animations should not accumulate/conflict

// 4. Very fast scrolling
// Should handle gracefully
```

---

## Implementation Checklist

### Phase 1: Preparation ✓
- [ ] Read all documentation
- [ ] Verify hook file exists
- [ ] Create backup of components

### Phase 2: Critical Fixes (1 hour) ⏳
- [ ] PrizeSection.tsx - DOM cleanup
- [ ] EventTimeline.tsx - Type safety
- [ ] GSAPSetup.tsx - ScrollTrigger kill removal

### Phase 3: High Priority (1 hour) ⏳
- [ ] Sponsors.tsx - Single trigger
- [ ] Organizers.tsx - Hook + accessibility
- [ ] Teams.tsx - Hook + accessibility
- [ ] Footer.tsx - Duplicate removal
- [ ] HeroSection.tsx - SplitText cleanup
- [ ] FAQs.tsx - Remove workaround

### Phase 4: Medium Priority (45 min) ⏳
- [ ] Add accessibility to all components
- [ ] Add error handling for DOM queries
- [ ] Standardize stagger values
- [ ] Convert to batch where applicable

### Phase 5: Testing (30 min) ⏳
- [ ] Performance testing
- [ ] Memory leak testing
- [ ] Animation conflict testing
- [ ] Accessibility testing
- [ ] Edge case testing

---

## Common Mistakes to Avoid

### ❌ Don't forget to add data-scroll-section attribute
```tsx
// Missing attribute will break some optimizations
<section ref={sectionRef}>  // ❌ Missing

// Correct:
<section ref={sectionRef} data-scroll-section>  // ✅
```

### ❌ Don't forget null checks
```tsx
// Will crash if element not found
const el = document.querySelector('.selector');
gsap.from(el, { /* ... */ });  // ❌

// Safe:
const el = safeQuery('.selector');
if (!el) return;  // ✅
```

### ❌ Don't use toggleActions 'reverse'
```tsx
// ❌ Bad - jarring reverse animation
toggleActions: 'play none none reverse'

// ✅ Good - animate once only
once: true
```

### ❌ Don't forget to import utilities
```tsx
// ❌ Won't work
gsapAnimateWithA11y('.element', {});

// ✅ Correct
import { gsapAnimateWithA11y } from '../lib/useScrollTriggerAnimations';
gsapAnimateWithA11y('.element', {});
```

### ❌ Don't kill all ScrollTriggers globally
```tsx
// ❌ Bad - breaks all animations site-wide
ScrollTrigger.getAll().forEach(t => t.kill());

// ✅ Good - let context handle cleanup
return () => ctx.revert();
```

---

## Verification Commands

```bash
# Check for remaining issues
grep -r "toggleActions.*reverse" components/
# Should return: nothing (0 results)

grep -r "ScrollTrigger.getAll" components/
# Should return: nothing (0 results)

grep -r "as unknown as" components/
# Should return: nothing (0 results)

grep -r "document.querySelector" components/ | grep -v safeQuery
# Should return: minimal results (only initialization)

# Check TypeScript errors
npm run type-check
# Should pass with no ScrollTrigger-related errors
```

---

## Performance Before/After Targets

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Memory (after 100 scrolls) | +500MB | 0MB | ✅ |
| Scroll FPS | 20-40 | 55-60 | ✅ |
| Frame time | 20-30ms | 2-8ms | ✅ |
| Scroll lag | Noticeable | Smooth | ✅ |
| Accessibility | ❌ None | ✅ Full | ✅ |
| Type safety | 🟡 Unsafe | ✅ Safe | ✅ |
| Animation conflicts | 🟡 Multiple | ✅ Single | ✅ |

---

## Final Validation Checklist

Before deploying, verify:

- [ ] All TypeScript errors resolved
- [ ] No console warnings/errors
- [ ] 60 FPS maintained during scroll
- [ ] Memory stable (no growth over 5 minutes)
- [ ] All animations smooth and conflict-free
- [ ] prefers-reduced-motion respected
- [ ] All edge cases handled gracefully
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Mobile tested (iOS Safari, Chrome Mobile)
- [ ] Accessibility audit passed

---

## Need Help?

**If you get stuck:**

1. Check the error in console
2. Find similar pattern in SCROLLTRIGGER_FIXES.md
3. Compare your code with the fixed version
4. Look for missing imports or typos
5. Verify HTML attributes match selectors

**Common errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read property of null` | Element not found | Use `safeQuery()` + null check |
| `Cannot revert context` | Double cleanup | Ensure cleanup only in useEffect return |
| `Animation flickering` | Conflicting tweens | Ensure single animation per element |
| `Memory grows` | Elements not removed | Add cleanup function to remove DOM |
| `TypeScript errors` | Unsafe types | Remove `as unknown as` assertions |

---

## Timeline

- **Phase 1** (Prep): 10 min
- **Phase 2** (Critical): 1 hour
- **Phase 3** (High): 1 hour
- **Phase 4** (Medium): 45 min
- **Phase 5** (Test): 30 min

**Total: ~3.5 hours**

Once complete, your site will have:
✅ Zero memory leaks  
✅ Smooth 60 FPS scrolling  
✅ Full accessibility support  
✅ Type-safe animations  
✅ Better user experience  

---

**Good luck! You've got this! 🚀**

