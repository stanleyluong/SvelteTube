<script>
  import { onMount } from 'svelte';
  import youtube from './api/youtube';
  import SearchBar from './components/SearchBar.svelte';
  import VideoDetail from './components/VideoDetail.svelte';
  import VideoList from './components/VideoList.svelte';
  import ApiKeyError from './components/ApiKeyError.svelte';
  
  let videos = [];
  let selectedVideo = null;
  let isLoading = false;
  let error = null;
  const apiKey = import.meta.env.VITE_API_KEY;
  let currentChannel = null;
  
  onMount(() => {
    if (apiKey) {
      loadChannelVideos('@fullstackbook');
    }
  });
  
  // Function to load videos from a specific channel
  async function loadChannelVideos(channelUsername) {
    isLoading = true;
    error = null;
    videos = [];
    selectedVideo = null;
    
    try {
      // First, get the channel ID from the username
      const channelResponse = await youtube.get('search', { 
        params: { 
          q: channelUsername,
          type: 'channel',
          part: 'snippet',
          maxResults: 1
        } 
      });
      
      console.log('Channel search response:', channelResponse.data);
      
      if (channelResponse.data && channelResponse.data.items && channelResponse.data.items.length > 0) {
        const channelData = channelResponse.data.items[0];
        const channelId = channelData.id.channelId;
        
        // Store channel info for display
        currentChannel = {
          id: channelId,
          title: channelData.snippet.title,
          description: channelData.snippet.description,
          thumbnail: channelData.snippet.thumbnails.default.url
        };
        
        // Now, get videos from the channel
        const videosResponse = await youtube.get('search', { 
          params: { 
            channelId: channelId,
            type: 'video',
            part: 'snippet',
            maxResults: 20,
            order: 'date'
          } 
        });
        
        console.log('Channel videos response:', videosResponse.data);
        
        if (videosResponse.data && Array.isArray(videosResponse.data.items) && videosResponse.data.items.length > 0) {
          // Get video IDs to fetch additional details
          const videoIds = videosResponse.data.items.map(item => item.id.videoId).join(',');
          
          // Get additional video details
          const videoDetailsResponse = await youtube.get('videos', {
            params: {
              id: videoIds,
              part: 'snippet,statistics,contentDetails',
            }
          });
          
          if (videoDetailsResponse.data && Array.isArray(videoDetailsResponse.data.items)) {
            // Merge search results with detailed information
            const detailedVideos = videoDetailsResponse.data.items;
            
            // Enrich the search results with the detailed information
            const enrichedVideos = videosResponse.data.items.map(searchItem => {
              const details = detailedVideos.find(
                detailItem => detailItem.id === searchItem.id.videoId
              );
              
              if (details) {
                return {
                  ...searchItem,
                  statistics: details.statistics,
                  contentDetails: details.contentDetails,
                  // Keep both snippet versions but prioritize the detailed one
                  fullSnippet: details.snippet
                };
              }
              
              return searchItem;
            });
            
            // Update the videos array with detailed results
            videos = enrichedVideos;
            selectedVideo = videos[0];
          } else {
            // Fall back to search results if details request fails
            videos = [...videosResponse.data.items];
            selectedVideo = videos[0];
          }
        } else {
          error = 'No videos found for this channel.';
        }
      } else {
        error = 'Channel not found.';
      }
    } catch (err) {
      console.error('Error fetching channel videos:', err);
      error = `Failed to load channel videos: ${err.message}`;
    } finally {
      isLoading = false;
    }
  }
  
  async function handleSubmit(searchTerm) {
    // Check if searchTerm is an event (from the SearchBar component)
    if (searchTerm && typeof searchTerm === 'object' && searchTerm.detail) {
      searchTerm = searchTerm.detail;
    }
    // Reset state for new search
    isLoading = true;
    error = null;
    videos = [];
    selectedVideo = null;
    currentChannel = null; // Clear channel when searching
    
    console.log(`Searching for: "${searchTerm}"`);
    
    if (!searchTerm || searchTerm.trim() === '') {
      error = 'Please enter a search term';
      isLoading = false;
      return;
    }
    
    try {
      // First, search for videos
      const searchResponse = await youtube.get('search', { 
        params: { 
          q: searchTerm,
          type: 'video',
          part: 'snippet',
          maxResults: 20,
          // Add timestamp to avoid caching issues
          _: new Date().getTime()
        } 
      });
      
      console.log('Search Response:', searchResponse.data);
      
      if (searchResponse.data && Array.isArray(searchResponse.data.items) && searchResponse.data.items.length > 0) {
        // Get video IDs to fetch additional details
        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
        
        // Get additional video details including statistics
        const videoDetailsResponse = await youtube.get('videos', {
          params: {
            id: videoIds,
            part: 'snippet,statistics,contentDetails',
            _: new Date().getTime()
          }
        });
        
        console.log('Video Details Response:', videoDetailsResponse.data);
        
        if (videoDetailsResponse.data && Array.isArray(videoDetailsResponse.data.items)) {
          // Merge search results with detailed information
          const detailedVideos = videoDetailsResponse.data.items;
          
          // Let's also enrich the search results with the detailed information
          const enrichedVideos = searchResponse.data.items.map(searchItem => {
            const details = detailedVideos.find(
              detailItem => detailItem.id === searchItem.id.videoId
            );
            
            if (details) {
              return {
                ...searchItem,
                statistics: details.statistics,
                contentDetails: details.contentDetails,
                // Keep both snippet versions but prioritize the detailed one
                fullSnippet: details.snippet
              };
            }
            
            return searchItem;
          });
          
          // Update the videos array with detailed results
          videos = enrichedVideos;
          selectedVideo = videos[0];
          
          console.log('Enriched results:', videos.length, 'videos found');
          console.log('First video with details:', selectedVideo);
        } else {
          // Fall back to search results if details request fails
          videos = [...searchResponse.data.items];
          selectedVideo = videos[0];
        }
      } else {
        console.warn('No videos found in response');
        videos = [];
        selectedVideo = null;
        error = 'No videos found for this search term. Please try another search.';
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      error = `Failed to load videos: ${err.message}`;
      videos = [];
      selectedVideo = null;
    } finally {
      isLoading = false;
    }
  }
  
  function handleVideoSelect(event) {
    selectedVideo = event.detail;
  }
</script>

<main>
  <div class="app-container">
    <header>
      <h1>Svelte Tube</h1>
      
      {#if apiKey}
        <SearchBar on:submit={handleSubmit} />
      {/if}
    </header>
    
    <ApiKeyError apiKey={apiKey} />
    
    {#if apiKey}
      {#if error}
        <div class="error-message">{error}</div>
      {/if}
      
      {#if isLoading}
        <div class="loading">Loading videos...</div>
      {:else if videos.length > 0}
        <div class="content">
          <div class="main-content">
            <VideoDetail video={selectedVideo} />
          </div>
          <div class="sidebar">
            <VideoList videos={videos} on:videoSelect={handleVideoSelect} />
          </div>
        </div>
      {/if}
    {/if}
  </div>
</main>

<style>
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #f9f9f9;
    color: #333;
  }
  
  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }
  
  header {
    margin-bottom: 24px;
  }
  
  .channel-info {
    margin: 20px 0;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .channel-header {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .channel-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .channel-details {
    flex: 1;
  }
  
  .channel-title {
    font-size: 18px;
    font-weight: 600;
    font-family: 'Montserrat', sans-serif;
    margin: 0 0 4px 0;
    color: #333;
  }
  
  h1 {
    color: #ff3e00;
    font-size: 42px;
    font-family: 'Pacifico', cursive;
    font-weight: 400;
    margin: 0 0 24px 0;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: 1px;
  }
  
  .content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .loading, .error-message {
    text-align: center;
    padding: 48px;
    font-size: 18px;
  }
  
  .error-message {
    color: #d32f2f;
    background-color: #ffebee;
    border-radius: 8px;
    padding: 16px;
  }
  
  @media (min-width: 768px) {
    .content {
      grid-template-columns: 2fr 1fr;
    }
  }
</style>
