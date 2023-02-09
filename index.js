document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    const doodler = document.createElement("div");
    const score = document.createElement('div');
    const scoreHeading = document.createElement('h1');
    const steps = document.createElement('p');
    let doodlerLeftSpace = 50;
    let startpoint = 150;
    let doodlerBottomSpace = startpoint;
    let isGameover = false;
    let platformCount = 5;
    let platforms = [];
    let upperTimeId;
    let downTimeId;    
    let leftTimeId;    
    let rightTimeId;    
    let isJumping = true;
    let isMovingLeft = false;
    let isMovingRight = false;
    let numberOfSteps = 0;


    class Platform {
        constructor(newPlatformBottom) {
            this.bottom = newPlatformBottom;
            this.left = 10 + Math.random() * 305;
            this.visual = document.createElement('div');
            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add("doodler");
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + "px";
        doodler.style.bottom = doodlerBottomSpace + "px";
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platgap = 600 / platformCount;
            let newPlatformBottom = 100 + i * platgap;
            let newPlatform = new Platform(newPlatformBottom);
            platforms.push(newPlatform);
            console.log(platforms);
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach((platform) => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';
                if(platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove("platform");
                    platforms.shift();
                    console.log(platforms);
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            });
        }
    }

    function jump() {
        clearInterval(downTimeId);
        isJumping = true;
        upperTimeId = setInterval(function () {
            doodlerBottomSpace += 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > startpoint + 200) {
                fall();
            }
        }, 40);

    }

    function fall() {
        clearInterval(upperTimeId);
        isJumping = false;
        downTimeId = setInterval(function () {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0) {
                console.log(`GameOver!`);
                gameOver();
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) && (doodlerBottomSpace <= (platform.bottom + 15)) && ((doodlerLeftSpace + 60) >= platform.left) && (doodlerLeftSpace <= (platform.left + 85)) && !isJumping) {
                        numberOfSteps++;
                        console.log("Landed!😀");
                        startpoint = doodlerBottomSpace;
                        jump();
                }

            });
        }, 40);


    }

    function gameOver() {
        console.log(`Status Report :\nNumber of Steps Moved Up : ${numberOfSteps} 😀😀`);
        isGameover = true;
        clearInterval(upperTimeId);
        clearInterval(downTimeId);
        clearInterval(leftTimeId);
        clearInterval(rightTimeId);
        while(grid.firstElementChild){
            grid.removeChild(grid.firstChild);
        }
        summary(numberOfSteps);
        numberOfSteps = 0;
    }
    function summary(numberOfSteps){
        score.classList.add("summary");
        scoreHeading.innerHTML = "GameOver! 🤒"
        steps.innerHTML = `Number of steps moved up : ${numberOfSteps}`;
        grid.appendChild(score);
        score.appendChild(scoreHeading);
        score.appendChild(steps);
    }
    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft();
        } else if (e.key === "ArrowRight") {
            moveRight();
        } else if (e.key === "ArrowUp") {
            moveUp();
        }
    }
    function moveLeft() {
        if(isMovingRight){
            clearInterval(rightTimeId);
            isMovingRight = false;
        }
        isMovingLeft = true;
        leftTimeId = setInterval(function () {
            if(doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            }else {
                moveRight();
            }    
        }, 30);
        
    }
    function moveRight() {
        if(isMovingLeft){
            clearInterval(leftTimeId);
            isMovingLeft = false;
        }
        isMovingRight = true;
        rightTimeId = setInterval(function () {
            if(doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            }
            else {
                moveLeft();
            }
        }, 30);
    }
    function moveUp() {
        isMovingLeft = false;
        isMovingRight = false;
        clearInterval(leftTimeId);
        clearInterval(rightTimeId);
        
    }
    function start() {
        if (!isGameover) {
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 60);
            jump();
            document.addEventListener('keyup', control);
        }
    }
    start();
});