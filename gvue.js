


// let obj = {
//     name:'old name'
// }
// Object.defineProperty(obj, 'name', {
//     get() {
//         console.log('获取名字调用的')
//         return this._name
//     },
//     set(nick) {
//         this._name = nick
//         console.log(nick + '设置名字')
//     }
// })

// console.log('第一次打印:' + obj.name)
// obj.name = '我的名字'
// console.log('第二次打印:' + obj.name)

// import compile from "./compile";


//给传入放入data对象,遍历,通过defineProperty重新定义
class Gvue {
    constructor(options) {
        this.$options = options
        this.$data = options.data    
        this.observe(this.$data)

        

        //到后边的bar  基本就看不懂了
        // new Watcher(this,'test')
        // this.test //这里的顺序不能变,不能放到 this.foo.bar 的上边 . 作用 :为了触发依赖收集
        // new Watcher(this,'foo.bar')
        // this.foo.bar
        new compile(options.el,this)
        if(options.created) {
            options.created.call(this)
        }
    }

    observe(data) {
        if (!data || typeof data !== 'object') return;
        //遍历 满足响应式的要求
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
            this.proxyData(key)
        })
    }

    //在vue的根上定义属性,代理data中的数据 这里的作用是什么:对象的那个地方也能改变data   不用一直 app.$data.test = 'hello gxq' 这么写
    proxyData(key){
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key]
            },
            set(newValue) {
                this.$data[key] = newValue
            }
        })
    }

    defineReactive(obj, key, valve) {
        this.observe(valve)
        const dep = new Dep()  // ? 这里有一些不懂感觉很奇怪 用法
        Object.defineProperty(obj,key,{
            get(){
                //将Dep.target (即当前的watcher对象存入Dep的deps中)
                Dep.target && dep.addDep(Dep.target);
                // console.log('dep.deps')
                console.log(dep.deps)
                return valve
            },
            set(newVal){
                if(newVal === valve){
                    return ;
                }
                valve = newVal
                console.log(`${key}更新了`);
                dep.notify()
                
            }
        })
    }
}

// 存所有 html标签中的 代码中的依赖
class Dep{
  constructor(){
    // 存所有的依赖
    this.deps = []  
  }

  //在deps添加一个监听器对象
  addDep(dep){
    this.deps.push(dep)
  }

  //通知所有的监听器去更新视图
  notify(){
      this.deps.forEach(dep=>dep.update())
  }
}

//监听器:负责更新视图
class Watcher{
    constructor(vm,key,cb){
        this.vm = vm
        this.key = key
        this.cb = cb

        Dep.target = this
        this.vm[this.key]
        Dep.target = null
    }

    update(){
        console.log(`监听到属性${this.key}更新了`)
        this.cb.call(this.vm,this.vm[this.key])
    }
}

