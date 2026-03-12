from django.shortcuts import get_object_or_404, render
from .models import Post
from django.http import Http404
# Create your views here.
def post_list(request):
    posts = Post.published.all()
    return render(request, 'blog/post/list.html', {'posts': posts})
def post_detail(request, id):
    post = get_object_or_404(Post.published, id=id, status=Post.Status.PUBLISHED)
    try:
        post = Post.published.get(id=id)
    except Post.DoesNotExist:
        raise Http404("No post found.")
    return render(request, 'blog/post/detail.html', {'post': post})
