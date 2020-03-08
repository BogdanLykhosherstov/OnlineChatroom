<template>
  <div class="container">
    <div class="header">
      <h3>You are: <span style="color:red">{{this.user}}</span></h3>
      <h3>Online Users: </h3>
    </div>
    <div class="mainContent">
        <div class="chatbox">
            <div class="messages" v-for="(msg, index) in messages" :key="index">
                <p><span class="username">{{ msg.user }}: </span>{{ msg.message }}</p>
            </div>
        </div>
        <div class="online">
            <div class="connected_user" v-for="connected_user in this.connected_users" :key="connected_user">
            <p>{{ connected_user }}</p>
            </div>
        </div>     
    </div>
    <div class="footer">
        <form @submit.prevent="sendMessage">
            <input type="text" v-model="message" class="form-control" placeholder="Begin Typing Your Message...">
        </form>
    </div>
   
      <!-- <div class="card-body">
          <div class="card-title">
              <h3>Chat Group</h3>
              <hr>
          </div>
          <div class="card-body">
              <div class="messages" v-for="(msg, index) in messages" :key="index">
                  <p><span class="font-weight-bold">{{ msg.user }}: </span>{{ msg.message }}</p>
              </div>
          </div>
      </div>
      <div class="card-footer">
          <form @submit.prevent="sendMessage">
              <div class="gorm-group">
                  <label for="user">User:</label>
                  <input type="text" v-model="user" class="form-control">
              </div>
              <div class="gorm-group pb-3">
                  <label for="message">Message:</label>
                  <input type="text" v-model="message" class="form-control">
              </div>
              <button type="submit" class="btn btn-success">Send</button>
          </form>
      </div> -->
  </div>
</template>

<script>

import io from 'socket.io-client';

export default {
    data() {
        return {
            user: 'none',
            connected_users:[],
            message: '',
            messages: [],
            socket : io('localhost:3001')
        }
    },
    methods: {
        sendMessage(e) {
            e.preventDefault();
            
            this.socket.emit('SEND_MESSAGE', {
                user: this.user,
                message: this.message
            });
            this.message = ''
        }
    },
    mounted() {
        if(this.messages.length==0){
            this.socket.emit('GET_CHAT',{});
        }
        if(!this.connected_users.includes(this.user)){
          this.user = 'User'+Math.floor((Math.random() * 10000000) + 1);
          this.socket.emit('USER_CONNECTED', {
                  user: this.user,
          });
        }

        this.socket.on('GET_CURRENT_CONNECTED',function(){
            this.socket.emit('USER_CONNECTED', {
                  user: this.user,
          });
          
        })
         this.socket.on('CONNECTED_USERS', (data) => {
            console.log('received updated list!!!',data.connectedUsers );
            this.connected_users = []
            data.connectedUsers.map(x=>{
                this.connected_users.push(x.user)
            })
            // this.connected_users = data.connectedUsers
        });
        this.socket.on('MESSAGE', (data) => {
            this.messages = []
            data.map((x)=>{
                this.messages.push(x)
            })
            console.log(data)
            // you can also do this.messages.push(data)
        });
    },
    updated(){
        // this.socket.on('MESSAGE', (data) => {
        //     this.messages = []
        //     data.map((x)=>{
        //         this.messages.push(x)
        //     })
        //     console.log(data)
        //     // you can also do this.messages.push(data)
        // });
        // this.socket.on('CONNECTED_USERS', (data) => {
        //     console.log('received updated list!!!',data.connectedUsers );
        //     this.connected_users = []
        //     data.connectedUsers.map(x=>{
        //         this.connected_users.push(x.user)
        //     })
        //     // this.connected_users = data.connectedUsers
        // });
    }
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
</style>