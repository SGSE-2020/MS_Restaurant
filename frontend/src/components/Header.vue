<template>
    <nav id="restaurants_nav" class="header level">
        <div class="level-left">
            <a href="/"><img class="header-logo" src="melon_32.png" alt="Smart City - Restaurants Logo"></a>
            <h1>Smart City - Restaurants</h1>
        </div>
        <div class="level-right">
            <div class="columns" v-if="!user">
                <b-input class="column" type="email" placeholder="E-Mail" v-model="email"></b-input>
                <b-input class="column" type="password" placeholder="Passwort" v-model="password"></b-input>
                <b-button class="button-column button-green-bg" @click.prevent="loginUser()">Login</b-button>
                <a class="link" href="http://portal.dvess.network">Zum Portal</a>
            </div>
            <div class="columns" v-if="user">
                <p class="welcome-message column">Willkommen, {{username}}</p>
                <b-button class="button-column button-green-bg" @click.prevent="logoutUser()">Logout</b-button>
                <a class="link" href="http://portal.dvess.network">Zum Portal</a>
            </div>
        </div>
    </nav>
</template>

<script>
import firebase from 'firebase'

export default {
    data() {
        return {
            user: null,
            email: null,
            password: null,
            username: null
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                this.user = user
                this.email = user.email
                this.username = user.displayName
            } else {
                this.user = null
                this.email = null
                this.username = null
                document.cookie = 'token=;'
            }
        })
    },
    methods: {
        loginUser: function() {
            var email = this.email
            var password = this.password

            if(email != undefined && email.length > 0 && password != undefined && password.length > 0){
                firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                    firebase.auth().currentUser.getIdToken(true).then((idToken) => {
                        //Token zu Bürgerbüro senden -> Uid zurückbekommen -> Dann User validiert
                        fetch('https://buergerbuero.dvess.network/api/user/verify/' + idToken, {method: 'POST'}).then(response => response.json()).then(json => {
                            if (json && json.status == 'success') {
                                this.user = firebase.auth().currentUser
                                this.email = this.user.email
                                this.username = this.user.displayName
                                document.cookie = 'token=' + idToken + ';'
                            } else {
                                alert("Dieser Nutzer konnte nicht verifiziert werden")
                            }
                        }).catch((error) => {
                            console.log(error)
                            alert("Dieser Nutzer konnte nicht verifiziert werden")
                        })
                        console.log("Token ist:\n" + idToken);
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
.header-logo {
    margin-left: 4px;
}

.button-green-bg {
    background-color: #42b983;
    border-color: transparent;
    color: #fff;
}

.button-green-bg:hover {
    background-color: #34af80;
    border-color: transparent;
    color: #fff;
}

.button-green-bg:focus {
    background-color: #42b983;
    border-color: transparent;
    color: #fff;
}

.header {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 1;
}

.button-column {
    margin: 0.75rem;
}

.welcome-message {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: #42b983;
    padding-top: 1.125rem;
}

.link {
    color: #fff;
    padding-bottom: calc(0.375em - 1px);
    padding-left: 0.75em;
    padding-right: 0.75em;
    padding-top: calc(0.375em - 1px);
    background-color: #42b983;
    border-width: 1px;
    border: 1px solid transparent;
    border-radius: 4px;
    margin: 12px;
}

.link:hover {
    color: #fff;
    background-color: #34af80;
}

#restaurants_nav {
    padding: 10px 16px;
    padding-left: 4px;
    background-color: #2c3e50;
}

h1 {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: #42b983;
    font-weight: 800;
    font-size: x-large;
}

img {
    margin-right: 12px;
}

@media (max-width: 768px) {

}
</style>
