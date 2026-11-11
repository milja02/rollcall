from rest_framework.permissions import SAFE_METHODS, BasePermission
from accounts.models import Role
from accounts.permissions import IsAdminOrCoordinator, IsCoordinator
from .models import Lesson, LessonAssignment, Program

__all__ = ["IsCoordinator", "IsAdminOrCoordinator", "CanAccessScheduleObject"]


def program_of(obj):
    if isinstance(obj, Program):
        return obj
    if isinstance(obj, Lesson):
        return obj.program
    return obj.lesson.program


class CanAccessScheduleObject(BasePermission):
    message = "You do not have access to this resource."

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == Role.ADMIN:
            return request.method in SAFE_METHODS
        if user.role == Role.COORDINATOR:
            return program_of(obj).coordinator_id == user.id
        if user.role == Role.LECTURER:
            return isinstance(obj, LessonAssignment) and obj.user_id == user.id
        return False