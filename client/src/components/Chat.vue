<template>
  <div class="container">
    <div class="header">
      <h3>You are: <span v-bind:style="{color:'#'+this.color}">{{this.user}}</span></h3>
      <h3>Online Users: </h3>
    </div>
    <div class="mainContent">
        <div class="chatbox">
            <div class="messages" v-for="(msg, index) in messages" :key="index">
                <p v-bind:style="{fontWeight: msg.weight}">{{msg.time}} <span class="" v-bind:style="{color:'#'+ msg.color}">{{ msg.name }}: </span>{{ msg.message }}</p>
            </div>
        </div>
        <div class="online">
            <div class="connected_user" v-for="connected_user in this.connected_users" :key="connected_user">
            <p>{{ connected_user.name }}</p>
            </div>
        </div>     
    </div>
    <div class="footer">
        <form @submit.prevent="sendMessage">
            <input type="text" v-model="message" class="form-control" placeholder="Begin Typing Your Message...">
        </form>
    </div>
  </div>
</template>

<script>

import io from 'socket.io-client';

export default {
    data() {
        return {
            user: 'none',
            color:'',
            connected_users:[],
            message: '',
            messages: [],
            socket : io('http://192.168.1.69:3001/')
        }
    },
    methods: {
        sendMessage(e) {
            e.preventDefault();
            
            this.socket.emit('send message', this.message);
            this.message = ''
        }
    },
    mounted() {
        if(this.messages.length==0){
            this.socket.emit('get chat',{});
        }
        
        this.socket.on('check cookie', () => {
        if (this.$cookies.get("name")) {
            this.socket.emit('set existing user', {
                'name': this.$cookies.get("name"), 
                'color': this.$cookies.get("color") 
        });
        } else {
            this.socket.emit('new user');
        }
        });

        this.socket.on('updateUsers', (data) => {
            this.connected_users = data;
        });

  
        this.socket.on('name', (data) => {
            this.user = data;
        });

        this.socket.on('color', (data) => {
            this.color = data;
        });

        this.socket.on('set cookie', (name, color) => {
            this.$cookies.set("name", name);
            this.$cookies.set("color", color);
        });

        

         this.socket.on('connected users', (data) => {
            console.log('received updated list!!!',data.connectedUsers );
            this.connected_users = []
            data.connectedUsers.map(x=>{
                this.connected_users.push(x.user)
            })
            // this.connected_users = data.connectedUsers
        });
        this.socket.on('update chat', (data) => {
            this.messages = data;
        });
    
        this.socket.on('message', (data) => {
            this.messages.push(data)
        });
    },
}
</script>

<style>
    .username{
        color:red;
    }
    form{
        width:88%;
    }
    input{
        font-size: 20px;
        margin-top:10px;
        border:none;
        padding:3%;
    }
    input[type=text]:focus {
        outline:none;
        border:none;
    }
    .footer{
        margin-top:10px;
        flex:1;
        display: flex;
        border-top:2px solid gainsboro;
        flex-direction:row;
    }
    .footer input{
        
        width:100%;
    }
    .mainContent{
        display:flex;
        flex-direction: row;
        height:500px;
    }
    .chatbox{
        align-self: flex-end;
        flex-grow: 9;
        padding:1% 3%;
        height: 500px;
        overflow-y:scroll;
    }
    .online{
        border-left:2px solid gainsboro;
        text-align: center; 
        flex-grow:1;
        
    }
  .container{
    background-color: white;
    border-radius: 10px;
    width:90%;
    /* height:500px; */
    display:flex;
    margin:2% auto;
    flex-direction: column;
  }
  .header{
    padding:1% 3%;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
  }
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }
</style>