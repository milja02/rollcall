from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register("programs", views.ProgramViewSet, basename="program")
router.register("lessons", views.LessonSerializer, basename="lesson")
urlpatterns = router.urls
