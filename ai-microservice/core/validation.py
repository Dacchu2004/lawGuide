from dataclasses import dataclass

@dataclass
class ValidationResult:
    is_valid: bool
    confidence: float
    high_risk: bool
    reason: str = ""