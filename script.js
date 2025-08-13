let shape;
let clientX, clientY;
let relXPos, relYPos;
let initTouch;
let differenceTouch = 0;
let state = "pan";
let startX, startY;      // where the touch started
let outerTempShape = null;
document.addEventListener("touchstart", (e) => {
    if (
        state != "pan" &&
        state != "text" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        let borderRad = 0;
        if (state == "circle") borderRad = "10rem";
        else if (state == "rect") borderRad = "8px";
        
        outerTempShape = document.createElement('div');
        outerTempShape.className = 'temp-shape';
        Object.assign(outerTempShape.style, {
            position: 'absolute',
            left: `${startX}px`,
            top: `${startY}px`,
            border: '2px dotted black',
            borderRadius: borderRad,
            width: '0px',
            height: '0px'
        });
        document.body.appendChild(outerTempShape);
    }
    else if (
        state != "pan" &&
        state == "text" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        const outerTempShape = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        outerTempShape.style.positionj = "absolute";
        outerTempShape.style.left = `${startX}px`;
        outerTempShape.style.top = `${startY}px`;
        outerTempShape.setAttribute("width", "0");
        outerTempShape.setAttribute("height", "0");
        outerTempShape.setAttribute("viewBox", "25 0 0 0");

        const d = "M 25 25";

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("stroke-width", "0");
        path.setAttribute("stroke", "black");
        path.setAttribute("d", d);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "5");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");

        outerTempShape.appendChild(path);

        document.body.appendChild(outerTempShape);
    }

    else if (e.target.matches(".shape") && state == "pan") {
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
        // cont.classList.add("selected");
    }
    else if (e.target.matches(".svg-cont") && state == "pan") {
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
        
        shape = e.target;
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
        state != "pan" &&
        state != "text" &&
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
        state != "pan" &&
        state == "text" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const touch = e.touches[0];
        const ww = touch.clientX - startX;
        const hh = touch.clientY - startY;

        // assign new values, don’t append strings
        console.log("svg Element", outerTempShape.querySelector("path"));
        // outerTempShape.style.width  = `${Math.abs(ww)}px`;
        // outerTempShape.style.height = `${Math.abs(hh)}px`;
        
        // keep the top-left corner fixed when dragging left/up
        if (ww < 0) outerTempShape.style.left = `${touch.clientX}px`;
        if (hh < 0) outerTempShape.style.top  = `${touch.clientY}px`;
    }
    
    else if (e.target.matches(".shape") && state == "pan") {
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        shape.style.left = `${xPos}px`;
        shape.style.top = `${yPos}px`;
    }
    else if (e.target.matches(".svg-cont") && state == "pan") {
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        shape.style.left = `${xPos}px`;
        shape.style.top = `${yPos}px`;
    }
    
    else if (e.target.matches(".w-dot") && !shape.classList.contains("svg-cont") && state == "pan") {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normX = Number(actShape.style.width.slice(0, actShape.style.width.indexOf("p")));
        
        normX += e.touches[0].clientX - differenceTouch.w;
        actShape.style.width = `${normX}px`;
    }
    else if (e.target.matches(".h-dot") && !shape.classList.contains("svg-cont") && state == "pan") {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normY = Number(actShape.style.height.slice(0, actShape.style.height.indexOf("p")));
        
        normY += e.touches[0].clientY - differenceTouch.h;
        actShape.style.height = `${normY}px`;
    }
    else if (e.target.matches(".w-h-dot") && !shape.classList.contains("svg-cont") && state == "pan") {
        const cont = e.target.closest(".cont");
        const actShape = cont.querySelector(".shape");
        let normX = Number(actShape.style.width.slice(0, actShape.style.width.indexOf("p")));
        let normY = Number(actShape.style.height.slice(0, actShape.style.height.indexOf("p")));
        
        normX += e.touches[0].clientX - differenceTouch.w;
        normY += e.touches[0].clientY - differenceTouch.h;
        actShape.style.width = `${normX}px`;
        actShape.style.height = `${normY}px`;
    }
    else if (e.target.matches(".w-dot") && shape.classList.contains("svg-cont") && state == "pan") {
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
    else if (e.target.matches(".h-dot") && shape.classList.contains("svg-cont") && state == "pan") {
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
    if (
        state != "pan" &&
        state == "rect" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const tempShapeWidth = outerTempShape.style.width.slice(0, outerTempShape.style.width.indexOf("p"));
        const tempShapeHeight = outerTempShape.style.height.slice(0, outerTempShape.style.height.indexOf("p"));
        createRect(e=e, width=Number(tempShapeWidth), height=Number(tempShapeHeight), left=Number(startX), top=Number(startY));
        outerTempShape.remove();
        outerTempShape = null;
    }
    if (
        state != "pan" &&
        state == "circle" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const tempShapeWidth = outerTempShape.style.width.slice(0, outerTempShape.style.width.indexOf("p"));
        const tempShapeHeight = outerTempShape.style.height.slice(0, outerTempShape.style.height.indexOf("p"));
        createCircle(e=e, width=Number(tempShapeWidth), height=Number(tempShapeHeight), left=Number(startX), top=Number(startY));
        outerTempShape.remove();
        outerTempShape = null;
    }
    initTouch = e.touches[0];
});





document.addEventListener("click", (e) => {
    console.log(state);
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
    else if (
        shape &&
        !e.target.matches(".svg-cont") &&
        !e.target.matches(".shape") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".tool") &&
        !e.target.matches(".tool svg") &&
        !e.target.matches(".create-tool")
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
    else if (e.target.matches(".show-create-dr-btn") || e.target.closest(".dr-btn-bg")) {
        if (!crDrawer.classList.contains("show-cr-drawer")) {
            crDrawer.classList.add("show-cr-drawer");
            crDrBtn.classList.add("rotate-btn");
        } else if (crDrawer.classList.contains("show-cr-drawer")) {
            crDrawer.classList.remove("show-cr-drawer");
            crDrBtn.classList.remove("rotate-btn");
        }
    }
    
    
    
    else if (e.target.matches(".rect-btn") || e.target.matches(".rect-btn svg")) state = "rect";
    else if (e.target.matches(".circle-btn") || e.target.matches(".circle-btn svg")) state = "circle";
    else if (e.target.matches(".text-btn") || e.target.matches(".text-btn svg")) state = "text";
    else if (e.target.matches(".pan-btn") || e.target.matches(".pan-btn svg")) state = "pan";



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



// toolbar Logic
const toolbar = document.getElementById('toolbar');
const tools   = [...toolbar.children].filter(n => n.classList.contains('tool'));
const label   = document.createElement('div');
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
  const btnRect = activeBtn.getBoundingClientRect();
  const barRect = toolbar.getBoundingClientRect();
  label.style.left = `${btnRect.left + btnRect.width/2 - barRect.left}px`;
  label.classList.add('show');
}

toolbar.addEventListener('click', e => {
  const tgt = e.target.closest('.tool');
  if (tgt) updateUI(tgt);
});

updateUI(tools[6]);
// end of toolbar logic



function createRect(e, width, height, left, top) {
    const cont = document.createElement("div");
    cont.className = "cont rect";
    cont.style.padding = "1rem";
    cont.style.width = "fit-content";
    cont.style.height = "fit-content";
    cont.style.position = "absolute";
    cont.style.left = `${left}px`;
    cont.style.top = `${top}px`;
   
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

function createCircle(e, width, height, left, top) {
    const cont = document.createElement("div");
    cont.className = "cont circle";
    cont.style.padding = "1rem";
    cont.style.width = "fit-content";
    cont.style.height = "fit-content";
    cont.style.position = "absolute";
    cont.style.left = `${left}px`;
    cont.style.top = `${top}px`;
    
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

function createText(e, width, height, left, top) {
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
}
