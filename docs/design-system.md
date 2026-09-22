# Design System Documentation

## Vision

This design system establishes a production-ready foundation for the Estate Car Wash SaaS platform. It provides a consistent, scalable, and maintainable set of UI components that every future page will follow.

## Design Principles

1. **Accessibility First**: All components must be fully accessible with proper ARIA labels, keyboard navigation, and screen reader support.

2. **Responsive by Default**: Components work seamlessly across all device sizes and orientations.

3. **Consistent Spacing**: Use systematic spacing scale for predictable layouts.

4. **Semantic HTML**: Components use proper HTML semantics for better SEO and maintainability.

5. **Type Safety**: All components are fully typed with TypeScript.

6. **Performance Optimized**: Components are optimized for render performance.

## Typography

### Primary Font
- Font Family: Inter, system-ui, sans-serif
- Weights: 300 (light), 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Scale
- Display: 4xl (72px) - 2xl (20px)
- Body: lg (18px) - sm (14px)
- Caption: xs (12px) - 2xs (10px)

### Line Heights
- Display: 1.1
- Body: 1.5
- Tight: 1.25

## Color System

### Base Colors
- Primary: #2563eb (blue-600)
- Secondary: #64748b (slate-500)
- Background: #ffffff (white)
- Surface: #f8fafc (slate-50)
- Text: #0f172a (slate-900)
- Muted: #94a3b8 (slate-400)

### Semantic Colors
- Success: #10b981 (emerald-500)
- Warning: #f59e0b (amber-500)
- Error: #ef4444 (red-500)
- Info: #3b82f6 (blue-500)

## Radius

### Border Radius Scale
- none: 0px
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px
- full: 9999px

## Elevation

### Box Shadow Scale
- level-1: 0px 1px 3px rgba(0, 0, 0, 0.1)
- level-2: 0px 4px 6px rgba(0, 0, 0, 0.1)
- level-3: 0px 10px 15px rgba(0, 0, 0, 0.1)
- level-4: 0px 20px 25px rgba(0, 0, 0, 0.1)

## Spacing

### Spacing Scale
- 0: 0px
- 1: 4px
- 2: 8px
- 3: 16px
- 4: 24px
- 5: 32px
- 6: 48px
- 8: 64px
- 10: 80px
- 12: 96px

## Grid

### Layout Grid
- Columns: 12-column grid
- Gap: 16px (2)
- Container: max-width 1280px (80rem)
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## Icons

### Icon Size Scale
- xs: 12px
- sm: 16px
- md: 20px
- lg: 24px
- xl: 32px

### Icon Library
- Lucide React for all icon needs
- Consistent stroke width: 2px
- Consistent stroke linecap: round

## Cards

### Card Variants
1. **Default Card**
   - Background: white
   - Border: 1px solid #e2e8f0
   - Shadow: level-1
   - Border-radius: md

2. **Elevated Card**
   - Background: white
   - Shadow: level-3
   - Border-radius: lg

3. **Outline Card**
   - Background: transparent
   - Border: 1px solid #e2e8f0
   - Border-radius: md

## Buttons

### Button Variants
1. **Primary**
   - Background: #2563eb
   - Text: white
   - Hover: #1d4ed8
   - Focus: ring-2 ring-blue-200

2. **Secondary**
   - Background: #f1f5f9
   - Text: #0f172a
   - Hover: #e2e8f0

3. **Outline**
   - Background: transparent
   - Border: 1px solid #e2e8f0
   - Text: #0f172a
   - Hover: #f1f5f9

4. **Ghost**
   - Background: transparent
   - Text: #64748b
   - Hover: #f1f5f9

5. **Destructive**
   - Background: #fef2f2
   - Text: #dc2626
   - Hover: #fee2e2

### Button Sizes
- sm: h-7 px-3 py-1.5 text-xs
- default: h-8 px-4 py-2 text-sm
- lg: h-9 px-6 py-2.5 text-base

## Forms

### Input Fields
- Background: white
- Border: 1px solid #d1d5db
- Text: #111827
- Padding: px-3 py-2
- Border-radius: md
- Focus: border-blue-500 ring-2 ring-blue-200

### Labels
- Text: #374151 (gray-700)
- Font-size: sm
- Font-weight: medium
- Margin-bottom: 2

### Fieldsets
- Spacing: gap-4
- Alignment: vertical or horizontal

## Dropdowns

### Dropdown Menu
- Background: white
- Border-radius: md
- Shadow: level-3
- Padding: 4px

### Dropdown Items
- Height: 36px
- Padding: px-3 py-2
- Hover: bg-gray-100
- Focus: outline-none ring-2 ring-blue-200

## Tables

### Table Container
- Background: white
- Border: 1px solid #e5e7eb
- Border-radius: md
- Shadow: level-1

### Table Headers
- Background: #f9fafb
- Text: #374151
- Font-weight: medium
- Padding: py-3 px-4
- Border-bottom: 1px solid #e5e7eb

