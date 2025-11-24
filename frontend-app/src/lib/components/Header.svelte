<script>
  let userName = 'Matheus Tavares';
</script>

<div class="header-bar">
  <div class="brand-container">
    <div class="brand-logo">💸</div>
    <div class="brand-name">MyFinances</div>
  </div>

  <div class="header-actions">
    <div class="search-bar">
      <span>🔍</span>
      <input type="text" placeholder="Buscar despesas, metas..." />
    </div>

    <div>🔔</div>

    <div class="user-profile">
      <div class="user-avatar">{userName.split(' ').map(n => n[0]).join('')}</div>
      <div>{userName}</div>
    </div>
  </div>
</div>

<style>
  .header-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background-color: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    z-index: 100;
  }

  .brand-container {
    display: flex;
    align-items: center;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background-color: #4169e1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 18px;
    margin-right: 12px;
  }

  .brand-name {
    font-weight: 600;
    font-size: 18px;
    background: linear-gradient(90deg, #4169e1, #9370db);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .search-bar {
    background-color: #f6f8ff;
    border-radius: 20px;
    padding: 8px 15px;
    display: flex;
    align-items: center;
    width: 250px;
  }

  .search-bar input {
    background: none;
    border: none;
    outline: none;
    font-size: 14px;
    width: 100%;
    color: #1a2542;
    margin-left: 8px;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background-color: #f6f8ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4169e1;
    font-weight: bold;
  }
</style>

