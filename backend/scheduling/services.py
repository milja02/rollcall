# Business rules

from rest_framework.exceptions import APIException, ValidationError
from .models import LessonAssignment

class Conflict(APIException):
    status_code = 409
    default_detail = "Conflict"
    default_code = "conflict"

def find_overlap(user, starts_at, ends_at, exclude_lesson = None):
    qs = LessonAssignment.objects.select_related("lesson").filter(user = user, lesson__starts_at__lt = ends_at, lesson__ends_at__gt=starts_at) # lt - less than, gt - greater than (ending at 10:00 and starting at 10:00 is not an overlap)
    if exclude_lesson is not None:
        qs = qs.exclude(lesson = exclude_lesson)
    assignment = qs.first()
    return assignment.lesson if assignment else None

def check_lesson_time(starts_at, ends_at, lesson = None):
    if ends_at <= starts_at:
        raise ValidationError({"ends_at": "End must be later than start"})
    if lesson is not None:
        for assignment in lesson.assignment.select_related("user"):
            other = find_overlap(assignment.user, starts_at, ends_at, exclude_lesson=lesson)
            if other:
                raise Conflict(f"{assignment.user.full_name} is already assigned to '{other.title}' at that time")
        