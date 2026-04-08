# EcoSort - AI Waste Sorting Assistant

AI-powered waste classification and sorting assistant. Take a photo of any waste item and get instant identification, correct bin assignment, disposal instructions, and environmental impact information.

**By [Humanoid Maker](https://www.humanoidmaker.com)**

## Features

- **Waste Classification**: 10 waste categories (Recyclable Plastic/Paper/Metal/Glass, Organic, E-Waste, Hazardous, Non-Recyclable, Textile, Medical)
- **Bin Assignment**: Color-coded bin recommendations (Blue, Green, Red, Black, Yellow)
- **Disposal Instructions**: Detailed instructions for proper disposal of each waste type
- **Environmental Impact**: Facts about the environmental benefit of proper disposal
- **Tips**: Practical tips for each waste category
- **Impact Tracking**: Personal dashboard with items sorted, CO2 saved, recycling rate
- **Achievement Badges**: Gamified milestones from "Eco Starter" to "Sustainability Legend"
- **Complete Sorting Guide**: Reference guide for all waste categories

## Tech Stack

- **Backend**: Python, FastAPI, PyTorch, torchvision (EfficientNet-B3 classifier)
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Database**: MongoDB
- **ML Model**: EfficientNet-B3 fine-tuned for 10-class waste classification

## GPU Requirements

| Level | GPU | VRAM | Notes |
|-------|-----|------|-------|
| Minimum | NVIDIA GTX 1650 | 4 GB | Inference only |
| Recommended | NVIDIA RTX 3060 | 12 GB | Fast inference, model fine-tuning |
| Production | NVIDIA RTX 4080+ | 16 GB+ | High throughput |

CPU-only mode is supported with reasonable performance for single image classification.

## Quick Start

### Docker (Recommended)

```bash
cp backend/.env.example backend/.env
docker-compose up --build
```

- Frontend: http://localhost:3002
- Backend API: http://localhost:8002
- API Docs: http://localhost:8002/docs

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8002
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/settings | Update settings |
| POST | /api/classify/waste | Classify waste image |
| GET | /api/classify/history | Get classification history |
| GET | /api/classify/stats | Get sorting statistics |
| GET | /api/classify/guide | Get complete waste sorting guide |

## Waste Categories

| Category | Bin Color | CO2 Saved/Item |
|----------|-----------|----------------|
| Recyclable Plastic | Blue | 0.04 kg |
| Recyclable Paper | Blue | 0.03 kg |
| Recyclable Metal | Blue | 0.08 kg |
| Recyclable Glass | Green | 0.03 kg |
| Organic/Compostable | Green | 0.02 kg |
| E-Waste | Red | 0.50 kg |
| Hazardous Waste | Red | - |
| Non-Recyclable | Black | - |
| Textile Waste | Yellow | 0.10 kg |
| Medical Waste | Red | - |

## License

MIT License - see [LICENSE](LICENSE)
