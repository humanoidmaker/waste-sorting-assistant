from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

WASTE_CLASSES = [
    "Recyclable Plastic",
    "Recyclable Paper",
    "Recyclable Metal",
    "Recyclable Glass",
    "Organic/Compostable",
    "E-Waste",
    "Hazardous Waste",
    "Non-Recyclable",
    "Textile Waste",
    "Medical Waste",
]

BIN_COLORS = {
    "Recyclable Plastic": "Blue",
    "Recyclable Paper": "Blue",
    "Recyclable Metal": "Blue",
    "Recyclable Glass": "Green",
    "Organic/Compostable": "Green",
    "E-Waste": "Red",
    "Hazardous Waste": "Red",
    "Non-Recyclable": "Black",
    "Textile Waste": "Yellow",
    "Medical Waste": "Red",
}

DISPOSAL_INSTRUCTIONS = {
    "Recyclable Plastic": "Rinse and place in blue recycling bin. Remove caps and labels if possible.",
    "Recyclable Paper": "Flatten cardboard boxes. Place clean paper in blue recycling bin. Avoid wet or food-stained paper.",
    "Recyclable Metal": "Rinse cans and tins. Place in blue recycling bin. Aluminum foil should be clean and balled up.",
    "Recyclable Glass": "Rinse glass containers. Place in green glass recycling bin. Do not include broken glass, mirrors, or ceramics.",
    "Organic/Compostable": "Place in green compost bin or home compost. Includes food scraps, yard waste, and biodegradable items.",
    "E-Waste": "Take to designated e-waste collection center. Never throw in regular trash. Many electronics stores offer free recycling.",
    "Hazardous Waste": "Take to hazardous waste facility. Never pour down drains or dispose in regular trash. Includes batteries, paint, chemicals.",
    "Non-Recyclable": "Place in black general waste bin. Consider if item can be repurposed before disposal.",
    "Textile Waste": "Donate wearable clothing. Place non-wearable textiles in yellow textile recycling bin. Many retailers accept old clothes.",
    "Medical Waste": "Use designated sharps container for needles. Take medications to pharmacy for safe disposal. Never flush or trash.",
}

ENVIRONMENTAL_IMPACT = {
    "Recyclable Plastic": "Recycling 1 plastic bottle saves enough energy to power a lightbulb for 3 hours. Plastic takes 450+ years to decompose.",
    "Recyclable Paper": "Recycling 1 ton of paper saves 17 trees, 7,000 gallons of water, and 3 cubic yards of landfill space.",
    "Recyclable Metal": "Recycling aluminum saves 95% of the energy needed to make new aluminum. A recycled can is back on shelves in 60 days.",
    "Recyclable Glass": "Glass is 100% recyclable and can be recycled endlessly without quality loss. Recycling glass reduces CO2 emissions by 50%.",
    "Organic/Compostable": "Composting reduces methane emissions from landfills and creates nutrient-rich soil. Food waste in landfills generates 8% of global emissions.",
    "E-Waste": "E-waste contains valuable materials like gold, silver, and copper. Proper recycling recovers these and prevents toxic chemicals from leaching.",
    "Hazardous Waste": "Improper disposal contaminates soil and groundwater. One quart of motor oil can contaminate 250,000 gallons of water.",
    "Non-Recyclable": "Reducing non-recyclable waste starts with choosing products with less packaging and seeking recyclable alternatives.",
    "Textile Waste": "The fashion industry produces 10% of global CO2 emissions. Extending clothing life by just 9 months reduces its footprint by 30%.",
    "Medical Waste": "Improper medical waste disposal poses serious public health risks. Proper disposal protects sanitation workers and communities.",
}

TIPS = {
    "Recyclable Plastic": ["Remove labels if possible", "Crush to save space", "Check recycling number (1-7)", "Avoid black plastic (not recyclable)"],
    "Recyclable Paper": ["Keep it dry", "Remove staples and tape", "Shred sensitive documents", "Pizza boxes with grease go to compost"],
    "Recyclable Metal": ["Rinse food residue", "Keep lids attached", "Crush cans to save space", "Steel and aluminum are both recyclable"],
    "Recyclable Glass": ["Separate by color if required", "Remove metal lids", "Don't include ceramics or Pyrex", "Broken glass: wrap safely first"],
    "Organic/Compostable": ["No meat or dairy in home compost", "Add brown materials (leaves, paper) for balance", "Keep compost moist", "Turn regularly"],
    "E-Waste": ["Wipe personal data first", "Remove batteries separately", "Check manufacturer take-back programs", "Many items can be refurbished"],
    "Hazardous Waste": ["Never mix chemicals", "Keep in original containers", "Check local collection events", "Store safely until disposal"],
    "Non-Recyclable": ["Try to reduce purchases", "Look for recyclable alternatives", "Consider reusing items", "Compact to reduce volume"],
    "Textile Waste": ["Donate wearable items", "Repurpose as cleaning rags", "Look for textile recycling bins", "Buy quality over quantity"],
    "Medical Waste": ["Use approved sharps containers", "Never recap needles", "Return unused medications to pharmacy", "Follow local regulations"],
}

CO2_SAVED_PER_ITEM = {
    "Recyclable Plastic": 0.04,
    "Recyclable Paper": 0.03,
    "Recyclable Metal": 0.08,
    "Recyclable Glass": 0.03,
    "Organic/Compostable": 0.02,
    "E-Waste": 0.5,
    "Hazardous Waste": 0.0,
    "Non-Recyclable": 0.0,
    "Textile Waste": 0.1,
    "Medical Waste": 0.0,
}


class ClassificationResult(BaseModel):
    waste_type: str
    confidence: float
    bin_color: str
    disposal_instructions: str
    environmental_impact: str
    tips: List[str]
    co2_saved: float = 0.0


class ClassificationRecord(BaseModel):
    id: Optional[str] = None
    user_id: str
    waste_type: str
    confidence: float
    bin_color: str
    co2_saved: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ClassificationStats(BaseModel):
    total_scans: int = 0
    recyclable_count: int = 0
    organic_count: int = 0
    hazardous_count: int = 0
    non_recyclable_count: int = 0
    total_co2_saved: float = 0.0
    recycling_rate: float = 0.0
