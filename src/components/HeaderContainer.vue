<template>
  <div class="header-container">
    <img
      id="cgLogo"
      :src="CGImage"
      alt="CG Logo"
      class="cg-logo"
    />
    <h1>3DXSync Dashboard </h1>
    <img
      id="minutusLogo"
      :src="MinLogo"
      alt="Minutus Logo"
      class="minutus-logo"
    />
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}
h1 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  flex-grow: 1;
  margin: 0 20px;
}
.minutus-logo {
  cursor: pointer;
  height: auto;
}
.cg-logo {
  width: 75px;
  height: auto;
}
</style>

<script setup>
import CGImage from '@/assets/images/CG.png';
import MinLogo from '@/assets/images/MinLogo.png';
</script>