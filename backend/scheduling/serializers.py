from rest_framework import serializers

from accounts.serializers import UserSerializer

from . import services
from .models import Lesson, LessonAssignment, Program


class ProgramSerializer(serializers.ModelSerializer):
    lessons_count = serializers.IntegerField(read_only=True)
    coordinator_name = serializers.CharField(source="coordinator.full_name", read_only=True)

    class Meta:
        model = Program
        fields = [
            "id", "title", "description",
            "coordinator", "coordinator_name", "lessons_count", "created_at",
        ]
        read_only_fields = ["coordinator", "created_at"]


class AssignmentBaseSerializer(serializers.ModelSerializer):
    lecturer = UserSerializer(source="user", read_only=True)
    replaced_from = UserSerializer(read_only=True)
    reviewed_by_name = serializers.CharField(
        source="reviewed_by.full_name", read_only=True, default=None
    )

    class Meta:
        model = LessonAssignment
        fields = [
            "id", "lecturer", "status", "attendance", "reported_at",
            "reviewed_by_name", "reviewed_at", "review_comment",
            "replaced_from", "replacement_reason",
        ]
        read_only_fields = fields


class LessonSerializer(serializers.ModelSerializer):
    program_title = serializers.CharField(source="program.title", read_only=True)
    assignments = AssignmentBaseSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id", "program", "program_title", "title", "description",
            "starts_at", "ends_at", "assignments",
        ]

    def validate(self, attrs):
        if self.instance and attrs.get("program") not in (None, self.instance.program):
            raise serializers.ValidationError({"program": "A lesson cannot be moved to another program."})
        starts_at = attrs.get("starts_at") or self.instance.starts_at
        ends_at = attrs.get("ends_at") or self.instance.ends_at
        services.check_lesson_times(starts_at, ends_at, lesson=self.instance)
        return attrs


class LessonSummarySerializer(serializers.ModelSerializer):
    program_title = serializers.CharField(source="program.title", read_only=True)

    class Meta:
        model = Lesson
        fields = ["id", "program", "program_title", "title", "description", "starts_at", "ends_at"]


class AssignmentSerializer(AssignmentBaseSerializer):
    lesson = LessonSummarySerializer(read_only=True)

    class Meta(AssignmentBaseSerializer.Meta):
        fields = AssignmentBaseSerializer.Meta.fields + ["lesson"]
        read_only_fields = fields
