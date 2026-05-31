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
│   ├── ImagePreview.tsx      # Before/after image viewer
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

## License

MIT
