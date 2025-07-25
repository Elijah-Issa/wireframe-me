const ctx = document.querySelector(".ctx");

const crDrawer = document.querySelector(".create-drawer");
const crDrBtn = document.querySelector(".show-create-dr-btn");

const toolsDr = document.querySelector(".tools-drawer");
const toolsDrBtn = document.querySelector(".tools-drawer .tools-dr-btn .icon");
const selectTool = document.querySelector(".select-tool");
const moveTool = document.querySelector(".move-tool");
const editTool = document.querySelector(".edit-tool")

const editTools = document.querySelector(".tools-drawer .edit-tools");
const lockXElement = document.querySelector(".lock-x");
const lockYElement = document.querySelector(".lock-y");

const editValues = document.querySelector(".edit-values");
const widthInput = document.querySelector(".width-input");
const heightInput = document.querySelector(".height-input");
const wh = document.querySelector(".w-h");

const hintMsg = document.querySelector(".hint-message");





let state = "";
let shape = null;
let hold, clientX, clientY;
let isHolding = false;
let fingerMoving = true;
let relXPos, relYPos;
let initTouch;
document.addEventListener("touchstart", (e) => {
    if (e.target.matches(".shape")) {
        const cont = e.target.closest(".cont");
        const delBtn = cont.querySelector(".del-btn");
        const cpyBtn = cont.querySelector(".cpy-btn");
        const wDot = cont.querySelector(".w-dot");
        const hDot = cont.querySelector(".h-dot");
        cpyBtn.style.opacity = "1";
        cpyBtn.style.pointerEvents = "auto";
        delBtn.style.opacity = "1";
        delBtn.style.pointerEvents = "auto";
        wDot.style.opacity = "1";
        wDot.style.pointerEvents = "auto";
        hDot.style.opacity = "1";
        hDot.style.pointerEvents = "auto";
        isHolding = true;
        const shapeInfo = e.target.closest(".cont").getBoundingClientRect();
        relXPos = e.touches[0].clientX - shapeInfo.left;
        relYPos = e.touches[0].clientY - shapeInfo.top;
        //e.target.classList.add("holding-shape");            
        
        if (shape) {
            shape.classList.remove("selected");
            const delBtn = shape.querySelector(".del-btn");
            const cpyBtn = shape.querySelector(".cpy-btn");
            const wDot = shape.querySelector(".w-dot");
            const hDot = shape.querySelector(".h-dot");
            cpyBtn.style.opacity = "0";
            cpyBtn.style.pointerEvents = "none";
            delBtn.style.opacity = "0";
            delBtn.style.pointerEvents = "none";
            wDot.style.opacity = "0";
            wDot.style.pointerEvents = "none";
            hDot.style.opacity = "0";
            hDot.style.pointerEvents = "none";
        }            
        
        shape = e.target.closest(".cont");
        cont.classList.add("selected");
    }
    else if (e.target.matches("svg")) {
        hold = setTimeout(() => {
            isHolding = true;
            const shapeInfo = e.target.getBoundingClientRect();
            relXPos = e.touches[0].clientX - shapeInfo.left;
            relYPos = e.touches[0].clientY - shapeInfo.top;
            e.target.classList.add("holding-shape");
            shape = e.target;
        }, 50);
    }
    /* else if (!fingerMoving) {
        hold = setTimeout(() => {
            const touch = e.touches[0] || e.changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
            ctx.style.left = `${touch.clientX}px`;
            ctx.style.top = `${touch.clientY}px`;
            ctx.classList.add("ctx-show");
            ctx.classList.remove("ctx-hide");
        }, 500);
    } */
    initTouch = e.touches[0];
});

