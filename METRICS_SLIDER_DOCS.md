# Metrics Slider Components

This document describes the two responsive slider components created for displaying accuracy, predictions, and dataset growth metrics.

## Components Overview

### 1. MetricsSlider (Full-Width)
**File:** `src/components/MetricsSlider.jsx`

A full-width responsive slider component designed for displaying metrics across an entire section.

#### Features:
- Auto-play carousel (4-second intervals)
- Desktop arrow navigation (hidden on mobile)
- Keyboard navigation (Arrow Left/Right)
- Touch/swipe support for mobile
- Animated transitions
- Responsive design (mobile, tablet, desktop)
- Dot indicators for navigation
- Auto-pause on hover (desktop)

#### Usage:
```jsx
import MetricsSlider from './components/MetricsSlider'

function MyPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <MetricsSlider />
      </div>
    </section>
  )
}
```

#### Location in App:
Currently integrated in the landing page between Dataset and Technology sections.

---

### 2. MetricsSliderPanel (Right Panel Layout)
**File:** `src/components/MetricsSliderPanel.jsx`

A responsive panel component designed to work as a right-side widget in two-column layouts.

#### Features:
- Same interactive functionality as MetricsSlider
- Customizable metrics via props
- Optional title and subtitle
- Responsive: full-width on mobile, side-by-side on desktop
- Integrated into Benefits section
- Touch/swipe navigation
- Keyboard support

#### Props:
```typescript
interface MetricsSliderPanelProps {
  metrics?: Array<MetricItem>  // Custom metrics (optional)
  title?: string               // Panel title
  subtitle?: string            // Panel subtitle
  fullWidth?: boolean          // Force full width (default: false)
}
```

#### Usage:
```jsx
import MetricsSliderPanel from './components/MetricsSliderPanel'

function MyComponent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>Left content</div>
      <MetricsSliderPanel
        title="Live Metrics"
        subtitle="Performance Dashboard"
      />
    </div>
  )
}
```

#### Location in App:
Currently integrated in the Benefits section as the right panel for desktop screens.

---

## Default Metrics

Both components display three metrics:

### Metric 1: Accuracy Level
- **Value:** 94.2%
- **Color:** Emerald to Teal gradient
- **Details:**
  - YOLOv8: 94.2%
  - TensorFlow: 92.8%
  - Confidence: 94.2%

### Metric 2: Predictions
- **Value:** 9,355+
- **Color:** Blue to Cyan gradient
- **Details:**
  - Fresh: 5,231
  - Mild: 2,847
  - Spoiled: 1,277

### Metric 3: Dataset Growth
- **Value:** +15%
- **Color:** Purple to Pink gradient
- **Details:**
  - This Month: +2,150
  - Last Month: +1,860
  - Trend: ↗ Up 15%

---

## Responsive Design Breakdown

### Mobile (< 640px)
- Slider height: 12rem (h-48)
- Full-width with padding
- Smaller text sizes
- Touch/swipe only navigation
- Dots visible at bottom
- No arrow buttons (use dots or swipe)

### Tablet (640px - 1024px)
- Slider height: 14rem (h-56)
- Same navigation as mobile with arrow buttons
- Medium text sizes
- Touch-friendly buttons (w-8 h-8)

### Desktop (> 1024px)
- Slider height: 16rem (h-64)
- Full arrow button support
- Larger text sizes
- Hover effects on buttons
- Side-by-side layout for panel variant

---

## Navigation Methods

### Auto-Play
- Automatically advances to the next metric every 4 seconds
- Pauses on mouse hover (desktop)
- Resumes after 3 seconds of inactivity

### Arrow Navigation
- Desktop only (visible at left and right edges)
- Click to go to previous/next metric
- Disables auto-play on click

### Dot Navigation
- Always visible
- Click any dot to jump to that metric
- Disables auto-play on click

### Keyboard Navigation
- Arrow Left: Previous metric
- Arrow Right: Next metric
- Works anywhere on the document

### Touch/Swipe (Mobile)
- Swipe left to advance to next metric
- Swipe right to go to previous metric
- Threshold: 50px minimum swipe distance

---

## Customization

### Custom Metrics
You can pass custom metrics to `MetricsSliderPanel`:

```jsx
const customMetrics = [
  {
    id: 1,
    title: 'Custom Title',
    value: '123%',
    subtitle: 'Custom Subtitle',
    icon: <YourIcon />,
    details: [
      { label: 'Label 1', value: 'Value 1' },
      { label: 'Label 2', value: 'Value 2' },
      { label: 'Label 3', value: 'Value 3' },
    ],
    color: 'from-blue-500 to-purple-500',
  },
]

<MetricsSliderPanel metrics={customMetrics} />
```

### Styling
Colors use Tailwind's gradient utilities:
- `from-emerald-500 to-teal-500`
- `from-blue-500 to-cyan-500`
- `from-purple-500 to-pink-500`

---

## Accessibility

- Semantic HTML structure
- ARIA labels on buttons
- Keyboard navigation support
- High contrast colors
- Clear visual indicators
- Screen reader friendly

---

## Performance

- Uses Framer Motion for optimized animations
- Conditional rendering for mobile/desktop
- Efficient state management
- No unnecessary re-renders
- Touch event throttling

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Integration Points

### Landing Page (`src/auth/Landingpage.jsx`)
- MetricsSlider added in new section after Dataset
- Full-width layout
- White background section
- Centered heading with description

### Benefits Section (`src/pages/landingpage/components/Benefits.jsx`)
- MetricsSliderPanel added as right column
- Hidden on lg screens and below (use `hidden lg:block`)
- Full height to match left content
- Maintains responsive benefits grid on left

---

## Files Modified

1. `src/components/MetricsSlider.jsx` (Created)
2. `src/components/MetricsSliderPanel.jsx` (Created)
3. `src/auth/Landingpage.jsx` (Updated - Added MetricsSlider)
4. `src/pages/landingpage/components/Benefits.jsx` (Updated - Added MetricsSliderPanel)

---

## Future Enhancements

- Real-time data integration
- Custom animation timings
- More metric templates
- Analytics dashboard export
- Real-time data updates via WebSocket
- Configurable auto-play interval
