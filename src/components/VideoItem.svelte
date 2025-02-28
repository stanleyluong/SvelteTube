<script>
  import { createEventDispatcher } from 'svelte';
  
  export let video;
  const dispatch = createEventDispatcher();
  
  function handleClick() {
    dispatch('select', video);
  }
  
  // Decode HTML entities
  function decodeHtml(html) {
    if (!html) return '';
    
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
</script>

<div class="video-item" on:click={handleClick}>
  <div class="thumbnail">
    <img 
      src={video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || 'https://via.placeholder.com/160x90?text=No+Thumbnail'} 
      alt={video.snippet?.title || 'Video thumbnail'} 
    />
  </div>
  <div class="info">
    <h3>{decodeHtml(video.snippet?.title) || 'Untitled Video'}</h3>
    <p>{decodeHtml(video.snippet?.channelTitle) || 'Unknown Channel'}</p>
  </div>
</div>

<style>
  .video-item {
    display: flex;
    align-items: flex-start;
    padding: 12px;
    margin-bottom: 16px;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.2s;
  }
  
  .video-item:hover {
    background-color: #f5f5f5;
  }
  
  .thumbnail {
    width: 160px;
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .thumbnail img {
    width: 100%;
    border-radius: 6px;
  }
  
  .info {
    flex: 1;
  }
  
  h3 {
    font-size: 16px;
    margin: 0 0 8px 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  p {
    font-size: 14px;
    color: #606060;
    margin: 0;
  }
</style>