<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
        <MyHeader :addTodo="addTodo" />
        <!-- <MyList :todos="todos" :checkTodo="checkTodo" :deleteTodo="deleteTodo" /> -->
        <MyList
          :todos="todos"
          :checkTodo="checkTodo"
          :deleteTodo="deleteTodo"
        />
        <MyFooter
          :todos="todos"
          :checkAllTodo="checkAllTodo"
          :clearAllDoneTodo="clearAllDoneTodo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from "./components/MyHeader.vue";
//import MyItem from "./components/MyItem.vue";//Item是List的子組件
import MyList from "./components/MyList.vue";
import MyFooter from "./components/MyFooter.vue";
import axios from 'axios';

export default {
  name: "App",
  components: {
    MyHeader,
    MyList,
    MyFooter,
  },
  data() {
    return {
      //todos: JSON.parse(localStorage.getItem("todos")) || [],
      todos:[]
    };
  },
  //數據在哪裡 操作數據的方法就在哪裡
  //父組件傳給 子組件 props 子組件傳給父組件 需透過 父組件方法
  methods: {
    //取得
    getTodos(){
      axios.get('http://127.0.0.1:8000/todoList/list').then(
        response =>{
          console.log('請求成功!!!',response.data)
          this.todos = response.data.data
        },erro =>{
          console.log('請求失敗!!!',erro.message)
        }
      )
    },

    //增加
    addTodo(todoObj) {
     // this.todos.unshift(todoObj);
    // const todoObjjson = JSON.stringify(todoObj); 會報錯 x-www-form-urlencoded 格式問題
    //axios 本身就是傳輸
     axios.post(`http://127.0.0.1:8000/todoList/create`,
     todoObj
     )
     .then(
        response =>{
          console.log('新增Todo成功!!!',response.data)
          todoObj.id = response.data.data
          this.todos.unshift(todoObj);
          
        },erro =>{
          console.log('請求失敗!!!',erro.message)
        }
      )
    },
    //更新便已完成
    checkTodo(id) {
      // this.todos.forEach((todo) => {
      //   if (todo.id === id) todo.done = !todo.done;
      // });
      axios.put(`http://127.0.0.1:8000/todoList/update/${id}`).then(
        response =>{
          console.log('更新Todo已完成成功!!!',response.data)
        
          this.todos.forEach((todo) => {
            if (todo.id === id) todo.done = !todo.done;
       });
        },erro =>{
          console.log('請求失敗!!!',erro.message)
        }
      )

    }, 
    //更新Todo
    updateTodo(id,title) {
      // this.todos.forEach((todo) => {
      //   if (todo.id === id) todo.title = title;
      // });
        //變成todoObject
      const todoObj = {'id':id,'title':title}
      axios.put(`http://127.0.0.1:8000/todoList/updateTodoTitle`,
      todoObj
      ).then(
        response =>{
          console.log('更新TodoTitle已完成成功!!!',response.data)
            this.todos.forEach((todo) => {
           if (todo.id === id) todo.title = title;
      });
        },erro =>{
          console.log('請求失敗!!!',erro.message)
        }
      )
    }, 
    
    //刪除一個Todo
    deleteTodo(id) {
      //filter 不改變原數組 所以要負值
      // this.todos = this.todos.filter((todo) => {
      //   return todo.id != id;
      // });

      axios.delete(`http://127.0.0.1:8000/todoList/delete/${id}`).then(
        response =>{
          console.log('刪除Todo已完成成功!!!',response.data)
          this.todos = this.todos.filter((todo) => {
         return todo.id != id;
       })
        },erro =>{
          console.log('請求失敗!!!',erro.message)
        }
      )
    },

    //全選或取消全選
    checkAllTodo(done) {
      // this.todos.forEach((todo) => {
      //   todo.done = done;
      // });

      axios.put(`http://127.0.0.1:8000/todoList/updateAllTodoDone?done=${done}`
      ).then(
        response =>{
          console.log('更新全部TodoTitle已完成成功!!!',response.data)
          this.todos.forEach((todo) => {
            todo.done = done;
          });
        },erro =>{
          console.log('請求失敗!!!',erro.message)
        }
      )

      
    },
    //清楚所有已經完成的todo
    clearAllDoneTodo() {
      this.todos = this.todos.filter((todo) => {
        return !todo.done;
      });
    },
  },
  watch: {
    todos: {
      handler(value) {
        localStorage.setItem("todos", JSON.stringify(value));
      },
      deep: true,
    },
  },
  //當頁面一載入就調用該方法
  mounted(){
    //別人調用updateTodo
    this.$bus.$on('updateTodo',this.updateTodo);
    this.getTodos();
  },
  beforeDestory(){
    this.$bus.$off('updateTodo');
  }
};
</script>

<style>
/*base*/
body {
  background: #fff;
}
.btn {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
.btn-danger {
  color: #fff;
  background-color: #da4f49;
  border: 1px solid #bd362f;
}
.btn-edit{
  color: #fff;
 background-color: skyblue;
 border: 1px solid rgb(103, 159, 180);
 margin-right: 5px;
}
.btn-danger:hover {
  color: #fff;
  background-color: #bd362f;
  
}
.btn:focus {
  outline: none;
}
.todo-container {
  width: 600px;
  margin: 0 auto;
}
.todo-container .todo-wrap {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
