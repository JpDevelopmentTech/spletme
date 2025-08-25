# Dashboard Tour System

## Overview

The Dashboard Tour is an interactive guided tour that helps new users understand the main features of the music dashboard. It uses `react-joyride` to create a smooth, step-by-step experience that highlights key dashboard elements.

## Features

- 🎯 **Automatic Launch**: Tour starts automatically for first-time users
- 📱 **Responsive Design**: Works perfectly on all device sizes
- 🎨 **Beautiful UI**: Modern design with smooth animations
- 🔄 **Restartable**: Users can restart the tour anytime
- 💾 **Persistent State**: Remembers if user has completed the tour
- 🌍 **Localized**: Spanish language support

## How It Works

### 1. First Visit
When a user visits the dashboard for the first time:
- Tour automatically starts after 1 second (to ensure page is loaded)
- User sees a welcome message and introduction
- Tour progresses through 8 key dashboard sections

### 2. Tour Steps

1. **Welcome Screen** - Introduction and overview
2. **Hero Header** - Dashboard title and description
3. **Stats Cards** - Key metrics explanation
4. **Analytics Chart** - Performance visualization
5. **Balance Section** - Financial overview
6. **Platforms Section** - Streaming platform performance
7. **Top Songs** - Best performing tracks
8. **Completion** - Tour summary and tips

### 3. User Controls
- **Next/Previous**: Navigate between steps
- **Skip**: Skip entire tour
- **Close**: Close current step
- **Progress**: Visual progress indicator

### 4. Persistence
- Tour completion status is stored in `localStorage`
- Users won't see the tour again unless they manually restart it
- Tour can be reset for testing or re-education

## Implementation

### Components

#### `DashboardTour.tsx`
Main tour component that handles:
- Tour state management
- Step definitions
- User interactions
- Styling and animations

#### `useDashboardTour.ts`
Custom hook that manages:
- Tour completion status
- Local storage persistence
- Tour state logic

### Data Attributes

The tour targets specific elements using `data-tour` attributes:

```tsx
<div data-tour="hero-header">
  {/* Hero header content */}
</div>

<div data-tour="stats-cards">
  {/* Stats cards content */}
</div>

<div data-tour="analytics-chart">
  {/* Analytics chart content */}
</div>
```

### Styling

The tour uses custom styling that matches the dashboard design:
- Purple/blue gradient theme
- Rounded corners and shadows
- Smooth animations
- Responsive tooltips

## Usage

### Basic Implementation

```tsx
import DashboardTour from '../components/tour/DashboardTour';

function HomePage() {
  return (
    <>
      <DashboardTour />
      {/* Your dashboard content */}
    </>
  );
}
```

### Custom Tour Completion Handler

```tsx
function HomePage() {
  const handleTourComplete = () => {
    console.log('Tour completed!');
    // Show success message, track analytics, etc.
  };

  return (
    <>
      <DashboardTour onTourComplete={handleTourComplete} />
      {/* Your dashboard content */}
    </>
  );
}
```

### Manual Tour Control

```tsx
import { useDashboardTour } from '../hooks/useDashboardTour';

function HomePage() {
  const { startTour, resetTour } = useDashboardTour();

  return (
    <div>
      <button onClick={startTour}>Start Tour</button>
      <button onClick={resetTour}>Reset Tour</button>
      {/* Your dashboard content */}
    </div>
  );
}
```

## Customization

### Adding New Steps

To add a new tour step:

1. Add the step to the `steps` array in `DashboardTour.tsx`
2. Add the corresponding `data-tour` attribute to your component
3. Update the step content and placement

```tsx
{
  target: '[data-tour="new-section"]',
  content: (
    <div>
      <h3>New Section</h3>
      <p>Description of the new section</p>
    </div>
  ),
  placement: 'bottom',
  disableBeacon: true,
}
```

### Modifying Styles

Tour styles can be customized in the `styles` prop:

```tsx
styles={{
  options: {
    primaryColor: '#your-color',
    zIndex: 10000,
  },
  tooltip: {
    backgroundColor: '#your-bg-color',
    borderRadius: '16px',
    // ... more styles
  },
  // ... more style options
}}
```

### Changing Language

Update the `locale` prop to change button text:

```tsx
locale={{
  back: 'Previous',
  close: 'Close',
  last: 'Finish',
  next: 'Next',
  skip: 'Skip Tour',
}}
```

## Best Practices

1. **Performance**: Tour only renders when needed
2. **Accessibility**: High contrast and readable text
3. **Mobile**: Responsive design for all screen sizes
4. **User Experience**: Smooth animations and clear instructions
5. **Maintenance**: Easy to update and modify

## Troubleshooting

### Tour Not Starting
- Check if `localStorage` is available
- Verify `data-tour` attributes are present
- Ensure component is properly mounted

### Styling Issues
- Check z-index values
- Verify CSS classes are applied
- Test on different screen sizes

### Performance Issues
- Tour only runs once per user
- Minimal re-renders
- Efficient state management

## Future Enhancements

- [ ] Multi-language support
- [ ] Tour analytics tracking
- [ ] Custom step animations
- [ ] Tour templates for different pages
- [ ] A/B testing for tour effectiveness
- [ ] User feedback collection
- [ ] Tour completion certificates

## Dependencies

- `react-joyride`: Core tour functionality
- `framer-motion`: Smooth animations
- `lucide-react`: Icons
- `localStorage`: Persistence

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This tour system is part of the SPLITME project and follows the same licensing terms.
