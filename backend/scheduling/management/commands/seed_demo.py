from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from accounts.models import Role, User
from scheduling.models import Lesson, LessonAssignment, Program

PASSWORD = "demo12345"
Status = LessonAssignment.Status
Attendance = LessonAssignment.Attendance


def create_user(email, full_name, role, superuser=False):
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "full_name": full_name,
            "role": role,
            "is_staff": superuser,
            "is_superuser": superuser,
        },
    )
    if created:
        user.set_password(PASSWORD)
        user.save()
    return user


def add_lesson(program, title, day_offset, hour, lecturer, status, attendance=None, comment=""):
    start = timezone.localtime().replace(hour=hour, minute=0, second=0, microsecond=0)
    start += timedelta(days=day_offset)
    lesson = Lesson.objects.create(
        program=program,
        title=title,
        starts_at=start,
        ends_at=start + timedelta(minutes=90),
    )
    reported = status != Status.ASSIGNED
    reviewed = status in (Status.CONFIRMED, Status.REJECTED)
    LessonAssignment.objects.create(
        lesson=lesson,
        user=lecturer,
        status=status,
        attendance=attendance,
        reported_at=start + timedelta(hours=2) if reported else None,
        reviewed_by=program.coordinator if reviewed else None,
        reviewed_at=start + timedelta(hours=5) if reviewed else None,
        review_comment=comment,
    )


class Command(BaseCommand):
    help = "Create demo users, programs and lessons. Safe to run more than once."

    @transaction.atomic
    def handle(self, *args, **options):
        create_user("admin@rollcall.test", "Ada Admin", Role.ADMIN, superuser=True)
        coordinator = create_user("coordinator@rollcall.test", "Cene Coordinator", Role.COORDINATOR)
        lara = create_user("lecturer@rollcall.test", "Lara Lecturer", Role.LECTURER)
        luka = create_user("lecturer2@rollcall.test", "Luka Lecturer", Role.LECTURER)

        if Program.objects.exists():
            self.stdout.write("Demo data already present, skipping programs and lessons.")
            return

        dsa = Program.objects.create(
            title="Data Structures and Algorithms",
            description="Core data structures, complexity analysis and classic algorithms.",
            coordinator=coordinator,
        )
        oop = Program.objects.create(
            title="Object Oriented Programming",
            description="Object oriented design from classes to design patterns.",
            coordinator=coordinator,
        )

        add_lesson(dsa, "Big O Notation", -7, 14, luka, Status.CONFIRMED, Attendance.PRESENT)
        add_lesson(dsa, "Arrays and Linked Lists", -7, 10, lara, Status.CONFIRMED, Attendance.PRESENT)
        add_lesson(dsa, "Stacks and Queues", -6, 10, lara, Status.CONFIRMED, Attendance.PRESENT)
        add_lesson(dsa, "Hash Tables", -4, 12, lara, Status.CONFIRMED, Attendance.ABSENT)
        add_lesson(dsa, "Binary Search Trees", -3, 10, lara, Status.REPORTED, Attendance.PRESENT)
        add_lesson(dsa, "Heaps and Priority Queues", -2, 10, lara, Status.REPORTED, Attendance.PRESENT)
        add_lesson(dsa, "Graph Traversal", -1, 14, lara, Status.REJECTED, Attendance.PRESENT, "Please check the date.")
        add_lesson(dsa, "Sorting Algorithms", 0, 16, lara, Status.ASSIGNED)
        add_lesson(dsa, "Dynamic Programming", 2, 10, lara, Status.ASSIGNED)
        add_lesson(dsa, "Greedy Algorithms", 4, 12, lara, Status.ASSIGNED)

        add_lesson(oop, "Classes and Objects", -5, 12, luka, Status.CONFIRMED, Attendance.PRESENT)
        add_lesson(oop, "Inheritance", -3, 14, luka, Status.CONFIRMED, Attendance.PRESENT)
        add_lesson(oop, "Polymorphism", -2, 14, luka, Status.REPORTED, Attendance.ABSENT)
        add_lesson(oop, "Interfaces and Abstract Classes", -1, 12, luka, Status.REPORTED, Attendance.PRESENT)
        add_lesson(oop, "Exception Handling", 1, 12, luka, Status.ASSIGNED)
        add_lesson(oop, "SOLID Principles", 3, 14, luka, Status.ASSIGNED)
        add_lesson(oop, "Design Patterns", 5, 12, luka, Status.ASSIGNED)
        add_lesson(oop, "Generics and Collections", 6, 10, lara, Status.ASSIGNED)

        self.stdout.write(self.style.SUCCESS(f"Demo data created. Password for all users: {PASSWORD}"))
