from django.core.mail import send_mail
from django.db.models import Count, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from taggit.models import Tag

from .models import Comment, Post
from .serializers import CommentSerializer, PostSerializer, ShareSerializer


class PostPagination(PageNumberPagination):
    page_size = 3


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PostSerializer
    pagination_class = PostPagination

    def get_queryset(self):
        queryset = Post.published.prefetch_related(
            Prefetch('comments', queryset=Comment.objects.filter(active=True))
        )
        tag_slug = self.request.query_params.get('tag')
        if tag_slug:
            tag = get_object_or_404(Tag, slug=tag_slug)
            queryset = queryset.filter(tags__in=[tag])
        return queryset

    @action(detail=True, methods=['get'])
    def similar(self, request, pk=None):
        post = self.get_object()
        post_tags_ids = post.tags.values_list('id', flat=True)
        similar_posts = (
            Post.published.filter(tags__in=post_tags_ids)
            .exclude(id=post.id)
            .annotate(same_tags=Count('tags'))
            .order_by('-same_tags', '-publish')[:4]
        )
        serializer = self.get_serializer(similar_posts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        post = self.get_object()
        if request.method == 'GET':
            comments = post.comments.filter(active=True)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        post = self.get_object()
        serializer = ShareSerializer(data=request.data)
        if serializer.is_valid():
            cd = serializer.validated_data
            post_url = request.build_absolute_uri(post.get_absolute_url())
            subject = f"{cd['name']} recommends you read {post.title}"
            message = (
                f"Read {post.title} at {post_url}\n\n"
                f"{cd['name']}'s comments: {cd.get('comments', '')}"
            )
            send_mail(subject, message, from_email=None, recipient_list=[cd['to']])
            return Response({'sent': True})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
