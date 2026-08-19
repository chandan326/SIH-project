from typing import Any, Optional, Dict
from fastapi import HTTPException, status


class BhoomiVerifyException(HTTPException):
    def __init__(
        self,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        code: str = "BAD_REQUEST",
        message: str = "An unexpected error occurred.",
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "success": False,
                "error": {
                    "code": code,
                    "message": message,
                    "details": details or {},
                },
            },
        )


class ParcelNotFoundException(BhoomiVerifyException):
    def __init__(self, parcel_uid: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="PARCEL_NOT_FOUND",
            message=f"The requested demo parcel '{parcel_uid}' could not be found.",
        )


class VerificationException(BhoomiVerifyException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="VERIFICATION_FAILED",
            message=message,
            details=details,
        )


class InvalidGeometryException(BhoomiVerifyException):
    def __init__(self, message: str = "The provided spatial geometry is invalid."):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="INVALID_GEOMETRY",
            message=message,
        )


class UnauthorizedException(BhoomiVerifyException):
    def __init__(self, message: str = "Authentication credentials were invalid or missing."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message=message,
        )


class InsufficientPermissionsException(BhoomiVerifyException):
    def __init__(self, message: str = "You do not have permission to perform this action."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            code="FORBIDDEN",
            message=message,
        )
