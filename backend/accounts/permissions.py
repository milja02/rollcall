from rest_framework.permissions import BasePermission
from .models import Role

#can this user see thsi view

class HasRole(BasePermission):
    allowed_roles: tuple = ()
    message = "You do not have access to this resource."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role in self.allowed_roles)


class IsAdmin(HasRole):
    allowed_roles = (Role.ADMIN,)


class IsCoordinator(HasRole):
    allowed_roles = (Role.COORDINATOR,)


class IsLecturer(HasRole):
    allowed_roles = (Role.LECTURER,)


class IsAdminOrCoordinator(HasRole):
    allowed_roles = (Role.ADMIN, Role.COORDINATOR)