let lockX = true;
let lockY = true;
let normDx = 0;
document.addEventListener("touchmove", (e) => {
    if (e.target.matches(".shape")) {
        const cont = e.target.closest(".cont");
        let rect = cont.getBoundingClientRect();
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        cont.style.left = `${xPos}px`;
        cont.style.top = `${yPos}px`;
    }
    else if (e.target.matches("svg") && state == "move") {
        let rect = e.target.getBoundingClientRect();
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        e.target.style.left = `${xPos}px`;
        e.target.style.top = `${yPos}px`;
    }
    else if (e.target.matches("svg") && state == "edit") {
        let path = shape.querySelector("path");
        let dArr = path.getAttribute("d").split(" ");
        let x = Number(dArr[8]);
        let svgWidth = Number(shape.getAttribute("width"));
            
        if (e.touches[0].clientX > initTouch.clientX && !lockX) {
            x += 1;
            svgWidth += 1;
        }
        if (e.touches[0].clientX < initTouch.clientX && !lockX) {
            x -= 1;
            svgWidth -= 1;
        }
        
        let d = `M 0 25 c ${x / 2} -25 ${x / 2} 25 ${x} 0`;
       
        shape.setAttribute("width", svgWidth);
        let vb = `0 0 ${svgWidth} 60`;    
        shape.setAttribute("viewBox", vb);
        
        path.setAttribute("d", d);
        
        widthInput.value = x;
    }
    
    else if (e.target.matches(".w-dot")) {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normX = Number(actShape.style.width.slice(0, actShape.style.width.indexOf("p")));
        let normY = Number(actShape.style.height.slice(0, actShape.style.height.indexOf("p")));
        
        if (e.touches[0].clientX > initTouch.clientX) {
            normX += 1;
        }
        if (e.touches[0].clientX < initTouch.clientX) {
            normX -= 1;
        }
        if (shape.tagName == "DIV") {
            actShape.style.width = `${normX}px`;
            actShape.style.height = `${normY}px`;
            widthInput.value = normX;
            heightInput.value = normY;
        }
    }
    else if (e.target.matches(".h-dot")) {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normX = Number(actShape.style.width.slice(0, actShape.style.width.indexOf("p")));
        let normY = Number(actShape.style.height.slice(0, actShape.style.height.indexOf("p")));
        
        if (e.touches[0].clientY > initTouch.clientY) {
            normY += 1;
        }
        if (e.touches[0].clientY < initTouch.clientY) {
            normY -= 1;
        }
        if (shape.tagName == "DIV") {
            actShape.style.width = `${normX}px`;
            actShape.style.height = `${normY}px`;
            widthInput.value = normX;
            heightInput.value = normY;
        }
    }
    fingerMoving = true;
});

document.addEventListener("touchend", (e) => {
    clearTimeout(hold);
    if (shape) shape.classList.remove("holding-shape");
    fingerMoving = false;
    initTouch = e.touches[0];
});





