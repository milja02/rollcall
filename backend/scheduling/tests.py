from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient

from accounts.models import Role, User

from . import services
from .models import Lesson, LessonAssignment, Program

Status = LessonAssignment.Status


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


class AssignLecturerTests(SchedulingTestCase):
    def test_assignment_starts_in_state_assigned(self):
        lesson = self.lesson("Uvod", at(1, 9))
        [assignment] = services.assign_lecturers(lesson, [self.lecturer])
        self.assertEqual(assignment.status, Status.ASSIGNED)

    def test_same_lecturer_cannot_be_assigned_twice(self):
        lesson = self.lesson("Uvod", at(1, 9))
        services.assign_lecturers(lesson, [self.lecturer])
        with self.assertRaises(services.Conflict):
            services.assign_lecturers(lesson, [self.lecturer])

    def test_overlapping_lesson_is_rejected_with_its_title(self):
        first = self.lesson("Prva", at(1, 9), minutes=90)
        second = self.lesson("Druga", at(1, 10))
        services.assign_lecturers(first, [self.lecturer])
        with self.assertRaises(services.Conflict) as ctx:
            services.assign_lecturers(second, [self.lecturer])
        self.assertIn("Prva", str(ctx.exception.detail))

    def test_lessons_that_only_touch_do_not_overlap(self):
        first = self.lesson("Prva", at(1, 9), minutes=60)  # 9:00 - 10:00
        second = self.lesson("Druga", at(1, 10))  # 10:00 - 11:00
        services.assign_lecturers(first, [self.lecturer])
        services.assign_lecturers(second, [self.lecturer])
        self.assertEqual(LessonAssignment.objects.filter(user=self.lecturer).count(), 2)

    def test_only_active_lecturers_can_be_assigned(self):
        lesson = self.lesson("Uvod", at(1, 9))
        with self.assertRaises(ValidationError):
            services.assign_lecturers(lesson, [self.coordinator])


class AttendanceTests(SchedulingTestCase):
    def assignment(self, starts_at):
        return LessonAssignment.objects.create(lesson=self.lesson("Lekcija", starts_at), user=self.lecturer)

    def test_report_past_lesson_sets_reported(self):
        assignment = services.report_attendance(self.assignment(at(-2, 9)), "PRESENT")
        self.assertEqual(assignment.status, Status.REPORTED)
        self.assertIsNotNone(assignment.reported_at)

    def test_cannot_report_future_lesson(self):
        with self.assertRaises(ValidationError):
            services.report_attendance(self.assignment(at(2, 9)), "PRESENT")

    def test_reported_attendance_cannot_be_changed(self):
        assignment = services.report_attendance(self.assignment(at(-2, 9)), "PRESENT")
        with self.assertRaises(services.Conflict):
            services.report_attendance(assignment, "ABSENT")

    def test_rejected_report_can_be_reported_again(self):
        assignment = services.report_attendance(self.assignment(at(-2, 9)), "PRESENT")
        services.reject_report(assignment, self.coordinator, "Napacen datum")
        services.report_attendance(assignment, "ABSENT")
        self.assertEqual(assignment.status, Status.REPORTED)
        self.assertEqual(assignment.attendance, "ABSENT")

    def test_confirm_saves_reviewer(self):
        assignment = services.report_attendance(self.assignment(at(-2, 9)), "PRESENT")
        services.confirm_report(assignment, self.coordinator)
        self.assertEqual(assignment.status, Status.CONFIRMED)
        self.assertEqual(assignment.reviewed_by, self.coordinator)
        self.assertIsNotNone(assignment.reviewed_at)

    def test_reject_requires_reason(self):
        assignment = services.report_attendance(self.assignment(at(-2, 9)), "PRESENT")
        with self.assertRaises(ValidationError):
            services.reject_report(assignment, self.coordinator, "   ")


class ReplaceLecturerTests(SchedulingTestCase):
    def setUp(self):
        super().setUp()
        self.other = User.objects.create_user(
            email="drugi@test.si", password="x", full_name="Drugi", role=Role.LECTURER
        )
        self.assignment = LessonAssignment.objects.create(lesson=self.lesson("Uvod", at(-1, 9)), user=self.lecturer)

    def test_replace_requires_reason(self):
        with self.assertRaises(ValidationError):
            services.replace_lecturer(self.assignment, self.other, "")

    def test_replace_changes_lecturer_and_remembers_old_one(self):
        services.replace_lecturer(self.assignment, self.other, "Bolniska")
        self.assertEqual(self.assignment.user, self.other)
        self.assertEqual(self.assignment.replaced_from, self.lecturer)

    def test_only_assigned_can_be_replaced(self):
        services.report_attendance(self.assignment, "PRESENT")
        with self.assertRaises(services.Conflict):
            services.replace_lecturer(self.assignment, self.other, "Bolniska")


class ProgramApiTests(SchedulingTestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()

    def test_coordinator_sees_only_own_programs(self):
        other = User.objects.create_user(email="k2@test.si", password="x", full_name="K2", role=Role.COORDINATOR)
        Program.objects.create(title="Tuj program", coordinator=other)
        self.client.force_authenticate(self.coordinator)
        response = self.client.get("/api/programs/")
        self.assertEqual([p["title"] for p in response.data], ["Program A"])

    def test_new_program_belongs_to_logged_in_coordinator(self):
        self.client.force_authenticate(self.coordinator)
        response = self.client.post("/api/programs/", {"title": "Nov program"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Program.objects.get(title="Nov program").coordinator, self.coordinator)

    def test_lecturer_cannot_access_programs(self):
        self.client.force_authenticate(self.lecturer)
        response = self.client.get("/api/programs/")
        self.assertEqual(response.status_code, 403)

    def test_lesson_must_end_after_it_starts(self):
        self.client.force_authenticate(self.coordinator)
        start = at(1, 10)
        response = self.client.post(
            "/api/lessons/",
            {"program": self.program.id, "title": "Napacna", "starts_at": start, "ends_at": start - timedelta(hours=1)},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
