<script>
  export let apiKey = null;
</script>

{#if !apiKey}
  <div class="api-key-error">
    <h2>⚠️ YouTube API Key Required</h2>
    <p>This application requires a YouTube Data API key to function properly.</p>
    
    <h3>How to set up your API key:</h3>
    <ol>
      <li>Create a new project in the <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer">Google Developers Console</a></li>
      <li>Enable the YouTube Data API v3 for your project</li>
      <li>Create an API key in the credentials section</li>
      <li>Create a file named <code>.env.local</code> in the root directory of this project</li>
      <li>Add the following line to the file, replacing <code>YOUR_API_KEY</code> with your actual key:
        <pre>VITE_API_KEY=YOUR_API_KEY</pre>
      </li>
      <li>Restart the development server</li>
    </ol>
    
    <p class="note">Note: Your API key should be kept private and not committed to public repositories.</p>
  </div>
{/if}

<style>
  .api-key-error {
    max-width: 800px;
    margin: 40px auto;
    padding: 24px;
    background-color: #fff3e0;
    border-left: 4px solid #ff9800;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-top: 0;
    color: #e65100;
  }
  
  h3 {
    margin-top: 24px;
    margin-bottom: 16px;
  }
  
  ol {
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 12px;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 8px 12px;
    border-radius: 4px;
    overflow-x: auto;
    font-family: monospace;
    margin: 8px 0;
  }
  
  code {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
  }
  
  .note {
    margin-top: 24px;
    font-style: italic;
    color: #666;
  }
  
  a {
    color: #f57c00;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
</style>