document.addEventListener("click", (e) => {
    if (e.target.matches(".shape") && !shape) {
        shape = e.target.closest(".cont");
        shape.classList.add("selected");
        const delBtn = shape.querySelector(".del-btn");
        const cpyBtn = shape.querySelector(".cpy-btn");
        const wDot = shape.querySelector(".w-dot");
        const hDot = shape.querySelector(".h-dot");
        cpyBtn.style.opacity = "1";
        cpyBtn.style.pointerEvents = "auto";
        delBtn.style.opacity = "1";
        delBtn.style.pointerEvents = "auto";
        wDot.style.opacity = "1";
        wDot.style.pointerEvents = "auto";
        hDot.style.opacity = "1";
        hDot.style.pointerEvents = "auto";
     }
     else if (e.target.matches(".shape") && shape) {
        shape.classList.remove("selected");
        const delBtn = shape.querySelector(".del-btn");
        const cpyBtn = shape.querySelector(".cpy-btn");
        const wDot = shape.querySelector(".w-dot");
        const hDot = shape.querySelector(".h-dot");
        cpyBtn.style.opacity = "0";
        cpyBtn.style.pointerEvents = "none";
        delBtn.style.opacity = "0";
        delBtn.style.pointerEvents = "none";
        wDot.style.opacity = "0";
        wDot.style.pointerEvents = "none";
        hDot.style.opacity = "0";
        hDot.style.pointerEvents = "none";
        shape = null;
     }
    else if (e.target.matches(".show-create-dr-btn") || e.target.closest(".dr-btn-bg")) {
        if (!crDrawer.classList.contains("show-cr-drawer")) {
            crDrawer.classList.add("show-cr-drawer");
            crDrBtn.classList.add("rotate-btn");
        } else if (crDrawer.classList.contains("show-cr-drawer")) {
            crDrawer.classList.remove("show-cr-drawer");
            crDrBtn.classList.remove("rotate-btn");
        }
    }
    else if (e.target.matches(".cancel")) {
        ctx.classList.add("ctx-remove");
        ctx.classList.remove("ctx-show");
    }
    
    
    
    else if (e.target.matches(".rect-btn")) {
        const cont = document.createElement("div");
        cont.className = "cont";
        cont.style.padding = "1rem";
        cont.style.width = "fit-content";
        cont.style.height = "fit-content";
        cont.style.position = "absolute";
        
        const wDot = document.createElement("div");
        wDot.className = "w-dot dot";
        wDot.style.width = "15px";
        wDot.style.height = "15px";
        wDot.style.borderRadius = "50px";
        wDot.style.backgroundColor = "black";
        wDot.style.position = "absolute";
        const w =15 / 2;
        wDot.style.right = `calc(1rem - ${w}px)`;
        wDot.style.top = "50%";
        wDot.style.transform = "translateY(-50%)";
        wDot.style.opacity = "0";
        wDot.style.pointerEvents = "none";
        
        const hDot = document.createElement("div");
        hDot.className = "h-dot dot";
        hDot.style.width = "15px";
        hDot.style.height = "15px";
        hDot.style.borderRadius = "50px";
        hDot.style.backgroundColor = "black";
        hDot.style.position = "absolute";
        const h =15 / 2;
        hDot.style.bottom = `calc(1rem - ${h}px)`;
        hDot.style.left = "50%";
        hDot.style.transform = "translateX(-50%)";
        hDot.style.opacity = "0";
        hDot.style.pointerEvents = "none";
        
        const delBtn = document.createElement("div");
        delBtn.className = "del-btn shape-btn";
        delBtn.style.borderRadius = "8px";
        delBtn.style.backgroundColor = "blueViolet";
        delBtn.style.color = "white";
        delBtn.style.padding = "0.3rem 0.5rem";
        delBtn.style.position = "absolute";
        delBtn.style.left = "10%";
        delBtn.style.top = "0";
        delBtn.innerText = "Delete";
        delBtn.style.opacity = "0";
        delBtn.style.pointerEvents = "none";
        
        const cpyBtn = document.createElement("div");
        cpyBtn.className = "cpy-btn shape-btn";
        cpyBtn.style.borderRadius = "8px";
        cpyBtn.style.backgroundColor = "blueViolet";
        cpyBtn.style.color = "white";
        cpyBtn.style.padding = "0.3rem 0.5rem";
        cpyBtn.style.position = "absolute";
        cpyBtn.style.right = "10%";
        cpyBtn.style.top = "0";
        cpyBtn.innerText = "Copy";
        cpyBtn.style.opacity = "0";
        cpyBtn.style.pointerEvents = "none";
    
        const rect = document.createElement("div");
        rect.className = "shape rect";
        rect.style.border = "2px solid black";
        rect.style.width = "100px";
        rect.style.height = "60px";
        //rect.style.position = "absolute";
        rect.style.left = `${clientX}px`;
        rect.style.top = `${clientY}px`;
        rect.style.borderRadius = "8px";
        
        cont.appendChild(rect);
        cont.appendChild(wDot);
        cont.appendChild(hDot);
        cont.appendChild(delBtn);
        cont.appendChild(cpyBtn);
        document.body.appendChild(cont);
        ctx.classList.add("ctx-remove");
        ctx.classList.remove("ctx-show");
        crDrawer.classList.remove("show-drawer")
    }
    else if (e.target.matches(".circle-btn")) {
        const circle = document.createElement("div");
        circle.className = "shape circle";
        circle.style.border = "2px solid black";
        circle.style.width = "100px";
        circle.style.height = "100px";
        circle.style.position = "absolute";
        circle.style.left = `${clientX}px`;
        circle.style.top = `${clientY}px`;
        circle.style.borderRadius = "10rem";
        
        document.body.appendChild(circle);
        ctx.classList.add("ctx-remove");
        ctx.classList.remove("ctx-show");
        crDrawer.classList.remove("show-drawer")
    }
    else if (e.target.matches(".text-btn")) {
        const svgCont = document.createElement("div");
        svgCont.className = "text shape svg";
        svgCont.style.backgroundColor = "red";
        svgCont.style.position = "absolute";
    
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100");
        svg.setAttribute("height", "50");
        svg.setAttribute("viewBox", "0 0 100 60");
        svg.style.position = "absolute";
        
        const d = "M 0 25 c 50 -25 50 25 100 0";
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "5");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        
        //svgCont.appendChild(svg);
        svg.appendChild(path);
        document.body.appendChild(svg);
    }
    
    
    
    else if (e.target.matches("svg") && state == "edit") {
        const path = e.target.querySelector("path");
        let dArr = path.getAttribute("d").split(" ");
        widthInput.value = Number(dArr[8]);
    }
    
    
    
    else if (e.target.matches(".tools-dr-btn .icon") || e.target.closest(".tools-dr-btn")) {
        if (!toolsDr.classList.contains("show-tools-drawer")) {
            toolsDr.classList.add("show-tools-drawer");
            toolsDrBtn.classList.add("rotate-tools-dr-btn");
        }
        else if (toolsDr.classList.contains("show-tools-drawer")) {
            toolsDr.classList.remove("show-tools-drawer");
            toolsDrBtn.classList.remove("rotate-tools-dr-btn");
        }
    }
    else if (e.target.matches(".select-tool")) {
        state = "select";
        selectTool.style.opacity = "1";
        editTool.style.opacity = "0.5";
        moveTool.style.opacity = "0.5";
        editValues.classList.remove("show-edit-values");
    }
    else if (e.target.matches(".move-tool")) {
        state = "move";
        selectTool.style.opacity = "0.5";
        editTool.style.opacity = "0.5";
        moveTool.style.opacity = "1";
        editValues.classList.remove("show-edit-values");
    }
    else if (e.target.matches(".edit-tool")) {
        selectTool.style.opacity = "0.5";
        editTool.style.opacity = "1";
        moveTool.style.opacity = "0.5";
        if (!shape) {
            alert("Select Shape First");
            return;
        }
        state = "edit";
        editValues.classList.add("show-edit-values");
        if (shape.classList.contains(".svg")) {
            let w = shape.querySelector(".svg").style.width.slice(0, shape.querySelector(".svg").style.width.indexOf("p"));
            let h = shape.style.height.slice(0, shape.style.height.indexOf("p"));
            widthInput.value = w;
            heightInput.value = h;
        }
        else if (shape) {
            let w = shape.style.width.slice(0, shape.style.width.indexOf("p"));
            let h = shape.style.height.slice(0, shape.style.height.indexOf("p"));
            widthInput.value = w;
            heightInput.value = h;
        }
    }
    else if (e.target.matches(".lock-x")) {
        lockX = !lockX;
        lockXElement.classList.add("locked");
    } else if (e.target.matches(".lock-y")) {
        lockY = !lockY;
        lockYElement.classList.add("locked");
    }
    if (lockX) lockXElement.classList.add("locked");
    if (lockY) lockYElement.classList.add("locked");
    if (!lockX) lockXElement.classList.remove("locked");
    if (!lockY) lockYElement.classList.remove("locked");
    
    
    
    else if (e.target.matches(".del-btn")) {
        alert("Delete");
    }
    else if (e.target.matches(".cpy-btn")) {
        alert("Copy")
    }
});





widthInput.addEventListener("input", (e) => {
    let value = Number(e.target.value);
    if (shape.tagName == "SVG") {
        let path = shape.querySelector("path");
        let dArr = path.getAttribute("d");
        let d = `M 0 25 c ${value / 2} -25 ${value / 2} 25 ${value} 0`;
        path.setAttribute("d", d);
        alert("svg width has changed")
    }
    else if (shape.tagName == "DIV") shape.style.width = `${Number(e.target.value)}px`;
    else if (!shape) alert("Select a Shape First");
});
heightInput.addEventListener("input", (e) => {
    let value = Number(e.target.value);
    if (shape.tagName == "DIV") shape.style.height = `${Number(e.target.value)}px`;
    else if (!shape) alert("Select a Shape First");
});