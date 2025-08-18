const shapebar = document.getElementById("shapebar");
const lock = document.querySelector(".lock-btn");

let shape;
let clientX, clientY;
let relXPos, relYPos;
let initTouch;
let differenceTouch = 0;
let state;
let startX, startY;      // where the touch started
let outerTempShape = null;
let lineShape, angle;

document.addEventListener("touchstart", (e) => {
    if (
        state == "Rectangle" ||
        state == "Circle" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        let borderRad = 0;
        if (state == "Circle") borderRad = "10rem";
        else if (state == "Rectangle") borderRad = "8px";
        
        outerTempShape = document.createElement('div');
        outerTempShape.className = 'cont';
        Object.assign(outerTempShape.style, {
            position: 'absolute',
            left: `${startX}px`,
            top: `${startY}px`,
            border: '2px dotted black',
            borderRadius: borderRad,
            width: '0px',
            height: '0px',
            zIndex: "999",
        });
        document.body.appendChild(outerTempShape);
    }
    else if (
        state == "Text" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        outerTempShape = document.createElement("div");
        outerTempShape.className = "svg-cont";
        Object.assign(outerTempShape.style, {
            position: 'absolute',
            left: `${startX}px`,
            top: `${startY}px`,
            width: 'fit-content',
            height: 'fit-content',
            zIndex: "999",
        });

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // svg.style.positionj = "absolute";
        svg.style.left = `${startX}px`;
        svg.style.top = `${startY}px`;
        svg.setAttribute("width", "0");
        svg.setAttribute("height", "50");
        svg.setAttribute("viewBox", "25 0 0 50");

        const d = "M 25 25 c 0 0 0 0 0 0";

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-dasharray", "4 4");

        svg.appendChild(path);
        outerTempShape.appendChild(svg);

        document.body.appendChild(outerTempShape);
    }
    else if (
        state == "Line" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        
        lineShape = InitLine(startX, startY);
    }

    else if (e.target.matches(".shape") && state == "Pan") {
        shapebar.style.display = "flex";
        const cont = e.target.closest(".cont");
        // const delBtn = cont.querySelector(".del-btn");
        // const cpyBtn = cont.querySelector(".cpy-btn");
        const wDot = cont.querySelector(".w-dot");
        const hDot = cont.querySelector(".h-dot");
        const whDot = cont.querySelector(".w-h-dot");
        // cpyBtn.style.opacity = "1";
        // cpyBtn.style.pointerEvents = "auto";
        // delBtn.style.opacity = "1";
        // delBtn.style.pointerEvents = "auto";
        wDot.style.opacity = "1";
        wDot.style.pointerEvents = "auto";
        hDot.style.opacity = "1";
        hDot.style.pointerEvents = "auto";
        whDot.style.opacity = "1";
        whDot.style.pointerEvents = "auto";

        const shapeInfo = e.target.closest(".cont").getBoundingClientRect();
        relXPos = e.touches[0].clientX - shapeInfo.left;
        relYPos = e.touches[0].clientY - shapeInfo.top;
            
        if (shape && shape !== e.target.closest(".cont")) {
            // shape.classList.remove("selected");
            // const delBtn = shape.querySelector(".del-btn");
            // const cpyBtn = shape.querySelector(".cpy-btn");
            const wDot = shape.querySelector(".w-dot");
            const hDot = shape.querySelector(".h-dot");
            const whDot = shape.querySelector(".w-h-dot");
            // cpyBtn.style.opacity = "0";
            // cpyBtn.style.pointerEvents = "none";
            // delBtn.style.opacity = "0";
            // delBtn.style.pointerEvents = "none";
            wDot.style.opacity = "0";
            wDot.style.pointerEvents = "none";
            hDot.style.opacity = "0";
            hDot.style.pointerEvents = "none";
            whDot.style.opacity = "0";
            whDot.style.pointerEvents = "none";
            // editValues.classList.remove("show-edit-values");
        }
        
        shape = e.target.closest(".cont");
        // shape = e.target;
        // cont.classList.add("selected");
    }
    else if (e.target.matches(".svg-cont") && state == "Pan") {
        shapebar.style.display = "flex";
        const cont = e.target;
        // const delBtn = cont.querySelector(".del-btn");
        // const cpyBtn = cont.querySelector(".cpy-btn");
        const wDot = cont.querySelector(".w-dot");
        const hDot = cont.querySelector(".h-dot");

        // cpyBtn.style.opacity = "1";
        // cpyBtn.style.pointerEvents = "auto";
        // delBtn.style.opacity = "1";
        // delBtn.style.pointerEvents = "auto";
        wDot.style.opacity = "1";
        wDot.style.pointerEvents = "auto";
        hDot.style.opacity = "1";
        hDot.style.pointerEvents = "auto";

        // isHolding = true;
        const shapeInfo = e.target.getBoundingClientRect();
        relXPos = e.touches[0].clientX - shapeInfo.left;
        relYPos = e.touches[0].clientY - shapeInfo.top;
            
        if (shape && shape !== e.target.closest(".svg-cont")) {
            // shape.classList.remove("selected");
            // const delBtn = shape.querySelector(".del-btn");
            // const cpyBtn = shape.querySelector(".cpy-btn");
            const wDot = shape.querySelector(".w-dot");
            const hDot = shape.querySelector(".h-dot");
            const whDot = shape.querySelector(".w-h-dot");
            // cpyBtn.style.opacity = "0";
            // cpyBtn.style.pointerEvents = "none";
            // delBtn.style.opacity = "0";
            // delBtn.style.pointerEvents = "none";
            wDot.style.opacity = "0";
            wDot.style.pointerEvents = "none";
            hDot.style.opacity = "0";
            hDot.style.pointerEvents = "none";
            whDot.style.opacity = "0";
            whDot.style.pointerEvents = "none";
        }
        
        shape = e.target.closest(".svg-cont");
        // cont.classList.add("selected");
    }
    initTouch = e.touches[0];
    differenceTouch = {
        w: e.touches[0].clientX,
        h: e.touches[0].clientY,
    };
});

