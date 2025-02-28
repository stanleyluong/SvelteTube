<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  let searchTerm = '';

  function handleSubmit(event) {
    event.preventDefault();
    dispatch('submit', searchTerm);
  }
</script>

<form on:submit={handleSubmit} class="search-form">
  <input 
    type="text" 
    placeholder="Search for videos..." 
    bind:value={searchTerm}
    class="search-input"
  />
  <button type="submit" class="search-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    Search
  </button>
</form>

<style>
  .search-form {
    display: flex;
    gap: 8px;
    width: 100%;
    margin-bottom: 24px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .search-input {
    flex: 1;
    padding: 14px 18px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 30px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    font-family: 'Inter', sans-serif;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #ff3e00;
    box-shadow: 0 2px 12px rgba(255, 62, 0, 0.15);
  }

  .search-button {
    padding: 12px 28px;
    background-color: #ff3e00;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(255, 62, 0, 0.3);
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .search-icon {
    stroke-width: 3;
  }

  .search-button:hover {
    background-color: #e63700;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 62, 0, 0.4);
  }
  
  .search-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 62, 0, 0.3);
  }
  
  @media (max-width: 600px) {
    .search-form {
      flex-direction: column;
    }
    
    .search-button {
      width: 100%;
    }
  }
</style>