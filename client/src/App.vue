
<template>
  <div id="app">
    <div class="container-outer">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <Chat />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chat from './components/Chat.vue'

export default {
  name: 'app',
  components: {
    Chat
  }
}
</script>

<style>
  
  html{
    margin:0;
    background-color:rgb(105, 145, 255);
    font-family:Arial, Helvetica, sans-serif;
  }
</style>