### Table Cells
- Padding: py-3 px-4
- Border-bottom: 1px solid #f3f4f6
- Hover: background-color: #f9fafb

## Empty States

### Empty State Container
- Padding: 48px (py-12)
- Border: 1px dashed #d1d5db
- Border-radius: lg
- Background: #f9fafb
- Text-align: center

### Icon Size
- Default: 48px (h-12 w-12)
- Color: #9ca3af

## Skeletons

### Skeleton Variants
1. **Text**
   - Background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)
   - Animation: wave

2. **Rectangular**
   - Background: #e5e7eb
   - Animation: pulse

3. **Circular**
   - Border-radius: full
   - Background: #e5e7eb
   - Animation: pulse

## Dialogs

### Dialog Content
- Background: white
- Border-radius: xl
- Shadow: level-4
- Padding: 24px
- Max-width: 90vw

### Dialog Header
- Padding: pb-4
- Border-bottom: 1px solid #e5e7eb

### Dialog Footer
- Padding: pt-4
- Border-top: 1px solid #e5e7eb
- Background: #f9fafb

## Drawers

### Drawer Content
- Background: white
- Shadow: level-4
- Transition: transform 0.3s ease-in-out
- Width: 90vw (max-width: 400px)

### Drawer Header
- Padding: p-6
- Border-bottom: 1px solid #e5e7eb

## Dashboard Layout

### Grid Layout
- Columns: 12
- Gap: 6
- Card spacing: 6

### Section Spacing
- Section margin: mb-8
- Component margin: mb-6
- Item margin: mb-4

## CRUD Layout

### Form Grid
- Columns: 2 (desktop), 1 (mobile)
- Gap: 6
- Field margin: mb-4

### Action Bar
- Background: white
- Border-top: 1px solid #e5e7eb
- Padding: p-4
- Shadow: level-2

## Responsive Rules

### Breakpoint Behavior
- **sm (640px)**: Single column
- **md (768px)**: 2-column grid
- **lg (1024px)**: 3-column grid
- **xl (1280px)**: 4-column grid

### Component Scaling
- Font sizes scale down at md breakpoint
- Padding reduces at sm breakpoint
- Cards become full-width on mobile

## Accessibility Rules

### Focus Management
- All interactive elements must have visible focus states
- Focus indicators: ring-2 ring-blue-500
- Focus order: logical navigation order

### Color Contrast
- Text on background: minimum 4.5:1 ratio
- Icons: minimum 3:1 ratio with background
- All success/warning/error states must be distinguishable

### Keyboard Navigation
- Tab order: logical reading order
- Escape key: closes modals/drawers
- Enter/Space: activates buttons/links
- Arrow keys: navigates within components

## Animation Rules

### Transition Durations
- Fast: 150ms
- Default: 300ms
- Slow: 500ms

### Animation Types
- Ease-in-out: for most transitions
- Ease-out: for appear animations
- Ease-in: for disappear animations

## Do

- Use semantic HTML elements
- Follow consistent naming conventions
- Document component props thoroughly
- Write unit tests for all components
- Use CSS variables for themeable properties
- Group related components together

## Don't

- Don't create custom components when shadcn/ui has suitable alternatives
- Don't override component styles unless necessary
- Don't use custom animations when CSS transitions work
- Don't skip accessibility testing
- Don't hardcode values in components
- Don't create duplicate components

Every future page MUST follow this documentation.

## Component Migration

This document maps duplicate/custom components to their corresponding shadcn/ui counterparts.

### Current → Replace With

#### Custom Button

**Current**
- FloatingActionButton (PremiumComponents.tsx:254)

**Replace With**
- Button (src/components/ui/button.tsx)

**Rationale**: Custom button with advanced animations should use the standard Button component with proper animation variants.

#### Custom Card

**Current**
- StatCard (src/components/shared/StatCard.tsx)
- SpotlightCard (PremiumComponents.tsx:89)
- CardSkeleton (components/animations/Skeleton.tsx:69)

**Replace With**
- Card (src/components/ui/card.tsx)

**Rationale**: All custom cards extend or mimic shadcn/ui Card styling. StatCard properly uses Card composition. SpotlightCard and CardSkeleton should extend Card base.

#### Custom Dialog

**Current**
- ConfirmDialog (src/components/shared/ConfirmDialog.tsx)
- Modal components (PremiumComponents.tsx:3)

**Replace With**
- Dialog (src/components/ui/dialog.tsx)
- AlertDialog (src/components/ui/alert-dialog.tsx) for confirmations

**Rationale**: ConfirmDialog properly composes Dialog. Modal components should use Dialog with motion integration.

#### Custom Badge

**Current**
- StatusBadge (src/components/shared/StatusBadge.tsx)

**Replace With**
- Badge (src/components/ui/badge.tsx)

**Rationale**: StatusBadge implements custom styling that matches Badge variants. Can be refactored to use Badge with variant classes.

