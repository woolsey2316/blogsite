from rest_framework import serializers
from taggit.serializers import TagListSerializerField, TaggitSerializer

from .models import Comment, Post


class ShareSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=25)
    email = serializers.EmailField()
    to = serializers.EmailField()
    comments = serializers.CharField(required=False, allow_blank=True)


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'name', 'email', 'body', 'created']
        read_only_fields = ['id', 'created']


class PostSerializer(TaggitSerializer, serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    tags = TagListSerializerField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'slug',
            'author',
            'body',
            'publish',
            'created',
            'updated',
            'status',
            'tags',
            'comments',
        ]
        read_only_fields = ['id', 'created', 'updated', 'publish']
