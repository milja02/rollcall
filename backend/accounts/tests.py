from django.test import TestCase
from rest_framework.test import APIClient

from .models import Role, User

PASSWORD = "geslo12345"


class LoginApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="ana@test.si", password=PASSWORD, full_name="Ana Novak", role=Role.COORDINATOR
        )

    def login(self, email, password):
        return self.client.post("/api/auth/login/", {"email": email, "password": password}, format="json")

    def test_login_with_correct_credentials_returns_user(self):
        response = self.login("ana@test.si", PASSWORD)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["role"], Role.COORDINATOR)

    def test_wrong_password_and_unknown_email_return_same_message(self):
        wrong_password = self.login("ana@test.si", "napacno")
        unknown_email = self.login("nihce@test.si", PASSWORD)
        self.assertEqual(wrong_password.status_code, 400)
        self.assertEqual(wrong_password.data["detail"], unknown_email.data["detail"])

    def test_disabled_user_cannot_log_in(self):
        self.user.is_active = False
        self.user.save()
        response = self.login("ana@test.si", PASSWORD)
        self.assertEqual(response.status_code, 403)
