from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from datetime import datetime, timezone
from bson import ObjectId
from typing import Optional

from ..core.database import get_db
from ..core.security import get_current_user
from ..core.config import settings
from ..ml.waste_classifier import get_classifier
from ..models.classification import (
    WASTE_CLASSES, BIN_COLORS, DISPOSAL_INSTRUCTIONS,
    ENVIRONMENTAL_IMPACT, TIPS, CO2_SAVED_PER_ITEM,
)

router = APIRouter(prefix="/api/classify", tags=["Classification"])


@router.post("/waste")
async def classify_waste(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/bmp"]:
        raise HTTPException(status_code=400, detail="Invalid image format.")

    image_bytes = await file.read()
    if len(image_bytes) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="Image too large. Maximum 10MB.")

    classifier = get_classifier()
    result = classifier.classify(image_bytes)

    db = get_db()
    record = {
        "user_id": user["id"],
        "waste_type": result["waste_type"],
        "confidence": result["confidence"],
        "bin_color": result["bin_color"],
        "co2_saved": result["co2_saved"],
        "created_at": datetime.now(timezone.utc),
    }
    insert_result = await db.classifications.insert_one(record)
    record["id"] = str(insert_result.inserted_id)

    # Check milestones
    total = await db.classifications.count_documents({"user_id": user["id"]})
    if total in [10, 50, 100, 500] and user.get("email_notifications", True):
        pipeline = [
            {"$match": {"user_id": user["id"]}},
            {"$group": {"_id": None, "total_co2": {"$sum": "$co2_saved"}}},
        ]
        agg = await db.classifications.aggregate(pipeline).to_list(1)
        total_co2 = agg[0]["total_co2"] if agg else 0
        from ..services.email_service import send_milestone_email
        await send_milestone_email(user["email"], user["name"], total, total_co2)

    return {"id": record["id"], **result}


@router.get("/history")
async def get_history(
    page: int = 1, limit: int = 20,
    waste_type: Optional[str] = None,
    user=Depends(get_current_user),
):
    db = get_db()
    query = {"user_id": user["id"]}
    if waste_type:
        query["waste_type"] = waste_type

    total = await db.classifications.count_documents(query)
    skip = (page - 1) * limit
    cursor = db.classifications.find(query).sort("created_at", -1).skip(skip).limit(limit)
    records = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        records.append(doc)

    return {"records": records, "total": total, "page": page, "pages": (total + limit - 1) // limit}


@router.get("/stats")
async def get_stats(user=Depends(get_current_user)):
    db = get_db()
    uid = user["id"]
    total = await db.classifications.count_documents({"user_id": uid})

    recyclable = await db.classifications.count_documents({
        "user_id": uid,
        "waste_type": {"$in": ["Recyclable Plastic", "Recyclable Paper", "Recyclable Metal", "Recyclable Glass"]},
    })
    organic = await db.classifications.count_documents({"user_id": uid, "waste_type": "Organic/Compostable"})
    hazardous = await db.classifications.count_documents({
        "user_id": uid,
        "waste_type": {"$in": ["E-Waste", "Hazardous Waste", "Medical Waste"]},
    })
    non_recyclable = await db.classifications.count_documents({"user_id": uid, "waste_type": "Non-Recyclable"})

    pipeline = [
        {"$match": {"user_id": uid}},
        {"$group": {"_id": None, "total_co2": {"$sum": "$co2_saved"}}},
    ]
    agg = await db.classifications.aggregate(pipeline).to_list(1)
    total_co2 = round(agg[0]["total_co2"], 2) if agg else 0.0

    recycling_rate = round((recyclable + organic) / total * 100, 1) if total > 0 else 0.0

    return {
        "total_scans": total,
        "recyclable_count": recyclable,
        "organic_count": organic,
        "hazardous_count": hazardous,
        "non_recyclable_count": non_recyclable,
        "total_co2_saved": total_co2,
        "recycling_rate": recycling_rate,
    }


@router.get("/guide")
async def get_guide():
    """Return complete waste sorting guide."""
    guide = []
    for waste_type in WASTE_CLASSES:
        guide.append({
            "waste_type": waste_type,
            "bin_color": BIN_COLORS[waste_type],
            "disposal_instructions": DISPOSAL_INSTRUCTIONS[waste_type],
            "environmental_impact": ENVIRONMENTAL_IMPACT[waste_type],
            "tips": TIPS[waste_type],
            "co2_saved_per_item": CO2_SAVED_PER_ITEM[waste_type],
        })
    return {"guide": guide}
