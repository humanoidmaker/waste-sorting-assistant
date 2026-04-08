import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
import io
from typing import Dict, Any

from ..models.classification import (
    WASTE_CLASSES,
    BIN_COLORS,
    DISPOSAL_INSTRUCTIONS,
    ENVIRONMENTAL_IMPACT,
    TIPS,
    CO2_SAVED_PER_ITEM,
)


class WasteClassifierModel(nn.Module):
    """EfficientNet-B3 based waste classifier."""
    def __init__(self, num_classes=10):
        super().__init__()
        self.backbone = models.efficientnet_b3(weights=models.EfficientNet_B3_Weights.DEFAULT)
        in_features = self.backbone.classifier[1].in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(512, num_classes),
        )

    def forward(self, x):
        return self.backbone(x)


class WasteClassifier:
    def __init__(self, model_path: str = None, device: str = "cuda"):
        self.device = torch.device(device if torch.cuda.is_available() else "cpu")
        print(f"[WasteClassifier] Using device: {self.device}")

        self.model = WasteClassifierModel(num_classes=len(WASTE_CLASSES))
        if model_path:
            try:
                state_dict = torch.load(model_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
                print(f"[WasteClassifier] Loaded model from {model_path}")
            except FileNotFoundError:
                print("[WasteClassifier] Model file not found. Using pre-trained weights for demo.")

        self.model.to(self.device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((300, 300)),
            transforms.CenterCrop(280),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ])

    def classify(self, image_bytes: bytes) -> Dict[str, Any]:
        """Classify waste in an image."""
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        tensor = self.transform(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            output = self.model(tensor)
            probs = torch.softmax(output, dim=1)[0]

        class_idx = torch.argmax(probs).item()
        confidence = round(probs[class_idx].item() * 100, 1)
        waste_type = WASTE_CLASSES[class_idx]

        return {
            "waste_type": waste_type,
            "confidence": confidence,
            "bin_color": BIN_COLORS[waste_type],
            "disposal_instructions": DISPOSAL_INSTRUCTIONS[waste_type],
            "environmental_impact": ENVIRONMENTAL_IMPACT[waste_type],
            "tips": TIPS[waste_type],
            "co2_saved": CO2_SAVED_PER_ITEM[waste_type],
        }


_classifier: WasteClassifier = None


def get_classifier() -> WasteClassifier:
    global _classifier
    if _classifier is None:
        from ..core.config import settings
        _classifier = WasteClassifier(
            model_path=settings.MODEL_PATH,
            device=settings.DEVICE,
        )
    return _classifier
