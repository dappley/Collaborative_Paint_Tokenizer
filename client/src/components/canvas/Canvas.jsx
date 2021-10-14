import io from 'socket.io-client';
import React from 'react';
import './Canvas.css';

var outsideRoomId = null;
var base64ImageData = null;
class Board extends React.Component {
    socket = io.connect("http://localhost:5000");
    isDrawing = false;
    roomId = null;
    timeout;
    ctx;

    constructor(props) {
        super(props);
        this.state = { room: this.props.room }; // this.props is undefined
        this.roomId = this.state.room;
        outsideRoomId = this.state.room;
        console.log("room is : state " + this.state.room);
        console.log("room is : insideroomId " + this.roomId);
        console.log("room is : outsideRoomId " + outsideRoomId);

        this.socket.on("canvas-data", function (data, room) {
            console.log("receive canvas " + outsideRoomId);
            if (room === outsideRoomId) {
                console.log("they are equal finally")
                var root = this;
                var interval = setInterval(function () {
                    if (root.isDrawing) return;
                    root.isDrawing = true;
                    clearInterval(interval);
                    var image = new Image();
                    var canvas = document.querySelector('#board');
                    var ctx = canvas.getContext('2d');
                    image.onload = function () {
                        ctx.drawImage(image, 0, 0);
                        root.isDrawing = false;
                    };
                    image.src = data;
                }, 200)
            }
        })
    }

    componentDidMount() {
        this.drawOnCanvas();
    }

    componentWillReceiveProps(newProps) {
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
        //this.roomId = newProps.room;
    }

    drawOnCanvas() {
        var canvas = document.querySelector('#board');
        this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;
        var tempRoom = this.roomId

        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        var mouse = { x: 0, y: 0 };
        var last_mouse = { x: 0, y: 0 };

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function (e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);


        /* Drawing on Paint App */
        ctx.lineWidth = this.props.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.color;

        canvas.addEventListener('mousedown', function (e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var root = this;
        var onPaint = function () {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            if (root.timeout !== undefined) clearTimeout(root.timeout);
            root.timeout = setTimeout(function () {
                console.log("send canvas is " + tempRoom);
                base64ImageData = canvas.toDataURL("image/png");
                // console.log(base64ImageData);
                root.socket.emit("canvas-data", base64ImageData, tempRoom);
            }, 500)
        };
    }

    render() {
        return (
            <div className="sketch" id="sketch">
                <canvas className="board" id="board"></canvas>
            </div>
        )
    }
}

export {base64ImageData};
export default Board