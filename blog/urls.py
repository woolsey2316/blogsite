from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'blog'

router = DefaultRouter()
router.register('posts', views.PostViewSet, basename='post')

urlpatterns = [
    path('', include(router.urls)),
]