// let lockX = true;
// let lockY = true;
// let normDx = 0;
document.addEventListener("touchmove", (e) => {
    if (
        state == "Rectangle" ||
        state == "Circle" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const touch = e.touches[0];
        const ww = touch.clientX - startX;
        const hh = touch.clientY - startY;

        // assign new values, don’t append strings
        outerTempShape.style.width  = `${Math.abs(ww)}px`;
        outerTempShape.style.height = `${Math.abs(hh)}px`;
        
        // keep the top-left corner fixed when dragging left/up
        if (ww < 0) outerTempShape.style.left = `${touch.clientX}px`;
        if (hh < 0) outerTempShape.style.top  = `${touch.clientY}px`;
    }
    else if (
        state == "Text" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const touch = e.touches[0];

        // keep the top-left corner fixed when dragging left/up
        // if (ww < 0) outerTempShape.style.left = `${touch.clientX}px`;
        // if (hh < 0) outerTempShape.style.top  = `${touch.clientY}px`;

        let svg = outerTempShape.querySelector("svg");
        let path = svg.querySelector("path");
        // let svgHeight = Number(svg.getAttribute("height"));
        let svgWidth = Number(svg.getAttribute("width"));
        // let strokeWidth = Number(path.getAttribute("stroke-width"));
        // let viewBoxX = Number(svg.getAttribute("viewBox").split(" ")[2]);
            
        x = touch.clientX - startX;
        svgWidth = touch.clientX - startX;
        // strokeWidth = touch.clientX - startX;
        svgHeight = touch.clientY - startY;
        vby = touch.clientY - startY;

        let viewBox = `25 0 ${x} 50`;
        svg.setAttribute("viewBox", viewBox);
        svg.setAttribute("width", svgWidth);
        // svg.setAttribute("height", svgHeight);

        let d = `M 25 25 c ${x / 2} -25 ${x / 2} 25 ${x} 0`;
        path.setAttribute("d", d);
        // path.setAttribute("stroke-width", strokeWidth);
        // path.setAttribute("stroke-dasharray", "4 4");
    }
    else if (
        state == "Line" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const touch = e.touches[0];

        DrawLine(startX, startY, touch, lineShape);
        agnle = RotateLine(startX, startY, e.touches[0], lineShape);
    }
    
    else if (e.target.matches(".shape") && state == "Pan" && shape.dataset.isLock == "false") {
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        shape.style.left = `${xPos}px`;
        shape.style.top = `${yPos}px`;
    }
    else if (e.target.matches(".svg-cont") && state == "Pan" && shape.dataset.isLock == "false") {
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        shape.style.left = `${xPos}px`;
        shape.style.top = `${yPos}px`;
    }
    // else if (e.target.matches("svg") && state == "move") {
    //     const touch = e.touches[0] || e.changedTouches[0];
    //     let xPos = touch.clientX - relXPos;
    //     let yPos = touch.clientY - relYPos;
    //     e.target.style.left = `${xPos}px`;
    //     e.target.style.top = `${yPos}px`;
    // }
    // else if (e.target.matches("svg") && state == "edit") {
    //     let path = shape.querySelector("path");
    //     let dArr = path.getAttribute("d").split(" ");
    //  `   let x = Number(dArr[8]);
    //     let svgWidth = Number(shape.getAttribute("width"));
            
    //     if (e.touches[0].clientX > initTouch.clientX && !lockX) {
    //         x += 1;
    //         svgWidth += 1;
    //     }
    //     if (e.touches[0].clientX < initTouch.clientX && !lockX) {
    //         x -= 1;
    //         svgWidth -= 1;
    //     }
        
    //     let d = `M 0 25 c ${x / 2} -25 ${x / 2} 25 ${x} 0`;
       
    //     shape.setAttribute("width", svgWidth);
    //     let vb = `0 0 ${svgWidth} 60`;    
    //     shape.setAttribute("viewBox", vb);
        
    //     path.setAttribute("d", d);
        
    //     widthInput.value = x;
    // }
    
    else if (e.target.matches(".w-dot") && !shape.classList.contains("svg-cont") && state == "Pan" && shape.dataset.isLock == "false") {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normX = Number(actShape.style.width.slice(0, actShape.style.width.indexOf("p")));
        
        normX += e.touches[0].clientX - differenceTouch.w;
        actShape.style.width = `${normX}px`;
    }
    else if (e.target.matches(".h-dot") && !shape.classList.contains("svg-cont") && state == "Pan" && shape.dataset.isLock == "false") {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normY = Number(actShape.style.height.slice(0, actShape.style.height.indexOf("p")));
        
        normY += e.touches[0].clientY - differenceTouch.h;
        actShape.style.height = `${normY}px`;
    }
    else if (e.target.matches(".w-h-dot") && !shape.classList.contains("svg-cont") && state == "Pan" && shape.dataset.isLock == "false") {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normX = Number(actShape.style.width.slice(0, actShape.style.width.indexOf("p")));
        let normY = Number(actShape.style.height.slice(0, actShape.style.height.indexOf("p")));
        
        normX += e.touches[0].clientX - differenceTouch.w;
        normY += e.touches[0].clientY - differenceTouch.h;
        actShape.style.width = `${normX}px`;
        actShape.style.height = `${normY}px`;
    }
    else if (e.target.matches(".w-dot") && shape.classList.contains("svg-cont") && state == "Pan" && shape.dataset.isLock == "false") {
        let svg = shape.querySelector("svg");
        let path = svg.querySelector("path");
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
    }
    else if (e.target.matches(".h-dot") && shape.classList.contains("svg-cont") && state == "Pan" && shape.dataset.isLock == "false") {
        let svg = shape.querySelector("svg");
        let path = svg.querySelector("path");
        let svgHeight = Number(svg.getAttribute("height"));
        let svgWidth = Number(svg.getAttribute("width"));
        let strokeWidth = Number(path.getAttribute("stroke-width"));
        let vby = Number(svg.getAttribute("viewBox").split(" ")[3]);

        strokeWidth += e.touches[0].clientY - differenceTouch.h;
        svgHeight += e.touches[0].clientY - differenceTouch.h;
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
    if (
        state != "Pan" &&
        state == "Rectangle" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const tempShapeWidth = outerTempShape.style.width.slice(0, outerTempShape.style.width.indexOf("p"));
        const tempShapeHeight = outerTempShape.style.height.slice(0, outerTempShape.style.height.indexOf("p"));
        createRect(width=Number(tempShapeWidth), height=Number(tempShapeHeight), left=Number(startX), top=Number(startY));
    }
    else if (
        state != "Pan" &&
        state == "Circle" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const tempShapeWidth = outerTempShape.style.width.slice(0, outerTempShape.style.width.indexOf("p"));
        const tempShapeHeight = outerTempShape.style.height.slice(0, outerTempShape.style.height.indexOf("p"));
        createCircle(width=Number(tempShapeWidth), height=Number(tempShapeHeight), left=Number(startX), top=Number(startY));
    }
    else if (
        state == "Text" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const svg = outerTempShape.querySelector("svg");
        const path = svg.querySelector("path");

        const dAttr = path.getAttribute("d");
        const viewBoxAttr = svg.getAttribute("viewBox");

        const tempShapeLeft = outerTempShape.style.left.slice(0, outerTempShape.style.left.indexOf("p"));
        const tempShapeTop = outerTempShape.style.top.slice(0, outerTempShape.style.top.indexOf("p"));
        createText(svgWidth=svg.getAttribute("width"), d=viewBoxAttr, viewBox=dAttr, left=tempShapeLeft, top=tempShapeTop);
    }
    else if (
        state == "Line" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const svg = outerTempShape.querySelector("svg");
        const line = svg.querySelector("line");
        
        const tempShapeLeft = outerTempShape.style.left.slice(0, outerTempShape.style.left.indexOf("p"));
        const tempShapeTop = outerTempShape.style.top.slice(0, outerTempShape.style.top.indexOf("p"));

        const x1 = line.getAttribute("x1");
        const y1 = line.getAttribute("y1");
        const x2 = line.getAttribute("x2");
        const y2 = line.getAttribute("y2");

        const width = svg.getAttribute("width");
        const viewBox = svg.getAttribute("viewBox");

        createLine(angle, x1, y1, x2, y2, tempShapeLeft, tempShapeTop, width, `0 0 ${width} 10`);
    }
    if (outerTempShape) {
        outerTempShape.remove();
        outerTempShape = null;
    }
    initTouch = e.touches[0];
});





document.addEventListener("click", (e) => {
    if (e.target.closest(".shape-lock-icon")) {
        if (!shape) return;

        const lockIcon = e.target.closest(".shape-lock-icon");
        const innerShape = lockIcon.closest(".cont") || lockIcon.closest(".svg-cont");
        innerShape.dataset.isLock = "false";
        lockIcon.style.pointerEvents = "none";
        lockIcon.style.display = "none";
    }
    
    if (e.target.matches(".shape")) {
        shape = e.target.closest(".cont");
        // shape.classList.add("selected");
        // const delBtn = shape.querySelector(".del-btn");
        // const cpyBtn = shape.querySelector(".cpy-btn");
        const wDot = shape.querySelector(".w-dot");
        const hDot = shape.querySelector(".h-dot");
        const whDot = shape.querySelector(".w-h-dot");
        // cpyBtn.style.opacity = "1";
        // cpyBtn.style.pointerEvents = "auto";
        // delBtn.style.opacity = "1";
        // delBtn.style.pointerEvents = "auto";
        wDot.style.opacity = "1";
        wDot.style.pointerEvents = "auto";
        hDot.style.opacity = "1";
        hDot.style.pointerEvents = "auto";
        whDot.style.opacity = "1";
        whDot.style.pointerEvents = "auto";
     }
    else if (e.target.matches(".svg-cont")) {
        shape = e.target;
        shape.classList.add("selected");
        // const delBtn = shape.querySelector(".del-btn");
        // const cpyBtn = shape.querySelector(".cpy-btn");
        const wDot = shape.querySelector(".w-dot");
        const hDot = shape.querySelector(".h-dot");
        // cpyBtn.style.opacity = "1";
        // cpyBtn.style.pointerEvents = "auto";
        // delBtn.style.opacity = "1";
        // delBtn.style.pointerEvents = "auto";
        wDot.style.opacity = "1";
        wDot.style.pointerEvents = "auto";
        hDot.style.opacity = "1";
        hDot.style.pointerEvents = "auto";
    }
    else if (
        shape &&
        !e.target.matches(".svg-cont") &&
        !e.target.matches(".shape") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".tool") &&
        !e.target.matches(".tool svg")
        // !e.target.matches(".create-tool")
    ) {
        shape.classList.remove("selected");
        // const delBtn = shape.querySelector(".del-btn");
        // const cpyBtn = shape.querySelector(".cpy-btn");
        const wDot = shape.querySelector(".w-dot");
        const hDot = shape.querySelector(".h-dot");
        const whDot = shape.querySelector(".w-h-dot");
        // cpyBtn.style.opacity = "0";
        // cpyBtn.style.pointerEvents = "none";
        // delBtn.style.opacity = "0";
        // delBtn.style.pointerEvents = "none";
        wDot.style.opacity = "0";
        wDot.style.pointerEvents = "none";
        hDot.style.opacity = "0";
        hDot.style.pointerEvents = "none";
        whDot.style.opacity = "0";
        whDot.style.pointerEvents = "none";
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
    
    
    
    // else if (e.target.matches(".rect-btn") || e.target.matches(".rect-btn svg")) state = "rect";
    // else if (e.target.matches(".circle-btn") || e.target.matches(".circle-btn svg")) state = "circle";
    // else if (e.target.matches(".text-btn") || e.target.matches(".text-btn svg")) state = "text";
    // else if (e.target.matches(".pan-btn") || e.target.matches(".pan-btn svg")) state = "pan";



    // else if (e.target.matches(".del-btn")) {
    //     if (!shape) {
    //         alert("Select A shape Forst !");
    //         return;
    //     }
        
    //     shape.remove();
    //     shape = null;
    // }
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
});

function LockShape(target) {
    if (!target) return;

    target.dataset.isLock = "true";
    const shapeIcon = shape.querySelector(".shape-lock-icon");
    shapeIcon.style.display = "flex";
    shapeIcon.style.pointerEvents = "auto";
}

shapebar.addEventListener("click", (e) => {
    if (e.target.closest(".sh-tool") == null) return;

    shapeBtn = e.target.closest(".sh-tool");
    if (shapeBtn.classList.contains("lock-btn")) {
        LockShape(shape);
    }
});



// toolbar Logic
const toolbar = document.getElementById('toolbar');
const tools = [...toolbar.children].filter(n => n.classList.contains('tool'));
const label = document.createElement('div');
label.id = 'toolLabel';
toolbar.appendChild(label);

function updateUI(activeBtn) {
    const idx = tools.indexOf(activeBtn);
    tools.forEach((btn, i) => {
    const op = Math.max(1 - Math.abs(i - idx) * 0.2, 0.1);
    btn.style.opacity = op;
    btn.classList.toggle('active', btn === activeBtn);
    });

    label.textContent = activeBtn.dataset.name;
    state = activeBtn.dataset.name;
    const btnRect = activeBtn.getBoundingClientRect();
    const barRect = toolbar.getBoundingClientRect();
    label.style.left = `${btnRect.left + btnRect.width/2 - barRect.left}px`;
    label.classList.add('show');
}

toolbar.addEventListener('click', e => {
    if (e.target.closest(".tool") == null) return;
    const tgt = e.target.closest('.tool');
    if (tgt) updateUI(tgt);
});

updateUI(tools[6]);
// end of toolbar logic



function createRect(width, height, left, top) {
    const cont = document.createElement("div");
    cont.className = "cont rect";
    cont.style.padding = "1rem";
    cont.style.width = "fit-content";
    cont.style.height = "fit-content";
    cont.style.position = "absolute";
    cont.style.left = `${left}px`;
    cont.style.top = `${top}px`;
    cont.setAttribute("data-is-lock", "false");
    
    cont.innerHTML += `
        <div class="shape-lock-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#000000">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
            </svg>
        </div>
    `
   
    const wDot = document.createElement("div");
    wDot.className = "w-dot dot";
    wDot.style.width = "15px";
    wDot.style.height = "15px";
    wDot.style.borderRadius = "50px";
    wDot.style.backgroundColor = "black";
    wDot.style.position = "absolute";
    const w = 15 / 2;
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
    const h = 15 / 2;
    hDot.style.bottom = `calc(1rem - ${h}px)`;
    hDot.style.left = "50%";
    hDot.style.transform = "translateX(-50%)";
    hDot.style.opacity = "0";
    hDot.style.pointerEvents = "none";

    const whDot = document.createElement("div");
    whDot.className = "w-h-dot dot";
    whDot.style.width = "15px";
    whDot.style.height = "15px";
    whDot.style.borderRadius = "50px";
    whDot.style.backgroundColor = "black";
    whDot.style.position = "absolute";
    const wh = 15 / 2;
    whDot.style.right = `calc(1rem - ${wh}px)`;
    whDot.style.bottom = "0";
    whDot.style.transform = "translateY(-50%)";
    whDot.style.opacity = "0";
    whDot.style.pointerEvents = "none";

    const rect = document.createElement("div");
    rect.className = "shape rect";
    rect.style.border = "2px solid black";
    rect.style.width = `${width}px`;
    rect.style.height = `${height}px`;
    rect.style.left = `${clientX}px`;
    rect.style.top = `${clientY}px`;
    rect.style.borderRadius = "8px";
    
    cont.appendChild(rect);
    cont.appendChild(wDot);
    cont.appendChild(hDot);
    cont.appendChild(whDot);
    document.body.appendChild(cont);
}

function createCircle(width, height, left, top) {
    const cont = document.createElement("div");
    cont.className = "cont circle";
    cont.style.padding = "1rem";
    cont.style.width = "fit-content";
    cont.style.height = "fit-content";
    cont.style.position = "absolute";
    cont.style.left = `${left}px`;
    cont.style.top = `${top}px`;
    cont.setAttribute("data-is-lock", "false");

    cont.innerHTML += `
        <div class="shape-lock-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#000000">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
            </svg>
        </div>
    `;
    
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

    const whDot = document.createElement("div");
    whDot.className = "w-h-dot dot";
    whDot.style.width = "15px";
    whDot.style.height = "15px";
    whDot.style.borderRadius = "50px";
    whDot.style.backgroundColor = "black";
    whDot.style.position = "absolute";
    const wh = 15 / 2;
    whDot.style.right = `calc(2rem - ${wh}%)`;
    whDot.style.bottom = "1rem";
    whDot.style.transform = "translateY(-50%)";
    whDot.style.opacity = "0";
    whDot.style.pointerEvents = "none";
            
    const circle = document.createElement("div");
    circle.className = "shape circle";
    circle.style.border = "2px solid black";
    circle.style.width = `${width}px`;
    circle.style.height = `${height}px`;
    circle.style.left = `${clientX}px`;
    circle.style.top = `${clientY}px`;
    circle.style.borderRadius = "10rem";
    
    cont.appendChild(circle);
    cont.appendChild(wDot);
    cont.appendChild(hDot);
    cont.appendChild(whDot);
    document.body.appendChild(cont);
}

function createText(svgWidth, viewBox, d, left, top) {
    const cont = document.createElement("div");
    cont.className = "svg-cont";
    cont.style.padding = "1rem";
    cont.style.width = "fit-content";
    cont.style.height = "fit-content";
    cont.style.position = "absolute";
    cont.style.left = `${left}px`;
    cont.style.top = `${top}px`;
    cont.setAttribute("data-is-lock", "false");

    cont.innerHTML += `
        <div class="shape-lock-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#000000">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
            </svg>
        </div>
    `
    
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

    const whDot = document.createElement("div");
    whDot.className = "w-h-dot dot";
    whDot.style.display = "none";
    whDot.style.width = "15px";
    whDot.style.height = "15px";
    whDot.style.borderRadius = "50px";
    whDot.style.backgroundColor = "black";
    whDot.style.position = "absolute";
    const wh = 15 / 2;
    whDot.style.right = `calc(2rem - ${wh}%)`;
    whDot.style.bottom = "1rem";
    whDot.style.transform = "translateY(-50%)";
    whDot.style.opacity = "0";
    whDot.style.pointerEvents = "none";
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", "50");
    svg.setAttribute("viewBox", viewBox);
    svg.style.pointerEvents = "none";
    
    // const d = "M 25 25 c 50 -25 50 25 100 0";
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.style.pointerEvents = "none";
    
    svg.appendChild(path);
    cont.appendChild(svg);
    cont.appendChild(wDot);
    cont.appendChild(hDot);
    cont.appendChild(whDot);
    document.body.appendChild(cont);
}

function InitLine(initX, initY) {
    outerTempShape = document.createElement("div");
    outerTempShape.className = "cont line";
    outerTempShape.style.position = "absolute";
    outerTempShape.style.left = `${initX}px`;
    outerTempShape.style.top = `${initY}px`;
    outerTempShape.style.width = "fit-content";
    outerTempShape.style.height = "fit-content";
    outerTempShape.style.border = "2px dotted black";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "10");
    svg.setAttribute("veiwBox", `0 0 0 10`);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("fill", "none");
    // line.setAttribute("x1", initX);
    // line.setAttribute("y1", initY);
    // line.setAttribute("x2", initX);
    // line.setAttribute("y2", initY);
    line.setAttribute("stroke-dasharray", "4 4");

    svg.appendChild(line);
    outerTempShape.appendChild(svg);
    document.body.appendChild(outerTempShape);

    return outerTempShape;
}

