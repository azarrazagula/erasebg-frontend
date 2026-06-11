# EraseBG Frontend

A production-ready Next.js 14 frontend for an AI Background Removal tool, built with TypeScript and Tailwind CSS.

## Features

- ✨ Drag-and-drop image upload
- 🎨 Smooth animations and transitions
- 📱 Fully responsive design
- 🔄 Real-time loading states with progress
- 📥 PNG and JPG download support
- ⚡ Fast and optimized performance
- 🎯 Beautiful UI with custom theme

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS 3
- React 18

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local  # if needed

# Edit .env.local with your FastAPI backend URL
```

### Configuration

Edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
erasebg-frontend/
├── app/
│   ├── page.tsx              # Main page component
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles with Tailwind
├── components/
│   ├── DropZone.tsx          # Drag & drop upload with loading
│   └── DownloadBtn.tsx       # PNG/JPG download buttons
├── lib/
│   └── api.ts                # FastAPI integration
├── public/
│   └── [static files]
├── tailwind.config.ts        # Tailwind configuration with animations
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
└── .env.local                # Environment variables
```

## API Integration

The frontend connects to a FastAPI backend at the URL specified in `.env.local`.

### Remove Background Endpoint

**Request:**

- Method: `POST`
- URL: `{NEXT_PUBLIC_API_URL}/remove-bg`
- Body: `FormData` with key `file` containing the image file

**Response:**

- Returns PNG image as Blob
- Status 200 on success

### Error Handling

- Network errors are caught and displayed to the user
- Error messages from the backend are shown below the upload button
- Failed processing allows the user to try again

## Animations

Custom animations include:

- **Fade-up**: Page sections fade and slide up on load
- **Bob**: Upload icon gently bobs up and down
- **Bounce Dots**: Loading indicator with staggered dot bouncing
- **Progress Fill**: Animated progress bar
- **Lift Hover**: Buttons and cards lift slightly on hover

All animations use CSS only—no JavaScript animation libraries.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized image loading
- Lazy rendering of components
- Efficient state management
- No external UI libraries (Tailwind only)
- Responsive design for all screen sizes

## Step-by-Step Implementation Details

This is a walkthrough of all the features and design improvements implemented in this project:

### Phase 1: Core Layout & Dark Theme Setup
1. **Global CSS Update (`app/globals.css`)**:
   - Changed background to a premium, dark-violet theme (`#030014`).
   - Added custom CSS animations (`fade-up`, `bounce-dots`, `progress-fill`, `pulse`) and helper utility classes.
2. **Ambient Glow Effects**:
   - Embedded three radial background gradient blur divs to provide a sleek, modern visual aura behind the main content.

### Phase 2: Component Refinement
3. **DropZone Component Redesign (`components/DropZone.tsx`)**:
   - Updated styles to support a glassmorphic look: semi-transparent (`bg-[#12101e]/40`) with thin borders.
   - Replaced basic emojis with a clean, vector SVG cloud-upload icon.
   - Implemented a dedicated "Upload" CTA button within the drag-and-drop boundary.
4. **Loading States**:
   - Structured step-by-step loading status texts (Analyzing image ➔ Detecting edges ➔ Removing background ➔ Finalizing result).
   - Added an animated progress bar and staggered bouncing dots to match the premium theme.

### Phase 3: Hero & Interactive Features
5. **Hero Section Redesign (`app/page.tsx`)**:
   - Formatted the hero section into a clean two-column grid layout (Left: heading and description, Right: `DropZone`).
   - Cleaned up the interface by removing redundant, double buttons ("Upload Image" and "How it works") from the hero column.
6. **Interactive Showcase Examples Grid**:
   - Removed the generic feature cards section.
   - Added a grid showing 4 clickable example cards (Product, Portrait, Animal, Car) with smooth zoom animations.
   - Added an overlay with a glassmorphism "Test AI" button.
   - Connected example image click events to a custom fetch-and-upload loader: fetches the remote Unsplash image, converts it into a `File` object, and automatically runs it through the AI background removal API for instant testing.

### Phase 4: Output Preview & Polish
7. **Theme-matching Checkerboard**:
   - Styled the comparison slider's background with a dark purple grid pattern (`#0F0C1B` / `#1C192E`) to maintain theme unity.
8. **Memory Management**:
   - Configured `URL.revokeObjectURL` on image reset to prevent memory leaks during slider comparison handle dragging.
9. **Build Verification**:
   - Ran `npm run build` to verify that Next.js and TypeScript compilation succeeds without errors.

## License

MIT
