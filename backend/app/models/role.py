import enum


class UserRole(str, enum.Enum):
    PUBLIC = "PUBLIC"
    BUYER = "BUYER"
    REVIEWER = "REVIEWER"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"
