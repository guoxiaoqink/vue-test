class compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)

        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el)
            this.compile(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    node2Fragment(el) {
        const fragment = document.createDocumentFragment()
        let child
        while ((child = el.firstChild)) {
            fragment.appendChild(child)
        }
        return fragment
    }

    compile(el) {
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            console.log('console.log(childNodes)')
            console.log(childNodes)
            if (this.isElement(node)) {
                console.log("编译元素" + node.nodeName);
                this.compileElement(node)
            } else if (this.isInterpolation(node)) {
                this.compileText(node)
                console.log("编译插值文本" + node.textContent);
            }

            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }

    isElement(node) {
        return node.nodeType == 1
    }

    isInterpolation(node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    compileText(node) {
        const exp = RegExp.$1;
        this.update(node, exp, "text");
    }

    compileElement(node) {
        let nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
            // 规定：指令以 k-xxx 命名
            let attrName = attr.name; // 属性名称
            let exp = attr.value; // 表达式
            if (this.isDirective(attrName)) {
                let dir = attrName.substring(2); // 截取指令名称
                // 执行指令解析
                this[dir] && this[dir](node, exp);
            }
        });
    }

    isDirective(attr) {
        return attr.indexOf("k-") == 0;
    }

    text(node, exp) {
        this.update(node, exp, "text");
    }

    update(node, exp, dir) {
        let updateFn = this[dir + "Updater"]
        updateFn && updateFn(node, this.$vm[exp])
        new Watcher(this.$vm, exp, function (value) {
            updateFn && updateFn(node, value)
        })
    }

    textUpdater(node, value) {
        node.textContent = value
    }

}