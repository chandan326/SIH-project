import pytest
from app.core.config import settings


def test_verification_weights_sum():
    weights = settings.VERIFICATION_WEIGHTS
    assert weights["MISSING_REGISTRATION"] == 25
    assert weights["MISSING_ROR"] == 20
    assert weights["AREA_MISMATCH"] == 15
    assert weights["INVALID_GEOMETRY"] == 30
