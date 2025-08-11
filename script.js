const tlDrawer = document.querySelector(".tools-drawer");

const crDrawer = document.querySelector(".create-drawer");
const crDrBtn = document.querySelector(".show-create-dr-btn");

const editValues = document.querySelector(".edit-values");
const widthInput = document.querySelector(".width-input");
const heightInput = document.querySelector(".height-input");






let shape;
let clientX, clientY;
let relXPos, relYPos;
let initTouch;
let differenceTouch = 0;
let state = "idle";
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
        const shapeInfo = e.target.closest(".cont").getBoundingClientRect();
        relXPos = e.touches[0].clientX - shapeInfo.left;
        relYPos = e.touches[0].clientY - shapeInfo.top;
            
        if (shape && shape !== e.target.closest(".cont")) {
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
            editValues.classList.remove("show-edit-values");
        }
        
        shape = e.target.closest(".cont");
        cont.classList.add("selected");
    }
    else if (e.target.matches(".svg-cont")) {
        const cont = e.target;
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
        const shapeInfo = e.target.getBoundingClientRect();
        relXPos = e.touches[0].clientX - shapeInfo.left;
        relYPos = e.touches[0].clientY - shapeInfo.top;
            
        if (shape && shape !== e.target.closest(".svg-cont")) {
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
        
        shape = e.target;
        cont.classList.add("selected");
    }
    initTouch = e.touches[0];
    differenceTouch = {
        w: e.touches[0].clientX,
        h: e.touches[0].clientY,
    };
});

