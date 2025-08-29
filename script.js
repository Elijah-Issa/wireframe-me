let createdShapes = [];
let lassoed = [];

document.addEventListener("keydown", e => {
    if (e.key == "q") console.log(createdShapes);
});

const canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
Object.assign(canvas.style, {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',   // we’ll toggle it per tool
  zIndex: 9999,
});
canvas.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
document.body.appendChild(canvas);

const shapebar = document.getElementById("shapebar");
const lock = document.querySelector(".lock-btn");

const bbb = document.body.getBoundingClientRect();
const body = {
    x: bbb.left,
    y: bbb.top,
};

let shape;
let clientX, clientY;
let relXPos, relYPos;
let initTouch;
let differenceTouch = 0;
let state;
let startX, startY; // where the touch started
let outerTempShape = null;
let lassoCont, lasso, polyline, d, line;
let shX, shY;
// let lassoLine, lPath, ld;

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

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
        state == "Lasso" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        // document.body.style.touchAction = "none";
        
        lasso = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        lasso.style.position = "fixed";
        lasso.style.display = "block";
        lasso.style.overflow = "visible";
        // lasso.setAttribute("width", window.innerWidth);
        // lasso.setAttribute("height", window.innerHeight);
        // lasso.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);

        polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        polyline.setAttribute("stroke", "black");
        polyline.setAttribute("stroke-width", "3");
        polyline.setAttribute("fill", "none");
        d = `${startX} ${startY}`;
        polyline.setAttribute("points", d);
        polyline.setAttribute("stroke-dasharray", "4 4");
        
        line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute("fill", "none");
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "3");
        line.setAttribute("stroke-dasharray", "4 4");
        line.setAttribute("d", `M ${startX} ${startY} L ${e.touches[0].clientX} ${e.touches[0].clientY}`)
        lasso.appendChild(line);
        
        lasso.appendChild(polyline);
        lasso.appendChild(line);
        canvas.appendChild(lasso);
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

        if (lassoed) {
            lassoed.forEach(sh => {
                shX = sh.style.left.slice(0, sh.style.left.indexOf("p"));
                shY = sh.style.top.slice(0, sh.style.top.indexOf("p"));
                sh.setAttribute("data-sh-x", shX);
                sh.setAttribute("data-sh-y", shY);

                const shInfo = sh.closest(".cont").getBoundingClientRect();
                relXPos = e.touches[0].clientX - shInfo.left;
                relYPos = e.touches[0].clientY - shInfo.top;
                sh.setAttribute("data-rel-x", relXPos);
                sh.setAttribute("data-rel-y", relXPos);
            });
        }
            
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
    else if (e.target.matches(".line") && state == "Pan") {
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
            
        if (shape && shape !== e.target.closest(".line")) {
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
        
        shape = e.target.closest(".line");
        // cont.classList.add("selected");
    }
    else if (e.target.closest(".comment-cont") && state == "Pan") {
        const shapeInfo = e.target.closest(".comment-cont").getBoundingClientRect();
        relXPos = e.touches[0].clientX - shapeInfo.left;
        relYPos = e.touches[0].clientY - shapeInfo.top;

        if (shape !== e.target.closest(".comment-cont")) {
            shape = e.target.closest(".comment-cont");
        }
    }
    initTouch = e.touches[0];
    differenceTouch = {
        w: e.touches[0].clientX,
        h: e.touches[0].clientY,
    };
});

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
        state == "Lasso" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        d += ` ${e.touches[0].clientX} ${e.touches[0].clientY}`;
        polyline.setAttribute("points", d);

        line.setAttribute("d", `M ${startX} ${startY} L ${e.touches[0].clientX} ${e.touches[0].clientY}`);
    }
    
    
    else if (e.target.matches(".shape") && state == "Pan" && shape.dataset.isLock == "false") {
        const touch = e.touches[0] || e.changedTouches[0];

        if (lassoed) {
            lassoed.forEach(sh => {
                // shX = sh.style.left.slice(0, sh.style.left.indexOf("p"))
                // shY = sh.style.top.slice(0, sh.style.top.indexOf("p"))
                let xPos = touch.clientX - Number(sh.dataset.relX) - Number(sh.dataset.shX);
                let yPos = touch.clientY - Number(sh.dataset.relY) - Number(sh.dataset.shY);
                // let xPos = touch.clientX - Number(sh.dataset.shX);
                // let yPos = touch.clientY - Number(sh.dataset.shY);
                sh.style.left = `${xPos}px`;
                sh.style.top = `${yPos}px`;
            });
        }
        // else {
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        shape.style.left = `${xPos}px`;
        shape.style.top = `${yPos}px`;
        // } 
    }
    else if (e.target.matches(".svg-cont") && state == "Pan" && shape.dataset.isLock == "false") {
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        shape.style.left = `${xPos}px`;
        shape.style.top = `${yPos}px`;
    }
    else if (e.target.closest(".comment-cont") && state == "Pan") {
        const touch = e.touches[0] || e.changedTouches[0];
        let xPos = touch.clientX - relXPos;
        let yPos = touch.clientY - relYPos;
        shape.style.left = `${xPos}px`;
        shape.style.top = `${yPos}px`;
    }
    
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
    else if (e.target.matches(".w-dot") && !shape.classList.contains("line") && state == "Pan" && shape.dataset.isLock == "false") {
        let svg = shape.querySelector('svg[data-type="text"]');
        let path = svg.querySelector("path");
        let dArr = path.getAttribute("d").split(" ");
        let x = Number(dArr[8]);
        let svgWidth = Number(svg.getAttribute("width"));
        // let vby = Number(svg.getAttribute("viewBox").split(" ")[3]);
            
        x += e.touches[0].clientX - differenceTouch.w;
        svgWidth += e.touches[0].clientX - differenceTouch.w;

        let d = `M 25 25 c ${x / 2} -25 ${x / 2} 25 ${x} 0`;
       
        svg.setAttribute("width", svgWidth);
        let vb = `25 0 ${svgWidth} 50`;
        svg.setAttribute("viewBox", vb);
        
        path.setAttribute("d", d);
    }
    else if (e.target.matches(".h-dot") && !shape.classList.contains("line") && state == "Pan" && shape.dataset.isLock == "false") {
        let svg = shape.querySelector('svg[data-type="text"]');
        let path = svg.querySelector("path");
        // let svgHeight = Number(svg.getAttribute("height"));
        let svgWidth = Number(svg.getAttribute("width"));
        let strokeWidth = Number(path.getAttribute("stroke-width"));
        let vby = Number(svg.getAttribute("viewBox").split(" ")[3]);

        strokeWidth += e.touches[0].clientY - differenceTouch.h;
        // svgHeight += e.touches[0].clientY - differenceTouch.h;
        vby += e.touches[0].clientY - differenceTouch.h;

        let vb = `25 0 ${svgWidth} ${svgHeight}`;

        path.setAttribute("stroke-width", strokeWidth);
        // svg.setAttribute("height", svgHeight);
        svg.setAttribute("width", svgWidth);
        svg.setAttribute("viewBox", vb);
    }
    else if (e.target.matches(".w-dot") && shape.classList.contains("line") && state == "Pan" && shape.dataset.isLock == "false") {
        let svg = shape.querySelector('svg[data-type="line"]');
        let line = svg.querySelector("line");
        let x2 = Number(line.getAttribute("x2"));

        x2 += e.touches[0].clientX - differenceTouch.w;
        line.setAttribute("x2", x2);
        svg.setAttribute("width", x2);
        svg.setAttribute("viewBox", `0 25 ${x2} 50`)
    }
    else if (e.target.matches(".h-dot") && shape.classList.contains("line") && state == "Pan" && shape.dataset.isLock == "false") {
        let svg = shape.querySelector('svg[data-type="line"]');
        let line = svg.querySelector("line");
        let strokeWidth = Number(line.getAttribute("stroke-width"));

        strokeWidth += e.touches[0].clientY - differenceTouch.h;
        line.setAttribute("stroke-width", strokeWidth);
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
        const tempShapeLeft = outerTempShape.style.left.slice(0, outerTempShape.style.left.indexOf("p"));
        const tempShapeTop = outerTempShape.style.top.slice(0, outerTempShape.style.top.indexOf("p"));
        shape = createRect(width=Number(tempShapeWidth), height=Number(tempShapeHeight), left=Number(startX), top=Number(startY));
        const info = shape.getBoundingClientRect();
        const sh = {
            type: "rect",
            actualShape: shape.querySelector(".shape"),
            left: info.left,
            right: info.right,
            top: info.top,
            bottom: info.bottom,
            width: info.width,
            height: info.height,
        };
        createdShapes.push(sh);
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
        shape = createCircle(width=Number(tempShapeWidth), height=Number(tempShapeHeight), left=Number(startX), top=Number(startY));
        const info = shape.getBoundingClientRect();
        const sh = {
            type: "circle",
            actualShape: shape.querySelector(".shape"),
            left: info.left,
            right: info.right,
            top: info.top,
            bottom: info.bottom,
            width: info.width,
            height: info.height,
        };
        createdShapes.push(sh);
        console.log(createdShapes);}
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
        shape = createText(svgWidth=svg.getAttribute("width"), strokeWidth="3", d=viewBoxAttr, viewBox=dAttr, left=tempShapeLeft, top=tempShapeTop);
        const info = shape.getBoundingClientRect();
        const sh = {
            type: "text",
            actualShape: shape.querySelector(".svg-cont"),
            left: info.left,
            right: info.right,
            top: info.top,
            bottom: info.bottom,
            width: info.width,
            height: info.height,
        };
        createdShapes.push(sh);
    }
    else if (
        state == "Lasso" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        const lassoInfo = lasso.querySelector("svg polyline").getBoundingClientRect();
        const test = document.querySelector(".test");
        const testInfo = document.querySelector(".test").getBoundingClientRect();

        document.body.querySelectorAll(".cont, .svg-cont").forEach(sh => {
            let r = sh.getBoundingClientRect();
            
            if (
                lassoInfo.left < (r.left + (r.width / 2)) &&
                lassoInfo.right > (r.right - (r.width / 2)) &&
                lassoInfo.top < (r.top + (r.height / 2)) &&
                lassoInfo.bottom > (r.bottom - (r.height / 2))
            ) {
                // sh.actualShape.style.border = "2px dotted red";
                // selectedShapes.push(sh.actualShape);
                // sh.style.border = sh.classList.contains("cont") ? sh.querySelector(".shape").style.border = "2px dashed red" : sh.style.border = "2px dashed blue";
                // shapebar.style.display = "flex";
                // shape = test;
                lassoed.push(sh);
            }
            lassoed.forEach(sh => {
                if ( sh.classList.contains("cont") ) sh.querySelector(".shape").style.border = "2px dashed red";
                else if ( sh.classList.contains("svg-cont") ) sh.style.border = "2px dashed red";
            });
            // selectedShapes.forEach(sel => {
            //     sel.style.border = "3px dotted red";
            // });
            // console.log(selectedShapes)
            lasso.remove();
        });

        if (
            lassoInfo.left < testInfo.left &&
            lassoInfo.right > testInfo.right &&
            lassoInfo.top < testInfo.top &&
            lassoInfo.bottom > testInfo.bottom
        ) {
            test.style.border = "2px dotted red";
            shapebar.style.display = "flex";
            shape = test;
        }
        lasso.remove();
    }
    if (outerTempShape) {
        outerTempShape.remove();
        outerTempShape = null;
    }
    initTouch = e.touches[0];
    // lassoed.length = 0;
    // lassoed = [];
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

    else if (e.target.matches(".comment-x-icon") || e.target.closest(".comment-x-icon")) {
        if (!shape) return;

        e.target.closest(".comment-x-icon").style.display = "none";
        shape.querySelector(".inner-comment-wrapper").style.display = "none";
        shape.dataset.commentState = "closed";
    }
    else if (e.target.matches(".comment-icon-wrapper") || e.target.closest(".comment-icon-wrapper")) {
        const comment = e.target.closest(".comment-icon-wrapper");
        const overallWrapper = comment.closest(".comment-overall-wrapper");
        overallWrapper.querySelector(".inner-comment-wrapper").style.display = "flex";
        overallWrapper.querySelector(".comment-x-icon").style.display = "flex";
        overallWrapper.dataset.commentState = "closed";
    }

    else if (e.target.matches(".comment-delete-btn")) {
        if (!shape || !shape.classList.contains("comment-cont")) return;

        shape.remove();
        shape = null;
    }
    
    else if (e.target.matches(".shape")) {
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
        state != "Comment" &&
        !e.target.matches(".svg-cont") &&
        !e.target.matches(".shape") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".tool") &&
        !e.target.closest(".comment-cont") &&
        !e.target.matches(".tool svg")
        // !e.target.matches(".create-tool")
    ) {
        const wDot = shape.querySelector(".w-dot");
        const hDot = shape.querySelector(".h-dot");
        const whDot = shape.querySelector(".w-h-dot");
        wDot.style.opacity = "0";
        wDot.style.pointerEvents = "none";
        hDot.style.opacity = "0";
        hDot.style.pointerEvents = "none";
        whDot.style.opacity = "0";
        whDot.style.pointerEvents = "none";
    }

    else if (
        state == "Comment" &&
        !e.target.matches("#toolbar") &&
        !e.target.matches(".shape-btn") &&
        !e.target.matches(".shape-btn svg")
    ) {
        createComment(e);
    }
});

