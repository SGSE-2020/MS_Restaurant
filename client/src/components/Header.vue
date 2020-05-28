<template>
    <nav id="restaurants_nav" class="header level">
        <div class="level-left">
            <img src="melon_48.png" alt="Smart City - Restaurants Logo">
            <h1>Smart City - Restaurants</h1>
        </div>
        <div class="level-right">
          <div v-if="!email">
            <b-button type="is-success" @click.prevent="loginUser()">Login</b-button>
          </div>
          <div v-if="email">
            <b-button type="is-success" @click.prevent="logoutUser()">{{email}}</b-button>
          </div>
        </div>
    </nav>
</template>

<script>
import firebase from 'firebase'

export default {
  data() {
    return {
      email: null
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null)
        this.email = user.email
      else
        this.email = null
    })
  },
  methods: {
    loginUser() {
        var email = "exampleuser@test.de";
        var password = "sgse-ss2020";

        if(email != undefined && email.length > 0 && password != undefined && password.length > 0){
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
                self.email = user.email
                firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                    //Token zu Bürgerbüro senden -> Uid zurückbekommen -> Dann User validiert
                    alert("Token ist:" + idToken);
                    console.log(firebase.auth().currentUser);
                }).catch(function(error) {
                    console.log(error);
                });
            }, function(error) {
                if(error.code == "auth/invalid-email" || error.code == "auth/wrong-password" || error.code == "auth/user-not-found"){
                    alert("E-Mail oder Passwort falsch oder User existiert nicht");
                } else if(error.code == "auth/user-disabled"){
                    alert("Dieser Nutzer ist deaktiviert");
                } else {
                    alert(error);
                }
            });
        } else {
          firebase.auth().signOut().then(function() {
            //Logout erfolgreich
          }, function() {
            alert("Bitte Mail und Passwort eingeben"); 
          });
        }
    },
    logoutUser() {
      firebase.auth().signOut().then(function() {
        //Logout erfolgreich
      }, function() {
        alert("Logout fehlgeschlagen");
      });
    }
  }
}
</script>

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