let lockX = true;
let lockY = true;
let normDx = 0;
document.addEventListener("touchmove", (e) => {
    if (e.target.matches(".shape")) {
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        shape.style.left = `${xPos}px`;
        shape.style.top = `${yPos}px`;
    }
    else if (e.target.matches(".svg-cont")) {
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        shape.style.left = `${xPos}px`;
        shape.style.top = `${yPos}px`;
    }
    else if (e.target.matches("svg") && state == "move") {
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
    
    else if (e.target.matches(".w-dot") && !shape.classList.contains("svg-cont")) {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normX = Number(actShape.style.width.slice(0, actShape.style.width.indexOf("p")));
        let normY = Number(actShape.style.height.slice(0, actShape.style.height.indexOf("p")));
        
        normX += e.touches[0].clientX - differenceTouch.w;
        actShape.style.width = `${normX}px`;
        widthInput.value = normX;
    }
    else if (e.target.matches(".h-dot") && !shape.classList.contains("svg-cont")) {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normY = Number(actShape.style.height.slice(0, actShape.style.height.indexOf("p")));
        
        normY += e.touches[0].clientY - differenceTouch.h;
        actShape.style.height = `${normY}px`;
        heightInput.value = normY;
    }
    else if (e.target.matches(".w-dot") && shape.classList.contains("svg-cont")) {
        let path = shape.querySelector("path");
        let svg = shape.querySelector("svg");
        let dArr = path.getAttribute("d").split(" ");
        let x = Number(dArr[8]);
        let svgWidth = Number(svg.getAttribute("width"));
        let vby = Number(svg.getAttribute("viewBox").split(" ")[3]);
            
        x += e.touches[0].clientX - differenceTouch.w;
        svgWidth += e.touches[0].clientX - differenceTouch.w;

        let d = `M 25 25 c ${x / 2} -25 ${x / 2} 25 ${x} 0`;
       
        svg.setAttribute("width", svgWidth);
        let vb = `25 0 ${svgWidth} ${vby}`;
        svg.setAttribute("viewBox", vb);
        
        path.setAttribute("d", d);
        
        widthInput.value = x;
    }
    else if (e.target.matches(".h-dot") && shape.classList.contains("svg-cont")) {
        let svg = shape.querySelector("svg");
        let path = svg.querySelector("path");
        let svgHeight = Number(svg.getAttribute("height"));
        let svgWidth = Number(svg.getAttribute("width"));
        let strokeWidth = Number(path.getAttribute("stroke-width"));
        let vby = Number(svg.getAttribute("viewBox").split(" ")[3]);

        strokeWidth += e.touches[0].clientY - differenceTouch.h;
        svgHeight += e.touches[0].clientY - differenceTouch.h;
        // svgWidth += (e.touches[0].clientY - differenceTouch.h) + 1;
        vby += e.touches[0].clientY - differenceTouch.h;

        let vb = `25 0 ${svgWidth} ${svgHeight}`;

        path.setAttribute("stroke-width", strokeWidth);
        svg.setAttribute("height", svgHeight);
        svg.setAttribute("width", svgWidth);
        svg.setAttribute("viewBox", vb);
    }
    differenceTouch = {
        w: e.touches[0].clientX,
        h: e.touches[0].clientY,
    };
});

document.addEventListener("touchend", (e) => {
    if (shape) shape.classList.remove("holding-shape");
    initTouch = e.touches[0];
});





document.addEventListener("click", (e) => {
    if (e.target.matches(".shape")) {
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
    else if (
        shape &&
        !e.target.matches(".svg-cont") &&
        !e.target.matches(".shape") &&
        !e.target.matches(".sh") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".create-tool")
    ) {
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
    else if (e.target.matches(".svg-cont")) {
        shape = e.target;
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
    else if (e.target.matches(".show-create-dr-btn") || e.target.closest(".dr-btn-bg")) {
        if (!crDrawer.classList.contains("show-cr-drawer")) {
            crDrawer.classList.add("show-cr-drawer");
            crDrBtn.classList.add("rotate-btn");
        } else if (crDrawer.classList.contains("show-cr-drawer")) {
            crDrawer.classList.remove("show-cr-drawer");
            crDrBtn.classList.remove("rotate-btn");
        }
    }
    
    
    
    else if (e.target.matches(".rect-btn")) {
        const cont = document.createElement("div");
        cont.className = "cont rect";
        cont.style.padding = "1rem";
        cont.style.width = "fit-content";
        cont.style.height = "fit-content";
        cont.style.position = "absolute";
        // cont.setAttribute("dataset-is-locked", "false");

        // const lock = document.createAttribute("div");
        // lock.className = "lock";
        // lock.innerText = "Lock";
        // lock.style.position = "absolute";
        
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
        delBtn.style.left = "1rem";
        delBtn.style.top = "-1.5rem";
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
        cpyBtn.style.left = "5rem";
        cpyBtn.style.top = "-1.5rem";
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
        crDrawer.classList.remove("show-drawer")
    }
    else if (e.target.matches(".circle-btn")) {
        const cont = document.createElement("div");
        cont.className = "cont circle";
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
        delBtn.style.left = "1rem";
        delBtn.style.top = "-1.5rem";
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
        cpyBtn.style.left = "5rem";
        cpyBtn.style.top = "-1.5rem";
        cpyBtn.innerText = "Copy";
        cpyBtn.style.opacity = "0";
        cpyBtn.style.pointerEvents = "none";
       
        const circle = document.createElement("div");
        circle.className = "shape circle";
        circle.style.border = "2px solid black";
        circle.style.width = "100px";
        circle.style.height = "100px";
        //circle.style.position = "absolute";
        circle.style.left = `${clientX}px`;
        circle.style.top = `${clientY}px`;
        circle.style.borderRadius = "10rem";
        
        cont.appendChild(circle);
        cont.appendChild(wDot);
        cont.appendChild(hDot);
        cont.appendChild(delBtn);
        cont.appendChild(cpyBtn);
        document.body.appendChild(cont);
        crDrawer.classList.remove("show-drawer");
    }
    else if (e.target.matches(".text-btn")) {
        const cont = document.createElement("div");
        cont.className = "svg-cont svg";
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
        delBtn.style.left = "1rem";
        delBtn.style.top = "-1.5rem";
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
        cpyBtn.style.left = "5rem";
        cpyBtn.style.top = "-1.5rem";
        cpyBtn.innerText = "Copy";
        cpyBtn.style.opacity = "0";
        cpyBtn.style.pointerEvents = "none";
    
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100");
        svg.setAttribute("height", "50");
        svg.setAttribute("viewBox", "25 0 100 60");
        svg.style.pointerEvents = "none";
        
        const d = "M 25 25 c 50 -25 50 25 100 0";
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "5");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        path.style.pointerEvents = "none";
        
        svg.appendChild(path);
        cont.appendChild(svg);
        cont.appendChild(wDot);
        cont.appendChild(hDot);
        cont.appendChild(delBtn);
        cont.appendChild(cpyBtn);
        document.body.appendChild(cont);
        crDrawer.classList.remove("show-drawer");
    }



    else if (e.target.matches(".del-btn")) {
        if (!shape) {
            alert("Select A shape Forst !");
            return;
        }
        
        shape.remove();
        shape = null;
    }
    else if (e.target.matches(".cpy-btn")) {
        if (!shape) {
            alert("Select A shape First !");
            return;
        }
        if (shape.classList.contains("svg-cont")) {
            let dArr = shape.querySelector("path").getAttribute("d").split(" ");
            let x = Number(dArr[8]);
            const wi = shape.querySelector("svg").getAttribute("width");
            const he = shape.querySelector("svg").getAttribute("height");
            const le = shape.style.left.slice(0, shape.style.left.indexOf("p"));
            const to = shape.style.top.slice(0, shape.style.top.indexOf("p"));
            const strokeWidth = Number(shape.querySelector("path").getAttribute("stroke-width"));
            const vby = shape.querySelector("svg").getAttribute("viewBox").split(" ")[3];

            const cont = document.createElement("div");
            cont.className = "svg-cont svg";
            cont.style.padding = "1rem";
            cont.style.width = "fit-content";
            cont.style.height = "fit-content";
            cont.style.position = "absolute";
            cont.style.left = `${Number(le) + 30}px`;
            cont.style.top = `${Number(to) + 20}px`; 

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
            delBtn.style.top = "-1.5rem";
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
            cpyBtn.style.top = "-1.5rem";
            cpyBtn.innerText = "Copy";
            cpyBtn.style.opacity = "0";
            cpyBtn.style.pointerEvents = "none";
        
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", `${Number(wi)}`);
            svg.setAttribute("height", `${Number(he)}`);
            svg.setAttribute("viewBox", `25 0 ${wi} ${Number(vby)}`);
            svg.style.pointerEvents = "none";
            
            let d = `M 25 25 c ${x / 2} -25 ${x / 2} 25 ${x} 0`;
            
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.setAttribute("stroke", "black");
            path.setAttribute("stroke-width", strokeWidth);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-linecap", "round");
            path.style.pointerEvents = "none";
            
            svg.appendChild(path);
            cont.appendChild(svg);
            cont.appendChild(wDot);
            cont.appendChild(hDot);
            cont.appendChild(delBtn);
            cont.appendChild(cpyBtn);
            document.body.appendChild(cont);
            crDrawer.classList.remove("show-drawer")
        }
        else if (shape.querySelector(".shape").classList.contains("rect")) {
            const wi = shape.querySelector(".shape").style.width.slice(0, shape.querySelector(".shape").style.width.indexOf("p"));
            const he = shape.querySelector(".shape").style.height.slice(0, shape.querySelector(".shape").style.height.indexOf("p"));
            const le = shape.style.left.slice(0, shape.style.left.indexOf("p"));
            const to = shape.style.top.slice(0, shape.style.top.indexOf("p"));
        
            const cont = document.createElement("div");
            cont.className = "cont";
            cont.style.padding = "1rem";
            cont.style.width = "fit-content";
            cont.style.height = "fit-content";
            cont.style.position = "absolute";
            cont.style.left = `${Number(le) + 30}px`;
            cont.style.top = `${Number(to) + 20}px`
        
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
            delBtn.style.top = "-1.5rem";
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
            cpyBtn.style.top = "-1.5rem";
            cpyBtn.innerText = "Copy";
            cpyBtn.style.opacity = "0";
            cpyBtn.style.pointerEvents = "none";
    
            const rect = document.createElement("div");
            rect.className = "shape rect";
            rect.style.border = "2px solid black";
            rect.style.width = `${Number(wi)}px`;
            rect.style.height = `${Number(he)}px`;
            rect.style.left = `${clientX}px`;
            rect.style.top = `${clientY}px`;
            rect.style.borderRadius = "8px";
        
            cont.appendChild(rect);
            cont.appendChild(wDot);
            cont.appendChild(hDot);
            cont.appendChild(delBtn);
            cont.appendChild(cpyBtn);
            document.body.appendChild(cont);
        }
        else if (shape.querySelector(".shape").classList.contains("circle")) {
            const wi = shape.querySelector(".shape").style.width.slice(0, shape.querySelector(".shape").style.width.indexOf("p"));
            const he = shape.querySelector(".shape").style.height.slice(0, shape.querySelector(".shape").style.height.indexOf("p"));
            const le = shape.style.left.slice(0, shape.style.left.indexOf("p"));
            const to = shape.style.top.slice(0, shape.style.top.indexOf("p"));
        
            const cont = document.createElement("div");
            cont.className = "cont";
            cont.style.padding = "1rem";
            cont.style.width = "fit-content";
            cont.style.height = "fit-content";
            cont.style.position = "absolute";
            cont.style.left = `${Number(le) + 30}px`;
            cont.style.top = `${Number(to) + 20}px`;
            cont.style.boxSizing = "border-box";
        
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
            delBtn.style.top = "-1.5rem";
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
            cpyBtn.style.top = "-1.5rem";
            cpyBtn.innerText = "Copy";
            cpyBtn.style.opacity = "0";
            cpyBtn.style.pointerEvents = "none";
    
            const circle = document.createElement("div");
            circle.className = "shape circle";
            circle.style.border = "2px solid black";
            circle.style.width = `${Number(wi)}px`;
            circle.style.height = `${Number(he)}px`;
            //circle.style.position = "absolute";
            circle.style.left = `${clientX}px`;
            circle.style.top = `${clientY}px`;
            circle.style.borderRadius = "10rem";
        
            cont.appendChild(circle);
            cont.appendChild(wDot);
            cont.appendChild(hDot);
            cont.appendChild(delBtn);
            cont.appendChild(cpyBtn);
            document.body.appendChild(cont);
        }
    }
    else if (e.target.matches(".create-tool")) crDrawer.style.top = "6rem"
    else if (e.target.matches(".hide-btn")) crDrawer.style.top = "1rem";
    // else if (e.target.matches(".hide-tool")) {
    //     tlDrawer.style.top = "-6rem";
    //     crDrawer.style.top = "-6rem";
    // }
});




// BUG
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