function LockShape(target) {
    if (!target) return;

    target.dataset.isLock = "true";
    const shapeIcon = shape.querySelector(".shape-lock-icon");
    shapeIcon.style.display = "flex";
    shapeIcon.style.pointerEvents = "auto";
}

function DeleteShape(shape) {
    if (!shape) return;

    shape.remove();
    shape = null;
}

function BringToFront(shape) {
    if (!shape) return;

    let shapeZIndex = Number(shape.style.zIndex);
    shapeZIndex++;
    shape.style.zIndex = shapeZIndex;
}

function SendToBack(shape) {
    if (!shape) return;

    let shapeZIndex = Number(shape.style.zIndex);
    shapeZIndex--;
    shape.style.zIndex = shapeZIndex;
}

function CopyShape(shape) {
    if (!shape) return;

    if (shape.classList.contains("rect")) {
        const w = shape.querySelector(".shape").style.width.slice(0, shape.querySelector(".shape").style.width.indexOf("p"));
        const h = shape.querySelector(".shape").style.height.slice(0, shape.querySelector(".shape").style.height.indexOf("p"));
        const l = Number(shape.style.left.slice(0, shape.style.left.indexOf("p"))) + 25;
        const t = Number(shape.style.top.slice(0, shape.style.top.indexOf("p"))) + 25;
        createRect(w, h, l, t);
    }
    else if (shape.classList.contains("circle")) {
        const w = shape.querySelector(".shape").style.width.slice(0, shape.querySelector(".shape").style.width.indexOf("p"));
        const h = shape.querySelector(".shape").style.height.slice(0, shape.querySelector(".shape").style.height.indexOf("p"));
        const l = Number(shape.style.left.slice(0, shape.style.left.indexOf("p"))) + 25;
        const t = Number(shape.style.top.slice(0, shape.style.top.indexOf("p"))) + 25;
        createCircle(w, h, l, t);
    }
    else if (shape.classList.contains("text")) {
        const svgWidth = shape.querySelector('svg[data-type="text"]').getAttribute("width");
        const viewBox = shape.querySelector('svg[data-type="text"]').getAttribute("viewBox");
        const strokeWidth = shape.querySelector('svg[data-type="text"] path').getAttribute("stroke-width");
        const d = shape.querySelector('svg[data-type="text"] path').getAttribute("d");
        const l = Number(shape.style.left.slice(0, shape.style.left.indexOf("p"))) + 25;
        const t = Number(shape.style.top.slice(0, shape.style.top.indexOf("p"))) + 25;
        createText(svgWidth, strokeWidth, viewBox, d, l, t);
    }
    else if (shape.classList.contains("line")) {
        const lineWidth = shape.querySelector('svg[data-type="line"] line').getAttribute("x2");
        const strokeWidth = shape.querySelector('svg[data-type="line"] line').getAttribute("stroke-width");
        const l = Number(shape.style.left.slice(0, shape.style.left.indexOf("p"))) + 25;
        const t = Number(shape.style.top.slice(0, shape.style.top.indexOf("p"))) + 25;
        shape = createLine(lineWidth, strokeWidth, `${l}px`, `${t}px`);
        const info = shape.getBoundingClientRect();
        const sh = {
            type: "line",
            actualShape: shape,
            left: info.left,
            right: info.right,
            top: info.top,
            bottom: info.bottom,
            width: info.width,
            height: info.height,
        };
        createdShapes.push(sh);
    }
}

