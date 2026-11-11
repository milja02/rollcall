from rest_framework.authentication import SessionAuthentication     
class SessionAuthentication401(SessionAuthentication):            

    def authenticate_header(self, request):                       
        return "Session"    #if it returns text then response is code 401 (unauthorized), if it returns none response is code 403 (forbidden)