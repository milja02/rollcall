from datetime import datetime

from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.response import Response

from accounts.models import Role, User
from accounts.permissions import IsLecturer
from accounts.serializers import UserSerializer

from . import services
from .models import Lesson, LessonAssignment, Program
from .permissions import CanAccessScheduleObject, IsAdminOrCoordinator, IsCoordinator
from .serializers import AssignmentSerializer, LessonSerializer, ProgramSerializer


def month_range(value):
    try:
        start = datetime.strptime(value, "%Y-%m")
    except ValueError:
        raise ValidationError({"month": "Use the format YYYY-MM."})
    end = datetime(start.year + (start.month == 12), start.month % 12 + 1, 1)
    return timezone.make_aware(start), timezone.make_aware(end)


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
            qs = qs.filter(coordinator=user)
        return qs

    def perform_create(self, serializer):
        serializer.save(coordinator=self.request.user)


class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsAdminOrCoordinator(), CanAccessScheduleObject()]
        return [IsCoordinator(), CanAccessScheduleObject()]

    def get_queryset(self):
        qs = Lesson.objects.select_related("program").prefetch_related(
            "assignments__user", "assignments__replaced_from", "assignments__reviewed_by"
        )
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

    @action(detail=True, methods=["post"])
    def assignments(self, request, pk=None):
        lesson = self.get_object()
        ids = request.data.get("lecturer_ids")
        if not isinstance(ids, list) or not ids:
            raise ValidationError({"lecturer_ids": "Provide a non-empty list."})
        lecturers = list(User.objects.filter(pk__in=ids))
        if len(lecturers) != len(set(ids)):
            raise ValidationError({"lecturer_ids": "Unknown lecturer."})
        created = services.assign_lecturers(lesson, lecturers)
        data = AssignmentSerializer(created, many=True).data
        return Response(data, status=201)


class AssignmentViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        if self.action == "report":
            return [IsLecturer(), CanAccessScheduleObject()]
        if self.action in ("confirm", "reject", "replace"):
            return [IsCoordinator(), CanAccessScheduleObject()]
        return [CanAccessScheduleObject()]

    def get_queryset(self):
        qs = LessonAssignment.objects.select_related(
            "lesson__program", "user", "replaced_from", "reviewed_by"
        )
        user = self.request.user
        if self.action != "list":
            return qs
        if user.role == Role.LECTURER:
            qs = qs.filter(user=user)
        elif user.role == Role.COORDINATOR:
            qs = qs.filter(lesson__program__coordinator=user)
        params = self.request.query_params
        if params.get("status"):
            qs = qs.filter(status=params["status"])
        if params.get("program"):
            qs = qs.filter(lesson__program_id=params["program"])
        if params.get("month"):
            start, end = month_range(params["month"])
            qs = qs.filter(lesson__starts_at__gte=start, lesson__starts_at__lt=end)
        return qs.order_by("lesson__starts_at")

    @action(detail=True, methods=["post"])
    def replace(self, request, pk=None):
        assignment = self.get_object()
        new_lecturer=get_object_or_404(User, pk = request.data.get("lecturer_id"))
        services.replace_lecturer(assignment, new_lecturer, request.data.get("reason"))
        return Response(self.get_serializer(assignment).data)

    @action(detail=True, methods=["post"])
    def report(self, request, pk=None):
        assignment = self.get_object()
        services.report_attendance(assignment, request.data.get("attendance"))
        return Response(self.get_serializer(assignment).data)

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        assignment = self.get_object()
        services.confirm_report(assignment, request.user)
        return Response(self.get_serializer(assignment).data)
    
    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        assignment = self.get_object()
        services.reject_report(assignment, request.user, request.data.get("comment"))
        return Response(self.get_serializer(assignment).data)
    



class LecturerListView(ListAPIView):

    serializer_class = UserSerializer
    permission_classes = [IsCoordinator]

    def get_queryset(self):
        qs = User.objects.filter(role=Role.LECTURER, is_active=True).order_by("full_name")
        search = self.request.query_params.get("search", "").strip()
        if search:
            qs = qs.filter(Q(full_name__icontains=search) | Q(email__icontains=search))
        return qs
