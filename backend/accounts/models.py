from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

class Role(models.TextChoices):
    ADMIN = "ADMIN", "Administrator"
    COORDINATOR = "COORDINATOR", "Coordinator"
    LECTURER = "LECTURER", "Lecturer"

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password = None, **extra_fields):
        if not email:
            raise ValueError("Email is required.")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password = None, **extra_fields):
        extra_fields.setdefault("role", Role.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email,password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique = True)
    full_name = models.CharField(max_length=150)
    role = models.CharField(max_length=12, choices=Role.choices, default=Role.LECTURER)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default = False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return f"{self.full_name} {self.email}"