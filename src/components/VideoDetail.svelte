<script>
  // Import Comments component
  import Comments from './Comments.svelte';
  
  export let video = null;
  
  // Extract the correct video ID from different possible formats
  function getVideoId(video) {
    if (!video) return null;
    
    // Handle different video ID formats the API might return
    if (typeof video.id === 'object' && video.id?.videoId) {
      return video.id.videoId;
    } else if (typeof video.id === 'string') {
      return video.id;
    } else if (video.id?.kind === 'youtube#video') {
      return video.id.videoId;
    } else {
      // Fallback using URL parameter if available
      return video.snippet?.resourceId?.videoId || '';
    }
  }
  
  // Format the date for video publish time
  function formatPublishDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
  
  // Decode HTML entities in strings
  function decodeHtml(html) {
    if (!html) return '';
    
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
  
  // For the view count
  function formatViewCount(count) {
    if (!count) return '0 views';
    
    count = Number(count);
    if (isNaN(count)) return '0 views';
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    } else {
      return `${count} views`;
    }
  }
</script>

{#if !video}
  <div class="loading">Loading...</div>
{:else}
  <div class="video-detail">
    <div class="video-wrapper">
      <iframe
        src={`https://www.youtube.com/embed/${getVideoId(video)}`}
        title={video.snippet?.title || 'YouTube Video'}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    
    <div class="video-info">
      <h2>{decodeHtml(video.snippet?.title) || 'No Title'}</h2>
      
      <div class="video-meta">
        <div class="channel-info">
          <h3>{decodeHtml(video.snippet?.channelTitle) || 'Unknown Channel'}</h3>
          {#if video.snippet?.publishedAt}
            <span class="publish-date">Published on {formatPublishDate(video.snippet.publishedAt)}</span>
          {/if}
        </div>
        
        {#if video.statistics}
          <div class="video-stats">
            <span class="view-count">{formatViewCount(video.statistics.viewCount)}</span>
            <span class="like-count">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              {video.statistics.likeCount || 0}
            </span>
          </div>
        {/if}
      </div>
      
      <div class="description">
        <p>{decodeHtml(video.snippet?.description) || 'No description available.'}</p>
      </div>
      
      <!-- Comments section -->
      {#if getVideoId(video)}
        <Comments videoId={getVideoId(video)} />
      {/if}
    </div>
  </div>
{/if}

<style>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 20px;
    color: #666;
  }

  .video-detail {
    margin-bottom: 24px;
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .video-info {
    padding: 0 8px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 16px;
    color: #333;
    font-weight: 700;
    line-height: 1.3;
    font-family: 'Montserrat', sans-serif;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 4px;
    color: #666;
    font-weight: 600;
  }
  
  .video-meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }
  
  .channel-info {
    margin-right: 16px;
    margin-bottom: 12px;
  }
  
  .publish-date {
    display: block;
    font-size: 14px;
    color: #777;
    margin-top: 4px;
  }
  
  .video-stats {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-top: 4px;
  }
  
  .view-count, .like-count {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #666;
  }
  
  .description {
    margin-bottom: 24px;
  }

  p {
    font-size: 16px;
    line-height: 1.6;
    color: #444;
    white-space: pre-line; /* Preserve line breaks in description */
  }
  
  .comments-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #eee;
  }
  
  .note {
    background-color: #fff3e0;
    border-left: 4px solid #ff9800;
    padding: 16px;
    margin-top: 16px;
    border-radius: 4px;
    font-style: italic;
  }
</style>