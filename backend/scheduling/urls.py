from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register("programs", views.ProgramViewSet, basename="program")
urlpatterns = router.urls
