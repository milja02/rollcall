from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, LoginSerializer

class CsrfView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"csrfToken": get_token(request)})

@method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        invalid = Response(
            {"detail": "Incorrect email or password."},
            status = status.HTTP_400_BAD_REQUEST
        )

        user = User.objects.filter(email__iexact=email).first()

        if user is None or not user.check_password(password):
            return invalid

        if not user.is_active:
            return Response(
                {"detail": "This account has been disabled."},
                status = status.HTTP_403_FORBIDDEN
            )

        login(request, user, backend="django.contrib.auth.backends.ModelBackend")
        return Response(UserSerializer(user).data)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

# Check if user is still logged in 
class MeView(APIView):                       
    def get(self, request):                  
        return Response(UserSerializer(request.user).data)