function DrawLine(initX, initY ,touch, wrapper) {
    const svg = wrapper.querySelector("svg");
    const line = svg.querySelector("line");

    let width = touch.clientX - initX;

    if (width < 0) {
        wrapper.style.left = `${touch.clientX}px`;
        width *= -1;
    }
    // let height = touch.clientY - initY;

    svg.setAttribute("width", width);
    // svg.setAttribute("viewBox", `${width / 2} 5 ${width} 5`)
    svg.setAttribute("viewBox", `0 0 ${width} 10`);

    // let x1 = initX;
    // let y1 = initY;
    // let x2 = touch.clientX - initX;
    // let y2 = touch.clientY - initY;

    line.setAttribute("x1", 0);
    line.setAttribute("y1", "5");
    line.setAttribute("x2", width);
    line.setAttribute("y2", "5");
}

function RotateLine(initX, initY, touch, wrapper) {
    if (!wrapper) return;
    
    const dx = touch.clientX - initX;
    const dy = touch.clientY - initY;

    let angle = Math.atan2(dy, dx) * 180 / Math.PI;

    if (angle < 0) angle += 360;

    wrapper.style.transform = `rotate(${angle}deg)`;

    return angle;
}

function createLine(angle, x1, y1, x2, y2, left, top, width, viewBox) {
    const wrapper = document.createElement("div");
    wrapper.className = "cont line";
    Object.assign(wrapper.style, {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: "fit-content",
        height: "fit-content",
        transform: `rotate(${angle}deg)`,
    });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", "10");
    svg.setAttribute("viewBox", viewBox);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    svg.appendChild(line);
    wrapper.appendChild(svg);
    document.body.appendChild(wrapper);
}
