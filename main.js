window.onload = () => {
  var app = new Vue({
    el: "#app",
    data: {
        newTask: {
          description: '',
          priority: '',
          date: ''
        },
        tasks: JSON.parse(localStorage.getItem('tasks')) || [],
        filter: 'all'
      },
    mounted() {
        setInterval(() => {
          this.tasks.forEach(task => {
            task.elapsedTime = this.calculateElapsedTime(task.date);
            console.log(task.elapsedTime)
          });
        }, 60000);
      },
    computed: {
    filteredTasks: function() {
      var filtered = this.tasks;
      if (this.filter === 'completed') {
        filtered = filtered.filter(function(task) {
          return task.completed;
        });
      } else if (this.filter === 'active') {
        filtered = filtered.filter(function(task) {
          return !task.completed;
        });
      }
      filtered.sort(function(a, b) {
        if (a.priority === 'high' && b.priority !== 'high') {
          return -1;
        } else if (b.priority === 'high' && a.priority !== 'high') {
          return 1;
        } else if (a.priority === 'medium' && b.priority === 'low') {
          return -1;
        } else if (a.priority === 'low' && b.priority === 'medium') {
          return 1;
        } else {
          return 0;
        }
      });
      return filtered;
    },

      hasCompleted: function () {
        return this.tasks.some(function (task) {
          return task.completed;
        });
      },
      completedTasks: function () {
        return this.tasks.filter(function (task) {
          return task.completed;
        }).length;
      },
    },
methods: {
    addTask: function() {
      var task = {
        id: this.tasks.length + 1,
        description: this.newTask.description,
        priority: this.newTask.priority,
        date: new Date().toLocaleString(),
        completed: false,
        elapsedTime: '0 minutes'
      }
      this.tasks.push(task);
      this.saveTasks();
      this.newTask = {
        description: '',
        priority: '',
        date: ''
      };
    },
    calculateElapsedTime: function(taskDate) {
      var date = new Date(taskDate);
      var currentDate = new Date();
      var diff = currentDate - date;
      var minutes = Math.floor(diff / 60000);
      return minutes + ' minutes';
    },
      deleteTask: function (index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
      },
      changeStatus: function (index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasks();
      },
      deleteCompleted: function () {
        this.tasks = this.tasks.filter(function (task) {
          return !task.completed;
        });
        this.saveTasks();
      },
      saveTasks: function () {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
      },
      changePriority: function (index, currentPriority) {
        var newPriority = "";
        if (currentPriority === "high") {
          newPriority = "medium";
        } else if (currentPriority === "medium") {
          newPriority = "low";
        } else {
          newPriority = "high";
        }
        this.tasks[index].priority = newPriority;
        this.saveTasks();
      },
    },
    created: function () {
      this.saveTasks();
    },
  });
};