#### Custom Table

**Current**
- TableSkeleton (src/components/shared/LoadingState.tsx:26)
- TableSkeleton (src/components/animations/Skeleton.tsx:98)

**Replace With**
- Table (src/components/ui/table.tsx)

**Rationale**: Custom skeletons should extend Table structure and use TableCell/TableRow components.

#### Custom Dropdown

**Current**
- AnimatedSelect (src/components/ui/AnimatedSelect.tsx)
- Various menu implementations

**Replace With**
- Select (src/components/ui/select.tsx)
- DropdownMenu (src/components/ui/dropdown-menu.tsx)

**Rationale**: AnimatedSelect should use Select component with custom styling. Menu implementations should use DropdownMenu.

#### Custom Input

**Current**
- PasswordInput (src/components/ui/PasswordInput.tsx)

**Replace With**
- Input (src/components/ui/input.tsx)

**Rationale**: PasswordInput implements custom styling and toggle. Can be refactored to use Input with wrapper for icon and toggle.

#### Custom Label

**Current**
- FieldLabel (various implementations)

**Replace With**
- Label (src/components/ui/label.tsx)

**Rationale**: Custom labels should use Label component for consistency.

#### Custom Separator

**Current**
- Various implementations using div with borders

**Replace With**
- Separator (src/components/ui/separator.tsx)

**Rationale**: Standard separator component provides consistent styling and accessibility.

## Legacy Color Documentation

### Legacy Colors (globals.css)

**Legacy Colors in globals.css:12-54**
- --color-canvas: #000000
- --color-surface-soft: #0d0d0d
- --color-surface-card: #1a1a1a
- --color-surface-elevated: #262626
- --color-hairline: #3c3c3c
- --color-ink: #ffffff
- --color-body: #e6e6e6
- --color-body-strong: #ffffff
- --color-muted: #a0a0a0
- --color-muted-light: #7e7e7e
- --color-yellow-light: #ffdd44
- --color-yellow: #ffcc00
- --color-yellow-dark: #e6b800
- --color-m-red: #e22718
- --color-warning: #f4b400
- --color-success: #0fa336

**Legacy Typography**
- Font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- --tracking-machined: 1.5px

**Legacy Utility Classes**
- `.text-muted`: Sets color: var(--color-ink) !important
- `.text-muted-foreground`: Sets color: var(--color-ink) !important
- `.text-body`: Sets color: var(--color-ink) !important
- `.bg-canvas`: Sets background-color: var(--color-canvas)
- `.bg-surface-card`: Sets background-color: var(--color-surface-card)
- `.bg-surface-soft`: Sets background-color: var(--color-surface-soft)

**Branding Classes**
- `tracking-machined`: letter-spacing: 1.5px (custom machined font look)
- `font-sans`: system font stack

**Shadcn Token Overrides**
- `--color-background`: mapped to --color-canvas
- `--color-foreground`: mapped to --color-ink
- `--color-card`: mapped to --color-surface-card
- `--color-card-foreground`: mapped to --color-ink
- `--color-popover`: mapped to --color-surface-card
- `--color-popover-foreground`: mapped to --color-ink
- `--color-primary`: mapped to --color-yellow
- `--color-primary-foreground`: #000000
- `--color-secondary`: mapped to --color-surface-elevated
- `--color-secondary-foreground`: mapped to --color-ink
- `--color-muted`: mapped to --color-surface-elevated
- `--color-muted-foreground`: mapped to --color-muted-light
- `--color-accent`: mapped to --color-yellow
- `--color-accent-foreground`: #000000
- `--color-destructive`: mapped to --color-m-red
- `--color-border`: mapped to --color-hairline
- `--color-input`: mapped to --color-hairline
- `--color-ring`: mapped to --color-yellow

**Recommendations for Removal**
- These legacy colors should eventually be deprecated in favor of the design system color palette
- The black/grey/yellow palette is brand-specific and should be abstracted
- Utility class overrides should be removed to allow Tailwind CSS defaults

**Summary of Component Migration**
- 5 Button components → 1 shadcn/ui Button
- 3 Card components → 1 shadcn/ui Card
- 2 Dialog components → 1 shadcn/ui Dialog
- 1 Badge component → 1 shadcn/ui Badge
- 2 Table components → 1 shadcn/ui Table
- 1 Input component → 1 shadcn/ui Input
- 1 Label component → 1 shadcn/ui Label
- 1 Separator component → 1 shadcn/ui Separator

**Total**: 19 custom/ui components → 8 standardized shadcn/ui components (58% reduction in duplication)

## Implementation Steps

1. Refactor custom components to use shadcn/ui base components
2. Remove legacy color classes from components
3. Update global styles to remove legacy overrides
4. Ensure all components follow design system specifications
5. Run tests to verify functionality remains intact
6. Update documentation and component examples

Every new page and component development should follow the established design system and use the standardized shadcn/ui components.