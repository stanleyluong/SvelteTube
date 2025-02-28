<script>
  import { createEventDispatcher } from 'svelte';
  import VideoItem from './VideoItem.svelte';
  
  export let videos = [];
  const dispatch = createEventDispatcher();
  
  function handleVideoSelect(event) {
    dispatch('videoSelect', event.detail);
  }
</script>

<div class="video-list">
  <h2>Videos</h2>
  {#if videos.length === 0}
    <p class="no-videos">No videos found</p>
  {:else}
    {#each videos as video, i (video.id?.videoId || video.etag || i)}
      <VideoItem 
        video={video} 
        on:select={handleVideoSelect} 
      />
    {/each}
  {/if}
</div>

<style>
  .video-list {
    max-height: 90vh;
    overflow-y: auto;
    padding-right: 12px;
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
  
  .no-videos {
    padding: 20px;
    text-align: center;
    color: #666;
    font-style: italic;
  }
</style>