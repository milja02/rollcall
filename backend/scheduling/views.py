from django.db.models import Count
from rest_framework import viewsets
from accounts.models import Role
from .models import Program
from .permissions import CanAccessScheduleObject, IsAdminOrCoordinator, IsCoordinator
from .serializers import ProgramSerializer

class ProgramViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsAdminOrCoordinator, CanAccessScheduleObject()]
        return [IsCoordinator(), CanAccessScheduleObject()]

    def get_queryset(self):
        qs = Program.objects.select_related("coordinator").annotate(lessons_count=Count("lessons"))
        user = self.request.user
        if self.action == "list" and user.role == Role.COORDINATOR:
            qs = qs.filter(coordinator = user)
        return qs

    def perform_create(self, serializer):
        serializer.save(coordinator=self.request.user)
