from django.db import models
from django.db.models import F, Q
from django.conf import settings

class Program(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank = True)
    coordinator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="programs")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
            return self.title

class Lesson(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()

    class Meta:
        ordering = ["starts_at"]
        constraints = [
            models.CheckConstraint(
                condition=Q(ends_at__gt=F("starts_at")), name="lesson_ends_after_start"
            )
        ]

    def __str__(self):
        return self.title


class LessonAssignment(models.Model):
    class Status(models.TextChoices):
        ASSIGNED = "ASSIGNED"
        REPORTED = "REPORTED"
        CONFIRMED = "CONFIRMED"
        REJECTED = "REJECTED"

    class Attendance(models.TextChoices):
        PRESENT = "PRESENT"
        ABSENT = "ABSENT"

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="assignments")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="assignments"
    )
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ASSIGNED)
    attendance = models.CharField(max_length=7, choices=Attendance.choices, null=True, blank=True)
    reported_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="reviewed_assignments",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_comment = models.TextField(blank=True)
    
    replaced_from = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="replaced_assignments",
    )
    replacement_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["lesson", "user"], name="unique_lecturer_per_lesson")
        ]

    def __str__(self):
        return f"{self.user_id} -> {self.lesson_id} ({self.status})"
