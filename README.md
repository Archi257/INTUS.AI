<!-- Project: Intus.ai Med Tech | Author: Archi Sagvekar -->
# MedTech Image Processing Web Application

## Overview

This is a full-stack medical image processing web application designed for surgical planning simulations. The application allows users to upload 2D medical images (JPG/PNG) and apply phase-based processing filters to simulate different imaging phases used in medical diagnostics. The frontend handles user interactions and image display, while the backend performs server-side image processing using Python libraries (PIL, OpenCV). The architecture follows a separation of concerns with a static frontend and a dedicated Python backend server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla JavaScript, HTML5, CSS3
- **Deployment Model**: Static file serving (designed for GitHub Pages or similar)
- **User Interface Pattern**: Single-page application with drag-and-drop file upload
- **State Management**: DOM-based state with file handling in memory
- **Image Display**: Side-by-side comparison view showing original and processed images

**Key Design Decisions**:
- Pure vanilla JavaScript chosen over frameworks for simplicity and minimal bundle size
- Drag-and-drop interface for improved user experience with medical image uploads
- Client-side file preview using FileReader API before server processing
- Responsive design with gradient background and card-based layout
- Visual feedback through loading indicators and disabled states

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Processing Libraries**: PIL (Python Imaging Library) for contrast enhancement, OpenCV for Gaussian smoothing
- **API Design**: RESTful endpoint with multipart/form-data for image upload
- **Image Processing Pipeline**: 
  - Arterial phase: Contrast enhancement using PIL ImageEnhance
  - Venous phase: Gaussian blur using OpenCV
- **Response Format**: Processed images returned as binary data or base64-encoded strings

**Key Design Decisions**:
- Flask chosen for lightweight, easy deployment to platforms like Hugging Face Spaces
- CORS enabled to allow cross-origin requests from separate frontend domain
- Hybrid serving capability: Backend can serve frontend files OR operate as standalone API
- Image processing entirely server-side as per requirements (no browser-based operations)
- In-memory image processing using BytesIO to avoid filesystem I/O overhead
- Debug mode disabled by default for security (only enabled via FLASK_DEBUG environment variable)

### Communication Flow
1. User uploads image via frontend drag-and-drop or file picker
2. Frontend sends POST request to `/process` endpoint with image file and selected phase
3. Backend receives image, converts to RGB if needed, applies selected processing
4. Processed image returned to frontend for side-by-side display
5. Health check endpoint (`/health`) available for deployment verification

### File Structure
```
├── frontend/
│   ├── index.html       # Main UI structure
│   ├── style.css        # Styling and responsive design
│   └── script.js        # File handling, API calls, UI updates
├── backend/
│   └── app.py          # Flask server with image processing logic
```

## External Dependencies

### Backend Dependencies
- **Flask**: Web framework for HTTP server and routing
- **flask-cors**: Cross-Origin Resource Sharing support for separate frontend/backend domains
- **Pillow (PIL)**: Image processing library for format conversion and contrast enhancement
- **OpenCV (cv2)**: Computer vision library for Gaussian smoothing operations
- **NumPy**: Array operations required by OpenCV for image manipulation

### Frontend Dependencies
- **None**: Uses only browser-native APIs (FileReader, Fetch API, DOM manipulation)

### Deployment Platforms
- **Frontend**: Configured for GitHub Pages or any static file hosting service
- **Backend**: Designed for deployment to Hugging Face Spaces or similar Python hosting platforms
- **Cross-Origin Communication**: Requires CORS configuration to connect separate frontend/backend domains

### Image Processing Algorithms
- **Arterial Phase Simulation**: PIL ImageEnhance.Contrast (1.8x enhancement) + Brightness (1.1x) for increased contrast ratio
- **Venous Phase Simulation**: OpenCV GaussianBlur with (15, 15) kernel for image smoothing (simulates reduced sharpness)

### API Integration Points
- Primary endpoint: `POST /process` (multipart form data with 'image' file and 'phase' parameter)
- Health check: `GET /health` (returns JSON status)
- Static serving: `GET /` and `GET /<path>` (optional frontend serving from backend)