shapebar.addEventListener("click", (e) => {
    if (e.target.closest(".sh-tool") == null) return;

    shapeBtn = e.target.closest(".sh-tool");
    if (shapeBtn.classList.contains("lock-btn")) LockShape(shape);
    else if (shapeBtn.classList.contains("delete-btn")) DeleteShape(shape);
    else if (shapeBtn.classList.contains("b-t-f-btn")) BringToFront(shape);
    else if (shapeBtn.classList.contains("s-t-b-btn")) SendToBack(shape);
    else if (shapeBtn.classList.contains("copy-btn")) CopyShape(shape);
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
    else if (e.target.closest(".line-btn")) {
        shape = createLine(200, 3, "50%", "50%");
        const info = shape.getBoundingClientRect();
        const sh = {
            type: "line",
            actualShape: shape,
            left: info.left,
            right: info.right,
            top: info.top,
            bottom: info.bottom,
            width: info.width,
            height: info.height,
        };
        createdShapes.push(sh);
    }
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
    cont.style.zIndex = "0";
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

    return cont;
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
    cont.style.zIndex = "0";
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

    return cont;
}

function createText(svgWidth, strokeWidth, viewBox, d, left, top) {
    const cont = document.createElement("div");
    cont.className = "svg-cont text";
    cont.style.padding = "1rem";
    cont.style.width = "fit-content";
    cont.style.height = "fit-content";
    cont.style.position = "absolute";
    cont.style.left = `${left}px`;
    cont.style.top = `${top}px`;
    cont.style.zIndex = "0";
    cont.setAttribute("data-is-lock", "false");

    cont.innerHTML += `
        <div class="shape-lock-icon">
            <svg data-type="icon" xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#000000">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
            </svg>
        </div>
    `
    
    const wDot = document.createElement("div");
    wDot.className = "w-dot dot";
    wDot.style.width = "15px";
    wDot.style.height = "15px";
    wDot.style.borderRadius = "50px";
    wDot.style.backgroundColor = "gray";
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
    hDot.style.backgroundColor = "gray";
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
    svg.setAttribute("data-type", "text");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", "50");
    svg.setAttribute("viewBox", viewBox);
    svg.style.pointerEvents = "none";
    svg.style.display = "block";
    svg.style.overflow = "visible";
    
    // const d = "M 25 25 c 50 -25 50 25 100 0";
    
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
    cont.appendChild(whDot);
    document.body.appendChild(cont);

    return cont;
}

function createLine(lineWidth, strokeWidth, left, top) {
    const wrapper = document.createElement("div");
    wrapper.className = "svg-cont line";
    wrapper.setAttribute("data-is-lock", "false");
    Object.assign(wrapper.style, {
        position: "absolute",
        left: left,
        top: top,
        width: "fit-content",
        height: "fit-content",
        zIndex: "0",
        // border: "2px dotted black",
    });

    wrapper.innerHTML += `
        <div class="shape-lock-icon">
            <svg data-type="icon" xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#000000">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
            </svg>
        </div>
    `

    const wDot = document.createElement("div");
    wDot.className = "w-dot dot";
    wDot.style.width = "15px";
    wDot.style.height = "15px";
    wDot.style.borderRadius = "50px";
    wDot.style.backgroundColor = "gray";
    wDot.style.position = "absolute";
    const w =15 / 2;
    // wDot.style.right = `calc(1rem - ${w}px)`;
    wDot.style.right = "-25px";
    wDot.style.top = "50%";
    wDot.style.transform = "translateY(-50%)";
    wDot.style.opacity = "0";
    wDot.style.pointerEvents = "none";
    
    const hDot = document.createElement("div");
    hDot.className = "h-dot dot";
    hDot.style.width = "15px";
    hDot.style.height = "15px";
    hDot.style.borderRadius = "50px";
    hDot.style.backgroundColor = "gray";
    hDot.style.position = "absolute";
    const h =15 / 2;
    // hDot.style.bottom = `calc(1rem - ${h}px)`;
    hDot.style.bottom = "-2.5px"
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
    svg.setAttribute("data-type", "line");
    svg.setAttribute("width", lineWidth);
    svg.setAttribute("height", "50");
    svg.setAttribute("viewBox", `0 25 ${lineWidth} 50`);
    svg.style.pointerEvents = "none";
    svg.style.display = "block";
    svg.style.overflow = "visible";

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "50");
    line.setAttribute("x2", lineWidth);
    line.setAttribute("y2", "50");
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", strokeWidth);
    line.setAttribute("stroke-linecap", "round");
    line.style.pointerEvents = "none";

    svg.appendChild(line);
    wrapper.appendChild(svg);
    wrapper.appendChild(wDot);
    wrapper.appendChild(hDot);
    wrapper.appendChild(whDot);
    document.body.appendChild(wrapper);

    return wrapper;
}

