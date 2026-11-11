from django.db.models import Count
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from accounts.models import Role
from .models import Program, Lesson
from .permissions import CanAccessScheduleObject, IsAdminOrCoordinator, IsCoordinator
from .serializers import ProgramSerializer, LessonSerializer

class ProgramViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsAdminOrCoordinator(), CanAccessScheduleObject()]
        return [IsCoordinator(), CanAccessScheduleObject()]

    def get_queryset(self):
        qs = Program.objects.select_related("coordinator").annotate(lessons_count=Count("lessons"))
        user = self.request.user
        if self.action == "list" and user.role == Role.COORDINATOR:
            qs = qs.filter(coordinator = user)
        return qs

    def perform_create(self, serializer):
        serializer.save(coordinator=self.request.user)

class LessonViewSet(viewsets.ModelViewSet):
        serializer_class = LessonSerializer

        def get_permissions(self):
             if self.action in ("list", "retrieve"):
                  return [IsAdminOrCoordinator(),CanAccessScheduleObject()]
             return [IsCoordinator(), CanAccessScheduleObject()]

        def get_queryset(self):
            qs = Lesson.objects.select_related("program").prefetch_related("assignments__user", "assignments__replaced_from", "assignments__reviewed_by")
            user = self.request.user
            if self.action == "list":
                if user.role == Role.COORDINATOR:
                    qs = qs.filter(program__coordinator=user)
                program_id = self.request.query_params.get("program")
                if program_id:
                    qs = qs.filter(program_id=program_id)
            return qs

        def perform_create(self, serializer):
            if serializer.validated_data["program"].coordinator_id != self.request.user.id:
                raise PermissionDenied("You can only add lessons to your own programs.")
            serializer.save()

