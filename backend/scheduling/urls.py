from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()
router.register("programs", views.ProgramViewSet, basename="program")
router.register("lessons", views.LessonViewSet, basename="lesson")
router.register("assignments", views.AssignmentViewSet, basename="assignment")

urlpatterns = [
    path("lecturers/", views.LecturerListView.as_view()),
    *router.urls,
]
