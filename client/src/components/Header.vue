<template>
    <nav id="restaurants_nav" class="header level">
        <div class="level-left">
            <img src="melon_48.png" alt="Smart City - Restaurants Logo">
            <h1>Smart City - Restaurants</h1>
        </div>
        <div class="level-right">
            <b-button type="is-success">Login</b-button>
        </div>
    </nav>
</template>

<style>
.header {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 1;
}

#restaurants_nav {
  padding: 8px 16px;
  padding-left: 4px;
  background-color: #2c3e50;
}

h1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #42b983;
  font-weight: 900;
  font-size: xx-large;
}

img {
  margin-right: 12px;
}
</style>