function Lasso(e) {
    outerTempShape = document.createElement("div");
    Object.assign(outerTempShape.style, {
        position: "absolute",
        left: `${startX}px`,
        top: `${startY}px`,
        width: "fit-content",
        height: "fit-content",
    });
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.display = "block";
    svg.style.overflow = "visible";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "3");

    const d = `M 1 1 L${e.touches[0].clientX} 100`;
    path.setAttribute("d", d);

    svg.appendChild(path);
    outerTempShape.appendChild(svg);
    document.body.appendChild(outerTempShape);
}

function createComment(e) {
    const overallWrapper = document.createElement("div");
    overallWrapper.setAttribute("data-comment-state", "true");
    overallWrapper.className = "comment-overall-wrapper comment-cont";
    Object.assign(overallWrapper.style, {
        position: "absolute",
        width: "fit-content",
        height: "fit-content",
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
    });

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "comment-icon-wrapper";
    Object.assign(iconWrapper.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        width: "30px",
        height: "30px",
        left: "0",
        top: "-32px",
        border: "2px solid black",
        borderRadius: "6px",
    });

    iconWrapper.innerHTML = `
        <svg data-type="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/>
        </svg>
    `; 

    const xIcon = document.createElement("div");
    xIcon.className = "comment-x-icon";
    Object.assign(xIcon.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: "0",
        top: "-32px",
        border: "2px solid black",
        borderRadius: "8px",
        width: "30px",
        height: "30px",
    });

    xIcon.innerHTML = `
        <svg data-type="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
    `;
    
    const wrapper = document.createElement("div");
    wrapper.className = "inner-comment-wrapper";
    Object.assign(wrapper.style, {
        width: "fit-content",
        height: "fit-content",
        border: "2px solid black",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
    });

    const comment = document.createElement("p");
    comment.className = "comment";
    comment.innerText = "This is a Comment";
    Object.assign(comment.style, {
        padding: "0.5rem 1rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        fontSize: "1.2rem",
    });
    comment.contentEditable = true;

    const wDot = document.createElement("div");
    wDot.className = "w-dot";
    wDot.style.display = "none";
    const hDot = document.createElement("div");
    hDot.className = "h-dot";
    hDot.style.display = "none";
    const whDot = document.createElement("div");
    whDot.className = "w-h-dot";
    whDot.style.display = "none";


    wrapper.appendChild(comment);
    wrapper.appendChild(wDot);
    wrapper.appendChild(hDot);
    wrapper.appendChild(whDot);

    overallWrapper.appendChild(wrapper);
    overallWrapper.appendChild(iconWrapper);
    overallWrapper.appendChild(xIcon);

    document.body.appendChild(overallWrapper);

    shape = wrapper;
}