from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient

from accounts.models import Role, User

from . import services
from .models import Lesson, LessonAssignment, Program


def at(day_offset, hour):
    """Local time `day_offset` days from today at the given hour."""
    now = timezone.localtime().replace(hour=hour, minute=0, second=0, microsecond=0)
    return now + timedelta(days=day_offset)


class SchedulingTestCase(TestCase):
    def setUp(self):
        self.coordinator = User.objects.create_user(
            email="koordinator@test.si", password="x", full_name="Koordinator", role=Role.COORDINATOR
        )
        self.lecturer = User.objects.create_user(
            email="predavatelj@test.si", password="x", full_name="Predavatelj", role=Role.LECTURER
        )
        self.program = Program.objects.create(title="Program A", coordinator=self.coordinator)

    def lesson(self, title, starts_at, minutes=60):
        return Lesson.objects.create(
            program=self.program, title=title, starts_at=starts_at, ends_at=starts_at + timedelta(minutes=minutes)
        )

    def assignment(self, starts_at):
        return LessonAssignment.objects.create(lesson=self.lesson("Lekcija", starts_at), user=self.lecturer)


class AssignLecturerTests(SchedulingTestCase):
    def test_same_lecturer_cannot_be_assigned_twice(self):
        lesson = self.lesson("Uvod", at(1, 9))
        services.assign_lecturers(lesson, [self.lecturer])
        with self.assertRaises(services.Conflict):
            services.assign_lecturers(lesson, [self.lecturer])

    def test_overlapping_lesson_is_rejected(self):
        first = self.lesson("Prva", at(1, 9), minutes=90)
        second = self.lesson("Druga", at(1, 10))
        services.assign_lecturers(first, [self.lecturer])
        with self.assertRaises(services.Conflict):
            services.assign_lecturers(second, [self.lecturer])

    def test_lessons_that_only_touch_do_not_overlap(self):
        first = self.lesson("Prva", at(1, 9), minutes=60)  # 9:00 - 10:00
        second = self.lesson("Druga", at(1, 10))  # 10:00 - 11:00
        services.assign_lecturers(first, [self.lecturer])
        services.assign_lecturers(second, [self.lecturer])
        self.assertEqual(LessonAssignment.objects.filter(user=self.lecturer).count(), 2)


class AttendanceTests(SchedulingTestCase):
    def test_cannot_report_future_lesson(self):
        with self.assertRaises(ValidationError):
            services.report_attendance(self.assignment(at(2, 9)), "PRESENT")

    def test_reported_attendance_cannot_be_changed(self):
        assignment = services.report_attendance(self.assignment(at(-2, 9)), "PRESENT")
        with self.assertRaises(services.Conflict):
            services.report_attendance(assignment, "ABSENT")

    def test_reject_requires_reason(self):
        assignment = services.report_attendance(self.assignment(at(-2, 9)), "PRESENT")
        with self.assertRaises(ValidationError):
            services.reject_report(assignment, self.coordinator, "   ")


class ProgramApiTests(SchedulingTestCase):
    def test_coordinator_sees_only_own_programs(self):
        other = User.objects.create_user(email="k2@test.si", password="x", full_name="K2", role=Role.COORDINATOR)
        Program.objects.create(title="Tuj program", coordinator=other)
        client = APIClient()
        client.force_authenticate(self.coordinator)
        response = client.get("/api/programs/")
        self.assertEqual([p["title"] for p in response.data], ["Program A"])
