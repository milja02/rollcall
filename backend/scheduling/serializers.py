from rest_framework import serializers
from .models import Program

class ProgramSerializer(serializers.ModelSerializer):
    lessons_count = serializers.IntegerField(read_only=True)
    coordinator_name = serializers.CharField(source = "coordinator.full_name", read_only = True)

    class Meta:
        model = Program
        fields = ["id", "title", "description", "coordinator", "coordinator_name", "lessons_count", "created_at"]
        read_only_fields = ["coordinator", "created_at"]