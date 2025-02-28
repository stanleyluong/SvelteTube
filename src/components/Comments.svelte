
<script>
  import { onMount } from 'svelte';
  import youtube from '../api/youtube';
  
  export let videoId = '';
  
  let comments = [];
  let isLoading = false;
  let error = null;
  let nextPageToken = '';
  let hasMore = false;
  
  $: if (videoId) {
    loadComments();
  }
  
  async function loadComments() {
    if (!videoId) return;
    
    isLoading = true;
    error = null;
    
    try {
      const response = await youtube.get('commentThreads', {
        params: {
          part: 'snippet',
          videoId: videoId,
          maxResults: 10,
          order: 'relevance',
        }
      });
      
      console.log('Comments response:', response.data);
      
      if (response.data && Array.isArray(response.data.items)) {
        comments = response.data.items;
        nextPageToken = response.data.nextPageToken || '';
        hasMore = !!nextPageToken;
      } else {
        comments = [];
        error = 'No comments available for this video.';
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      error = err.response?.data?.error?.message || 'Failed to load comments';
      comments = [];
    } finally {
      isLoading = false;
    }
  }
  
  async function loadMoreComments() {
    if (!nextPageToken) return;
    
    isLoading = true;
    
    try {
      const response = await youtube.get('commentThreads', {
        params: {
          part: 'snippet',
          videoId: videoId,
          maxResults: 10,
          order: 'relevance',
          pageToken: nextPageToken
        }
      });
      
      if (response.data && Array.isArray(response.data.items)) {
        comments = [...comments, ...response.data.items];
        nextPageToken = response.data.nextPageToken || '';
        hasMore = !!nextPageToken;
      }
    } catch (err) {
      console.error('Error loading more comments:', err);
    } finally {
      isLoading = false;
    }
  }
  
  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffYears > 0) {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
    } else if (diffMonths > 0) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    } else if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  }
  
  // Generate a letter avatar based on the username
  function getLetterAvatar(username) {
    if (!username) return '';
    
    // Get the first non-@ letter of the username and uppercase it
    let displayLetter = 'U'; // Default to 'U' for "User"
    
    if (username) {
      // Skip @ if it's the first character, and find the first letter
      const nameWithoutAt = username.startsWith('@') ? username.substring(1) : username;
      if (nameWithoutAt.length > 0) {
        displayLetter = nameWithoutAt.charAt(0).toUpperCase();
      }
    }
    
    // Generate a color based on the username (this ensures the same user always gets the same color)
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    const baseColor = `hsl(${hue}, 65%, 45%)`;
    
    // Create an SVG with the letter
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='48' height='48'%3E%3Ccircle cx='50' cy='50' r='50' fill='${encodeURIComponent(baseColor)}'/%3E%3Ctext x='50' y='50' dy='.35em' text-anchor='middle' dominant-baseline='middle' fill='white' font-family='sans-serif' font-size='40' font-weight='bold'%3E${displayLetter}%3C/text%3E%3C/svg%3E`;
  }
  
  // Clean comment text for rendering
  function cleanCommentText(text) {
    if (!text) return '';
    
    // Use browser's built-in HTML entity decoding
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    
    return txt.value;
  }
</script>

<div class="comments-section">
  <h3>Comments</h3>
  
  {#if isLoading && comments.length === 0}
    <div class="loading">Loading comments...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if comments.length === 0}
    <div class="no-comments">No comments found for this video.</div>
  {:else}
    <div class="comments-list">
      {#each comments as comment}
        {#if comment.snippet && comment.snippet.topLevelComment}
          {@const commentData = comment.snippet.topLevelComment.snippet}
          <div class="comment">
            <div class="comment-avatar">
              <img 
                src={commentData.authorProfileImageUrl || getLetterAvatar(commentData.authorDisplayName)} 
                alt={`${commentData.authorDisplayName}'s profile`}
                on:error={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = getLetterAvatar(commentData.authorDisplayName);
                }}
              />
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="author-name">{commentData.authorDisplayName}</span>
                <span class="comment-date">{formatDate(commentData.publishedAt)}</span>
              </div>
              <div class="comment-text">{@html cleanCommentText(commentData.textDisplay)}</div>
              <div class="comment-actions">
                <span class="like-count">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  {commentData.likeCount || 0}
                </span>
                {#if comment.snippet.totalReplyCount > 0}
                  <span class="reply-count">{comment.snippet.totalReplyCount} {comment.snippet.totalReplyCount === 1 ? 'reply' : 'replies'}</span>
                {/if}
              </div>
            </div>
          </div>
        {/if}
      {/each}
      
      {#if isLoading}
        <div class="loading-more">Loading more comments...</div>
      {/if}
      
      {#if hasMore && !isLoading}
        <button class="load-more-btn" on:click={loadMoreComments}>
          Load more comments
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .comments-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #eee;
  }
  
  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    font-weight: 600;
    color: #333;
  }
  
  .loading, .error, .no-comments {
    padding: 20px;
    text-align: center;
    color: #666;
  }
  
  .error {
    color: #d32f2f;
    background-color: #ffebee;
    border-radius: 4px;
  }
  
  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .comment {
    display: flex;
    gap: 16px;
  }
  
  .comment-avatar {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
  }
  
  .comment-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background-color: #f5f5f5;
    border: 1px solid #eee;
  }
  
  .comment-content {
    flex: 1;
  }
  
  .comment-header {
    display: flex;
    align-items: baseline;
    margin-bottom: 4px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .author-name {
    font-weight: 600;
    font-size: 14px;
    color: #333;
  }
  
  .comment-date {
    font-size: 12px;
    color: #777;
  }
  
  .comment-text {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 8px;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  
  /* Fix styling for HTML content in comments */
  .comment-text :global(br) {
    display: block;
    content: "";
    margin-top: 8px;
  }
  
  .comment-text :global(a) {
    color: #065fd4;
    text-decoration: none;
  }
  
  .comment-text :global(a:hover) {
    text-decoration: underline;
  }
  
  .comment-actions {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #777;
  }
  
  .like-count, .reply-count {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .loading-more {
    text-align: center;
    padding: 12px;
    font-size: 14px;
    color: #666;
  }
  
  .load-more-btn {
    margin: 0 auto;
    display: block;
    padding: 8px 16px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    color: #555;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .load-more-btn:hover {
    background-color: #e8e8e8;
  }
</style>